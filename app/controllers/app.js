(function() {
	"use strict";	
	
	angular.module('hihApp', ["smart-table", "ui.router", "ngAnimate", "hihApp.Login"])
	.run(['$rootScope', '$state', '$stateParams',
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


	.config(['$stateProvider', '$urlRouterProvider',
	      function ($stateProvider,   $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/welcome', '/home')
        .when('/about', '/home/about')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/login');


      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider
	      
        //////////
        // Home //
        //////////

        .state("home", {
          abstract: true,
          // Use a url of "/" to set a states as the "index".
          url: "/home",
          
          views: {      	  
              "": {
            	  templateUrl: 'app/views/home.html',
                  controller: 'HomeController'  
              },
              
        	  "NavMenuView": {
                  templateUrl: 'app/views/navmenu.html',
                  controller: 'NavController' 
                }
          	}
        })
        
        ////////////////////
        // Home > Welcome //
        ////////////////////
        .state('home.welcome', {
        	url: '',
        	templateUrl: 'app/views/welcome.html'
        })
        
        ///////////
        // About //
        ///////////

        .state('home.about', {
          url: '/about',
          templateUrl: 'app/views/about.html'
        });
	}])
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$http', function($scope, $rootScope, $state, $http) {
		
		$scope.CurrentUser = $rootScope.CurrentUser;
		
		$scope.$on("LoginSuccess", function() {
	    	console.log("HIH LoginSuccess event fired!");
	    	
	    	$state.go("home");
	    });
	}])
	
	.controller('NavController', ['$scope', '$stateParams', '$rootScope',
        function (  $scope,   $stateParams,   $rootScope) {
          
        }])
	;

})();
