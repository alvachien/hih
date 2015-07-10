/* global $ */
/* global angular */
(function() {
	"use strict";	
	
	angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
	    $i18nextProvider.options = {
	        lng: 'en',
	        useCookie: false,
	        useLocalStorage: false,
	        fallbackLng: 'en',
	        resGetPath: 'locales/__lng__/resource.json',
	        defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
	    };
	}]);
	
	angular.module('hihApp', ["smart-table", "ui.router", "ngAnimate", "hihApp.Login", "hihApp.Utility", 'hihApp.Learn', 'ui.bootstrap', "ui.select", 'ngSanitize', 'hihApp.Finance', 'jm.i18next'])
		.run(['$rootScope', '$state', '$stateParams', '$modal', '$timeout', '$log', '$i18next', function ($rootScope,   $state,   $stateParams, $modal, $timeout, $log, $i18next) {
			    $rootScope.$state = $state;
			    $rootScope.$stateParams = $stateParams;
			    
			    $rootScope.$on('$stateChangeStart', 
		    		function(event, toState, toParams, fromState, fromParams) {
		    			console.log('HIH: state change start, target url is ' + toState.url + "; state is " + toState.name);
		    			
		    			if (toState.name === 'login' || toState.name === 'register') {
		    				if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
		    					console.log('HIH: state change failed: already login but ask for login page, redirect to home page...');
		    					event.preventDefault();
		    					$state.go("home.welcome");
		    				} 
		    				return;
		    			}  
		    			
		    			if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
		    				return;
		    			}

		    			console.log('HIH: state change failed: not login, redirect to login page...');
	    		    	event.preventDefault();
	    		    	$state.go("login");
			    	}
			    );
			    
				$rootScope.$on('i18nextLanguageChange', function () {
					$log.info('HIH: Language has changed!');
					if (!$rootScope.i18nextReady) {
						$timeout(function () {
							$rootScope.i18nextReady = true;
						}, 500);
					}
				});
				
			    $rootScope.$on('ShowMessage', function (oEvent, msgHeader, msgDetail) {
					console.log('HIH: ShowMessage event occurred');
					
					$rootScope.MessageHeader = msgHeader;
					$rootScope.MessageDetail = msgDetail;
					
					var modalInstance = $modal.open({
					      animation: true,
					      templateUrl: 'app/views/messagedialog.html',
					      controller: 'MessageBoxController'
				      });
					
					modalInstance.result.then(function () {
					      //$scope.selected = selectedItem;
					    }, function () {
					      $log.info('HIH: Message dialog dismissed at: ' + new Date());
					    });
				});
			}
		])

	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        .when('/welcome', '/home')
        .when('/about', '/home/about')
        .when('/userdetail', '/home/userdetail')
        .when('/learn', '/home/learn')
        .when('/learnobject', '/home/learn/object')
        .when('/learnhistory', '/home/learn/history')
        .when('/learnaward', '/home/learn/award')
        .when('/finance', '/home/finance')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/home');

      //////////////////////
      // State Configurations //
      //////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider
	      
        .state("home", {
        	url: "/home",
        	abstract: true,
        	templateUrl: 'app/views/home.html',
        	controller: 'HomeController',
        	data: {
        		rule: function($rootScope) {
        			if (!angular.isDefined($rootScope.isLogin)) return false;
        		
        			return $rootScope.isLogin;
        		}  
        	},
          
        	onEnter: function($rootScope) {
        		console.log('HIH Home: Entering page!');
        	}
        })        
        .state('home.welcome', {
        	url: '',
        	templateUrl: 'app/views/welcome.html'
        })
		.state('home.userlist', {
        	url: '/userlist',
        	templateUrl: 'app/views/userlist.html',
			controller: 'UserListController'
		})
        .state('home.userdetail', {
        	url: '/userdetail',
        	templateUrl: 'app/views/userdetail.html'
        })
        .state('home.about', {
          url: '/about',
          templateUrl: 'app/views/about.html',
          controller: 'AboutController'
        });
	}])
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$http', '$log', '$i18next', 'utils', function($scope, $rootScope, $state, $http, $log, $i18next, utils) {		
		$scope.CurrentUser = $rootScope.CurrentUser;
		$scope.displayedCollection = [
			{userobj: 'ID', 		usercont: $scope.CurrentUser.userid},
			{userobj: 'Display As', usercont: $scope.CurrentUser.userdisplayas},
			{userobj: 'Gender',		usercont: utils.genderFormatter($scope.CurrentUser.usergender)},
			{userobj: 'Created On', usercont: $scope.CurrentUser.usercreatedon}
			];
		
		$scope.logout = function() {
			$log.info("HIH: Logout triggerd!");
			utils.sendRequest( { objecttype: 'USERLOGOUT' }, function (data, status, headers, config) {
				
				// Clear the current user information
				$rootScope.isLogin = false;
				$rootScope.CurrentUser = {};
				$scope.CurrentUser = {};
				
				// Redirect to login page
				$state.go('login');
			}, function(data, status, headers, config) {
				// Throw out error message				
				$rootScope.$broadcast('ShowMessage', 'Error', 'Failed to logout!');
			});
		};
		
		$scope.setLanguage = function(lng) {
			$log.info("HIH: Language change event triggerd!");
			
			if (lng !== $i18next.options.lng) {
				$i18next.options.lng = lng;				
			}
		}
	}])

	.controller('UserListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$i18next', 'utils', function($scope, $rootScope, $state, $http, $log, $i18next, utils) {
		utils.loadUserList();
		
	    $scope.rowCollection = $rootScope.arUserList;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("UserListLoaded", function() {
	    	$log.info("HIH User List: Loaded event fired!");
		    	
		    $scope.rowCollection = $rootScope.arUserList;
			if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
			   	$scope.displayedCollection = [].concat($scope.rowCollection);
			}
		});		
	}])
	
	.controller('MessageBoxController', ['$scope', '$rootScope','$modalInstance', function($scope, $rootScope, $modalInstance) {
		$scope.MessageHeader = $rootScope.MessageHeader;
		$scope.MessageDetail = $rootScope.MessageDetail;
		
		$scope.ok = function () {
		    $modalInstance.close();
		  };
        $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
		  
//		$scope.$on("ShowMessage",function (oEvent, msgHeader, msgDetail) {
//			console.log('HIH MessageBox Controller: ShowMessage event occurred');
//			$scope.MessageHeader = msgHeader;
//			$scope.MessageDetail = msgDetail;
//
//			var modalInstance = $modal.open({
//			      animation: true,
//			      templateUrl: 'hihMessageDialog.html',
//			      resolve: {
//			          msgHeader: $scope.msgHeader,
//			          msgDetail: $scope.msgDetail			          
//			        }
//		      });
//		
//			modalInstance.result.then(function () {
//		      //$scope.selected = selectedItem;
//		    }, function () {
//		      $log.info('HIH: Message dialog dismissed at: ' + new Date());
//		    });			
//			
//			$('#dlgMessage').modal('hide');
//			var dlg = $('#dlgMessage');
//			if (dlg)
//				dlg.modal('show');
//		});
	}])	
	
	.controller('AboutController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.myInterval = 5000;
		
		var slides = $scope.slides = [];
		$scope.addSlide = function(url, infotxt) {
		    slides.push({
		    	image: url,
		    	text: infotxt
		    });
		 };
		 
		//$scope.addSlide('app/img/Duoduo2013.jpg', 'Duoduo @ 2013');
		//$scope.addSlide('app/img/JiaotongUniversity.jpg', 'Jiaotong University');
		//$scope.addSlide('app/img/LD.jpg', 'LD @ 2013');
		//$scope.addSlide('app/img/SpeedOfShanghai.jpg', 'Speed of Shanghai');
		//$scope.addSlide('app/img/TheAutumn.jpg', 'The Autumn');
	}])
	;
})();
