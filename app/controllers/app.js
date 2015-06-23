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
	
	app.controller('LoginController', function($scope, $location) {
		$scope.credentials = {
			username: "",
			password: ""
		};
		
		$scope.login = function() {
			if ($scope.credentials.username.length > 0) {
				// Redirect to home page
				$location.path('/home');
			}
		}
		
		$scope.register = function() {
			$location.path('/register');
		}
	});
	
	app.controller('RegisterController', function($scope, $location) {
		$scope.registerInfo = {
			username: "",
			password: "",
			confirmpassword: ""
		};
		
		$scope.submitRegister = function() {
			
		}
	});
	
	app.controller('HomeController', function($scope, $location) {
		$scope.currentUser = "";
		$scope.title = "";
		
		$scope.logout = function() {
			$location.path('/login');
		}
	});
	
})();
