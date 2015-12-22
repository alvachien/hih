/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';
    
	angular.module('hihApp.Lib', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 
		'ngJsTree', 'ngTouch', 'selectize', 'smart-table'])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
	      $stateProvider
	        .state("home.lib", {
	            url: "/lib",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.language", {
	            url: "/language",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.language.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/languagelist.html',
	        	controller: 'LibLanguageListController'
	        })
	        .state("home.lib.person", {
	            url: "/person",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.person.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/personlist.html',
	        	controller: 'LibPersonListController'
	        })
	        .state("home.lib.org", {
	            url: "/org",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.org.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/orglist.html',
	        	controller: 'LibOrgListController'
	        })
	        .state("home.lib.loc", {
	            url: "/loc",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.loc.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/locationlist.html',
	        	controller: 'LibLocationListController'
	        })
			;
		}])
		
	   .controller('LibLanguageListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils', 
		  function($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
              utils.loadLibLanguageQ()
                .then(function(response) {
                    // Do nothing....
                }, function(reason) {
                    $rootScope.$broadcast("ShowMessage", "Error", reason);
                });
	   }])
       
		.controller('LibLocationListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibLocationQ()
					.then(function (response) {
						// Do nothing...
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});

				$scope.newItem = function () {

				};
				$scope.deleteItem = function() {
					
				};
			}])
	   
		.controller('LibPersonListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibPersonQ()
					.then(function (response) {
						// Do nothing...
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});

				$scope.newItem = function () {

				};
				$scope.deleteItem = function() {
					
				};
				
			}])

		.controller('LibOrgListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibOrganizatioinQ()
					.then(function (response) {
						// Do nothing...
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});

				$scope.newItem = function () {

				};
				$scope.deleteItem = function() {
					
				};
				
			}])
	   ;
})();
