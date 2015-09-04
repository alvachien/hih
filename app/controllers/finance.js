/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';

	angular.module('hihApp.Finance', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 'ui.select',
	 	'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns',
	    'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping'])
	    
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state("home.finance", {
            url: "/finance",
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state("home.finance.account", {
            url: "/account",
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state("home.finance.account.list", {
        	url: "",
        	templateUrl: 'app/views/financeaccountlist.html',
        	controller: 'FinanceAccountListController'
        })
        .state("home.finance.account.hierarchy", {
        	url: "/hierarchy",
        	templateUrl: 'app/views/financeaccounthierarchy.html',
        	controller: 'FinanceAccountHierarchyController'
        })
        .state("home.finance.account.create", {
        	url: '/create',
        	templateUrl: 'app/views/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.account.display", {
        	url: '/display/:accountid',
        	templateUrl: 'app/views/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.account.maintain", {
        	url: '/maintain/:accountid',
        	templateUrl: 'app/views/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.document", {
            url: "/document",
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state("home.finance.document.list", {
        	url: "",
        	templateUrl: 'app/views/financedocumentlist.html',
        	controller: 'FinanceDocumentListController'
        })
        .state("home.finance.document.create", {
        	url: '/create',
        	templateUrl: 'app/views/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
        .state("home.finance.document.display", {
        	url: '/display/:docid',
        	templateUrl: 'app/views/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
        .state("home.finance.document.maintain", {
        	url: '/maintain/:docid',
        	templateUrl: 'app/views/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
		.state("home.finance.transactiontype", {
			url: '/transactiontype',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.transactiontype.list", {
			url: '',
			templateUrl: 'app/views/financetransactiontypelist.html',
			controller: 'FinanceTransactionTypeListController'
		})
		.state("home.finance.transactiontype.hierarchy", {
			url: '/hierarchy',
			templateUrl: 'app/views/financetransactiontypehierarchy.html',
			controller: 'FinanceTransactionTypeHierarchyController'
		})
		.state("home.finance.documenttype", {
			url: '/documenttype',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.documenttype.list", {
			url: '',
			templateUrl: 'app/views/financedocumenttypelist.html',
			controller: 'FinanceDocumentTypeListController'
		})
		.state("home.finance.accountcategory", {
			url: '/accountcategory',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.accountcategory.list", {
			url: '',
			templateUrl: 'app/views/financeaccountcategorylist.html',
			controller: 'FinanceAccountCategoryListController'
		})
		.state("home.finance.currency", {
			url: '/currency',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.currency.list", {
			url: '',
			templateUrl: 'app/views/financecurrencylist.html',
			controller: 'FinanceCurrencyListController'
		})
		.state("home.finance.controlcenter", {
			url: '/controlcenter',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.controlcenter.list", {
			url: '',
			templateUrl: 'app/views/financecclist.html',
			controller: 'FinanceControlCenterListController'
		})
		.state("home.finance.controlcenter.hierarchy", {
			url: '/hierarchy',
			templateUrl: 'app/views/financecchierarchy.html',
			controller: 'FinanceControlCenterHierarchyController'
		})
		.state("home.finance.controlcenter.maintain", {
			url: '/maintain/:id',
			templateUrl: 'app/views/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.controlcenter.display", {
			url: '/display/:id',
			templateUrl: 'app/views/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.controlcenter.create", {
			url: '/create',
			templateUrl: 'app/views/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.order", {
			url: '/order',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.order.list", {
			url: '',
			templateUrl: 'app/views/financeorderlist.html',
			controller: 'FinanceOrderListController'
		})
		.state("home.finance.order.maintain", {
			url: '/maintain/:id',
			templateUrl: 'app/views/financeorder.html',
			controller: 'FinanceOrderController'
		})
		.state("home.finance.order.display", {
			url: '/display/:id',
			templateUrl: 'app/views/financeorder.html',
			controller: 'FinanceOrderController'
		})
		.state("home.finance.order.create", {
			url: '/create',
			templateUrl: 'app/views/financeorder.html',
			controller: 'FinanceOrderController'
		})
    ;
	}])
	
	.directive('stringToNumber', function() {
  		return {
    		require: 'ngModel',
    		link: function(scope, element, attrs, ngModel) {
      			ngModel.$parsers.push(function(value) {
        			return '' + value;
      			});
      			ngModel.$formatters.push(function(value) {
        			return parseFloat(value);
      			});
    		}
  		};
	})
	
	.controller('FinanceAccountListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
		// Grid options
        $scope.selectedRows = [];
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
	    	{ name:'ctgyid', field: 'CategoryObject.ID', displayName: 'Common.CategoryID', headerCellFilter: "translate", width:90 },
			{ name:'ctgyname', field: 'CategoryObject.Name', displayName: 'Common.Category', headerCellFilter: "translate", width: 150},
			{ name:'name', field:'Name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
			{ name:'assetflag', field:'CategoryObject.AssetFlag', displayName: 'Finance.Asset', headerCellFilter: "translate", width: 50,
				cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
          			if (grid.getCellValue(row,col) === 1) { return 'accountasset';} 
					else { return 'accountnotasset'; }
        		}
			 },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
	    ];
	  
	    var promise1 = utils.loadCurrenciesQ();
	    var promise2 = utils.loadFinanceAccountCategoriesQ();
	  
	    $q.all([promise1, promise2])
	  	    .then(function(response) {
			    utils.loadFinanceAccountsQ()
			  	    .then(function(response2) {
					    if (angular.isArray($rootScope.arFinanceAccount ) && $rootScope.arFinanceAccount.length > 0) {
						    $scope.myData = [];
						    $.each($rootScope.arFinanceAccount, function(idx, obj) {
							    $scope.myData.push(angular.copy(obj));					
						    });
					    }
				    }, function(reason2) {
					    // Error occurred
					    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		  }, function(reason) {
			  // Error occurred!
			  $rootScope.$broadcast("ShowMessage", "Error", reason);
		});

	    // Remove to the real data holder
	    $scope.removeItem = function removeItem(row) {
	  	    if ($scope.selectedRows.length <= 0)
			    return;
				
			// To-Do: delete multiple accounts as a batch
	    };
	    
	    // Display
	    $scope.displayItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
				return;
			
	    	$state.go("home.finance.account.display",  { accountid : $scope.selectedRows[0].ID });
	    };
		
	    // Edit
	    $scope.editItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
		        return;
			
		    $state.go("home.finance.account.maintain",  { accountid : $scope.selectedRows[0].ID });
	    };
		
	    // Create
	    $scope.newItem = function() {
	        $state.go('home.finance.account.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceAccountsQ(true)
			    .then(function(response2) {
				    if (angular.isArray($rootScope.arFinanceAccount ) && $rootScope.arFinanceAccount.length > 0) {
					    $scope.myData = [];
						$.each($rootScope.arFinanceAccount, function(idx, obj) {
						    $scope.myData.push(angular.copy(obj));					
						});
					}
				}, function(reason2) {
					    // Error occurred
					    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])
	
	.controller('FinanceAccountHierarchyController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, utils) {
			utils.loadFinanceAccountHierarchy();
		
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
				types: {
					default: {
						icon : 'glyphicon glyphicon-folder-close'
					},
					Account: {
						icon : 'glyphicon glyphicon-equalizer'
					},
					Category: {
						icon : 'glyphicon glyphicon-gift'
					},
					Journey : {
						icon : 'glyphicon glyphicon-list'
					}
				},
                 version : 1,
    			 plugins : [ 'wholerow', 'types' ]
            };
			
			$scope.treeData = [];
			if (angular.isArray($rootScope.arFinanceAccountHierarchy) && $rootScope.arFinanceAccountHierarchy.length > 0) {				
				 $.each($rootScope.arFinanceAccountHierarchy, function(idx, obj) {
					var treenode = {};
					angular.copy(obj, treenode);
					treenode.state = {
					 	opened: true	
					};
					
					$scope.treeData.push(treenode); 
				 });
			 }
	         
			 $scope.newItem = function() {
				 // Navigate to the account create
	 			 $state.go('home.finance.account.create');
			 };
			 
			 $scope.refreshHierarchy = function() {
				// ToDo: Refresh the whole hierarchy 
			 };
			 
	 		 $scope.$on("FinanceAccountHierarchyLoaded", function() {
				$log.info("HIH FinanceAccount Hierarchy view: Hierarchy Loaded event fired!");
				
				if (angular.isArray($rootScope.arFinanceAccountHierarchy) && $rootScope.arFinanceAccountHierarchy.length > 0) {
					$.each($rootScope.arFinanceAccountHierarchy, function(idx, obj) {
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

	.controller('FinanceAccountController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $stateParams, $http, $translate, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		
		$scope.AccountObject = new hih.FinanceAccount();
		$scope.AccountCategoryObject = {};
		$scope.AllAccountCategories = $rootScope.arFinanceAccountCategory;
		
        if (angular.isDefined($stateParams.accountid)) {
			if ($state.current.name === "home.finance.account.maintain") {
			    $scope.Activity = "Common.Edit";
			} else if ($state.current.name === "home.finance.account.display") {
				$scope.Activity = "Common.Display";
				$scope.isReadonly = true;
			}
			
			var nAcntID = parseInt($stateParams.accountid);
			$.each($rootScope.arFinanceAccount, function (idx, obj) {				
				if (obj.ID === nAcntID) {
					$scope.AccountObject = angular.copy(obj);
					$scope.AccountCategoryObject.selected = obj.CategoryObject;
					return false;
				}
			});
		} else {
			$scope.Activity = "Common.Create";
		}
		 
		$scope.submit = function() {
			// Update the category id
			if ($scope.AccountCategoryObject.selected) {
				if ($scope.AccountObject.CategoryID !== $scope.AccountCategoryObject.selected.ID) {
					$scope.AccountObject.CategoryID = $scope.AccountCategoryObject.selected.ID;					
				}
			} else {
				$scope.AccountObject.CategoryID = -1;
			}
			
			var errMsgs = $scope.AccountObject.Verify();
			if (errMsgs && errMsgs.length > 0) {
				$translate(errMsgs).then(function (translations) {
					// Show errors
					$.foreach(translations, function(idx, obj) {
						$rootScope.$broadcast("ShowMessage", "Error", obj);
					});
  				});				
				return;
			}
			
			// Now submit to the server side
			$http.post('script/hihsrv.php', {
				    objecttype : 'CREATEFINANCEACCOUNT',
				    name: $scope.AccountObject.Name,
				    ctgyid: $scope.AccountObject.CategoryID,
				    comment: $scope.AccountObject.Comment 
				})
				.then(function(response) {
					// First of all, update the rootScope
					var acntObj = new hih.FinanceAccount();
					acntObj.setContent(response.data[0]);
					acntObj.buildCategory($rootScope.arFinanceAccountCategory);
					$rootScope.arFinanceAccount.push(acntObj);
					
					// Change to the display mode
					$state.go("home.finance.account.display",  { accountid : acntObj.ID });
				}, function(response) {
					// Failed, throw out error message
				});
		};
		
		$scope.close = function() {
		    $state.go("home.finance.account.list");
		};
	}])	
	
	.controller('FinanceDocumentListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadFinanceDocuments();
		utils.loadFinanceDocumentTypes();
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();
		utils.loadCurrencies();
		utils.loadFinanceTransactionTypes();

		// Grid options
        $scope.selectedRows = [];
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
		 	return row.DocID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.DocID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
			
 			gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
 				if (row.isSelected) {
 					$scope.selectedRows.push(row.entity);     					
 				} else {
 					$.each($scope.selectedRows, function(idx, obj) {
						if (obj.DocID === row.entity.DocID) {
							$scope.selectedRows.splice(idx, 1);
							return false;
						}
					});
 				}
  		    });
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'docid', field: 'DocID', displayName: 'Common.ID', headerCellFilter: "translate", width:90 },
	    	{ name:'doctypename', field: 'DocTypeName', displayName: 'Finance.DocumentTypeID', headerCellFilter: "translate", width:90 },
			{ name:'trandate', field: 'TranDate', displayName: 'Common.Date', headerCellFilter: "translate", width: 150},
			{ name:'trancurr', field:'TranCurrency', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'trancurrname', field:'TranCurrencyName', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'tranamount', field:'TranAmount', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 50 },
			{ name:'desp', field:'Desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
	    ];
	  
	    if (angular.isArray($rootScope.arFinanceDocument ) && $rootScope.arFinanceDocument.length > 0) {
		    $scope.myData = [];
			$.each($rootScope.arFinanceDocument, function(idx, obj) {
	  			$scope.myData.push(angular.copy(obj));					
			});			  
	    };
		
	    $scope.$on("FinanceDocumentLoaded", function() {
	    	$log.info("HIH FinanceDocument List: Loaded event fired!");
	    	
		  $scope.myData = [];
			$.each($rootScope.arFinanceDocument, function(idx, obj) {
				$scope.myData.push(angular.copy(obj));					
			});			  
	    });
	    
	    $scope.$on("FinanceDocumentTypeLoaded", function() {
	    	$log.info("HIH FinanceDocument List: Type Loaded event fired!");
	    });	

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			if ($scope.selectedRows.length <= 0)
				return;
				
			// To-Do: delete mutliple accounts allowed?
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
	    	$state.go("home.finance.document.display",  { docid : $scope.selectedRows[0].docid });
		};
		
		// Edit
		$scope.editItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
	    	$state.go("home.finance.document.maintain",  { docid : $scope.selectedRows[0].docid });
		};
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.document.create');
		};
	}])
		
	.controller('FinanceDocumentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', 'utils', function($scope, $rootScope, $state, $stateParams, $http, $log, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.showhdr = true; // Default value
		$scope.ItemActivity = "Finance.CreateItem";
		
		// For item table
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'ItemsCollection';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		//$scope.gridOptions.enableRowSelection = true;
		//$scope.gridOptions.enableFullRowSelection = true;
		//$scope.gridOptions.selectionRowHeaderWidth = 35;
		
		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.docid;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.docid;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'itemid', field: 'itemid', displayName: 'Finance.ItemID', headerCellFilter: "translate", width:50 },
	    	{ name:'accountid', field: 'accountid', displayName: 'Finance.Account', headerCellFilter: "translate", width:50 },
			{ name:'accountname', field: 'accountname', displayName: 'Finance.Account', headerCellFilter: "translate", width: 100},
			{ name:'accountcategoryname', field:'accountcategoryname', displayName: 'Finance.AccountCategory', headerCellFilter: "translate", width: 90 },
			{ name:'trantypename', field:'trantypename', displayName: 'Finance.TransactionType', headerCellFilter: "translate", width: 100 },
			{ name:'trantypeexpense', field:'trantypeexpense', displayName: 'Finance.ExpenseFlag', headerCellFilter: "translate", width: 100 },
			{ name:'tranamount', field:'tranamount', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 50 },
			{ name:'desp', field:'desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 },
			{ name: 'edit', field:'itemid', displayName: 'Common.Edit', headerCellFilter: "translate",  width: 200,
					cellTemplate:'<div class="ui-grid-cell-contents">\
						<div class="btn-toolbar" role="toolbar">\
							<div class="btn-group" role="group">\
								<button class="btn primary" ng-click="grid.appScope.displayItem(COL_FIELD)" translate="Common.Display"></button>\
								<button class="btn primary" ng-disabled="grid.appScope.isReadonly" ng-click="grid.appScope.editItem(COL_FIELD)" translate="Common.Edit"></button>\
								<button class="btn primary" ng-disabled="grid.appScope.isReadonly" ng-click="grid.appScope.deleteItem(COL_FIELD)" translate="Common.Delete"></button>\
							</div>\
						</div>\
					</div>',
					enableFiltering: false
			}
	   ];

        // For select control
		$scope.AllAccounts = $rootScope.arFinanceAccount;
		$scope.AllCurrencies = $rootScope.arCurrency;
		$scope.AllDocumentTypes = $rootScope.arFinanceDocumentType;
		$scope.AllTransactionTypes = $rootScope.arFinanceTransactionType;

        // Attributes
		$scope.DocumentHeader = {};
		$scope.ItemsCollection = [];
		$scope.SelectedDocumentItem = {}; // Current edit item
		$scope.SelectedDocumentItem.itemid = -1;
		$scope.nextItemID = 0;
		$scope.ItemsChanged = false;
		
		$scope.DocumentHeader.DocumentID = -1;
		$scope.DocumentHeader.DocumentType = {};
		$scope.DocumentHeader.DocumentCurrency = {};
		$scope.DocumentHeader.DocumentTranDate = new Date();
		$scope.DocumentHeader.DocumentDesp = "";
		$scope.DocumentHeader.DocumentAmount = 0.0;

        // For date control
		$scope.isDateOpened = false;
		$scope.DateFormat = "yyyy-MM-dd";
		$scope.dateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isDateOpened = true;				
			}
		};
		
		// Get the next Item ID
		$scope.UpdateNextItemID = function () {
			if (angular.isArray($scope.ItemsCollection) && $scope.ItemsCollection.length > 0) {
				$scope.nextItemID = 0;
				$.each($scope.ItemsCollection, function (idx, obj) {
	                var nItemID = parseInt(obj.itemid);
						
					if ($scope.nextItemID < nItemID) {
						$scope.nextItemID = nItemID;
		            }
		        });
				
				$scope.nextItemID++;
			} else {
				$scope.nextItemID = 1;
			}
		};

		if (angular.isDefined($stateParams.docid)) {
		    utils.loadFinanceDocumentItems($stateParams.docid);

		    $scope.DocumentHeader.DocumentID = parseInt($stateParams.docid);

		    if ($state.current.name === "home.finance.document.maintain") {
		        $scope.Activity = "Common.Edit";
		    } else if ($state.current.name === "home.finance.document.display") {
		        $scope.Activity = "Common.Display";
		        $scope.isReadonly = true;
		    }

		    $.each($rootScope.arFinanceDocument, function (idx, obj) {
		        if (obj.docid === $stateParams.docid) {

		            $scope.DocumentHeader.DocumentAmount = parseFloat(obj.tranamount).toFixed(4);
		            $scope.DocumentHeader.DocumentDesp = obj.desp;
		            $scope.DocumentHeader.DocumentTranDate = obj.trandate;					

		            $.each($scope.AllDocumentTypes, function (idx2, obj2) {
		                if (obj2.id === obj.doctype) {
		                    $scope.DocumentHeader.DocumentType.selected = obj2;
		                    return false;
		                }
		            });
		            $.each($scope.AllCurrencies, function (idx3, obj3) {
		                if (obj3.curr === obj.trancurr) {
		                    $scope.DocumentHeader.DocumentCurrency.selected = obj3;
		                    return false;
		                }
		            });

		            return false;
		        }
		    });

		    if (angular.isDefined($rootScope.arFinanceDocumentItem) && $scope.ItemsCollection.length <= 0) {
		        $.each($rootScope.arFinanceDocumentItem, function (idx10, obj10) {
		            if (obj10.docid === $stateParams.docid) {
		                $scope.ItemsCollection.push(obj10);
		                return false;
		            }
		        });
				
				$scope.UpdateNextItemID();
		    }
		} else {
		    $scope.Activity = "Common.Create";
			$scope.UpdateNextItemID();
		}
		
		$scope.$on("FinanceDocumentItemLoaded", function () {
		    $log.info("HIH FinanceDocument: Items Loaded event fired!");
		    if (angular.isDefined($rootScope.arFinanceDocumentItem) && $scope.ItemsCollection.length <= 0) {
		        $.each($rootScope.arFinanceDocumentItem, function (idx11, obj11) {
		            if (obj11.docid === $stateParams.docid) {
		                $scope.ItemsCollection.push(angular.copy(obj11));
		                return false;
		            }
		        });
		    }
		});

		$scope.submit = function() {
			// Submit the current item
		};
		
		$scope.close = function() {
		    $state.go("home.finance.document.list");
		};

		$scope.saveCurrentItem = function() {
			// Save current editting item
			if ($scope.SelectedDocumentItem.itemid === -1) {
				var newItem = angular.copy($scope.SelectedDocumentItem);
				newItem.itemid = $scope.nextItemID;	
				newItem.accountid = newItem.Account.selected.id;
				newItem.accountname = newItem.Account.selected.name;
				//newItem.accountcategoryname = newItem.Accoun
				$scope.ItemsCollection.push(newItem);
				
				$scope.UpdateNextItemID();				
				$scope.cancelCurrentItem();
			}
		};
		
		$scope.cancelCurrentItem = function() {
			$scope.SelectedDocumentItem = {}; 
			$scope.SelectedDocumentItem.itemid = -1;
		};
		
		$scope.displayItem = function (itemid) {
			$.each($scope.ItemsCollection, function (idx, obj) {
				if (obj.itemid === itemid) {
					$scope.setSelectedDocumentItem(obj);
					return false;
				}
		    });			
		};
		
		$scope.setSelectedDocumentItem = function(docItem) {
			$scope.SelectedDocumentItem = angular.copy(docItem);
			$scope.SelectedDocumentItem.Account = {};
			$scope.SelectedDocumentItem.TranType = {};
			
			// Account
			$.each($scope.AllAccounts, function(idx, obj) {
				if (obj.id === $scope.SelectedDocumentItem.accountid) {
					$scope.SelectedDocumentItem.Account.selected = obj;
					return false;
				}
			});			
			
			// Transaction type
			$.each($scope.AllTransactionTypes, function(idx2, obj2) {
				if (obj2.id === $scope.SelectedDocumentItem.trantype) {
					$scope.SelectedDocumentItem.TranType.selected = obj2;
					return false;
				}
			});
		};
		
		$scope.editItem = function(itemid) {
			// Load the specified item into the current item
			$.each($scope.ItemsCollection, function (idx, obj) {
				if (obj.itemid === itemid) {
					$scope.setSelectedDocumentItem(obj);
					return false;
				}
		    });
		};
		$scope.deleteItem = function(itemid) {
			// Load the specified item into the current item
			$.each($scope.ItemsCollection, function (idx, obj) {
				if (obj.itemid === itemid) {
					// Delete it!
					//$scope.setSelectedDocumentItem(obj);
					return false;
				}
		    });
		};
	}])	
	
	.controller('FinanceDocumentDialogController', ['$scope', '$rootScope', '$modalInstance', 'utils', function($scope, $rootScope, $modalInstance, utils) {
		$scope.Activity = "Create";
		$scope.DocumentHeader = {};
		$scope.DocumentItem = {};
		$scope.isReadonly = false;
		
		if (angular.isDefined($rootScope.CurrentDocumentItem) && angular.isArray($rootScope.CurrentDocumentItem) && $rootScope.CurrentDocumentItem.length > 2) {
			$scope.Activity = $rootScope.CurrentDocumentItem[1];
			$scope.DocumentHeader = $rootScope.CurrentDocumentItem[0];
			$scope.DocumentItem = $rootScope.CurrentDocumentItem[2];	
			if ( $scope.Activity === "Display" ) {
				$scope.isReadonly = true;				
			}
		}
		
		$scope.ok = function () {
		    $modalInstance.close();
		  };
		  
        $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };		  
		
		$scope.$on('modal.closing', function($event) {
			if ($scope.isReadonly) {
				
			} else {
				//if (frmIt)
				//$event.preventDefault();
			}
		});
	}])	
	
	.controller('FinanceTransactionTypeListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		$scope.arList = [];
		
		utils.loadFinanceTransactionTypesQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arFinanceTransactionType ) && $rootScope.arFinanceTransactionType.length > 0) {
					$scope.arList = [];
					$.each($rootScope.arFinanceTransactionType, function(idx, obj) {
						$scope.arList.push(angular.copy(obj));					
					});	  
				};
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])
	
	.controller('FinanceTransactionTypeHierarchyController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $log, utils) {
			
			utils.loadFinanceTransactionTypeHierarchy();
		
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
			
			$scope.treeData = [];
			if (angular.isArray($rootScope.arFinanceTransactionTypeHierarchy) && $rootScope.arFinanceTransactionTypeHierarchy.length > 0) {				
				 $.each($rootScope.arFinanceTransactionTypeHierarchy, function(idx, obj) {
					var treenode = {};
					angular.copy(obj, treenode);
					treenode.state = {
					 	opened: true	
					};
					
					$scope.treeData.push(treenode); 
				 });
			 }
	         
	 		 $scope.$on("FinanceTransactionTypeHierarchyLoaded", function() {
				$log.info("HIH FinanceTransactionType Hierarchy view: Hierarchy Loaded event fired!");
				
				if (angular.isArray($rootScope.arFinanceTransactionTypeHierarchy) && $rootScope.arFinanceTransactionTypeHierarchy.length > 0) {
					$.each($rootScope.arFinanceTransactionTypeHierarchy, function(idx, obj) {
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
	
	.controller('FinanceDocumentTypeListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		$scope.arList = [];

		utils.loadFinanceDocumentTypesQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arFinanceDocumentType ) && $rootScope.arFinanceDocumentType.length > 0) {
					$scope.arList = [];
					$.each($rootScope.arFinanceDocumentType, function(idx, obj) {
						$scope.arList.push(angular.copy(obj));					
					});			  
				};
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])

	.controller('FinanceAccountCategoryListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $log, utils) {
		$scope.arList = [];

		utils.loadFinanceAccountCategoriesQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arFinanceAccountCategory ) && $rootScope.arFinanceAccountCategory.length > 0) {
					$scope.arList = [];
					$.each($rootScope.arFinanceAccountCategory, function(idx, obj) {
						$scope.arList.push(angular.copy(obj));					
					});			  
				};				
			}, function(reason){
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])	
	
	.controller('FinanceCurrencyListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $log, utils) {
		$scope.arList = [];
		
		utils.loadCurrenciesQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arCurrency) && $rootScope.arCurrency.length > 0) {
					$scope.arList = [];
					$.each($rootScope.arCurrency, function(idx, obj) {
						$scope.arList.push(angular.copy(obj));					
					});
				};
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])	
	
	.controller("FinanceControlCenterListController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $translate, utils) {
		// Grid options
        $scope.selectedRows = [];
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
			{ name:'name', field:'Name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
			{ name:'parent', field:'ParentObject.Name', displayName: 'Common.Parent', headerCellFilter: "translate", width: 90 },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
	    ];
	  
	    utils.loadFinanceControlCentersQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arFinanceControlCenter ) && $rootScope.arFinanceControlCenter.length > 0) {
					$scope.myData = [];
					$.each($rootScope.arFinanceControlCenter, function(idx, obj) {
						$scope.myData.push(angular.copy(obj));					
				    });
				}
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

		// Remove to the real data holder
	    $scope.removeItem = function removeItem(row) {
			if ($scope.selectedRows.length !== 1) {
				$translate('Message.SelectSingleItemForDeletion')
					.then(
						function(response) {
							$rootScope.$broadcast("ShowMessage", "Error", response);
						},
						function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
						}
					);
				return;				
			}
			
			utils.deleteControlCenterQ($scope.selectedRows[0].ID)
				.then(function(response) {
					// Empty selection table
					$scope.selectedRows = [];
					
					// Just refresh it!
					$scope.refreshList();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
	    };
	    
	    // Display
	    $scope.displayItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
				return;
			
	    	$state.go("home.finance.controlcenter.display",  { id : $scope.selectedRows[0].ID });
	    };
		
	    // Edit
	    $scope.editItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
		        return;
			
		    $state.go("home.finance.controlcenter.maintain",  { id : $scope.selectedRows[0].ID });
	    };
		
	    // Create
	    $scope.newItem = function() {
	        $state.go('home.finance.controlcenter.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceControlCentersQ(true)
			    .then(function(response2) {
					if (angular.isArray($rootScope.arFinanceControlCenter ) && $rootScope.arFinanceControlCenter.length > 0) {
						$scope.myData = [];
						$.each($rootScope.arFinanceControlCenter, function(idx, obj) {
							$scope.myData.push(angular.copy(obj));					
						});
					}
				}, function(reason2) {
				    // Error occurred
				    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])
	
	.controller("FinanceControlCenterHierarchyController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, utils) {
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
				types: {
					default: {
						icon : 'glyphicon glyphicon-folder-close'
					},
					Account: {
						icon : 'glyphicon glyphicon-equalizer'
					},
					Category: {
						icon : 'glyphicon glyphicon-gift'
					},
					Journey : {
						icon : 'glyphicon glyphicon-list'
					}
				},
                 version : 1,
    			 plugins : [ 'wholerow', 'types' ]
            };
			
			utils.loadFinanceControlCentersQ()
				.then(function(response) {
					if (angular.isArray($rootScope.arFinanceControlCenter) && $rootScope.arFinanceControlCenter.length > 0) {				
						$.each($rootScope.arFinanceControlCenter, function(idx, obj) {
							var treenode = {};
							angular.copy(obj, treenode);
							treenode = {};
							treenode.id = obj.ID.toString();
							if (obj.ParentID !== -1)
								treenode.parent = obj.ParentID.toString();
							else
								treenode.parent = "#";
							treenode.text = obj.Name;
							//angular.copy(obj, treenode);
							//delete treenode.parent;
							treenode.state = {
								opened: true	
							};
						
							$scope.treeData.push(treenode); 
						});
						
						$scope.treeConfig.version++;
					}
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
	         
			 $scope.newItem = function() {
				 // Navigate to the account create
	 			 $state.go('home.finance.account.create');
			 };
			 
			 $scope.refreshHierarchy = function() {
				utils.loadFinanceControlCentersQ(true)
					.then(function(response) {
						$scope.treeData = [];
						
						if (angular.isArray($rootScope.arFinanceControlCenter) && $rootScope.arFinanceControlCenter.length > 0) {											
							$.each($rootScope.arFinanceControlCenter, function(idx, obj) {
								var treenode = {};
								angular.copy(obj, treenode);
								treenode = {};
								treenode.id = obj.ID.toString();
								if (obj.ParentID !== -1)
									treenode.parent = obj.ParentID.toString();
								else
									treenode.parent = "#";
								treenode.text = obj.Name;
								//angular.copy(obj, treenode);
								//delete treenode.parent;
								treenode.state = {
									opened: true	
								};
							
								$scope.treeData.push(treenode); 
							});
							
							$scope.treeConfig.version++;
						}
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			 };
	}])
				
	.controller("FinanceControlCenterController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		
		$scope.ControlCenterObject = new hih.FinanceControlCenter();		
		$scope.AllControlCenters = $rootScope.arFinanceControlCenter;
		
        if (angular.isDefined($stateParams.id)) {
			if ($state.current.name === "home.finance.controlcenter.maintain") {
			    $scope.Activity = "Common.Edit";
			} else if ($state.current.name === "home.finance.controlcenter.display") {
				$scope.Activity = "Common.Display";
				$scope.isReadonly = true;
			}
			
			var nCCID = parseInt($stateParams.id);
			$.each($rootScope.arFinanceControlCenter, function (idx, obj) {				
				if (obj.ID === nCCID) {
					$scope.ControlCenterObject = angular.copy(obj);
					var parObj = $scope.ControlCenterObject.ParentObject;
					$scope.ControlCenterObject.ParentObject = {};
					$scope.ControlCenterObject.ParentObject.selected = parObj;
					return false;
				}
			});
		} else {
			$scope.Activity = "Common.Create";
		}

		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		 
		$scope.submit = function() {
			$scope.cleanReportMessages();
			
			// Parent control center
			if ($scope.ControlCenterObject.ParentObject.selected) {
				$scope.ControlCenterObject.ParentID = $scope.ControlCenterObject.ParentObject.selected.ID; 
			} else {
				$scope.ControlCenterObject.ParentID = null;
			}
			
			var msgTable = $scope.ControlCenterObject.Verify($translate);
			if (msgTable.length > 0 ) {
				$q.all(msgTable)
					.then(function(response) {
						Array.prototype.push.apply($scope.ReportedMessages, response);
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
					});
				return;
			}
			
			// Now submit to the server side
			utils.createControlCenterQ($scope.ControlCenterObject)
				.then(function(response) {
					if (response) {
						$state.go("home.finance.controlcenter.display",  { id : response });						
					} else {
						$scope.close();
					}
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		};
		
		$scope.close = function() {
		    $state.go("home.finance.controlcenter.list");
		};
	}])
				
	.controller("FinanceOrderListController", ['$scope', '$rootScope', '$state', '$http', '$q', '$translate', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $translate, $log, utils) {
		// Grid options
        $scope.selectedRows = [];
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
			{ name:'name', field:'Name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
			{ name:'validfrm', field:'ValidFrom', displayName: 'Common.ValidFrom', headerCellFilter: "translate", width: 90 },
			{ name:'validto', field:'ValidTo', displayName: 'Common.ValidTo', headerCellFilter: "translate", width: 90 },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 120 }
	    ];
	  
	    utils.loadFinanceOrderQ()
			.then(function(response) {
				if (angular.isArray($rootScope.arFinanceOrder ) && $rootScope.arFinanceOrder.length > 0) {
					$scope.myData = [];
					$.each($rootScope.arFinanceOrder, function(idx, obj) {
						$scope.myData.push(angular.copy(obj));					
					});
				}
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
		
		// Remove to the real data holder
	    $scope.removeItem = function removeItem(row) {
			if ($scope.selectedRows.length !== 1) {
				$translate('Message.SelectSingleOrderForDeletion')
					.then(
						function(response) {
							$rootScope.$broadcast("ShowMessage", "Error", response);
						},
						function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
						}
					);
				return;				
			}
			
			utils.deleteFinanceOrderQ($scope.selectedRows[0].ID)
				.then(function(response) {
					// Empty selection table
					$scope.selectedRows = [];
					
					// Just refresh it!
					$scope.refreshList();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
	    };
	    
	    // Display
	    $scope.displayItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
				return;
			
	    	$state.go("home.finance.order.display",  { id : $scope.selectedRows[0].ID });
	    };
		
	    // Edit
	    $scope.editItem = function (row) {
	        if ($scope.selectedRows.length <= 0)
		        return;
			
		    $state.go("home.finance.order.maintain",  { id : $scope.selectedRows[0].ID });
	    };
		
	    // Create
	    $scope.newItem = function() {
	        $state.go('home.finance.order.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceOrderQ(true)
			    .then(function(response) {
				if (angular.isArray($rootScope.arFinanceOrder ) && $rootScope.arFinanceOrder.length > 0) {
					$scope.myData = [];
					$.each($rootScope.arFinanceOrder, function(idx, obj) {
						$scope.myData.push(angular.copy(obj));					
					});
				}
				}, function(reason2) {
				    // Error occurred
				    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])
				
	.controller("FinanceOrderController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, uiGridConstants, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.showhdr = true; // Default value
		$scope.ItemActivity = "Finance.CreateItem";
		$scope.OrderObject = new hih.FinanceOrder();
		$scope.RuleObjects = [];
		$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
		
	    var promise1 = utils.loadFinanceControlCentersQ();
        if (angular.isDefined($stateParams.id)) {
			if ($state.current.name === "home.finance.order.maintain") {
	    		$scope.Activity = "Common.Edit";
			} else if ($state.current.name === "home.finance.order.display") {
				$scope.Activity = "Common.Display";
				$scope.isReadonly = true;
			}
			
			var nOrdID = parseInt($stateParams.id);
			promise1.then(
				function(response) {
					$scope.AllCostCenters = $rootScope.arFinanceControlCenter;

					utils.loadFinanceSettlementRulesQ(nOrdID)
						.then(function(response2) {
							$.each($rootScope.arFinanceOrder, function (idx, obj) {				
								if (obj.ID === nOrdID) {
									$scope.RuleObjects = [];
									$scope.OrderObject = angular.copy(obj);
									for(var i = 0; i < obj.SRules.length; i++) {
										$scope.RuleObjects.push(obj.SRules[i]);
									}
									return false;
								}
							});							
						},
						function(reason2) {
							$rootScope.$broadcast("ShowMessage", "Error", reason2);
						});
				},
				function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				}
			)
		} else {
			$scope.Activity = "Common.Create";
			promise1
				.then(function(response) {	
					$scope.AllCostCenters = $rootScope.arFinanceControlCenter;				
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);					
				});
		}
		
		// For settlement rules
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'RuleObjects';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'ruleid', field: 'RuleID', displayName: 'Finance.ItemID', headerCellFilter: "translate", width:50 },
	    	{ name:'ccid', field: 'ControlCenterID', displayName: 'Finance.ControlCenter', headerCellFilter: "translate", width:50 },
			{ name:'ccname', field: 'ControlCenterObject.Name', displayName: 'Finance.ControlCenter', headerCellFilter: "translate", width:100 },
			{ name:'precent', field: 'Precentage', displayName: 'Common.Precent', headerCellFilter: "translate", width: 100,
				aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 150 },
			{ name: 'edit', field:'RuleID', displayName: 'Common.Edit', headerCellFilter: "translate",  width: 200,
					cellTemplate:'<div class="ui-grid-cell-contents">\
						<div class="btn-toolbar" role="toolbar">\
							<div class="btn-group" role="group">\
								<button class="btn primary" ng-click="grid.appScope.displayItem(COL_FIELD)" translate="Common.Display"></button>\
								<button class="btn primary" ng-disabled="grid.appScope.isReadonly" ng-click="grid.appScope.editItem(COL_FIELD)" translate="Common.Edit"></button>\
								<button class="btn primary" ng-disabled="grid.appScope.isReadonly" ng-click="grid.appScope.deleteItem(COL_FIELD)" translate="Common.Delete"></button>\
							</div>\
						</div>\
					</div>',
					enableFiltering: false
			}
	    ];

		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.RuleID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.RuleID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
 			// gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
 			// 	if (row.isSelected) {
			//  		$scope.SelectedRuleObject = {};
			// 		angular.copy(row.entity, $scope.SelectedRuleObject);
			// 		$scope.SelectedRuleObject.ControlCenterObject.selected = $scope.SelectedRuleObject.ControlCenterObject;
 			// 	} else {
			// 		$scope.SelectedRuleObject = {};
			// 		$scope.SelectedRuleObject.ControlCenterObject = {};
 			// 	}
  		    // });
		};
		
        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = "yyyy-MM-dd";
		$scope.dateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openValidfromDate = function ($event) {
			$scope.cleanReportMessages();
			
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isValidfromDateOpened = true;				
			}
		};
		$scope.openValidtoDate = function ($event) {
			$scope.cleanReportMessages();
			
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isValidtoDateOpened = true;				
			}
		};
		
		// Get the next Item ID
		$scope.nextItemID = 0;
		$scope.updateNextItemID = function () {
			if (angular.isArray($scope.RuleObjects) && $scope.RuleObjects.length > 0) {
				$scope.nextItemID = 0;
				$.each($scope.RuleObjects, function (idx, obj) {
						
					if ($scope.nextItemID < obj.RuleID) {
						$scope.nextItemID = obj.RuleID;
		            }
		        });
				
				$scope.nextItemID++;
			} else {
				$scope.nextItemID = 1;
			}
		};

		$scope.displayItem = function(ruleid) {
			$scope.cleanReportMessages();
			for(var i = 0; i < $scope.RuleObjects.length; i ++) {
				if ($scope.RuleObjects[i].RuleID === ruleid) {
					$scope.SelectedRuleObject = $scope.RuleObjects[i]; 
					$scope.SelectedRuleObject.ControlCenterObject.selected = $scope.SelectedRuleObject.ControlCenterObject;
					break;
				}
			}

			$scope.ItemActivity = "Finance.DisplayItem";
		};
		
		$scope.editItem = function(ruleid) {
			$scope.cleanReportMessages();
			for(var i = 0; i < $scope.RuleObjects.length; i ++) {
				if ($scope.RuleObjects[i].RuleID === ruleid) {
					$scope.SelectedRuleObject = $scope.RuleObjects[i]; 
					$scope.SelectedRuleObject.ControlCenterObject.selected = $scope.SelectedRuleObject.ControlCenterObject;
					break;
				}
			}
			
			$scope.ItemActivity = "Finance.EditItem";
		};
		
		$scope.deleteItem = function(ruleid) {
			$scope.cleanReportMessages();
		};
		
		$scope.saveCurrentItem = function() {
			$scope.cleanReportMessages();
			
			// Control center
			if ($scope.SelectedRuleObject.ControlCenterObject.selected) {
				$scope.SelectedRuleObject.ControlCenterID = $scope.SelectedRuleObject.ControlCenterObject.selected.ID; 
				$scope.SelectedRuleObject.ControlCenterObject = $scope.SelectedRuleObject.ControlCenterObject.selected;
			}
			
			// Perform the check
			var rptMsgs = $scope.SelectedRuleObject.Verify($translate);
			if (rptMsgs.length > 0) {
				$q.all(rptMsgs)
					.then(function(response) {
						$scope.cleanReportMessages();
						Array.prototype.push.apply($scope.ReportedMessages, response);
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
					});
				return;
			}
			
			// Next item ID
			if ($scope.SelectedRuleObject.RuleID === -1) {
				$scope.updateNextItemID();
				$scope.SelectedRuleObject.RuleID = $scope.nextItemID;				
				$scope.RuleObjects.push($scope.SelectedRuleObject);
			} else {
				// Update the selected one
				// It is updated automatically? Yes, it is!
			}
			
			// New item
			$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		$scope.cancelCurrentItem = function() {
			$scope.cleanReportMessages();
			$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		
		$scope.submit = function() {
			// Submit the SRules
			$scope.OrderObject.SRules = [];
			for(var i = 0; i < $scope.RuleObjects.length; i ++) {
				$scope.OrderObject.SRules.push($scope.RuleObjects[i]);
			}
			
			var rptMsgs = $scope.OrderObject.Verify($translate);
			if (rptMsgs.length > 0) {
				// Show all the errors?
				$q.all(rptMsgs).then(
					function(response) {
						$scope.cleanReportMessages();
						Array.prototype.push.apply($scope.ReportedMessages, response);
					},
					function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
					}	
				);
				return;
			}
			
			// Now, ready for submit!
			var strJSON = JSON && JSON.stringify($scope.OrderObject);
			if (strJSON) {
				if ($scope.OrderObject.ID === -1) {
					// Create order
					utils.createFinanceOrderQ(strJSON)
						.then(function(response) {
							// Take a look at the response
							if (response) {
								utils.loadFinanceOrderQ(true)
									.then(function(response2) {
										// Now navigate to display
										$state.go("home.finance.order.display",  { id : response });
									}, function(reason2) {
										$rootScope.$broadcast("ShowMessage", "Error", reason2);
									});							
							}
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				}
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.order.list");
		};				
	}])			
	;
}()
);

