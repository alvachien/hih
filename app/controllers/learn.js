(function() {
	'use strict';
	
	if (app) {
		app.controller('LearnObjectController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
			$scope.title = "";
			
		}]);
	
		app.controller('LearnHistoryController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
			$scope.title = "";
			
		}]);
		
		app.controller('LearnAwardController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
			$scope.title = "";
			
		}]);
	}
})();
