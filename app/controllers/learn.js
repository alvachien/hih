(function() {
	'use strict';
	
	angular.module('hihApp.Learn', ["ui.router", "ngAnimate", "smart-table", "hihApp.Utility", "ui.tinymce"])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
	      $stateProvider
	        .state("home.learn", {
	            url: "/learn",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.object", {
	            url: "/object",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.object.list", {
	        	url: "",
	        	templateUrl: 'app/views/learnobjectlist.html',
	        	controller: 'LearnObjectListController'
	        })
	        .state("home.learn.object.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	        .state("home.learn.object.display", {
	        	url: '/display/:objid',
	        	templateUrl: 'app/views/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	        .state("home.learn.object.maintain", {
	        	url: '/maintain/:objid',
	        	templateUrl: 'app/views/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	    ;
		}])
		
		.controller('LearnObjectListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
			utils.loadLearnCategories();
			utils.loadLearnObjects();
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = $rootScope.arLearnObject;
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnObjectLoaded", function() {
		    	console.log("HIH LearnObject List: Loaded event fired!");
		    	
		    	$scope.rowCollection = $rootScope.arLearnObject;
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					// copy the references (you could clone ie angular.copy but
					// then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
		    $scope.$on("LearnCategoryLoaded", function() {
		    	console.log("HIH LearnObject List: Category Loaded event fired!");
		    });	

//			// Remove to the real data holder
//			$scope.removeItem = function removeItem(row) {
//				var index = $scope.rowCollection.indexOf(row);
//			    if (index !== -1) {
//			    	$scope.rowCollection.splice(index, 1);
//			    }
//			 }
//			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.object.maintain",  { objid : row.id });
			    }
			}
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.object.create');
			}
		}])
		
		.controller('LearnObjectController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
			 $scope.Activity = "";
			 $scope.ErrorDetail = "";
			 $scope.CategoryIDs = $rootScope.arLearnCategory;
			 $scope.ObjectContent = "";
			 $scope.ObjectName = "";
			 $scope.ObjectCategoryID = -1;
			 $scope.ObjectID = 0;
			 
			 if (angular.isDefined($stateParams.objid)) {
				 $scope.ObjectID = $stateParams.objid;
				 $scope.Activity = "Edit";
				 
				 $.each($rootScope.arLearnObject, function(idx, obj) {
					 if (obj.id === $scope.ObjectID) {
						 $scope.ObjectContent = obj.content;
						 $scope.ObjectName = obj.name;
						 $scope.ObjectCategoryID = obj.categoryid;
						 //$scope.ObjectID = obj.id;
						 return false;
					 }
				 });
			 } else {
				 $scope.Activity = "Create";
			 };
			 
			 $scope.tinymceOptions = {
			    onChange: function(e) {
			      // put logic here for keypress and cut/paste changes
			    	
			    },
			    inline: false,
			    plugins : 'advlist autolink link image lists charmap print preview',
			    skin: 'lightgray',
			    theme : 'modern'
			  };
		}])
		;
// if (app) {
// app.controller('LearnObjectController', ['$scope', '$rootScope',
// '$routeParams', '$location', '$http', 'hihSharedInfo', function($scope,
// $rootScope, $routeParams, $location, $http, hihSharedInfo) {
// //
//			
// if (angular.isDefined($routeParams.learnobjectid)) {
// $scope.Activity = "Edit";
// var objs = hihSharedInfo.getLearnObjects($http, $rootScope);
// $.each(objs, function(idx, obj) {
// if (obj.id === $routeParams.learnobjectid) {
// $scope.ObjectContent = obj.content;
// $scope.ObjectName = obj.name;
// $scope.ObjectCategoryID = obj.categoryid;
// $scope.ObjectID = obj.id;
// return false;
// }
// });
// } else {
// $scope.Activity = "Create";
// }
//			
// $scope.submit = function() {
// // Let's do the checks first!!!!
// $scope.ErrorDetail = "Please input the name!";
// //$("#areaAlert").alert();
//				
// if ($scope.LearnObject ) {
//					
// } else {
//					
// }
// }
//			
// $scope.close = function() {
// $location.path('/learnobjectlist');
// }
// }]);
//	
// // Learn histories
// app.controller('LearnHistoryListController', ['$scope', '$rootScope',
// '$location', '$http', 'hihSharedInfo', function($scope, $rootScope,
// $location, $http, hihSharedInfo) {
// hihSharedInfo.loadLearnHistories($http, $rootScope);
// $scope.rowCollection = [];
// $scope.displayedCollection = [];
//		    
// $scope.rowCollection = hihSharedInfo.getLearnHistories($http, $rootScope);
// $scope.displayedCollection = [].concat($scope.rowCollection);
//		    
// $scope.$on("LearnHistoryLoaded", function() {
// console.log("HIH LearnHistory List: Loaded event fired!");
//		    	
// $scope.rowCollection = hihSharedInfo.getLearnHistories();
// if ($scope.rowCollection && $scope.rowCollection.length > 0) {
// //copy the references (you could clone ie angular.copy but then have to go
// through a dirty checking for the matches)
// $scope.displayedCollection = [].concat($scope.rowCollection);
// }
// });
//		    
// // Remove to the real data holder
// $scope.removeItem = function removeItem(row) {
// var index = $scope.rowCollection.indexOf(row);
// if (index !== -1) {
// $scope.rowCollection.splice(index, 1);
// }
// }
//			
// // Create
// $scope.newItem = function() {
// $location.path('/learnobject');
// }
// }]);
//		
// // Learn award
// app.controller('LearnAwardListController', ['$scope', '$rootScope',
// '$location', '$http', 'hihSharedInfo', function($scope, $rootScope,
// $location, $http, hihSharedInfo) {
// hihSharedInfo.loadLearnAwards($http, $rootScope);
// $scope.rowCollection = [];
// $scope.displayedCollection = [];
//		    
// $scope.rowCollection = hihSharedInfo.getLearnAwards($http, $rootScope);
// $scope.displayedCollection = [].concat($scope.rowCollection);
//		    
// $scope.$on("LearnAwardLoaded", function() {
// console.log("HIH LearnAward List: Loaded event fired!");
//		    	
// $scope.rowCollection = hihSharedInfo.getLearnAwards();
// if ($scope.rowCollection && $scope.rowCollection.length > 0) {
// //copy the references (you could clone ie angular.copy but then have to go
// through a dirty checking for the matches)
// $scope.displayedCollection = [].concat($scope.rowCollection);
// }
// });
//		    
// // Remove to the real data holder
// $scope.removeItem = function removeItem(row) {
// var index = $scope.rowCollection.indexOf(row);
// if (index !== -1) {
// $scope.rowCollection.splice(index, 1);
// }
// }
//			
// // Create
// $scope.newItem = function() {
// $location.path('/learnobject');
// }
// }]);
// }
})();
