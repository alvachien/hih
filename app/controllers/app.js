var app = angular.module('hihApp', ["ngRoute"]);

(function() {
	'use strict';	

	app.config(function($routeProvider) {
		// ============================================
		// Login part
		$routeProvider.when('/login', {
			templateUrl: 'app/views/login.html',
			controller: 'LoginController'
		});
		
		$routeProvider.when('/register', {
			templateUrl: 'app/views/register.html',
			controller: 'RegisterController'
		});
		
		// ============================================
		// Home part
		$routeProvider.when('/home', {
			templateUrl: 'app/views/home.html',
			controller: 'HomeController'
		});

		// ============================================
		// Learn part
		$routeProvider.when('/learnobject', {
			templateUrl: 'app/views/learnobject.html',
			controller: 'LearnObjectController'
		});
		
		$routeProvider.when('/learnhistory', {
			templateUrl: 'app/views/learnobject.html',
			controller: 'LearnObjectController'
		});
		
		$routeProvider.when('/learnaward', {
			templateUrl: 'app/views/learnaward.html',
			controller: 'LearnObjectController'
		});

		$routeProvider.when('/learn', {
			redirectTo: '/notready'
		});
		
		// ============================================
		// Finance part
		$routeProvider.when('/finance', {
			redirectTo: '/notready'
		});
		$routeProvider.when('/financeaccount', {
			redirectTo: '/notready'
		});
		
		// ============================================
		// Others
		$routeProvider.when('/notready', {
			templateUrl: 'app/views/notready.html',
			controller: 'NotReadyController'
		});
		
		$routeProvider.otherwise({
			redirectTo: '/login'
		});
	});
	
	// Sevice: shared information
	app.factory('hihSharedInfo', function() {
		var currentUser = {};
		var bLogin = false;
		
		var getCurrentUser = function() { return this.currentUser; }
		var setCurrentUser = function(usr) { this.currentUser = usr; }
		var Login = function() { this.bLogin = true; }
		var Logout = function() { 
			this.bLogin = false;
			this.currentUser = {}; // Clear the current user information.
		}
		var isLogin = function() { return this.bLogin; }
		
		return {
			getCurrentUser: getCurrentUser,
			setCurrentUser: setCurrentUser,
			Login: Login,
			Logout: Logout,			
			isLogin: isLogin
		}
	});
	
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
