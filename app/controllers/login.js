/* global $ */
/* global angular */
(function() {
	'use strict';	
	
	angular.module('hihApp.Login', ["ui.router", "ngAnimate"])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
		      $stateProvider
		        .state("login", {
		          url: "/login",
		          templateUrl: 'app/views/login.html',
		          controller: 'LoginController'
		        })
		        .state('register', {
		        	url: '/register',
		        	templateUrl: 'app/views/register.html',
		        	controller: 'RegisterController'
		        });
		}])
		
		.controller('LoginController', ['$scope', '$rootScope', '$state', '$http', function($scope, $rootScope, $state, $http) {
	  		$scope.credentials = {
	  				username: "",
	  				password: ""
	  		};
	  			
			$scope.login = function() {
				// Verify the inputs first!
				
				// Then, real logon
				$http.post('script/hihsrv.php', { objecttype: 'USERLOGIN', loginuser:$scope.credentials.username, loginpassword: $scope.credentials.password } ).
				  success(function(data, status, headers, config) {
				    // this callback will be called asynchronously when the response is available
					  $rootScope.isLogin = true;
					  $rootScope.CurrentUser = {
						userid:data.UserID,
						userdisplayas: data.UserDisplayAs,
						usercreatedon: data.UserCreatedOn,
						usergender: data.UserGender
					  };
					  
					  // Navigate to the home page					  
					  $rootScope.$state.go("home.welcome");
					  // The both statements below are not working!
					  //$state.go('home');
					  //$state.transitionTo('home');
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
				
				// Go to some other page
			};
			
			$scope.register = function() {
				//$location.path('/register');
				$state.go('login.register');
			};
		}])
        
		// Register controller
		.controller('RegisterController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
	  		$scope.registerInfo = {
	  				username: "",
	  				password: "",
	  				confirmpassword: "",
	  				mailbox: ""
	  			};
	  			
			$scope.submitRegister = function() {
				
			};
			
			$scope.cancel = function() {
				$state.go('login');
			};
		}]);
})();
