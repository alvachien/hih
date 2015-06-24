(function() {
	'use strict';
	
	if (app) {
		// Learn objects
		app.controller('LearnObjectController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnObjects($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnObjects($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnObjectLoaded", function() {
		    	console.log("HIH LearnObject: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnObjects($http, $rootScope);
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			//remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
		}]);
	
		// Learn history
		app.controller('LearnHistoryController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnHistories($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnHistories($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnHistoryLoaded", function() {
		    	console.log("HIH LearnHistory: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnHistories($http, $rootScope);
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			//remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
		}]);
		
		// Learn award
		app.controller('LearnAwardController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
			$scope.title = "";
			
		}]);
	}
})();
