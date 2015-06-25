(function() {
	'use strict';
	
	if (app) {
		// Learn objects
		app.controller('LearnObjectListController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnObjects($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnObjects($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnObjectLoaded", function() {
		    	console.log("HIH LearnObject List: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnObjects($http, $rootScope);
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	//$scope.rowCollection.splice(index, 1);
			    	$location.path('/learnobject/' + row.id);
			    }
			}
			
			// Create
			$scope.newItem = function() {
				$location.path('/learnobject/0');
			}
		}]);
		
		app.controller('LearnObjectController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $routeParams, $location, $http, hihSharedInfo) {
			$scope.Activity = "";
			$scope.LearnObject = {};
			
			if ($routeParams.learnobjectid !== "0") {
				$scope.Activity = "Edit";
				var objs = hihSharedInfo.getLearnObjects($http, $rootScope);
				$.each(objs, function(idx, obj) {
					if (obj.id === $routeParams.learnobjectid) {
						$scope.LearnObject = obj;
						return false;
					}
				});				
			} else {
				$scope.Activity = "Create";
			}
			
			$scope.submit = function() {
				
			}
			$scope.close = function() {
				$location.path('/learnobjectlist');
			}
		}]);
	
		// Learn histories
		app.controller('LearnHistoryListController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnHistories($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnHistories($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnHistoryLoaded", function() {
		    	console.log("HIH LearnHistory List: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnHistories($http, $rootScope);
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
		}]);
		
		// Learn award
		app.controller('LearnAwardListController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnAwards($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnAwards($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnAwardLoaded", function() {
		    	console.log("HIH LearnAward List: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnAwards($http, $rootScope);
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
		}]);
	}
})();
