(function() {
	'use strict';
	var app = angular.module('hihApp', []).config(function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'app/templates/login.html',
			controller: 'LoginController'
		});
		$routeProvider.when('/home', {
			templateUrl: 'app/templates/home.html',
			controller: 'HomeController'
		});
		
		$routeProvider.otherwise({
			redirectTo: '/login'
		});
	});
	
	app.controller('LoginController', function($scope) {
		$scope.credentials = {
			username: "",
			password: ""
		};
		
		$scope.login = function() {
			if ($scope.credentials.username.length <= 0) {
				
			}
		}
	});
	
	app.controller('HomeController', function($scope) {
		$scope.currentUser = "";			
	});
})();
