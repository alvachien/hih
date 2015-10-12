/* global $ */
/* global angular */
(function() {
	'use strict';
	
	angular.module('hihApp.Learn', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 'ui.select', 'ngJsTree',  
		'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns',
		'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'selectize'])
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
	        	templateUrl: 'app/views/learn/learnobjectlist.html',
	        	controller: 'LearnObjectListController'
	        })
	        .state("home.learn.object.hierarchy", {
	        	url: "/hierarchy",
	        	templateUrl: 'app/views/learn/learnobjecthierarchy.html',
	        	controller: 'LearnObjectHierarchyController'
	        })
	        .state("home.learn.object.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learn/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	        .state("home.learn.object.display", {
	        	url: '/display/:objid',
	        	templateUrl: 'app/views/learn/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	        .state("home.learn.object.maintain", {
	        	url: '/maintain/:objid',
	        	templateUrl: 'app/views/learn/learnobject.html',
	        	controller: 'LearnObjectController'
	        })
	        .state("home.learn.history", {
	            url: "/history",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.history.list", {
	        	url: "",
	        	templateUrl: 'app/views/learn/learnhistorylist.html',
	        	controller: 'LearnHistoryListController'
	        })
	        .state("home.learn.history.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learn/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.history.display", {
	        	url: '/display/:histid',
	        	templateUrl: 'app/views/learn/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.history.maintain", {
	        	url: '/maintain/:histid',
	        	templateUrl: 'app/views/learn/learnhistory.html',
	        	controller: 'LearnHistoryController'
	        })
	        .state("home.learn.award", {
	            url: "/award",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.award.list", {
	        	url: "",
	        	templateUrl: 'app/views/learn/learnawardlist.html',
	        	controller: 'LearnAwardListController'
	        })
	        .state("home.learn.award.create", {
	        	url: '/create',
	        	templateUrl: 'app/views/learn/learnaward.html',
	        	controller: 'LearnAwardController'
	        })
	        .state("home.learn.award.display", {
	        	url: '/display/:objid',
	        	templateUrl: 'app/views/learn/learnaward.html',
	        	controller: 'LearnAwardController'
	        })
	        .state("home.learn.award.maintain", {
	        	url: '/maintain/:objid',
	        	templateUrl: 'app/views/learn/learnaward.html',
	        	controller: 'LearnAwardController'
	        })
	        .state("home.learn.category", {
	            url: "/category",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.learn.category.list", {
	        	url: "",
	        	templateUrl: 'app/views/learn/learncategorylist.html',
	        	controller: 'LearnCategoryListController'
	        })
	        .state("home.learn.category.hierarchy", {
	        	url: "/hierarchy",
	        	templateUrl: 'app/views/learn/learncategoryhierarchy.html',
	        	controller: 'LearnCategoryHierarchyController'
	        })
			;
		}])
		
		.controller('LearnObjectListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'uiGridConstants', 'uiGridGroupingConstants', 'utils', 
			function($scope, $rootScope, $state, $http, $interval, $translate, $log, uiGridConstants, uiGridGroupingConstants, utils) {

			// Grid options
			$scope.gridOptions = {};
			$scope.gridOptions.data = 'myData';
			$scope.gridOptions.enableSorting = true;
			$scope.gridOptions.enableColumnResizing = true;
			$scope.gridOptions.enableFiltering = true;
			$scope.gridOptions.enableGridMenu = false;
			$scope.gridOptions.enableColumnMenus = false;
			$scope.gridOptions.showGridFooter = true;
			$scope.gridOptions.enableRowSelection = true;
			$scope.gridOptions.enableFullRowSelection = true;
			$scope.gridOptions.selectionRowHeaderWidth = 35;
			
			$scope.gridOptions.rowIdentity = function(row) {
			 	return row.ID;
			};
			$scope.gridOptions.getRowIdentity = function(row) {
			 	return row.ID;
			};			
			$scope.gridOptions.onRegisterApi = function(gridApi) {
                $scope.gridApi = gridApi;
				
                gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
     				 if (row.isSelected) {
     					$scope.selectedRows.push(row.entity);     					
     				 } else {
     					$.each($scope.selectedRows, function(idx, obj) {
							if (obj.id === row.entity.id) {
								$scope.selectedRows.splice(idx, 1);
								return false;
							}
						});
     				 }
      		     });
    		};
			
			$scope.gridOptions.columnDefs = [
		    	{ name:'id', field: 'ID', displayName: 'Common.ID', headerCellFilter: "translate", width:90 },
				{ name:'categoryname', field: 'CategoryObject.FullDisplayText', displayName: 'Common.Category', headerCellFilter: "translate", width: 150},
				{ name:'name', field:'Name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
				{ name:'content', field:'Content', displayName: 'Common.Content', headerCellFilter: "translate", width: 400 }
		    ];
		  
			utils.loadLearnCategoriesQ()
				.then(function(response) {
					utils.loadLearnObjectsQ().
						then(function(response2) {
							$scope.myData = [];
							$.each($rootScope.arLearnObject, function(idx, obj) {
								$scope.myData.push(angular.copy(obj));					
							});			  
						}, function(reason2) {
							$rootScope.$broadcast("ShowMessage", "Error", reason2);
						} );
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		  
		    $scope.selectedRows = [];
		    $scope.$on("LearnObjectLoaded", function() {
                $log.info("HIH LearnObject List: Loaded event fired!");
		        $scope.myData = [];
				
				$.each($rootScope.arLearnObject, function(idx, obj) {
		  			$scope.myData.push(angular.copy(obj));					
				});
		    });
		    
		    $scope.$on("LearnCategoryLoaded", function() {
		  	    $log.info("HIH LearnObject List: Category Loaded event fired!");
		    });	

            // Remove to the real data holder
            $scope.removeItem = function removeItem(row) {
                if ($scope.selectedRows.length <= 0)
                    return;
				
				var strIDs = "";
				  
				// Following logic need enhance for multiple items deletion
				$.each($scope.selectedRows, function(idx, obj) {
					if (idx === 0) {						
					} else {
						strIDs = strIDs.concat(",");
					}
					strIDs = strIDs.concat(obj.ID.toString());
				});
				
		    	// Popup dialog for confirm
				$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
					$http.post(
							'script/hihsrv.php',
							{
								objecttype : 'DELETELEARNOBJECTS',
								ids: strIDs
							})
						.success(
							function(data, status, headers, config) {
								$scope.refreshList();
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
			};
			
			// Display
			$scope.displayItem = function (row) {
				if ($scope.selectedRows.length <= 0)
					return;
				
				$state.go("home.learn.object.display",  { objid : $scope.selectedRows[0].ID });
			};
			
			// Edit
			$scope.editItem = function (row) {
				if ($scope.selectedRows.length <= 0)
					return;
				
				$state.go("home.learn.object.maintain",  { objid : $scope.selectedRows[0].ID });
			};
			
			// Create
			$scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.object.create');
			};
			
			// Refresh list
			$scope.refreshList = function() {
				// Reload the whole list
				utils.loadLearnObjectsQ(true)
					.then(function(response) {
						$scope.myData = [];
						$.each($rootScope.arLearnObject, function(idx, obj) {
							$scope.myData.push(angular.copy(obj));					
						});			  
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
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
		
		.controller('LearnObjectController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$log', 'utils', 
		    function($scope, $rootScope, $state, $stateParams, $http, $translate, $log, utils) {
		    $scope.Activity = "";
		    $scope.ActivityID = 3;
			$scope.CategoryIDs = $rootScope.arLearnCategory;
			
			$scope.objLearnObject = new hih.LearnObject();
			$scope.isReadonly = false;
			$scope.ContentModified = false;
			 
			if (angular.isDefined($stateParams.objid)) {
				if ($state.current.name === "home.learn.object.maintain") {
				    $scope.Activity = "Common.Edit";
				    $scope.ActivityID = 2;
				} else if ($state.current.name === "home.learn.object.display") {
				    $scope.Activity = "Common.Display";
				    $scope.isReadonly = true;
				    $scope.ActivityID = 3;
				}
 				
				var nObjID = parseInt($stateParams.objid);
				$.each($rootScope.arLearnObject, function(idx, obj) {
                    if (obj.ID === nObjID) {
						$scope.objLearnObject = angular.copy(obj);
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
				 // Verify it!
				 var msgTab = $scope.objLearnObject.Verify();
				 if (msgTab && msgTab.length > 0) {
					$translate(msgTab).then(function (translations) {
						// Show errors
						$.foreach(translations, function(idx, obj) {
							$rootScope.$broadcast("ShowMessage", "Error", obj);
						});
  					});	
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
				 $http.post('script/hihsrv.php', { objecttype: 'CREATELEARNOBJECT', category:$scope.objLearnObject.CategoryID, 
					 	name: $scope.objLearnObject.Name, content: $scope.objLearnObject.Content } )
				 	.success(function(data, status, headers, config) {
					   // Then, go to display page
					   $scope.gen_id = data[0].id;
					  
					   // Add the buffer
					   utils.loadLearnObjects(true);
					   utils.loadLearnObjectsHierarchy(true);					  
				    })
				    .error(function(data, status, headers, config) {
					    $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				    });
			 };
			 
			 $scope.close = function() {
				 $state.go("home.learn.object.list");
			 };
			 
    		 $scope.$on("LearnObjectLoaded", function() {
				$log.info("HIH LearnObject: Object list loaded event fired!");
				
				$state.go("home.learn.object.display", { objid : $scope.gen_id });
			});	
		}])
		
		.controller('LearnHistoryListController', ['$scope', '$rootScope', '$state', '$http', '$q', '$log', 'utils', function($scope, $rootScope, $state, $http, $q, $log, utils) {
			
			// Grid option
			$scope.gridOptions = {};
			$scope.gridOptions.data = 'myData';
			$scope.gridOptions.enableSorting = true;
			$scope.gridOptions.enableColumnResizing = true;
			$scope.gridOptions.enableFiltering = true;
			$scope.gridOptions.enableGridMenu = false;
			$scope.gridOptions.enableColumnMenus = false;
			$scope.gridOptions.showGridFooter = true;
			$scope.gridOptions.enableRowSelection = true;
			$scope.gridOptions.enableFullRowSelection = true;
			$scope.gridOptions.selectionRowHeaderWidth = 35;
			
			$scope.gridOptions.rowIdentity = function(row) {
			 	return row.ObjectID.toString().concat('_', row.UserID.toString()) ;
			};
			$scope.gridOptions.getRowIdentity = function(row) {
			 	return row.ObjectID.toString().concat('_', row.UserID.toString()) ;
			};			
			$scope.gridOptions.onRegisterApi = function(gridApi) {
      			$scope.gridApi = gridApi;
				
     			 gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
     				 if (row.isSelected) {
     					$scope.selectedRows.push(row.entity);     					
     				 } else {
     					$.each($scope.selectedRows, function(idx, obj) {
							if (obj.UserID === row.entity.UserID && obj.ObjectID === row.entity.ObjectID) {
								$scope.selectedRows.splice(idx, 1);
								return false;
							}
						});
     				 }
      		     });
    		};

			$scope.gridOptions.columnDefs = [
		    	{ name:'userid', field: 'UserID', displayName: 'Login.User', headerCellFilter: "translate", width:'5%' },
		    	{ name:'displayas', field: 'UserObject.DisplayAs', displayName: 'Login.DisplayAs', headerCellFilter: "translate", width:'15%' },
				{ name:'objectid', field: 'ObjectID', displayName: 'Learn.ObjectID', headerCellFilter: "translate", width: '5%' },
				{ name:'objectname', field:'LearnObject.Name', displayName: 'Learn.ObjectName', headerCellFilter: "translate", width: '15%' },
				{ name:'categoryid', field:'LearnObject.CategoryObject.ID', displayName: 'Common.CategoryID', headerCellFilter: "translate", width: '5%' },
				{ name:'categoryname', field:'LearnObject.CategoryObject.FullDisplayText', displayName: 'Common.CategoryName', headerCellFilter: "translate", width: '15%' },
				{ name:'learndate', field:'LearnDate', displayName: 'Common.Date', headerCellFilter: "translate", width: '10%' },
		    ];
			
			var q1 = utils.loadUserListQ();
			var q2 = utils.loadLearnCategoriesQ();
			$q.all([q1, q2])
				.then(function(response) {
					utils.loadLearnObjectsQ()
						.then(function(response2) {
							utils.loadLearnHistoriesQ()
								.then(function(response3) {
									$scope.myData = [];
									$.each($rootScope.arLearnHistory, function(idx, obj) {
										$scope.myData.push(angular.copy(obj));					
									});
								}, function(reason3) {
									$rootScope.$broadcast("ShowMessage", "Error", reason3);
								});							
						}, function(reason2) {
							$rootScope.$broadcast("ShowMessage", "Error", reason2);
						});
					
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});			
		  
		    $scope.selectedRows = [];		    
		    $scope.$on("LearnHistoryLoaded", function() {
		  		$log.info("HIH LearnHistory List: Loaded event fired!");
		    });
		    
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				// To-Do: delete multiple rows
				if ($scope.selectedRows.length <= 0)
					return;
			 };
			
			 // Display
			 $scope.displayItem = function () {
				if ($scope.selectedRows.length <= 0)
					return;
				
				var row = $scope.selectedRows[0];
				$state.go("home.learn.history.display",   { histid : row.ObjectID.toString().concat('_', row.UserID.toString()) });
			 };
			
			 // Edit
			 $scope.editItem = function () {
				if ($scope.selectedRows.length <= 0)
					return;

				var row = $scope.selectedRows[0];
				$state.go("home.learn.history.maintain",  { histid : row.ObjectID.toString().concat('_', row.UserID.toString()) });
			 };
			
			 // Create
			 $scope.newItem = function() {
				//$location.path('/learnobject');
				$state.go('home.learn.history.create');
			 };
			
			 // Refresh list
			 $scope.refreshList = function() {
				// Reload the whole list
				utils.loadLearnHistoriesQ(true)
					.then(function(response2) {
						$scope.myData = [];
						$.each($rootScope.arLearnHistory, function(idx, obj) {
							$scope.myData.push(angular.copy(obj));					
						});
					}, function(reason2) {
						$rootScope.$broadcast("ShowMessage", "Error", reason2);
					});					
			 };
		}])

		.controller('LearnHistoryController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', 'utils', function($scope, $rootScope, $state, $stateParams, $http, $log, utils) {
			 $scope.Activity = "";
			 
			 $scope.CategoryIDs = $rootScope.arLearnCategory;
			 $scope.UserIDs = $rootScope.arUserList;
			 $scope.CurrentLearnHistory = null;			 

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
			
			// Source currency control
			$scope.learnobjectConfig = {
				create: false,
				onChange: function(value){
					$log.info('LearnHistoryController, Learn object control, event onChange, ', value);
				},
				valueField: 'ID',
				labelField: 'Name',
				maxItems: 1,
				required: true
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
						if (obj.UserID === arrID[1] && parseInt(obj.ObjectID) === parseInt(arrID[0])) {
							$scope.CurrentLearnHistory = angular.copy(obj);
							 
							return false;
						 }
					 }); 
				 }
			 } else {
				 $scope.CurrentLearnHistory = hih.LearnHistory.createNew();	
				 $scope.Activity = "Common.Create";
			 };
			 
			 $scope.submit = function() {
				 // Now, submit to the server
				 if ($scope.CurrentLearnHistory.UserID) {					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "Select an user!", "error");
					 return;					 
				 }
				 if ($scope.SelectedLearnObject && $scope.SelectedLearnObject.selected) {					 
				 } else {
					 $rootScope.$broadcast("ShowMessage", "Error", "Select a learning object!", "error");
					 return;
				 }
				 
				 $http.post('script/hihsrv.php', { objecttype: 'CREATELEARNHISTORY', user:$scope.UserID, 
					 learnobject: $scope.ObjectID, learndate: $scope.LearnDate, comment: $scope.Comment  } ).
				 	success(function(data, status, headers, config) {
					  // Then, go to display page
					  $scope.gen_id = data[0].ObjectID.toString().concat('_', data[0].UserID.toString());
					  
					  utils.loadLearnHistories(true);
				  }).
				  error(function(data, status, headers, config) {
					  // called asynchronously if an error occurs or server returns response with an error status.
					  $rootScope.$broadcast("ShowMessage", "Error", data.Message);
				  });
			 };
			 
			 $scope.close = function() {
				 $state.go("home.learn.history.list");
			 };
			 
		    $scope.$on("LearnHistoryLoaded", function() {
		    	console.log("HIH LearnHistory: List Loaded event fired!");
		    	
				$state.go("home.learn.history.display",   { histid : $scope.gen_id });
		    });			 
		}])

		.controller('LearnAwardListController', ['$scope', '$rootScope', '$state', '$http', '$translate', 'uiGridConstants', 'utils', 
		    function($scope, $rootScope, $state, $http, $translate, uiGridConstants, utils) {
			utils.loadLearnAwards();
			
			// Grid options
			$scope.gridOptions = {};
			$scope.gridOptions.data = 'myData';
			$scope.gridOptions.enableSorting = true;
			$scope.gridOptions.enableColumnResizing = true;
			$scope.gridOptions.enableFiltering = true;
			$scope.gridOptions.enableGridMenu = false;
			$scope.gridOptions.enableColumnMenus = false;
			$scope.gridOptions.showGridFooter = true;
			$scope.gridOptions.showColumnFooter = true;
			$scope.gridOptions.enableRowSelection = true;
			$scope.gridOptions.enableFullRowSelection = true;
			$scope.gridOptions.selectionRowHeaderWidth = 35;
			
			$scope.gridOptions.rowIdentity = function(row) {
			 	return row.id;
			};
			$scope.gridOptions.getRowIdentity = function(row) {
			 	return row.id;
			};			
			$scope.gridOptions.onRegisterApi = function(gridApi) {
      			$scope.gridApi = gridApi;
				
     			gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
     				if (row.isSelected) {
     					$scope.selectedRows.push(row.entity);     					
     				} else {
     					$.each($scope.selectedRows, function(idx, obj) {
							if (obj.id === row.entity.id) {
								$scope.selectedRows.splice(idx, 1);
								return false;
							}
						});
     				}
      		    });
    		};

			$scope.gridOptions.columnDefs = [
		    	{ name:'id', field: 'ID', displayName: 'Common.ID', headerCellFilter: "translate", width:'50' },
		    	{ name:'userid', field: 'UserID', displayName: 'Login.User', headerCellFilter: "translate", width: '90' },
		    	{ name:'displayas', field: 'UserDisplayAs', displayName: 'Login.DisplayAs', headerCellFilter: "translate", width:'100' },				
				{ name:'adate', field:'AwardDate', displayName: 'Common.Date', headerCellFilter: "translate", cellFilter:'date', width: '120' },
				{ name:'score', field:'Score', displayName: 'Learn.Score', headerCellFilter: "translate", width: '100',
					aggregationType:uiGridConstants.aggregationTypes.avg }, // type:'boolean' for sorting 
				{ name:'reason', field:'Reason', displayName: 'Learn.Reason', headerCellFilter: "translate", width: '200' }
		    ];
		  
		    if (angular.isArray($rootScope.arLearnAward ) && $rootScope.arLearnAward.length > 0) {
			    $scope.myData = [];
				$.each($rootScope.arLearnAward, function(idx, obj) {
		  			$scope.myData.push(angular.copy(obj));					
				});			  
		    };
		  
		    $scope.selectedRows = [];
		    $scope.$on("LearnAwardLoaded", function() {
		    	console.log("HIH LearnAward List: Loaded event fired!");
		    	$scope.myData = [];
				$.each($rootScope.arLearnAward, function(idx, obj) {
		  			$scope.myData.push(angular.copy(obj));					
				});	
		    });
		    
			if (!$rootScope.DeletionDialogTitle || !$rootScope.DeletionDialogMsg) {
				$translate(['Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem']).then(function (translations) {
    				$rootScope.DeletionDialogTitle = translations['Common.DeleteConfirmation'];
    				$rootScope.DeletionDialogMsg = translations['Common.ConfirmToDeleteSelectedItem'];
  				});				
			}
			
			// Remove to the real data holder
			$scope.removeItem = function removeItem(row) {
				if ($scope.selectedRows.length <= 0) 
					return;
				
				var strIDs = "";
				  
				// Following logic need enhance for multiple items deletion
				$.each($scope.selectedRows, function(idx, obj) {
					if (idx === 0) {						
					} else {
						strIDs = strIDs.concat(hih.Constants.IDSplitChar);
					}
					strIDs = strIDs.concat(obj.ID.toString());
				});
				
		    	// Popup dialog for confirm
				$rootScope.$broadcast('ShowMessage', $rootScope.DeletionDialogTitle, $rootScope.DeletionDialogMsg, "warning", function() {
					$http.post(
							'script/hihsrv.php',
							{
								objecttype : 'DELETELEARNAWARDS',
								ids: strIDs
							})
						.success(
							function(data, status, headers, config) {
								$scope.refreshList();
							})
						.error(
							function(data, status, headers, config) {
								$rootScope.$broadcast("ShowMessage", "Error", data.Message);
							});
				});
			 };
			
			// Display
			$scope.displayItem = function () {
				if ($scope.selectedRows.length <= 0) 
					return;

		    	$state.go("home.learn.award.display",  { objid : $scope.selectedRows[0].ID });
			};
			
			// Edit
			$scope.editItem = function () {
				if ($scope.selectedRows.length <= 0) 
					return;

		    	$state.go("home.learn.award.maintain",  { objid : $scope.selectedRows[0].ID });
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
								if (obj2.ID === obj.UserID) {
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
		
	.controller('LearnCategoryListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', 'utils', function($scope, $rootScope, $state, $http, $log, $q, utils) {
		// Grid options
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'myData';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		
		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.ID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.ID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'id', field: 'ID', displayName: 'Common.ID', headerCellFilter: "translate", width:'80' },
	    	{ name:'parent', field: 'ParentID', displayName: 'Common.Parent', headerCellFilter: "translate", width:'80' },
			{ name:'text', field: 'Text', displayName: 'Common.Text', headerCellFilter: "translate", width: '100' },
			{ name:'fulltext', field: 'FullDisplayText', displayName: 'Common.Text', headerCellFilter: "translate", width: '150' },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: '100' }
	  	];
	  
		utils.loadLearnCategoriesQ()
			.then(function(response) {
				$scope.myData = [];
				if (angular.isArray($rootScope.arLearnCategory ) && $rootScope.arLearnCategory.length > 0) {					
					$.each($rootScope.arLearnCategory, function(idx, obj) {
						$scope.myData.push(angular.copy(obj));					
					});			  
				};				
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

		$scope.$on("LearnCategoryLoaded", function() {
			$log.info("HIH LearnCategory List: Category Loaded event fired!");
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
			$scope.treeData = [];
			 $.each($rootScope.arLearnCategory, function(idx, obj) {
				var treenode = obj.getJsTreeNode();
				$scope.treeData.push(treenode); 
			 });
		 } else {			 		 
		 }
         
 		 $scope.$on("LearnCategoryLoaded", function() {
			$log.info("HIH LearnCategory List: Category Loaded event fired!");
			if (angular.isArray($rootScope.arLearnCategory) && $rootScope.arLearnCategory.length > 0) {
				$scope.treeData = [];
				$.each($rootScope.arLearnCategory, function(idx, obj) {
					var treenode = obj.getJsTreeNode();
					$scope.treeData.push(treenode); 
				 });
				 
				// Re-create the hierarchy
				$scope.treeConfig.version++;
			}			
		 }); 		 
	}])			
	;
})();

