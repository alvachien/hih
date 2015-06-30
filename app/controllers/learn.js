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
	        .state("home.learn.history", {
	            url: "/history",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.history.list", {
	        	url: "",
	        	templateUrl: 'app/views/learnhistorylist.html',
	        	controller: 'LearnHistoryListController'
	        })
	        .state("home.learn.history.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.history.display", {
	        	url: '/display/:objid',
	        	templateUrl: 'app/views/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.history.maintain", {
	        	url: '/maintain/:objid',
	        	templateUrl: 'app/views/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.award", {
	            url: "/award",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.award.list", {
	        	url: "",
	        	templateUrl: 'app/views/learnawardlist.html',
	        	controller: 'LearnAwardListController'
	        })
	        .state("home.learn.award.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learnaward.html',
	        	controller: 'LearnAwardController'
	        })
	        .state("home.learn.award.display", {
	        	url: '/display/:objid',
	        	templateUrl: 'app/views/learnaward.html',
	        	controller: 'LearnAwardController'
	        })
	        .state("home.learn.award.maintain", {
	        	url: '/maintain/:objid',
	        	templateUrl: 'app/views/learnaward.html',
	        	controller: 'LearnAwardController'
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

			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// Popup dialog for confirm
			    	
			    	// Then, communicate the sever for deleting
			    	
			    	// Last, update the UI part
//			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
			
			// Display
			$scope.displayItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.object.display",  { objid : row.id });
			    }
			}
			
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
			 $scope.isReadonly = false;
			 
			 if (angular.isDefined($stateParams.objid)) {
				 $scope.ObjectID = $stateParams.objid;
				 
				 if ($state.current.name === "home.learn.object.maintain") {
					 $scope.Activity = "Edit";					 
				 } else if ($state.current.name === "home.learn.object.display") {
					 $scope.Activity = "Display";
					 $scope.isReadonly = true;
				 }
 				 
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
			    menubar: false,
			    statusbar: false,
			    toolbar: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | removeformat",
			    plugins : 'advlist autolink link image lists charmap print preview',
			    skin: 'lightgray',
			    theme : 'modern'
			  };
			 
			 $scope.submit = function() {
				 // Let's do the checks first!!!!
				 $scope.ErrorDetail = "Please input the name!";
				 //$("#areaAlert").alert();
							
				 if ($scope.LearnObject ) {
									
				 } else {
									
				 }
			 }
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.object.list");
			 }
		}])
		
		.controller('LearnHistoryListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
			utils.loadLearnHistories();
			utils.loadUserList();
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = $rootScope.arLearnHistory;
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnHistoryLoaded", function() {
		    	console.log("HIH LearnHistory List: Loaded event fired!");
		    	
		    	$scope.rowCollection = $rootScope.arLearnHistory;
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					// copy the references (you could clone ie angular.copy but
					// then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// Popup dialog for confirm
			    	
			    	// Then, communicate the sever for deleting
			    	
			    	// Last, update the UI part
//			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
			
			// Display
			$scope.displayItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.history.display",  { objid : row.id });
			    }
			}
			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.history.maintain",  { objid : row.id });
			    }
			}
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.history.create');
			}
		}])

		.controller('LearnHistoryController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
			 $scope.Activity = "";
			 $scope.ErrorDetail = "";
			 $scope.CategoryIDs = $rootScope.arLearnCategory;
			 $scope.ObjectContent = "";
			 $scope.ObjectName = "";
			 $scope.ObjectCategoryID = -1;
			 $scope.ObjectID = 0;
			 $scope.LearnDate = new Date();
			 $scope.isReadonly = false;
			 $scope.isDateOpened = false;
			 
			 $scope.openDate = function($event) {
				    $event.preventDefault();
				    $event.stopPropagation();

				    $scope.isDateOpened = true;
			};
			 
			 if (angular.isDefined($stateParams.objid)) {
				 $scope.ObjectID = $stateParams.objid;
				 
				 if ($state.current.name === "home.learn.history.maintain") {
					 $scope.Activity = "Edit";					 
				 } else if ($state.current.name === "home.learn.history.display") {
					 $scope.Activity = "Display";
					 $scope.isReadonly = true;
				 }
 				 
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
			 
			 $scope.submit = function() {
				 // Let's do the checks first!!!!
				 $scope.ErrorDetail = "Please input the name!";
				 //$("#areaAlert").alert();
							
				 if ($scope.LearnObject ) {
									
				 } else {
									
				 }
			 }
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.object.list");
			 }
		}])

		.controller('LearnAwardListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
			utils.loadLearnAwards();
		    $scope.rowCollection = [];     
		    $scope.displayedCollection = [];
		    
		    $scope.rowCollection = $rootScope.arLearnAward;
		    $scope.displayedCollection = [].concat($scope.rowCollection);
		    
		    $scope.$on("LearnAwardLoaded", function() {
		    	console.log("HIH LearnAward List: Loaded event fired!");
		    	
		    	$scope.rowCollection = $rootScope.arLearnAward;
			    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
					// copy the references (you could clone ie angular.copy but
					// then have to go through a dirty checking for the matches)
			    	$scope.displayedCollection = [].concat($scope.rowCollection);
			    }
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// Popup dialog for confirm
			    	
			    	// Then, communicate the sever for deleting
			    	
			    	// Last, update the UI part
//			    	$scope.rowCollection.splice(index, 1);
			    }
			 }
			
			// Display
			$scope.displayItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.award.display",  { objid : row.id });
			    }
			}
			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.award.maintain",  { objid : row.id });
			    }
			}
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.award.create');
			}
		}])
		
		.controller('LearnAwardController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
			 $scope.Activity = "";
			 $scope.ErrorDetail = "";
			 $scope.CategoryIDs = $rootScope.arLearnCategory;
			 $scope.ObjectContent = "";
			 $scope.ObjectName = "";
			 $scope.ObjectCategoryID = -1;
			 $scope.ObjectID = 0;
			 $scope.isReadonly = false;
			 
			 if (angular.isDefined($stateParams.objid)) {
				 $scope.ObjectID = $stateParams.objid;
				 
				 if ($state.current.name === "home.learn.history.maintain") {
					 $scope.Activity = "Edit";					 
				 } else if ($state.current.name === "home.learn.history.display") {
					 $scope.Activity = "Display";
					 $scope.isReadonly = true;
				 }
 				 
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
			    menubar: false,
			    statusbar: false,
			    toolbar: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | removeformat",
			    plugins : 'advlist autolink link image lists charmap print preview',
			    skin: 'lightgray',
			    theme : 'modern'
			  };
			 
			 $scope.submit = function() {
				 // Let's do the checks first!!!!
				 $scope.ErrorDetail = "Please input the name!";
				 //$("#areaAlert").alert();
							
				 if ($scope.LearnObject ) {
									
				 } else {
									
				 }
			 }
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.object.list");
			 }
		}])
		;
// if (app) {
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
