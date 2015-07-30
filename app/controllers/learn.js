/* global $ */
/* global angular */
(function() {
	'use strict';
	
	angular.module('hihApp.Learn', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 'ui.select', 'ngJsTree',  
		'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns',
		'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping'])
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
	        .state("home.learn.object.hierarchy", {
	        	url: "/hierarchy",
	        	templateUrl: 'app/views/learnobjecthierarchy.html',
	        	controller: 'LearnObjectHierarchyController'
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
	        	url: '/display/:histid',
	        	templateUrl: 'app/views/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.history.maintain", {
	        	url: '/maintain/:histid',
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
	        .state("home.learn.category", {
	            url: "/category",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.category.list", {
	        	url: "",
	        	templateUrl: 'app/views/learncategorylist.html',
	        	controller: 'LearnCategoryListController'
	        })
	        .state("home.learn.category.hierarchy", {
	        	url: "/hierarchy",
	        	templateUrl: 'app/views/learncategoryhierarchy.html',
	        	controller: 'LearnCategoryHierarchyController'
	        })
			;
		}])
		
		.controller('LearnObjectListController', ['$scope', '$rootScope', '$state', '$http', '$interval', 'uiGridConstants', 'uiGridGroupingConstants', 'utils', 
			function($scope, $rootScope, $state, $http, $interval, uiGridConstants, uiGridGroupingConstants, utils) {
			utils.loadLearnCategories();
			utils.loadLearnObjects();

			// Grid options
			$scope.gridOptions = {};
			$scope.gridOptions.data = 'myData';
			$scope.gridOptions.enableSorting = true;
			$scope.gridOptions.enableColumnResizing = true;
			$scope.gridOptions.enableFiltering = true;
			$scope.gridOptions.enableGridMenu = false;
			$scope.gridOptions.enableColumnMenus = false;
			$scope.gridOptions.showGridFooter = true;
			//$scope.gridOptions.showColumnFooter = true;
			// $scope.gridOptions.fastWatch = true;
			
			$scope.gridOptions.rowIdentity = function(row) {
			 	return row.id;
			};
			$scope.gridOptions.getRowIdentity = function(row) {
			 	return row.id;
			};			
			$scope.gridOptions.onRegisterApi = function(gridApi) {
      			$scope.gridApi = gridApi;
    		};
			
			$scope.gridOptions.columnDefs = [
		    	{ name:'id', field: 'id', displayName: 'Common.ID', headerCellFilter: "translate", width:90,
					aggregationType:uiGridConstants.aggregationTypes.count
//		    		, sort: {
//		          	direction: uiGridConstants.DESC,
//		          	priority: 1
//		        	} 
				},
		    	{ name:'categoryid', field: 'categoryid', displayName: 'Common.Category', headerCellFilter: "translate", width:90 },
				{ name:'categoryname', field: 'categoryname', displayName: 'Common.Category', headerCellFilter: "translate", width: 150},
				{ name:'name', field:'name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
				{ name:'content', field:'content', displayName: 'Common.Content', headerCellFilter: "translate", width: 400 }
		    // 	{ name:'age', width:100, enableCellEdit: true, aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG },
		    // { name:'agetemplate',field:'age', width:150, cellTemplate: '<div class="ui-grid-cell-contents"><span>Age 2:{{COL_FIELD}}</span></div>' },
		    // { name:'Join Date',field:'registered', cellFilter:'date', width:150, type:'date', enableFiltering:false },
		    // { name:'Month Joined',field:'registered', cellFilter: 'date:"MMMM"', filterCellFiltered:true, sortCellFiltered:true, width:150, type:'date' }
		  ];
		  
		  if (angular.isArray($rootScope.arLearnObject ) && $rootScope.arLearnObject.length > 0) {
			  $scope.myData = [];
				$.each($rootScope.arLearnObject, function(idx, obj) {
		  			$scope.myData.push(angular.copy(obj));					
				});			  
		  };
		    
		    $scope.$on("LearnObjectLoaded", function() {
		    	console.log("HIH LearnObject List: Loaded event fired!");
		    	$scope.myData = [];
				
				$.each($rootScope.arLearnObject, function(idx, obj) {
		  			$scope.myData.push(angular.copy(obj));					
				});
		    });
		    
		    $scope.$on("LearnCategoryLoaded", function() {
		    	console.log("HIH LearnObject List: Category Loaded event fired!");
		    });	

			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// Popup dialog for confirm
					$rootScope.$broadcast('ShowMessage', "Deletion Confirm", "Delete the select item?", "warning", function() {
						$http.post(
							'script/hihsrv.php',
							{
								objecttype : 'DELETELEARNOBJECT',
								id : row.id
							})
							.success(
								function(data, status, headers, config) {
									//$scope.rowCollection.splice(index, 1);
									
									// Update the buffer
									$.each($rootScope.arLearnObject, function(idx, obj) {
										if (obj.id === row.id) {
											$rootScope.arLearnObject.splice(idx, 1);
											return false;
										}
									});
								})
							 .error(
								function(data, status, headers, config) {
									// called asynchronously if an error occurs or server returns response with an error status.
									$rootScope.$broadcast(
										"ShowMessage",
										"Error",
										data.Message);
								});							
					});
			    }
			 };
			
			// Display
			$scope.displayItem = function (row) {
				//var index = $scope.rowCollection.indexOf(row);
			    //if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    //	$state.go("home.learn.object.display",  { objid : row.id });
			    //}
			};
			
			// Edit
			$scope.editItem = function (row) {
				//var index = $scope.rowCollection.indexOf(row);
			    //if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    //	$state.go("home.learn.object.maintain",  { objid : row.id });
			   // }
			};
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.object.create');
			};
			
			// Refresh list
			$scope.refreshList = function() {
				// Reload the whole list
				utils.loadLearnObjects(true);
			};
		}])
		
		.controller('LearnObjectHierarchyController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
			utils.loadLearnObjectsHierarchy();
			utils.loadLearnCategories();
			
			$scope.ignoreModelChanges = function() { return false; };
	        $scope.treeConfig = {
	            	core : {
	                     multiple : false,
	                     animation: true,
	                     error : function(error) {
	                         $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
	                     },
	                     //check_callback : true,
	                     //worker : true,
	    				 themes: {
	                     	name: 'default-dark',
	    					url: "//cdn.bootcss.com/jstree/3.1.1/themes/default-dark/style.min.css",
	    					responsive: true,
	    					stripes: true
	                	}
	                 },
					 types: {
						default: {
							icon : 'glyphicon glyphicon-folder-close'
						},
						object: {
							icon : 'glyphicon glyphicon-gift'
						}
					 },
	                 version : 1,
	    			 plugins : [ 'wholerow', 'types' ]
	             };
			
			if (angular.isArray($rootScope.arLearnObjectHierarchy) && $rootScope.arLearnObjectHierarchy.length > 0) {
				$scope.treeData = [];
				 $.each($rootScope.arLearnObjectHierarchy, function(idx, obj) {
					var treenode = {};
					angular.copy(obj, treenode);
					treenode.state = {
					 	opened: true	
					};
					
					$scope.treeData.push(treenode); 
				 });
				 //$scope.treeData = utils.flat2nested($scope.treeData);
			 }
			
			 $scope.newItem = function() {
				 $state.go('home.learn.object.create');
			 };
			 
			 $scope.refreshHierarchy = function() {
				 utils.loadLearnObjectsHierarchy(true);
			 };
	         
	 		 $scope.$on("LearnObjectHierarchyLoaded", function() {
				$log.info("HIH LearnObject Hierarchy view: Object Hierarchy Loaded event fired!");
				
				$scope.treeData = [];
				if (angular.isArray($rootScope.arLearnObjectHierarchy) && $rootScope.arLearnObjectHierarchy.length > 0) {
					$.each($rootScope.arLearnObjectHierarchy, function(idx, obj) {
						var treenode = {};
						angular.copy(obj, treenode);
						treenode.state = {
						 	opened: true	
						};
						
						$scope.treeData.push(treenode); 
					 });
					 
					// Re-create the hierarchy
					$scope.treeConfig.version++;
				}			
			 });			
		}])		
		
		.controller('LearnObjectController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', 
		                                      function($scope, $rootScope, $state, $stateParams, $http, utils) {
		    $scope.Activity = "";
		    $scope.ActivityID = 3;
			$scope.CategoryIDs = $rootScope.arLearnCategory;
			
			$scope.ObjectContent = "";
			$scope.ObjectName = "";
			$scope.ObjectCategoryID = -1;
			$scope.ObjectID = 0;
			$scope.isReadonly = false;
			$scope.ContentModified = false;
			 
			if (angular.isDefined($stateParams.objid)) {
			    $scope.ObjectID = $stateParams.objid;
				 
				if ($state.current.name === "home.learn.object.maintain") {
				    $scope.Activity = "Common.Edit";
				    $scope.ActivityID = 2;
				} else if ($state.current.name === "home.learn.object.display") {
				    $scope.Activity = "Common.Display";
				    $scope.isReadonly = true;
				    $scope.ActivityID = 3;
				}
 				 
				$.each($rootScope.arLearnObject, function(idx, obj) {
				    if ($scope.ObjectID === 0 || $scope.ObjectID === -1) 
					    return false;
					 
                    if (obj.id === $scope.ObjectID) {
					    $scope.ObjectContent = obj.content;
						$scope.ObjectName = obj.name;
						$scope.ObjectCategoryID = obj.categoryid;
						//$scope.ObjectID = obj.id;
						return false;
					}
				});
			} else {
			    $scope.Activity = "Common.Create";
			    $scope.ActivityID = 1;
			};
			 
			$scope.tinymceOptions = {
			    onChange: function(e) {
			        if ($scope.ActivityID !== 3) {
			            $scope.ContentModified = true;
			        }
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
				 if ($scope.ObjectName.length <= 0) {
					 $rootScope.$broadcast('ShowMessage', "Error", "Name is must!");
					 return;
				 }
				 
				 // Check the category
				 if ($scope.ObjectCategoryID === -1 || $scope.ObjectCategoryID === 0) {
					 $rootScope.$broadcast('ShowMessage', "Error", "Category is must!");
					 return;
				 }
				 
				 // Check the content
				 var realcontent = $scope.ObjectContent.replace("<p><br data-mce-bogus=\"1\"></p>", "");
				 realcontent = realcontent.replace("<p><br /></p>", "");
				 if (realcontent.length <= 0) {
					 $rootScope.$broadcast('ShowMessage', "Error", "Content is must!");
					 return;
				 }
				 
				 // Now, submit to the server
				$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNOBJECT', category:$scope.ObjectCategoryID, name: $scope.ObjectName, content: $scope.ObjectContent } ).
				  success(function(data, status, headers, config) {
					  // Then, go to display page
					  $scope.gen_id = data[0].id;
					  
					  // Add the buffer
					  utils.loadLearnObjects(true);
					  utils.loadLearnObjectsHierarchy(true);					  
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
			 };
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.object.list");
			 };
			 
    		 $scope.$on("LearnObjectLoaded", function() {
				console.log("HIH LearnObject: Object list loaded event fired!");
				
				$state.go("home.learn.object.display", { objid : $scope.gen_id });
			});	
		}])
		
		.controller('LearnHistoryListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
			utils.loadLearnHistories();
			utils.loadLearnObjects();
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
					$rootScope.$broadcast('ShowMessage', "Deletion Confirm", "Delete the select item?", "warning", function() {
						$http.post(
							'script/hihsrv.php',
							{
								objecttype : 'DELETELEARNHISTORY',
								userid : row.userid,
								objectid: row.objectid
							})
							.success(
								function(data, status, headers, config) {
									$scope.rowCollection.splice(index, 1);
									
									// Update the buffer
									$.each($rootScope.arLearnHistory, function(idx, obj) {
										if (obj.objectid === row.objectid && obj.userid === row.userid) {
											$rootScope.arLearnHistory.splice(idx, 1);
											return false;
										}
									});
								})
							 .error(
								function(data, status, headers, config) {
									// called asynchronously if an error occurs or server returns response with an error status.
									$rootScope.$broadcast(
										"ShowMessage",
										"Error",
										data.Message);
								});
					});
			    }
			 };
			
			// Display
			$scope.displayItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.history.display",   { histid : row.objectid.toString().concat('_', row.userid.toString()) });
			    }
			};
			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.history.maintain",  { histid : row.objectid.toString().concat('_', row.userid.toString()) });
			    }
			};
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.history.create');
			};
			
			// Refresh list
			$scope.refreshList = function() {
				// Reload the whole list
				utils.loadLearnHistories(true);
			};
		}])

		.controller('LearnHistoryController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
			 $scope.Activity = "";
			 
			 $scope.CategoryIDs = $rootScope.arLearnCategory;
			 $scope.UserIDs = $rootScope.arUserList;			 
			 $scope.LearnObjects = $rootScope.arLearnObject;
			 
			 $scope.UserID = "";
			 $scope.ObjectID = -1;
			 $scope.ObjectName = "";
			 $scope.ObjectContent = "";
			 $scope.Comment = "";
			 $scope.CategoryID = -1;
			 $scope.CategoryName = "";
			 $scope.LearnDate = new Date();
			 $scope.SelectedLearnObject = {};
			 $scope.selectsearchenable = false;

			 $scope.isReadonly = false;
			 $scope.isDateOpened = false;	
			 $scope.DateFormat = "yyyy-MM-dd";
			 $scope.dateOptions = {
				formatYear: 'yyyy',
				startingDay: 1
			};
			 $scope.openDate = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				
				if (!$scope.isReadonly)
					$scope.isDateOpened = true;
			};
			 
			 if (angular.isDefined($stateParams.histid)) {
				 if ($state.current.name === "home.learn.history.maintain") {
					 $scope.Activity = "Common.Edit";					 
				 } else if ($state.current.name === "home.learn.history.display") {
					 $scope.Activity = "Common.Display";
					 $scope.isReadonly = true;
				 }
 				 
				 var arrID = $stateParams.histid.split('_');
				 if (arrID.length >= 2) {
					 $.each($rootScope.arLearnHistory, function(idx, obj) {
						 if (obj.userid === arrID[1] && parseInt(obj.objectid) === parseInt(arrID[0])) {
							 $scope.UserID = obj.userid;
							 $scope.DisplayAs = obj.displayas;
							 
							 $.each($scope.LearnObjects, function(idx2, obj2) {
								 if (obj.objectid === obj2.id) {
									 $scope.SelectedLearnObject.selected = obj2;
									 return false;
								 }
							 });
							 
							 $scope.ObjectID = obj.objectid;
							 $scope.ObjectName = obj.objectname;						 
							 $scope.CategoryID = obj.categoryid;
							 $scope.CategoryName = obj.categoryname;
							 $scope.LearnDate = utils.dateparser(obj.learndate);
							 //$scope.LearnDate = utils.datefromdbtoui(obj.learndate);
							 $scope.ObjectContent = obj.objectcontent;
							 $scope.Comment = obj.comment;
							 
							 return false;
						 }
					 }); 
				 }
			 } else {
				 $scope.Activity = "Common.Create";
			 };
			 
			 $scope.submit = function() {
				 // Now, submit to the server
				 if ($scope.UserID) {					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "Select an user!", "error");
					 return;					 
				 }
				 if ($scope.SelectedLearnObject && $scope.SelectedLearnObject.selected) {					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "Select a learning object!", "error");
					 return;
				 }
				 
				 $http.post('script/hihsrv.php', { objecttype: 'CREATELEARNHISTORY', user:$scope.UserID, learnobject: $scope.ObjectID, learndate: $scope.LearnDate, comment: $scope.Comment  } ).
				 	success(function(data, status, headers, config) {
					  // Then, go to display page
					  $scope.gen_id = data[0].objectid.toString().concat('_', data[0].userid.toString());
					  
					  utils.loadLearnHistories(true);
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
			 };
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.history.list");
			 };
			 
		    $scope.$on("LearnHistoryLoaded", function() {
		    	console.log("HIH LearnHistory: List Loaded event fired!");
		    	
				$state.go("home.learn.history.display",   { histid : $scope.gen_id });
		    });			 
		}])

		.controller('LearnAwardListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
			utils.loadLearnAwards();
			utils.loadUserList(); // Ensure the Award page can show user combo.
			
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
					$rootScope.$broadcast('ShowMessage', "Deletion Confirm", "Delete the select item?", "warning", function() {
						$http.post(
							'script/hihsrv.php',
							{
								objecttype : 'DELETELEARNAWARD',
								id : row.id
							})
							.success(
								function(data, status, headers, config) {
									$scope.rowCollection.splice(index, 1);
									
									// Update the buffer
									$.each($rootScope.arLearnAward, function(idx, obj) {
										if (obj.id === row.id) {
											$rootScope.arLearnAward.splice(idx, 1);
											return false;
										}
									});
								})
							 .error(
								function(data, status, headers, config) {
									// called asynchronously if an error occurs or server returns response with an error status.
									$rootScope.$broadcast(
										"ShowMessage",
										"Error",
										data.Message);
								});
					});
			    }
			 };
			
			// Display
			$scope.displayItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.award.display",  { objid : row.id });
			    }
			};
			
			// Edit
			$scope.editItem = function (row) {
				var index = $scope.rowCollection.indexOf(row);
			    if (index !== -1) {
			    	// $scope.rowCollection.splice(index, 1);
			    	//$location.path('/learnobject/' + row.id);
			    	$state.go("home.learn.award.maintain",  { objid : row.id });
			    }
			};
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.award.create');
			};
			
			// Refresh list
			$scope.refreshList = function() {
				// Reload the whole list
				utils.loadLearnAwards(true);
			};
		}])
		
		.controller('LearnAwardController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
			 $scope.Activity = "";
			 
			 $scope.AwardID = -1;
			 $scope.isReadonly = false;
			 $scope.UserIDs = $rootScope.arUserList;			 
			 $scope.AwardDate = new Date();
			 $scope.SelectedUser = {};
			 $scope.Score = 0;
			 $scope.Reason = "";
			 
			 $scope.isDateOpened = false;	
			 $scope.DateFormat = "yyyy-MM-dd";
			 $scope.dateOptions = {
				formatYear: 'yyyy',
				startingDay: 1
			 };
			 $scope.openDate = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				
				if (!$scope.isReadonly)
					$scope.isDateOpened = true;
			 };
 
			 if (angular.isDefined($stateParams.objid)) {
				 $scope.AwardID = $stateParams.objid;
				 
				 if ($state.current.name === "home.learn.award.maintain") {
					 $scope.Activity = "Common.Edit";					 
					 
				 } else if ($state.current.name === "home.learn.award.display") {
					 $scope.Activity = "Common.Display";
					 $scope.isReadonly = true;
				 }
 				 
				 $.each($rootScope.arLearnAward, function(idx, obj) {
					 // Learn Award example: {"id":"23","userid":"du","displayas":"Du","adate":"2015-02-22","score":"56","reason":"test"}
					 if (obj.id === $scope.AwardID) {
						 if (angular.isArray($scope.UserIDs)) {
							 $.each($scope.UserIDs, function (idx2, obj2) {
								 // User ID example: {"id":"ac","text":"AC"}
								 if (obj2.id === obj.userid) {
									 $scope.SelectedUser.selected = obj2;
									 return false;
								 }
							 });								 
						 }
						 
						 $scope.AwardDate = obj.adate;
						 $scope.Score = obj.score;
						 $scope.Reason = obj.reason;
						 return false;
					 }
				 });
			 } else {
				 $scope.Activity = "Common.Create";
			 };
			 
			 $scope.submit = function() {
				 // To-Do: Validation!!!!
				 if ($scope.SelectedUser && $scope.SelectedUser.selected) {					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "User is must!", "error");
					 return;
				 }
				 if ($scope.Score >= 0 && $scope.Score <= 100){
					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "Score is must!", "error");
					 return;
				 }
				 
				 // Submit the server
				 var datefmt = utils.dateformatter($scope.AwardDate);
				 // user, awarddate, awardscore, awardreason
				 $http.post('script/hihsrv.php', { objecttype: 'CREATELEARNAWARD', user:$scope.SelectedUser.selected.id, 
					 awarddate: datefmt, awardscore: $scope.Score, awardreason: $scope.Reason  } ).
				 	success(function(data, status, headers, config) {
					  // Then, go to display page
					  $scope.gen_id = data[0].id;
					  
					  utils.loadLearnAwards(true);
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
			 };
			 
			 $scope.close = function() {
				 //$location.path('/learnobjectlist');
				 
				 // Cannot go the parent, it shall go the list view!
 				 // $state.go("^");
				 $state.go("home.learn.award.list");
			 };
			 
    		 $scope.$on("LearnAwardLoaded", function() {
				console.log("HIH LearnAward: Award list loaded event fired!");
				
				$state.go("home.learn.award.display", { objid : $scope.gen_id });
			});	
		}])
		
	.controller('LearnCategoryListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadLearnCategories();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arLearnCategory;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

		$scope.$on("LearnCategoryLoaded", function() {
			console.log("HIH LearnCategory List: Category Loaded event fired!");
	    	$scope.rowCollection = $rootScope.arLearnCategory;
			
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
		});		
	}])
	
	.controller('LearnCategoryHierarchyController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadLearnCategories();	
		
		$scope.treeData = [];
		$scope.ignoreModelChanges = function() { return false; };
        $scope.treeConfig = {
            	core : {
                     multiple : false,
                     animation: true,
                     error : function(error) {
                         $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                     },
                     check_callback : true,
                     worker : true,
    				 themes: {
                    	name: 'default-dark',
    					url: "//cdn.bootcss.com/jstree/3.1.1/themes/default-dark/style.min.css",
    					responsive: true,
    					stripes: true
                	}
                 },
                 version : 1,
    			 plugins : [ 'wholerow' ]
             };
		
		if (angular.isArray($rootScope.arLearnCategory) && $rootScope.arLearnCategory.length > 0) {
			 $.each($rootScope.arLearnCategory, function(idx, obj) {
				var treenode = {};
				angular.copy(obj, treenode);
				treenode.state = {
					opened: true	
				};
				
				$scope.treeData.push(treenode); 
			 });
		 } else {			 		 
		 }
         
 		 $scope.$on("LearnCategoryLoaded", function() {
			$log.info("HIH LearnCategory List: Category Loaded event fired!");
			if (angular.isArray($rootScope.arLearnCategory) && $rootScope.arLearnCategory.length > 0) {
				$.each($rootScope.arLearnCategory, function(idx, obj) {
					var treenode = {};
					angular.copy(obj, treenode);
					treenode.state = {
						opened: true	
					};
					
					$scope.treeData.push(treenode); 
				 });
				 
				// Re-create the hierarchy
				$scope.treeConfig.version++;
			}			
		 }); 		 
	}])			
	;
})();

