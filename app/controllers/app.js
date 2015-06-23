(function() {
	'use strict';
	var app = angular.module('hihApp', ["ngRoute"]);

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
		
		$routeProvider.otherwise({
			redirectTo: '/login'
		});
	});
	
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
	
	app.controller("NavController", function($scope, $location, hihSharedInfo) {
		$scope.isLogin = hihSharedInfo.isLogin();
		
		$scope.$on("Login",function () {
			console.log('Login event occurred');
			$scope.isLogin = hihSharedInfo.isLogin();
		});
		$scope.$on("Logout",function () {
			console.log('Logout event occurred');
			$scope.isLogin = hihSharedInfo.isLogin();
		});
	});
	
	app.controller('LoginController', function($scope, $rootScope, $location, hihSharedInfo) {
		$scope.credentials = {
			username: "",
			password: ""
		};
		
		$scope.login = function() {
			if ($scope.credentials.username.length > 0) {
				// Login and save current user
				hihSharedInfo.Login();
				hihSharedInfo.setCurrentUser({
					username:$scope.credentials.username,
					password: $scope.credentials.password
				});
				// Broadcast event
				$rootScope.$broadcast("Login");
				// Redirect to home page
				$location.path('/home');
			}
		}
		
		$scope.register = function() {			
			$location.path('/register');
		}
	});
	
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
	
	app.controller('HomeController', function($scope, $rootScope, $location, hihSharedInfo) {
		$scope.currentUser = hihSharedInfo.getCurrentUser();
		$scope.title = "";
		
		$scope.logout = function() {
			hihSharedInfo.Logout();
			// Broadcast event
			$rootScope.$broadcast("Logout");
			$scope.currentUser = hihSharedInfo.getCurrentUser();
			
			$location.path('/login');
		}
	});
})();
