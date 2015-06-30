(function() {
	"use strict";	
	
	angular.module('hihApp', ["smart-table", "ui.router", "ngAnimate", "hihApp.Login", "hihApp.Utility", 'hihApp.Learn', 'ui.bootstrap'])
		.run(['$rootScope', '$state', '$stateParams', '$modal', '$log', function ($rootScope,   $state,   $stateParams, $modal, $log) {
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
//			    			if (!angular.isDefined(toState.data) || !angular.isDefined(toState.data.rule)) return;
//			    			if (!angular.isFunction(toState.data.rule)) return;
//			    			
//			    		    var result = toState.data.rule($rootScope);
//			    		    if (result !== true) {
//			    		    	console.log('HIH: state change failed: not login, redirect to login page...');
//			    		    	event.preventDefault();
//			    		    	$state.go("login");
//			    		    }
			    	}
			    );
			    
			    $rootScope.$on('ShowMessage', function (oEvent, msgHeader, msgDetail) {
					console.log('HIH: ShowMessage event occurred');
					
					$rootScope.MessageHeader = msgHeader;
					$rootScope.MessageDetail = msgDetail;
					
					var modalInstance = $modal.open({
					      animation: true,
					      templateUrl: 'hihMessageDialog.html',
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
	      
        //////////
        // Home //
        //////////
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
        
        ////////////////////
        // Home > Welcome //
        ////////////////////
        .state('home.welcome', {
        	url: '',
        	templateUrl: 'app/views/welcome.html'
        })
        ////////////////////
        // Home > User Detail //
        ////////////////////
        .state('home.userdetail', {
        	url: '/userdetail',
        	templateUrl: 'app/views/userdetail.html'
        })

        /////////////////
        // Home > About //
        /////////////////
        .state('home.about', {
          url: '/about',
          templateUrl: 'app/views/about.html'
        });
	}])
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {		
		$scope.CurrentUser = $rootScope.CurrentUser;
		$scope.displayedCollection = [
			{userobj: 'ID', 			usercont: $scope.CurrentUser.userid},
			{userobj: 'Display As', 	usercont: $scope.CurrentUser.userdisplayas},
			{userobj: 'Gender',		usercont: $scope.CurrentUser.usergender},
			{userobj: 'Created On', usercont: $scope.CurrentUser.usercreatedon}
			];
		
		$scope.logout = function() {
			console.log("HIH: Logout triggerd!");
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
			})
		}
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
////			$('#dlgMessage').modal('hide');
////			var dlg = $('#dlgMessage');
////			if (dlg)
////				dlg.modal('show');
//		});
	}])	
	;

})();
