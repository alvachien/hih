(function() {
	'use strict';
	var app = angular.module('hihApp', []).config(function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'login.html',
			controller: 'LoginController'
		});
		$routeProvider.when('/home', {
			templateUrl: 'home.html',
			controller: 'HomeController'
		});
		
		$routeProvider.otherwise({
			redirectTo: '/login'
		});
	});
	
	app.controller('LoginController', function($scope) {
		this.loginName = "";
		this.loginPassword = "";
	});
	
	app.controller('HomeController', function() {
		this.currentUser = "";			
	});
})();
