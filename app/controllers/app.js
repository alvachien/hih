var app = angular.module('hihApp', ["smart-table", "ui.router", "ngAnimate"]);

(function() {
	"use strict";	

	app
	.run(
			  [          '$rootScope', '$state', '$stateParams',
			    function ($rootScope,   $state,   $stateParams) {

			    // It's very handy to add references to $state and $stateParams to the $rootScope
			    // so that you can access them from any scope within your applications.For example,
			    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
			    // to active whenever 'contacts.list' or one of its decendents is active.
			    $rootScope.$state = $state;
			    $rootScope.$stateParams = $stateParams;
			    }
			  ]
			)
	.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/c?id', '/contacts/:id')
        .when('/user/:id', '/contacts/:id')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/');


      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider

        //////////
        // Home //
        //////////

        .state("home", {

          // Use a url of "/" to set a states as the "index".
          url: "/",

          // Example of an inline template string. By default, templates
          // will populate the ui-view within the parent state's template.
          // For top level states, like this one, the parent template is
          // the index.html file. So this template will be inserted into the
          // ui-view within index.html.
          template: '<p class="lead">Welcome to the UI-Router Demo</p>' +
            '<p>Use the menu above to navigate. ' +
            'Pay attention to the <code>$state</code> and <code>$stateParams</code> values below.</p>' +
            '<p>Click these links—<a href="#/c?id=1">Alice</a> or ' +
            '<a href="#/user/42">Bob</a>—to see a url redirect in action.</p>'

        })

        ///////////
        // About //
        ///////////

        .state('about', {
          url: '/about',

          // Showing off how you could return a promise from templateProvider
          templateProvider: ['$timeout',
            function (        $timeout) {
              return $timeout(function () {
                return '<p class="lead">UI-Router Resources</p><ul>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                       '</ul>';
              }, 100);
            }]
        })
    }
  ]
);
		
//	app.config(function($routeProvider) {
//		// ============================================
//		// Login part
//		$routeProvider.when('/login', {
//			templateUrl: 'app/views/login.html',
//			controller: 'LoginController'
//		});
//		
//		$routeProvider.when('/register', {
//			templateUrl: 'app/views/register.html',
//			controller: 'RegisterController'
//		});
//		
//		// ============================================
//		// Home part
//		$routeProvider.when('/home', {
//			templateUrl: 'app/views/home.html',
//			controller: 'HomeController'
//		});
//		$routeProvider.when('/userdetail', {
//			templateUrl: 'app/views/userdetail.html',
//			controller: 'UserDetailController'
//		});
//
//		// ============================================
//		// Learn part
//		$routeProvider.when('/learnobjectlist', {
//			templateUrl: 'app/views/learnobjectlist.html',
//			controller: 'LearnObjectListController'
//		});
//		$routeProvider.when('/learnobject', {
//			templateUrl: 'app/views/learnobject.html',
//			controller: 'LearnObjectController'
//		});
//		$routeProvider.when('/learnobject/:learnobjectid', {
//			templateUrl: 'app/views/learnobject.html',
//			controller: 'LearnObjectController'
//		});
//		
//		$routeProvider.when('/learnhistorylist', {
//			templateUrl: 'app/views/learnhistorylist.html',
//			controller: 'LearnHistoryListController'
//		});
//		
//		$routeProvider.when('/learnawardlist', {
//			templateUrl: 'app/views/learnawardlist.html',
//			controller: 'LearnAwardListController'
//		});
//
//		$routeProvider.when('/learn', {
//			redirectTo: '/notready'
//		});
//		
//		// ============================================
//		// Finance part
//		$routeProvider.when('/finance', {
//			redirectTo: '/notready'
//		});
//		$routeProvider.when('/financeaccount', {
//			redirectTo: '/notready'
//		});
//		$routeProvider.when('/financedocument', {
//			redirectTo: '/notready'
//		});
//		
//		// ============================================
//		// Others
//		$routeProvider.when('/notready', {
//			templateUrl: 'app/views/notready.html',
//			controller: 'NotReadyController'
//		});
//		
//		$routeProvider.otherwise({
//			redirectTo: '/login'
//		});
//	});
	
	// Sevice: shared information
	app.factory('hihSharedInfo', ['$rootScope', function($rootScope) {
		var that = this;

		var arLearnObject = [];
		var bLearnObject = false;
		var arLearnHistory = [];
		var bLearnHistory = false;
		var arLearnAward = [];
		var bLearnAward = false;
		var arLearnCategory = [];
		var bLearnCategory = false;
		
		var getCurrentUser = function() { return $rootScope.currentUser; }
		var setCurrentUser = function(usr) { $rootScope.currentUser = usr; }
		var Login = function() { $rootScope.bLogin = true; }
		var Logout = function() { 
			$rootScope.bLogin = false;
			$rootScope.currentUser = {}; // Clear the current user information.
		}
		var isLogin = function() { return $rootScope.bLogin; }
		
		var isLearnObjectLoaded = function() { return that.bLearnObject; }
		var loadLearnObjects = function($http, $rootScope) {
			if (!that.bLearnObject) {
				$http.post('script/hihsrv.php', { objecttype: 'GETLEARNOBJECTLIST' } ).
				  success(function(data, status, headers, config) {
					  	that.arLearnObject = data;
					  	that.bLearnObject = true;
					  	
					  	$rootScope.$broadcast("LearnObjectLoaded");
					  }).
					  error(function(data, status, headers, config) {
						  // called asynchronously if an error occurs or server returns response with an error status.
						  $rootScope.$broadcast("ShowMessage", "Error", data.Message);						  
					  });				
			}
		}
		var getLearnObjects = function() {
			return that.arLearnObject;
		}
		var getLearnObject = function(idx) {
			
		}

		var isLearnHistoryLoaded = function() { return that.bLearnHistory; }
		var loadLearnHistories = function($http, $rootScope) {
			if (!that.bLearnHistory) {
				$http.post('script/hihsrv.php', { objecttype: 'GETLEARNHISTORYLIST' } ).
				  success(function(data, status, headers, config) {
					  	that.arLearnHistory = data;
					  	that.bLearnHistory = true;
					  	
					  	$rootScope.$broadcast("LearnHistoryLoaded");
					  }).
					  error(function(data, status, headers, config) {
						  // called asynchronously if an error occurs or server returns response with an error status.
						  $rootScope.$broadcast("ShowMessage", "Error", data.Message);						  
					  });				
			}
		}
		var getLearnHistories = function() {
			return that.arLearnHistory;
		}
		
		var isLearnAwardLoaded = function() { return that.bLearnAward; }
		var loadLearnAwards = function($http, $rootScope) {
			if (!that.bLearnAward) {
				$http.post('script/hihsrv.php', { objecttype: 'GETLEARNAWARDLIST' } ).
				  success(function(data, status, headers, config) {
					  	that.arLearnAward = data;
					  	that.bLearnAward = true;
					  	
					  	$rootScope.$broadcast("LearnAwardLoaded");
					  }).
					  error(function(data, status, headers, config) {
						  // called asynchronously if an error occurs or server returns response with an error status.
						  $rootScope.$broadcast("ShowMessage", "Error", data.Message);						  
					  });				
			}			
		}
		var getLearnAwards = function() {
			return that.arLearnAward;
		}
		
		var isLearnCategoryLoaded = function() { return that.bLearnCategory; }
		var loadLearnCategories = function($http, $rootScope) {
			if (!that.bLearnCategory) {
				$http.post('script/hihsrv.php', { objecttype: 'GETLEARNCATEGORYLIST' } ).
				  success(function(data, status, headers, config) {
					  	that.arLearnCategory = data;
					  	that.bLearnCategory = true;
					  	
					  	$rootScope.$broadcast("LearnCategoryLoaded");
					  }).
					  error(function(data, status, headers, config) {
						  // called asynchronously if an error occurs or server returns response with an error status.
						  $rootScope.$broadcast("ShowMessage", "Error", data.Message);						  
					  });				
			}			
		}
		var getLearnCategories = function() {
			return that.arLearnCategory;
		}

		return {
			getCurrentUser: getCurrentUser,
			setCurrentUser: setCurrentUser,
			Login: Login,
			Logout: Logout,			
			isLogin: isLogin,
			
			isLearnObjectLoaded: isLearnObjectLoaded,
			getLearnObjects: getLearnObjects,
			loadLearnObjects: loadLearnObjects,
			
			isLearnHistoryLoaded: isLearnHistoryLoaded,
			getLearnHistories: getLearnHistories,
			loadLearnHistories: loadLearnHistories,
			
			isLearnAwardLoaded: isLearnAwardLoaded,
			getLearnAwards: getLearnAwards,
			loadLearnAwards: loadLearnAwards,
			
			isLearnCategoryLoaded: isLearnCategoryLoaded,
			loadLearnCategories: loadLearnCategories,
			getLearnCategories: getLearnCategories
		}
	}]);
	
	// Navigation controller
	app.controller("NavController", ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.isLogin = hihSharedInfo.isLogin();
		
		$scope.$on("Login",function () {
			console.log('HIH Nav Controller: Login event occurred');
			$scope.isLogin = hihSharedInfo.isLogin();
		});
		//$scope.$on("Logout",function () {
		//	console.log('HIH Nav Controller: Logout event occurred');
		//	$scope.isLogin = hihSharedInfo.isLogin();
		//});
		
		$scope.logout = function() {
			$http.post('script/hihsrv.php', { objecttype: 'USERLOGOUT' } ).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				hihSharedInfo.Logout();
				// Broadcast event
				//$rootScope.$broadcast("Logout");
				$scope.currentUser = hihSharedInfo.getCurrentUser();
				$scope.isLogin = hihSharedInfo.isLogin();
					
				$location.path('/login');
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
			  });
		}
	}]);
	
	// Register controller
	app.controller('RegisterController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.registerInfo = {
			username: "",
			password: "",
			confirmpassword: "",
			mailbox: ""
		};
		
		$scope.submitRegister = function() {
			
		}
	}]);
	
	// Home controller
	app.controller('HomeController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.currentUser = hihSharedInfo.getCurrentUser();
		$scope.title = "";
	}]);	
	
	app.controller('UserDetailController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.currentUser = hihSharedInfo.getCurrentUser();
		$scope.displayedCollection = [
		                 {userobj: 'ID', 			usercont: $scope.currentUser.userid},
		                 {userobj: 'Display As', 	usercont: $scope.currentUser.userdisplayas},
		                 {userobj: 'Gender',		usercont: $scope.currentUser.usergender},
		                 {userobj: 'Created On', usercont: $scope.currentUser.usercreatedon}
		];
	}]);	

	app.controller('MessageBoxController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.MessageHeader = "";
		$scope.MessageDetail = "";
		
		$scope.$on("ShowMessage",function (oEvent, msgHeader, msgDetail) {
			console.log('HIH MessageBox Controller: ShowMessage event occurred');
			$scope.MessageHeader = msgHeader;
			$scope.MessageDetail = msgDetail;
			
			var dlg = $('#dlgMessage');
			if (dlg)
				dlg.modal('show');
		});
	}]);	

	// Not ready controller
	app.controller('NotReadyController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.title = "";
		
	}]);	
})();
