/* global $ */
/* global angular */
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
    ;
	}])
	
	.controller('FinanceAccountListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();
		utils.loadCurrencies();

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
	    	{ name:'id', field: 'id', displayName: 'Common.ID', headerCellFilter: "translate", width:90 },
	    	{ name:'ctgyid', field: 'ctgyid', displayName: 'Common.CategoryID', headerCellFilter: "translate", width:90 },
			{ name:'ctgyname', field: 'ctgyname', displayName: 'Common.Category', headerCellFilter: "translate", width: 150},
			{ name:'name', field:'name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
			{ name:'assetflag', field:'assetflag', displayName: 'Finance.Asset', headerCellFilter: "translate", width: 50 },
			{ name:'comment', field:'comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
	  ];
	  
	  if (angular.isArray($rootScope.arFinanceAccount ) && $rootScope.arFinanceAccount.length > 0) {
		  $scope.myData = [];
			$.each($rootScope.arFinanceAccount, function(idx, obj) {
	  			$scope.myData.push(angular.copy(obj));					
			});			  
	  };
		
	    $scope.$on("FinanceAccountLoaded", function() {
	    	$log.info("HIH FinanceAccount List: Loaded event fired!");
	    	
		  $scope.myData = [];
		  $.each($rootScope.arFinanceAccount, function(idx, obj) {
	  			$scope.myData.push(angular.copy(obj));					
			});			  
	    });
	    
	    $scope.$on("FinanceAccountCategoryLoaded", function() {
	    	$log.info("HIH FinanceAccount List: Category Loaded event fired!");
	    });	

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			if ($scope.selectedRows.length <= 0)
				return;
			
			//var index = $scope.rowCollection.indexOf(row);
		    //if (index !== -1) {
		    	// Popup dialog for confirm
		    	
		    	// Then, communicate the sever for deleting
		    	
		    	// Last, update the UI part
//		    	$scope.rowCollection.splice(index, 1);
		    //}
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
			
	    	$state.go("home.finance.account.display",  { accountid : $scope.selectedRows[0].id });
		};
		
		// Edit
		$scope.editItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
			
		    $state.go("home.finance.account.maintain",  { accountid : $scope.selectedRows[0].id });
		};
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.account.create');
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

	.controller('FinanceAccountController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', 
	    function($scope, $rootScope, $state, $stateParams, $http, utils) {
		$scope.Activity = "";
		$scope.ErrorDetail = "";
		$scope.isReadonly = false;
		
		$scope.AccountID = -1;
		$scope.AccountCategory = {};
		$scope.AllAccountCategories = $rootScope.arFinanceAccountCategory;
		$scope.AccountName = "";
		$scope.AccountComment = "";
		$scope.AccountAssetFlag = "";
		
		 if (angular.isDefined($stateParams.accountid)) {
			 $scope.AccountID = parseInt($stateParams.accountid);
			 
			 if ($state.current.name === "home.finance.account.maintain") {
				 $scope.Activity = "Common.Edit";
			 } else if ($state.current.name === "home.finance.account.display") {
				 $scope.Activity = "Common.Display";
				 $scope.isReadonly = true;
			 }
			 
			 $.each($rootScope.arFinanceAccount, function (idx, obj) {
				 if (obj.id === $stateParams.accountid) {
					 // Category
					 $.each($scope.AllAccountCategories, function(idx2, obj2){
						 if (obj2.id === obj.ctgyid) {
							 $scope.AccountCategory.selected = obj2;
							 return false;
						 }
					 });
					 $scope.AccountAssetFlag = utils.assetFormatter(obj.assetflag);
					 $scope.AccountName = obj.name;
					 $scope.AccountComment = obj.comment;
					 
					 return false;
				 }
			 });

		 } else {
			 $scope.Activity = "Common.Create";
		 }
		 
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
		 	return row.docid;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.docid;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
			
 			 gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
 				 if (row.isSelected) {
 					$scope.selectedRows.push(row.entity);     					
 				 } else {
 					$.each($scope.selectedRows, function(idx, obj) {
						if (obj.docid === row.entity.docid) {
							$scope.selectedRows.splice(idx, 1);
							return false;
						}
					});
 				 }
  		     });
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'docid', field: 'docid', displayName: 'Common.ID', headerCellFilter: "translate", width:90 },
	    	{ name:'doctypename', field: 'doctypename', displayName: 'Finance.DocumentTypeID', headerCellFilter: "translate", width:90 },
			{ name:'trandate', field: 'trandate', displayName: 'Common.Date', headerCellFilter: "translate", width: 150},
			{ name:'trancurr', field:'trancurr', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'trancurrname', field:'trancurrname', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'tranamount', field:'tranamount', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 50 },
			{ name:'desp', field:'desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
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
			//var index = $scope.rowCollection.indexOf(row);
		    //if (index !== -1) {
		    	// Popup dialog for confirm
		    	
		    	// Then, communicate the sever for deleting
		    	
		    	// Last, update the UI part
//		    	$scope.rowCollection.splice(index, 1);
		    //}
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
		
	.controller('FinanceDocumentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.showhdr = true; // Default value
		$scope.ItemsChanged = false;
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
		$scope.gridOptions.enableRowSelection = true;
		$scope.gridOptions.enableFullRowSelection = true;
		$scope.gridOptions.selectionRowHeaderWidth = 35;
		
		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.docid;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.docid;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
			
 			 gridApi.selection.on.rowSelectionChanged($scope,function(row) {      		        
 				 if (row.isSelected) {
 					$scope.selectedItemRows.push(row.entity);     					
 				 } else {
 					$.each($scope.selectedRows, function(idx, obj) {
						if (obj.docid === row.entity.docid) {
							$scope.selectedItemRows.splice(idx, 1);
							return false;
						}
					});
 				 }
  		     });
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'itemid', field: 'itemid', displayName: 'Finance.ItemID', headerCellFilter: "translate", width:50 },
	    	{ name:'accountid', field: 'accountid', displayName: 'Finance.Account', headerCellFilter: "translate", width:50 },
			{ name:'accountname', field: 'accountname', displayName: 'Finance.Account', headerCellFilter: "translate", width: 100},
			{ name:'accountcategoryname', field:'accountcategoryname', displayName: 'Finance.AccountCategory', headerCellFilter: "translate", width: 90 },
			{ name:'trantypename', field:'trantypename', displayName: 'Finance.TransactionType', headerCellFilter: "translate", width: 100 },
			{ name:'trantypeexpense', field:'trantypeexpense', displayName: 'Finance.ExpenseFlag', headerCellFilter: "translate", width: 100 },
			{ name:'tranamount', field:'tranamount', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 50 },
			{ name:'desp', field:'desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 }
	   ];

        // For select control
		$scope.AllAccounts = $rootScope.arFinanceAccount;
		$scope.AllCurrencies = $rootScope.arCurrency;
		$scope.AllDocumentTypes = $rootScope.arFinanceDocumentType;
		$scope.AllTransactionTypes = $rootScope.arFinanceTransactionType;

        // Attributes
		$scope.DocumentHeader = {};
		$scope.SelectedDocumentItem = {};
        $scope.selectedItemRows = [];
		
		$scope.DocumentHeader.DocumentID = -1;
		$scope.DocumentHeader.DocumentType = {};
		$scope.DocumentHeader.DocumentCurrency = {};
		$scope.DocumentHeader.DocumentTranDate = new Date();
		$scope.DocumentHeader.DocumentDesp = "";
		$scope.DocumentHeader.DocumentAmount = 0.0;
		$scope.ItemsCollection = [];

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
		    }
		} else {
		    $scope.Activity = "Common.Create";
		}
		
		$scope.$on("FinanceDocumentItemLoaded", function () {
		    console.log("HIH FinanceDocument: Items Loaded event fired!");
		    if (angular.isDefined($rootScope.arFinanceDocumentItem) && $scope.ItemsCollection.length <= 0) {
		        $.each($rootScope.arFinanceDocumentItem, function (idx11, obj11) {
		            if (obj11.docid === $stateParams.docid) {
		                $scope.ItemsCollection.push(obj11);
		                return false;
		            }
		        });
		    }
		});

		$scope.close = function() {
		    $state.go("home.finance.document.list");
		};

		$scope.GoHeader = function (target) {
		    var hdr = angular.element('#divFinDocHeader');
		    var itm = angular.element('#divFinDocItem');

		    if (angular.isDefined(hdr) && angular.isDefined(itm)) {                
		    }
		};

		$scope.GoItems = function (target) {
		    var hdr = angular.element('#divFinDocHeader');
		    var itm = angular.element('#divFinDocItem');

		    if (angular.isDefined(hdr) && angular.isDefined(itm)) {
		    }
		};
		
		$scope.saveCurrentItem = function() {
			$scope.ItemsCollection.push(angular.copy($scope.SelectedDocumentItem));
		};
		
		$scope.cancelCurrentItem = function() {
			
		};
		
		//$scope.addDocItem = function() {
		//	$rootScope.CurrentDocumentItem = [$scope.DocumentHeader, $scope.Activity, null]; 
		//	// Show the dialog	
		//	var modalInstance = $modal.open({
		//		animation: true,
		//	    templateUrl: 'app/views/financedocumentitemdlg.html',
		//	    controller: 'FinanceDocumentDialogController',
		//		keyboard: false

		//		// Following part is not working without ngRoute				
		//		// resolve: {
       	//		// 	DocumentInfo: function () {
		//		// 		return [$scope.DocumentHeader, $scope.Activity, $scope.SelectedDocumentItem];
        //		// 	}
      	//		// }
		//      });
			
		//	modalInstance.result.then(function () {
		//	      //$scope.selected = selectedItem;
		//		  $rootScope.CurrentDocumentItem = [];
		//	    }, function () {
		//	 });			
		//};
		
		$scope.displayItem = function () {
			if ($scope.selectedItemRows.length <= 0 )
				return;
			
			var row = $scope.selectedItemRows[0];
			$scope.SelectedDocumentItem = angular.copy(row);
			$scope.SelectedDocumentItem.Account = {};
			$scope.SelectedDocumentItem.TranType = {};
			
			// Account
			$.each($scope.AllAccounts, function(idx, obj) {
				if (obj.id === row.accountid) {
					$scope.SelectedDocumentItem.Account.selected = obj;
					return false;
				}
			});			
			
			// Transaction type
			$.each($scope.AllTransactionTypes, function(idx2, obj2) {
				if (obj2.id === row.trantype) {
					$scope.SelectedDocumentItem.TranType.selected = obj2;
					return false;
				}
			});
			
			// Set the Item detail part
			// $.each($scope.ItemsCollection, function (idx1, obj1) {
		    //         if (obj1.itemid === $scope.DocumentHeader.docid) {
		    //             $scope.ItemsCollection.push(obj1);
		    //             return false;
		    //         }
		    //     });
			
			
// 			$rootScope.CurrentDocumentItem = [$scope.DocumentHeader, 'Display', row]; 
// 			// Show the dialog	
// 			var modalInstance = $modal.open({
// 				animation: true,
// 			    templateUrl: 'app/views/financedocumentitemdlg.html',
// 			    controller: 'FinanceDocumentDialogController',
// 				keyboard: false
// 
// 				// Following part is not working without ngRoute				
// 				// resolve: {
//        			// 	DocumentInfo: function () {
// 				// 		return [$scope.DocumentHeader, $scope.Activity, $scope.SelectedDocumentItem];
//         		// 	}
//       			// }
// 		     });
			
		//	modalInstance.result.then(function () {
		//	      //$scope.selected = selectedItem;
		//		  $rootScope.CurrentDocumentItem = [];
		//	    }, function () {
		//	 });			
		};
		//$scope.editItem = function(row) {
		//	$rootScope.CurrentDocumentItem = [$scope.DocumentHeader, 'Maintain', row]; 
		//	// Show the dialog	
		//	var modalInstance = $modal.open({
		//		animation: true,
		//	    templateUrl: 'app/views/financedocumentitemdlg.html',
		//	    controller: 'FinanceDocumentDialogController',
		//		keyboard: false

		//		// Following part is not working without ngRoute				
		//		// resolve: {
       	//		// 	DocumentInfo: function () {
		//		// 		return [$scope.DocumentHeader, $scope.Activity, $scope.SelectedDocumentItem];
        //		// 	}
      	//		// }
		//      });
			
		//	modalInstance.result.then(function () {
		//	      //$scope.selected = selectedItem;
		//		  $rootScope.CurrentDocumentItem = [];
		//	    }, function () {
		//	 });			
		//};
		//$scope.removeItem = function(row) {
			
		//};
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
		utils.loadFinanceTransactionTypes();
		$scope.arList = [];

		if (angular.isArray($rootScope.arFinanceTransactionType ) && $rootScope.arFinanceTransactionType.length > 0) {
			$scope.arList = [];
			$.each($rootScope.arFinanceTransactionType, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});	  
		};

		$scope.$on("FinanceTransactionTypeLoaded", function() {
			$log.info("HIH FinanceTransactionType List: Loaded event fired!");
	    	
			$scope.arList = [];
			$.each($rootScope.arFinanceTransactionType, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});	
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
		utils.loadFinanceDocumentTypes();
		$scope.arList = [];
	  
		if (angular.isArray($rootScope.arFinanceDocumentType ) && $rootScope.arFinanceDocumentType.length > 0) {
			$scope.arList = [];			
			$.each($rootScope.arFinanceDocumentType, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});			  
		};

		$scope.$on("FinanceDocumentTypeLoaded", function() {
	    	console.log("HIH FinanceDocumentType List: Loaded event fired!");
	    	
			$scope.arList = [];
			$.each($rootScope.arFinanceDocumentType, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});	
	    });
	}])

	.controller('FinanceAccountCategoryListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
	                                                     function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadFinanceAccountCategories();
		$scope.arList = [];

		if (angular.isArray($rootScope.arFinanceAccountCategory ) && $rootScope.arFinanceAccountCategory.length > 0) {
			$scope.arList = [];
			$.each($rootScope.arFinanceAccountCategory, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});			  
		};

	    $scope.$on("FinanceAccountCategoryLoaded", function() {
	    	$log.info("HIH FinanceAccountCategory List: Loaded event fired!");
	    	
			$scope.arList = [];
			$.each($rootScope.arFinanceAccountCategory, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});			  
	    });
	}])	
	
	.controller('FinanceCurrencyListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadCurrencies();
		$scope.arList = [];

		if (angular.isArray($rootScope.arCurrency ) && $rootScope.arCurrency.length > 0) {
			$scope.arList = [];
			$.each($rootScope.arCurrency, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});
		};

		$scope.$on("CurrencyLoaded", function() {
			$log.info("HIH Currency List: Loaded event fired!");
	    	
			$scope.arList = [];
			$.each($rootScope.arCurrency, function(idx, obj) {
				$scope.arList.push(angular.copy(obj));					
			});
		});
	}])		
	;
}()
);

