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
	        .state("home.learn.language.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/languagelist.html',
	        	controller: 'LibLanguageListController'
	        })
	        .state("home.lib.person", {
	            url: "/person",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.person.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/personlist.html',
	        	controller: 'LibPersonListController'
	        })
	        .state("home.lib.org", {
	            url: "/org",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.org.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/orglist.html',
	        	controller: 'LibOrgListController'
	        })
			;
		}])
		
	   .controller('LibLanguageListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils', 
		  function($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
	   }])
       
	   .controller('LibPersonListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils', 
		  function($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
	   }])
       
	   .controller('LibOrgListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils', 
		  function($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
	   }])
	   ;
})();
