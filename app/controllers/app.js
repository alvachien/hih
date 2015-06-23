var app = angular.module('hihApp', ["ngRoute"]);

(function() {
	'use strict';	

	app.config(function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'app/views/login.html',
			controller: 'LoginController'
		});
		
		$routeProvider.when('/register', {
			templateUrl: 'app/views/register.html',
			controller: 'RegisterController'
		});
		
		$routeProvider.when('/home', {
			templateUrl: 'app/views/home.html',
			controller: 'HomeController'
		});

		$routeProvider.when('/learnobject', {
			templateUrl: 'app/views/learnobject.html',
			controller: 'LearnObjectController'
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
		var Logout = function() { this.bLogin = false; }
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
	app.controller("NavController", function($scope, $location, hihSharedInfo) {
		$scope.isLogin = hihSharedInfo.isLogin();
		
		$scope.$on("Login",function () {
			console.log('HIH Nav Controller: Login event occurred');
			$scope.isLogin = hihSharedInfo.isLogin();
		});
		$scope.$on("Logout",function () {
			console.log('HIH Nav Controller: Logout event occurred');
			$scope.isLogin = hihSharedInfo.isLogin();
		});
	});
	
	// Register controller
	app.controller('RegisterController', function($scope, $location, hihSharedInfo) {
		$scope.registerInfo = {
			username: "",
			password: "",
			confirmpassword: "",
			mailbox: ""
		};
		
		$scope.submitRegister = function() {
			
		}
	});
	
	// Home controller
	app.controller('HomeController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.currentUser = hihSharedInfo.getCurrentUser();
		$scope.title = "";
		
		$scope.logout = function() {
			$http.post('script/hihsrv.php', { objecttype: 'USERLOGOUT' } ).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				hihSharedInfo.Logout();
				// Broadcast event
				$rootScope.$broadcast("Logout");
				$scope.currentUser = hihSharedInfo.getCurrentUser();
					
				$location.path('/login');
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
	}]);	
})();
