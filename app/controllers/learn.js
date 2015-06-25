(function() {
	'use strict';
	
	if (app) {
		// Learn objects
		app.controller('LearnObjectListController', ['$scope', '$rootScope', '$location', '$http', 'hihSharedInfo', function($scope, $rootScope, $location, $http, hihSharedInfo) {
		    hihSharedInfo.loadLearnObjects($http, $rootScope);		
		    hihSharedInfo.loadLearnCategories($http, $rootScope);
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = hihSharedInfo.getLearnObjects($http, $rootScope);
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnObjectLoaded", function() {
		    	console.log("HIH LearnObject List: Loaded event fired!");
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnObjects();
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    $scope.$on("LearnCategoryLoaded", function() {
		    	console.log("HIH LearnObject List: Category Loaded event fired!");
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
			$("#areaAlert").alert('close');
			$scope.Activity = "";
			$scope.LearnObject = {};
			$scope.isDirty = false;
			
			if ($routeParams.learnobjectid) {
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
				$scope.isDirty = true;
			}
			$scope.ErrorDetail = "";
			$scope.CategoryIDs = hihSharedInfo.getLearnCategories();
			$scope.setDirty = function() {
				$scope.isDirty = true;
			}
			$scope.submit = function() {
				// Let's do the checks first!!!!
				$("#areaAlert").alert();
				
				if ($scope.LearnObject ) {
					
				} else {
					
				}
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
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnHistories();
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
			
			// Create
			$scope.newItem = function() {
				$location.path('/learnobject/0');
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
		    	
		    	$scope.rowCollection = hihSharedInfo.getLearnAwards();
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
			
			// Create
			$scope.newItem = function() {
				$location.path('/learnobject/0');
			}
		}]);
	}
})();
