(function() {
	'use strict';	
	
	// Login controller
	app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		$scope.credentials = {
			username: "",
			password: ""
		};
		$scope.ErrorHeader = "";
		$scope.ErrorDetail = "";		
		
		$scope.login = function() {
			// Verify the inputs first!
			
			// Then, real logon
			$http.post('script/hihsrv.php', { objecttype: 'USERLOGIN', loginuser:$scope.credentials.username, loginpassword: $scope.credentials.password } ).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously when the response is available
				hihSharedInfo.Login();
				hihSharedInfo.setCurrentUser({
					userid:data.UserID,
					userdisplayas: data.UserDisplayAs
				});
				
				// Broadcast event
				$rootScope.$broadcast("Login");
				// Redirect to home page
				$location.path('/home');
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs or server returns response with an error status.
				  $scope.ErrorHeader = "Error";
				  $scope.ErrorDetail = data.Message;
				  var dlg = $('#dlgLoginError');
				  if (dlg)
					  dlg.modal('show');
			  });
		}
		
		$scope.register = function() {			
			$location.path('/register');
		}
	}]);
	
})();
