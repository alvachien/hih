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

                        var arProfiles = JSON && JSON.parse(data.UserProfile);
                        $rootScope.CurrentUser.Profiles = {};
                        if ($.isArray(arProfiles) && arProfiles.length > 0) {
                            $.each(arProfiles, function(idx, obj) {
                                $rootScope.CurrentUser.Profiles[obj.Module] = {};
                                $rootScope.CurrentUser.Profiles[obj.Module].ReadFlag = (parseInt(obj.ReadFlag) === 1);
                                $rootScope.CurrentUser.Profiles[obj.Module].CreateFlag = (parseInt(obj.CreateFlag) === 1);
                                $rootScope.CurrentUser.Profiles[obj.Module].UpdateFlag = (parseInt(obj.UpdateFlag) === 1);
                                $rootScope.CurrentUser.Profiles[obj.Module].FullControlFlag = (parseInt(obj.FullControlFlag) === 1);
                            });
                        }
                        console.log($rootScope.CurrentUser);
                        
                        // Navigate to the home page					  
                        $rootScope.$state.go("home.welcome");
                        // The both statements below are not working!
                        //$state.go('home');
                        //$state.transitionTo('home');
                      } else {
					       $rootScope.$broadcast("ShowMessageEx", "Error", 
                            [{Type: 'danger', Message: "Unexpected system response, no logon allowed so far!"}]);
                      }
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
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
                    var msgTable = [];
                    $.each(msgs, function(idx, objMsg) {
                        msgTable.push({Type: 'danger', Message: objMsg});
                    });
                    $rootScope.$broadcast('ShowMessageEx', "Error",  msgTable);
					return;	
				} else {
					utils.registerUserQ($scope.registerInfo)
						.then(function(response) {
							$state.go("login");
						}, function(reason) {
							$rootScope.$broadcast('ShowMessageEx', "Error", [{Type: 'danger', Message: reason}]);
						});
				}
			};
			
			$scope.cancel = function() {
				$state.go('login');
			};
		}]);
})();
