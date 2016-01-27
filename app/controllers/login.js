/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';	
	
	angular.module('hihApp.Login', ["ui.router", "ngAnimate", "pascalprecht.translate", "hihApp.Utility"])
		.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {
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
		
		.controller('LoginController', ['$scope', '$rootScope', '$state', '$http', '$translate', function($scope, $rootScope, $state, $http, $translate) {
	  		$scope.credentials = {
	  			username: "",
	  			password: ""
	  		};
	  			
			$scope.login = function() {
                $rootScope.$broadcast("ShowMessageEx", "Error", ["data.Message"]);
                return;
                
				// Verify the inputs first!
				// To-Do
				
				// Then, real logon
				$http.post('script/hihsrv.php', { objecttype: 'USERLOGIN', loginuser:$scope.credentials.username, loginpassword: $scope.credentials.password } ).
				  success(function(data, status, headers, config) {
                      if (data.UserID && data.UserID.length > 0) {
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
                      } else {
					       $rootScope.$broadcast("ShowMessage", "Error", "Unexpected system response, no logon allowed so far!");
                      }
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
			};
			
			$scope.register = function() {
				//$location.path('/register');
				$state.go('login.register');
			};
		}])
        
		// Register controller
		.controller('RegisterController', ['$scope', '$rootScope', '$state', '$translate', 'utils', function($scope, $rootScope, $state, $translate, utils) {
	  		$scope.registerInfo = new hih.UserRegistration();
	  		$scope.PasswordStrengthValue = 0;
			$scope.ProgressClass = "progress-bar progress-bar-danger";
			$scope.regGender = "0";
			  
			$scope.$watch('registerInfo', function(newVal, oldVal) {
				if (newVal.Password !== oldVal.Password) {
					var nLevel = hih.ModelUtility.CheckPasswordStrength(newVal.Password);
					if (nLevel === hih.Constants.Login_PwdStrgth_VeryStrong) {
						$scope.PasswordStrengthValue = 100;
						$scope.ProgressClass = "progress-bar progress-bar-success";
					} else if (nLevel === hih.Constants.Login_PwdStrgth_Strong) {
						$scope.PasswordStrengthValue = 80;
						$scope.ProgressClass = "progress-bar progress-bar-info";
						
					} else if (nLevel === hih.Constants.Login_PwdStrgth_Normal) {
						$scope.PasswordStrengthValue = 60;
						$scope.ProgressClass = "progress-bar progress-bar-warning";
					} else if (nLevel === hih.Constants.Login_PwdStrgth_Weak) {
						$scope.PasswordStrengthValue = 30;
						$scope.ProgressClass = "progress-bar progress-bar-danger";
					} else {
						$scope.PasswordStrengthValue = 0;
						$scope.ProgressClass = "progress-bar progress-bar-danger";
					}
				}
			}, true);
			
			$scope.submitRegister = function() {
				$scope.registerInfo.Gender = parseInt($scope.regGender);
				
				var msgs = $scope.registerInfo.Verify();
				if ($.isArray(msgs) && msgs.length > 0) {
					// To-Do
					// 
					$.each(msgs, function(idx, objMsg) {
						$rootScope.$broadcast('ShowMessageNeedTranslate', objMsg, 'Common.Error', 'error');
					})
					return;	
				} else {
					utils.registerUserQ($scope.registerInfo)
						.then(function(response) {
							$state.go("login");
						}, function(reason) {
							$rootScope.$broadcast('ShowMessage', "Error", reason);
						});
				}
			};
			
			$scope.cancel = function() {
				$state.go('login');
			};
		}]);
})();
