/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';

	angular.module('hihApp.Finance', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 'ui.select',
	 	'ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns',
	    'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping', 'selectize', 'chart.js'])
	    
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
        	templateUrl: 'app/views/finance/financeaccountlist.html',
        	controller: 'FinanceAccountListController'
        })
        .state("home.finance.account.hierarchy", {
        	url: "/hierarchy",
        	templateUrl: 'app/views/finance/financeaccounthierarchy.html',
        	controller: 'FinanceAccountHierarchyController'
        })
        .state("home.finance.account.create", {
        	url: '/create',
        	templateUrl: 'app/views/finance/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.account.display", {
        	url: '/display/:accountid',
        	templateUrl: 'app/views/finance/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.account.maintain", {
        	url: '/maintain/:accountid',
        	templateUrl: 'app/views/finance/financeaccount.html',
        	controller: 'FinanceAccountController'
        })
        .state("home.finance.document", {
            url: "/document",
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state("home.finance.document.list", {
        	url: "",
        	templateUrl: 'app/views/finance/financedocumentlist.html',
        	controller: 'FinanceDocumentListController'
        })
        .state("home.finance.document.create", {
        	url: '/create',
        	templateUrl: 'app/views/finance/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
        .state("home.finance.document.create_tran", {
        	url: '/create_tran',
        	templateUrl: 'app/views/finance/financedocument_tran.html',
        	controller: 'FinanceDocumentTranController'
        })
		.state("home.finance.document.create_currexg", {
        	url: '/create_currexg',
        	templateUrl: 'app/views/finance/financedocument_currexg.html',
        	controller: 'FinanceDocumentCurrExgController'			
		})
		.state("home.finance.document.create_instal", {
        	url: '/create_instal',
        	templateUrl: 'app/views/finance/financedocument_instal.html',
        	controller: 'FinanceDocumentInstalController'			
		})
		.state("home.finance.document.create_downpay", {
        	url: '/create_downpay',
        	templateUrl: 'app/views/finance/financedocument_downpay.html',
        	controller: 'FinanceDocumentDownPayController'			
		})
        .state("home.finance.document.display", {
        	url: '/display/:docid',
        	templateUrl: 'app/views/finance/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
        .state("home.finance.document.display_currexg", {
        	url: '/display_currexg/:docid',
        	templateUrl: 'app/views/finance/financedocument_currexg.html',
        	controller: 'FinanceDocumentCurrExgController'
        })
        .state("home.finance.document.display_tran", {
        	url: '/display_tran/:docid',
        	templateUrl: 'app/views/finance/financedocument_tran.html',
        	controller: 'FinanceDocumentTranController'
        })
        .state("home.finance.document.maintain", {
        	url: '/maintain/:docid',
        	templateUrl: 'app/views/finance/financedocument.html',
        	controller: 'FinanceDocumentController'
        })
		.state("home.finance.transactiontype", {
			url: '/transactiontype',
			abstract: true,
			template: '<div ui-view></div>'
		})
		.state("home.finance.transactiontype.list", {
			url: '',
			templateUrl: 'app/views/finance/financetransactiontypelist.html',
			controller: 'FinanceTransactionTypeListController'
		})
		.state("home.finance.transactiontype.hierarchy", {
			url: '/hierarchy',
			templateUrl: 'app/views/finance/financetransactiontypehierarchy.html',
			controller: 'FinanceTransactionTypeHierarchyController'
		})
		.state("home.finance.documenttype", {
			url: '/documenttype',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.documenttype.list", {
			url: '',
			templateUrl: 'app/views/finance/financedocumenttypelist.html',
			controller: 'FinanceDocumentTypeListController'
		})
		.state("home.finance.accountcategory", {
			url: '/accountcategory',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.accountcategory.list", {
			url: '',
			templateUrl: 'app/views/finance/financeaccountcategorylist.html',
			controller: 'FinanceAccountCategoryListController'
		})
		.state("home.finance.currency", {
			url: '/currency',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.currency.list", {
			url: '',
			templateUrl: 'app/views/finance/financecurrencylist.html',
			controller: 'FinanceCurrencyListController'
		})
		.state("home.finance.controlcenter", {
			url: '/controlcenter',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.controlcenter.list", {
			url: '',
			templateUrl: 'app/views/finance/financecclist.html',
			controller: 'FinanceControlCenterListController'
		})
		.state("home.finance.controlcenter.hierarchy", {
			url: '/hierarchy',
			templateUrl: 'app/views/finance/financecchierarchy.html',
			controller: 'FinanceControlCenterHierarchyController'
		})
		.state("home.finance.controlcenter.maintain", {
			url: '/maintain/:id',
			templateUrl: 'app/views/finance/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.controlcenter.display", {
			url: '/display/:id',
			templateUrl: 'app/views/finance/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.controlcenter.create", {
			url: '/create',
			templateUrl: 'app/views/finance/financecc.html',
			controller: 'FinanceControlCenterController'
		})
		.state("home.finance.order", {
			url: '/order',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.order.list", {
			url: '',
			templateUrl: 'app/views/finance/financeorderlist.html',
			controller: 'FinanceOrderListController'
		})
		.state("home.finance.order.maintain", {
			url: '/maintain/:id',
			templateUrl: 'app/views/finance/financeorder.html',
			controller: 'FinanceOrderController'
		})
		.state("home.finance.order.display", {
			url: '/display/:id',
			templateUrl: 'app/views/finance/financeorder.html',
			controller: 'FinanceOrderController'
		})
		.state("home.finance.order.create", {
			url: '/create',
			templateUrl: 'app/views/finance/financeorder.html',
			controller: 'FinanceOrderController'
		})
		.state("home.finance.report", {
			url: '/report',
			abstract: true,
			template: '<div ui-view></div>'			
		})
		.state("home.finance.report.balancesheet", {
			url: '',
			templateUrl: 'app/views/finance/financereportbs.html',
			controller: 'FinanceReportBSController'
		})
		.state("home.finance.report.trantype", {
			url: '/tt',
			templateUrl: 'app/views/finance/financereporttt.html',
			controller: 'FinanceReportTTController'
		})
		.state("home.finance.report.orderbalance", {
			url: '/order',
			templateUrl: 'app/views/finance/financereportorder.html',
			controller: 'FinanceReportOrderController'
		})
		.state("home.finance.report.ccbalance", {
			url:'/cc',
			templateUrl: 'app/views/finance/financereportcc.html',
			controller: 'FinanceReportCCController'
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
	    	//{ name:'ctgyid', field: 'CategoryObject.ID', displayName: 'Common.CategoryID', headerCellFilter: "translate", width:90 },
			{ name:'ctgyname', field: 'CategoryObject.Name', displayName: 'Common.Category', headerCellFilter: "translate", width: 150},
			{ name:'name', field:'Name', displayName: 'Common.Name', headerCellFilter: "translate", width: 150 },
			{ name:'assetflag', field:'CategoryObject.AssetFlag', displayName: 'Finance.Asset', headerCellFilter: "translate", width: 90,
				cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
          			if (grid.getCellValue(row,col) === 1) { return 'accountasset';} 
					else { return 'accountnotasset'; }
        		}
			 },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 200 }
	    ];
	  
	    var promise1 = utils.loadCurrenciesQ();
	    var promise2 = utils.loadFinanceAccountCategoriesQ();	  
	    $q.all([promise1, promise2])
	  	    .then(function(response) {
			    utils.loadFinanceAccountsQ()
			  	    .then(function(response2) {
					    if (angular.isArray($rootScope.arFinanceAccount) && $rootScope.arFinanceAccount.length > 0) {
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
			
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
				utils.deleteFinanceAccountQ($scope.selectedRows[0].ID)
					.then(function(response) {
						// Empty selection table
						$scope.selectedRows = [];
						
						// Just refresh it!
						$scope.refreshList();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			});
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
	
	.controller('FinanceAccountHierarchyController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, utils) {
			$scope.treeData = [];
			
			var promise1 = utils.loadCurrenciesQ();
	    	var promise2 = utils.loadFinanceAccountCategoriesQ();
	  
	    	$q.all([promise1, promise2])
				.then(function(response) {
					utils.loadFinanceAccountHierarchyQ()
						.then(function(response2) {
							if (angular.isArray($rootScope.arFinanceAccountHierarchy) && $rootScope.arFinanceAccountHierarchy.length > 0) {				
								$.each($rootScope.arFinanceAccountHierarchy, function(idx, obj) {
									var treenode = {};
									angular.copy(obj, treenode);
									treenode.state = {
										opened: true	
									};
									
									$scope.treeData.push(treenode); 
								});
								
								$scope.treeConfig.version++;
							}
						}, function(reason2) {
							$rootScope.$broadcast("ShowMessage", "Error", reason2);
						});
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});			
		
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
	         
		$scope.newItem = function() {
			// Navigate to the account create
	 		$state.go('home.finance.account.create');
		};
			 
		$scope.refreshHierarchy = function() {
			utils.loadFinanceAccountHierarchyQ(true)
				.then(function(response2) {
					if (angular.isArray($rootScope.arFinanceAccountHierarchy) && $rootScope.arFinanceAccountHierarchy.length > 0) {				
						$.each($rootScope.arFinanceAccountHierarchy, function(idx, obj) {
							var treenode = {};
							angular.copy(obj, treenode);
							treenode.state = {
								opened: true	
							};
									
							$scope.treeData.push(treenode); 
						});
								
						$scope.treeConfig.version++;
					}
				}, function(reason2) {
					$rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])

	.controller('FinanceAccountController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', 'utils', 
	    function($scope, $rootScope, $state, $stateParams, $http, $translate, $q, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		
		$scope.AccountObject = new hih.FinanceAccount();
		$scope.AccountCategoryObject = {};
		$scope.AllAccountCategories = $rootScope.arFinanceAccountCategory;
		
		// Messages
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};

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
			$scope.cleanReportMessages();
			
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
				$q.all(errMsgs).then(function (translations) {
					Array.prototype.push.call($scope.cleanReportMessages, translations);
  				}, function(reason) {
					  $rootScope.$broadcast("ShowMessage", "Error", reason);
				  });				
				return;
			}
			
			// Now submit to the server side
			var strJSON = JSON && JSON.stringify($scope.AccountObject) || $.toJSON($scope.AccountObject);
			if (strJSON) {
				utils.createFinanceAccountQ(strJSON)
					.then(function(response) {
						// First of all, update the rootScope
						if (response) {
							$state.go("home.finance.account.display",  { accountid : response });
						} else {
							$state.go("home.finance.account.list");
						}
					}, function(reason) {
						// Failed, throw out error message
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "To-Do: reason");
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.account.list");
		};
	}])	
	
	.controller('FinanceDocumentListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'uiGridConstants', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, uiGridConstants, utils) {
		var promise1 = utils.loadCurrenciesQ();
		var promise2 = utils.loadFinanceTransactionTypesQ();
		var promise3 = utils.loadFinanceAccountCategoriesQ();
		var promise4 = utils.loadFinanceDocumentTypesQ();
		var promise10 = utils.loadFinanceControlCentersQ();
		var promise11 = utils.loadFinanceOrderQ();
		$q.all(promise1, promise2, promise3, promise4, promise10, promise11)
			.then(function(response) {
				utils.loadFinanceAccountsQ().then(function(response2) {
					utils.loadFinanceDocumentsQ()
						.then(function(response3) {
						    if (angular.isArray($rootScope.arFinanceDocument ) && $rootScope.arFinanceDocument.length > 0) {
								$scope.myData = [];
								$.each($rootScope.arFinanceDocument, function(idx, obj) {
									$scope.myData.push(angular.copy(obj));					
								});			  
							};
						}, function(reason3) {
							$rootScope.$broadcast("ShowMessage", "Error", reason3);
						});
				}, function(reason2) {
					$rootScope.$broadcast("ShowMessage", "Error", reason2);
				})
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

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
		$scope.gridOptions.showColumnFooter = true;
		
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
	    	{ name:'doctypename', field: 'DocTypeObject.Name', displayName: 'Finance.DocumentType', headerCellFilter: "translate", width:90 },
			{ name:'trandate', field: 'TranDate', displayName: 'Common.Date', headerCellFilter: "translate", width: 150},
			//{ name:'trancurr', field:'TranCurrency', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'trancurrname', field:'TranCurrencyObject.Name', displayName: 'Finance.Currency', headerCellFilter: "translate", width: 150 },
			{ name:'tranamount', field:'TranAmount', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 150,
				 aggregationType:uiGridConstants.aggregationTypes.sum, cellClass: 'amountcell' },
			{ name:'desp', field:'Desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 200 }
	    ];	  
		
	    $scope.$on("FinanceDocumentLoaded", function() {
	    	$log.info("HIH FinanceDocument List: Loaded event fired!");
	    });
	    
	    $scope.$on("FinanceDocumentTypeLoaded", function() {
	    	$log.info("HIH FinanceDocument List: Type Loaded event fired!");
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
			
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
				utils.deleteFinanceDocumentQ($scope.selectedRows[0].DocID)
					.then(function(response) {
						// Empty selection table
						$scope.selectedRows = [];
						
						// Just refresh it!
						// To-Do: for Performance
						$scope.refreshList();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			});
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
			
			if ($scope.selectedRows[0].DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.display_tran",  { docid : $scope.selectedRows[0].DocID });	
			} else if($scope.selectedRows[0].DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.display_currexg",  { docid : $scope.selectedRows[0].DocID });
			} else {
		    	$state.go("home.finance.document.display",  { docid : $scope.selectedRows[0].DocID });				
			}
		};
		
		// Edit
		$scope.editItem = function (row) {
			if ($scope.selectedRows.length <= 0)
				return;
			if ($scope.selectedRows[0].DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.maintain_tran",  { docid : $scope.selectedRows[0].DocID });
			} else if($scope.selectedRows[0].DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.maintain_currexg",  { docid : $scope.selectedRows[0].DocID });
			} else {
		    	$state.go("home.finance.document.maintain",  { docid : $scope.selectedRows[0].DocID });				
			}	    	
		};
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.document.create');
		};

		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceDocumentsQ(true)
			    .then(function(response) {
					if (angular.isArray($rootScope.arFinanceDocument ) && $rootScope.arFinanceDocument.length > 0) {
						$scope.myData = [];
						$.each($rootScope.arFinanceDocument, function(idx, obj) {
							$scope.myData.push(angular.copy(obj));					
						});
						
						// Force it refresh!
						$scope.$apply();
					};
				}, function(reason2) {
				    // Error occurred
				    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])

	.controller('FinanceDocumentTranController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
		// This class serviced for the creation of Transfer document 
		$scope.Activity = "Common.Create"; // By default, it's create!
		$scope.isReadonly = false;
		$scope.ReportedMessages = [];

		$scope.DocumentObject = new hih.FinanceDocument();
		$scope.DocumentObject.DocTypeID = hih.Constants.FinDocType_Transfer;
		$scope.TranAmount = 0.0;
		$scope.SourceAccountID = null;
		$scope.TargetAccountID = null;
		$scope.SourceCCID = null;
		$scope.TargetCCID = null;
		$scope.SourceOrderID = null;
		$scope.TargetOrderID = null;
		$scope.DocumentObject.TranCurrency = $rootScope.objFinanceSetting.LocalCurrency;
		$scope.TranCurrencyIsLocal = true;
		
		// Currency select control
		$scope.currConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Currency control, event onChange, ', value);
				if (value === $rootScope.objFinanceSetting.LocalCurrency) {
					$scope.TranCurrencyIsLocal = true;
				} else {
					$scope.TranCurrencyIsLocal = false;
					
					var er = utils.getExpectedExchangeRate($scope.DocumentObject.TranDate, value);
					if (er && !isNaN(er)) {
						$scope.DocumentObject.ExchangeRate = parseFloat(er);
					}
				}
				$scope.$apply();
    		},
			valueField: 'Currency',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Source account
		$scope.sourceAccountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Source Account control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
			optgroups: $rootScope.arFinanceAccountCategory,
			optgroupField: 'CategoryID',
			optgroupLabelField: 'Name',
			optgroupValueField: 'ID',
		    maxItems: 1,
    		required: true,
			searchField: ['Name'],
			render: {
				optgroup_header: function(data, escape) {
					return '<div class="optgroup-header">' + escape(data.Name) + '</div>';
				}
			}
  		};
		// Target accountr
		$scope.targetAccountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Target Account control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
			optgroups: $rootScope.arFinanceAccountCategory,
			optgroupField: 'CategoryID',
			optgroupLabelField: 'Name',
			optgroupValueField: 'ID',
		    maxItems: 1,
    		required: true,
			searchField: ['Name'],
			render: {
				optgroup_header: function(data, escape) {
					return '<div class="optgroup-header">' + escape(data.Name) + '</div>';
				}
			}
  		};
		// Source control center
		$scope.sourceCCConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Source Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Target control center
		$scope.targetCCConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Target Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Source order
		$scope.sourceOrderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Source Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Target order
		$scope.targetOrderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentTranController, Target Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
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
		
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		
		if (angular.isDefined($stateParams.docid)) {
		    if ($state.current.name === "home.finance.document.maintain_tran") {
		        $scope.Activity = "Common.Edit";
		    } else if ($state.current.name === "home.finance.document.display_tran") {
		        $scope.Activity = "Common.Display";
		        $scope.isReadonly = true;
		    }
			
		    utils.loadFinanceDocumentItemsQ($stateParams.docid)
				.then(function(response) {
					var nDocID = parseInt($stateParams.docid);
					$.each($rootScope.arFinanceDocument, function (idx, obj) {
						if (obj.DocID === nDocID) {
							//$scope.ItemsCollection = [];
							$scope.DocumentObject = angular.copy(obj);
							
							for(var i = 0; i < $scope.DocumentObject.Items.length; i++) {
								if (i === 0) {
									$scope.SourceAccountID = $scope.DocumentObject.Items[i].AccountID;
									$scope.SourceCCID = $scope.DocumentObject.Items[i].ControlCenterID;
									$scope.SourceOrderID = $scope.DocumentObject.Items[i].OrderID;
									$scope.TranAmount = $scope.DocumentObject.Items[i].TranAmount_Org;
								} else if(i === 1) {
									$scope.TargetAccountID = $scope.DocumentObject.Items[i].AccountID;
									$scope.TargetCCID = $scope.DocumentObject.Items[i].ControlCenterID;
									$scope.TargetOrderID = $scope.DocumentObject.Items[i].OrderID;
								} else {
									$rootScope.$broadcast("ShowMessage", "Error", "fatal error!");
								}
							}
							return false;
						}
					});	
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		} else {
			$scope.Activity = "Common.Create";
		}
		
		$scope.submit = function() {
			// Set source account, target account and currency first
			$scope.DocumentObject.Items = [];
			
			var item1 = new hih.FinanceDocumentItem();
			item1.ItemID = 1;
			var item2 = new hih.FinanceDocumentItem();
			item2.ItemID = 2;
			item1.AccountID = parseInt($scope.SourceAccountID);
			item1.TranTypeID = hih.Constants.FinTranType_TransferOut;
			item1.TranAmount_Org = parseFloat($scope.TranAmount);
			item1.ControlCenterID = parseInt($scope.SourceCCID);
			item1.OrderID = parseInt($scope.SourceOrderID);
			item1.Desp = $scope.DocumentObject.Desp;
			item1.buildRelationship($rootScope.arFinanceAccount, $rootScope.arFinanceControlCenter, $rootScope.arFinanceOrder, $rootScope.arFinanceTransactionType);		
			$scope.DocumentObject.Items.push(item1);
			
			item2.AccountID = parseInt($scope.TargetAccountID);
			item2.TranTypeID = hih.Constants.FinTranType_TransferIn;
			item2.TranAmount_Org = item1.TranAmount_Org;
			item2.ControlCenterID = parseInt($scope.TargetCCID);
			item2.OrderID = parseInt($scope.TargetOrderID);
			item2.Desp = $scope.DocumentObject.Desp;
			item2.buildRelationship($rootScope.arFinanceAccount, $rootScope.arFinanceControlCenter, $rootScope.arFinanceOrder, $rootScope.arFinanceTransactionType);		
			$scope.DocumentObject.Items.push(item2);
			
			// Verify
			var rptMsgs = $scope.DocumentObject.Verify($translate, $rootScope.objFinanceSetting.LocalCurrency);
			if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
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
			var strJSON = JSON && JSON.stringify($scope.DocumentObject) || $.toJSON($scope.DocumentObject);
			if (strJSON) {
				if ($scope.DocumentObject.DocID === -1) {
					utils.createFinanceDocumentQ(strJSON)
						.then(function(response) {
							// Take a look at the response
							if (response) {
								// Now navigate to display
								$scope.DocumentObject.DocID = parseInt(response);
								$scope.DocumentObject.buildRelationship(
									$rootScope.arFinanceDocumentType,
									$rootScope.arCurrency
								);
								$scope.DocumentObject.Items = [];
								$rootScope.arFinanceDocument.push($scope.DocumentObject);
								$scope.DocumentObject = new hih.FinanceDocument();
								$state.go("home.finance.document.display_tran",  { docid : response });
							}
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				}
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
			}
		};
		
		$scope.close = function() {
			$state.go("home.finance.document.list");
		};
	}])		

	.controller('FinanceDocumentCurrExgController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
			
		// This class serviced for the creation of Currency Exchange document
		$scope.isReadonly = false;
		$scope.ReportedMessages = [];
		$scope.DocumentObject = new hih.FinanceDocument();
		$scope.DocumentObject.DocTypeID = hih.Constants.FinDocType_CurrExchange;
		$scope.SourceAccountID = null;
		$scope.TargetAccountID = null;
		$scope.SourceCCID = null;
		$scope.TargetCCID = null;
		$scope.SourceOrderID = null;
		$scope.TargetOrderID = null;
		$scope.SourceTranAmount = 0.0;
		$scope.TargetTranAmount = 0.0;
		$scope.DocumentObject.TranCurrency = $rootScope.objFinanceSetting.LocalCurrency;
		$scope.SourceCurrencyIsLocal = true;
		$scope.TargetCurrencyIsLocal = false;
		
		$scope.AllCurrencies = $rootScope.arCurrency;
		$scope.AllOrders = $rootScope.arFinanceOrder;

		// Source currency control
		$scope.sourceCurrConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Source Currency control, event onChange, ', value);
				if (value === $rootScope.objFinanceSetting.LocalCurrency) {
					$scope.SourceCurrencyIsLocal = true;
				} else {
					$scope.SourceCurrencyIsLocal = false;

					var er = utils.getExpectedExchangeRate($scope.DocumentObject.TranDate, value);
					if (er && !isNaN(er)) {
						$scope.DocumentObject.ExchangeRate = parseFloat(er);
					}
				}
				$scope.$apply();
    		},
			valueField: 'Currency',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Target currency control
		$scope.targetCurrConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Target Currency control, event onChange, ', value);
				if (value === $rootScope.objFinanceSetting.LocalCurrency) {
					$scope.TargetCurrencyIsLocal = true;
				} else {
					$scope.TargetCurrencyIsLocal = false;
					
					var er = utils.getExpectedExchangeRate($scope.DocumentObject.TranDate, value);
					if (er && !isNaN(er)) {
						$scope.DocumentObject.ExchangeRate2 = parseFloat(er);
					}
				}
				$scope.$apply();
    		},
			valueField: 'Currency',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Source account
		$scope.sourceAccountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Source Account control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
			optgroups: $rootScope.arFinanceAccountCategory,
			optgroupField: 'CategoryID',
			optgroupLabelField: 'Name',
			optgroupValueField: 'ID',
		    maxItems: 1,
    		required: true,
			searchField: ['Name'],
			render: {
				optgroup_header: function(data, escape) {
					return '<div class="optgroup-header">' + escape(data.Name) + '</div>';
				}
			}
  		};
		// Target accountr
		$scope.targetAccountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Target Account control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
			optgroups: $rootScope.arFinanceAccountCategory,
			optgroupField: 'CategoryID',
			optgroupLabelField: 'Name',
			optgroupValueField: 'ID',
		    maxItems: 1,
    		required: true,
			searchField: ['Name'],
			render: {
				optgroup_header: function(data, escape) {
					return '<div class="optgroup-header">' + escape(data.Name) + '</div>';
				}
			}
  		};
		// Source control center
		$scope.sourceCCConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Source Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Target control center
		$scope.targetCCConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Target Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Source order
		$scope.sourceOrderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Source Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Target order
		$scope.targetOrderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentCurrExgController, Target Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
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
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		
		// Handle the input parameter
		if (angular.isDefined($stateParams.docid)) {
			if ($state.current.name === "home.finance.document.maintain_currexg") {
			    $scope.Activity = "Common.Edit";
			} else if ($state.current.name === "home.finance.document.display_currexg") {
				$scope.Activity = "Common.Display";
				$scope.isReadonly = true;
			}
			
		    utils.loadFinanceDocumentItemsQ($stateParams.docid)
				.then(function(response) {
					var nDocID = parseInt($stateParams.docid);
					$.each($rootScope.arFinanceDocument, function (idx, obj) {
						if (obj.DocID === nDocID) {
							//$scope.ItemsCollection = [];
							$scope.DocumentObject = angular.copy(obj);
							
							for(var i = 0; i < $scope.DocumentObject.Items.length; i++) {
								if (i === 0) {
									$scope.SourceAccountID = $scope.DocumentObject.Items[i].AccountID;
									$scope.SourceCCID = $scope.DocumentObject.Items[i].ControlCenterID;
									$scope.SourceOrderID = $scope.DocumentObject.Items[i].OrderID;
									$scope.SourceTranAmount = $scope.DocumentObject.Items[i].TranAmount_Org;
								} else if(i === 1) {
									$scope.TargetAccountID = $scope.DocumentObject.Items[i].AccountID;
									$scope.TargetCCID = $scope.DocumentObject.Items[i].ControlCenterID;
									$scope.TargetOrderID = $scope.DocumentObject.Items[i].OrderID;
									$scope.TargetTranAmount = $scope.DocumentObject.Items[i].TranAmount_Org;
								} else {
									$rootScope.$broadcast("ShowMessage", "Error", "fatal error!");
								}
							}
							return false;
						}
					});	
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		} else {
			$scope.Activity = "Common.Create";
		}

		$scope.submit = function() {
			$scope.DocumentObject.Items = [];
			
			// Item 1
			var item1 = new hih.FinanceDocumentItem();
			item1.ItemID = 1;
			item1.AccountID = parseInt($scope.SourceAccountID);
			item1.TranTypeID = hih.Constants.FinTranType_TransferOut;
			item1.TranAmount_Org = parseFloat($scope.SourceTranAmount);
			item1.ControlCenterID = parseInt($scope.SourceCCID);
			item1.OrderID = parseInt($scope.SourceOrderID);
			item1.Desp = $scope.DocumentObject.Desp;
			item1.buildRelationship($rootScope.arFinanceAccount, $rootScope.arFinanceControlCenter, $rootScope.arFinanceOrder, $rootScope.arFinanceTransactionType);		
			$scope.DocumentObject.Items.push(item1);
			
			// Item 2
			var item2 = new hih.FinanceDocumentItem();
			item2.ItemID = 2;
			item2.UseCurrency2 = true;
			item2.AccountID = parseInt($scope.TargetAccountID);
			item2.TranTypeID = hih.Constants.FinTranType_TransferIn;
			item2.TranAmount_Org = parseFloat($scope.TargetTranAmount);
			item2.ControlCenterID = parseInt($scope.TargetCCID);
			item2.OrderID = parseInt($scope.TargetOrderID);
			item2.Desp = $scope.DocumentObject.Desp;
			item2.buildRelationship($rootScope.arFinanceAccount, $rootScope.arFinanceControlCenter, $rootScope.arFinanceOrder, $rootScope.arFinanceTransactionType);		
			$scope.DocumentObject.Items.push(item2);
			
			// Verify
			var rptMsgs = $scope.DocumentObject.Verify($translate, $rootScope.objFinanceSetting.LocalCurrency);
			if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
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
			var strJSON = JSON && JSON.stringify($scope.DocumentObject) || $.toJSON($scope.DocumentObject);
			if (strJSON) {
				if ($scope.DocumentObject.DocID === -1) {
					utils.createFinanceDocumentQ(strJSON)
						.then(function(response) {
							// Take a look at the response
							if (response) {
								$scope.DocumentObject.DocID = parseInt(response);
								$scope.DocumentObject.buildRelationship(
									$rootScope.arFinanceDocumentType,
									$rootScope.arCurrency
								);
								$rootScope.arFinanceDocument.push($scope.DocumentObject);
								
								// Now navigate to display
								$state.go("home.finance.document.display_currexg",  { docid : response });
							}
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				}
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
			}
		};
		$scope.close = function() {
			$state.go("home.finance.document.list");
		};
	}])		

	.controller('FinanceDocumentInstalController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
		// This class serviced for the creation of Installment document
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.ReportedMessages = [];
		$scope.DocumentObject = new hih.FinanceDocument();

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
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
	}])

	.controller('FinanceDocumentDownPayController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
		// This class serviced for the creation of Down payment document
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.ReportedMessages = [];
		$scope.DocumentObject = new hih.FinanceDocument();
		
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
	}])
		
	.controller('FinanceDocumentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, uiGridConstants, utils) {
		$scope.Activity = "";
		$scope.isReadonly = false;
		$scope.showhdr = true; // Default value
		$scope.ItemActivity = "Finance.CreateItem";
		$scope.TranCurrencyIsLocal = true;
		
		// Error messges
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		
		// For item table
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'ItemsCollection';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.ItemID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.ItemID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'itemid', field: 'ItemID', displayName: 'Finance.ItemID', headerCellFilter: "translate", width:50 },
	    	//{ name:'accountid', field: 'accountid', displayName: 'Finance.Account', headerCellFilter: "translate", width:50 },
			{ name:'accountname', field: 'AccountObject.Name', displayName: 'Finance.Account', headerCellFilter: "translate", width: 150 },
			//	cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
            //			if (grid.getCellValue(row,col) === 1) { return 'accountasset';} 
			//		else { return 'accountnotasset'; }
        	//	}},
			//{ name:'accountcategoryname', field:'AccountObject.CategoryObject.Name', displayName: 'Finance.AccountCategory', headerCellFilter: "translate", width: 90 },
			{ name:'trantypename', field:'TranTypeObject.Name', displayName: 'Finance.TransactionType', headerCellFilter: "translate", width: 100 },
			//	cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
          	//		if (grid.getCellValue(row,col) === 1) { return 'accountasset';} 
			//		else { return 'accountnotasset'; }
        	//	} },
			//{ name:'trantypeexpense', field:'TranTypeObject.ExpenseFlag', displayName: 'Finance.ExpenseFlag', headerCellFilter: "translate", width: 100 },
			{ name:'tranamountlc', field:'TranAmount_Org', displayName: 'Finance.Amount', headerCellFilter: "translate", width: 150,
				aggregationType:uiGridConstants.aggregationTypes.sum, cellClass: 'amountcell' },
			{ name:'desp', field:'Desp', displayName: 'Common.Comment', headerCellFilter: "translate", width: 100 },
			{ name:'itemcc', field:'ControlCenterObject.Name', displayName: 'Finance.ControlCenter', headerCellFilter: "translate", width: 100 },
			{ name:'itemord', field:'OrderObject.Name', displayName: 'Finance.Order', headerCellFilter: "translate", width: 100 },			
			{ name: 'edit', field:'ItemID', displayName: 'Common.Edit', headerCellFilter: "translate",  width: 240,
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

        // Attributes
		$scope.DocumentObject = new hih.FinanceDocument();
		$scope.ItemsCollection = [];
		$scope.SelectedDocumentItem = new hih.FinanceDocumentItem(); // Current edit item
		$scope.nextItemID = 0;
		$scope.RefCurrExgDocObject = {};
		
		// Doc type select control
		$scope.docTypeConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Doc. Type control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Currency select control
		$scope.currConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Currency control, event onChange, ', value);
				if (value === $rootScope.objFinanceSetting.LocalCurrency) {
					$scope.TranCurrencyIsLocal = true;
				} else {
					$scope.TranCurrencyIsLocal = false;
					
					var er = utils.getExpectedExchangeRate($scope.DocumentObject.TranDate, value);
					if (er && !isNaN(er)) {
						$scope.DocumentObject.ExchangeRate = parseFloat(er);
					}
				}
				$scope.$apply();				  
    		},
			valueField: 'Currency',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Account select control
		$scope.accountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Account control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
			optgroups: $rootScope.arFinanceAccountCategory,
			optgroupField: 'CategoryID',
			optgroupLabelField: 'Name',
			optgroupValueField: 'ID',
		    maxItems: 1,
    		required: true,
			searchField: ['Name'],
			render: {
				optgroup_header: function(data, escape) {
					return '<div class="optgroup-header">' + escape(data.Name) + '</div>';
				}
			}
  		};
		// Tran type select control 
		$scope.trantypeConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Tran. Type control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'FullDisplayName',
		    maxItems: 1,
    		required: true,
			render: {
				 option: function(data, escape) {
					return data.ExpenseFlag ? '<div class="trantypeexpense">' + escape(data.FullDisplayName) + '</div>'
							: '<div class="trantypenonexpense">' + escape(data.FullDisplayName) + '</div>';
				}
			}
  		};
		// CC select control
		$scope.ccConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Order select control
		$scope.orderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentController, Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};		  
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
		$scope.updateNextItemID = function () {
			if (angular.isArray($scope.ItemsCollection) && $scope.ItemsCollection.length > 0) {
				$scope.nextItemID = 0;
				
				$.each($scope.ItemsCollection, function (idx, obj) {
	                var nItemID = parseInt(obj.ItemID);
						
					if ($scope.nextItemID < nItemID) {
						$scope.nextItemID = nItemID;
		            }
		        });
				
				$scope.nextItemID++;
			} else {
				$scope.nextItemID = 1;
			}
		};

		// Handle the paramter
		if (angular.isDefined($stateParams.docid)) {
		    if ($state.current.name === "home.finance.document.maintain") {
		        $scope.Activity = "Common.Edit";
		    } else if ($state.current.name === "home.finance.document.display") {
		        $scope.Activity = "Common.Display";
		        $scope.isReadonly = true;
		    }
			
		    utils.loadFinanceDocumentItemsQ($stateParams.docid)
				.then(function(response) {
					var nDocID = parseInt($stateParams.docid);
					$.each($rootScope.arFinanceDocument, function (idx, obj) {
						if (obj.DocID === nDocID) {
							$scope.ItemsCollection = [];
							$scope.DocumentObject = angular.copy(obj);
							for(var i = 0; i < $scope.DocumentObject.Items.length; i++) {
								$scope.ItemsCollection.push($scope.DocumentObject.Items[i]);
							}

							return false;
						}
					});					
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		} else {
			// Set the default currency to local currency
			$scope.DocumentObject.TranCurrency = $rootScope.objFinanceSetting.LocalCurrency;
			$scope.DocumentObject.DocTypeID = hih.Constants.FinDocType_Normal;
			$scope.TranCurrencyIsLocal = true;

		    $scope.Activity = "Common.Create";
		}
		
		$scope.displayItem = function(itemid) {
			$scope.cleanReportMessages();
			var nID = parseInt(itemid);
			for(var i = 0; i < $scope.ItemsCollection.length; i ++) {
				if ($scope.ItemsCollection[i].ItemID === nID) {
					$scope.SelectedDocumentItem = $scope.ItemsCollection[i]; 
					break;
				}
			}

			$scope.ItemActivity = "Finance.DisplayItem";
		};
		
		$scope.editItem = function(itemid) {
			$scope.cleanReportMessages();
			var nID = parseInt(itemid);
			for(var i = 0; i < $scope.ItemsCollection.length; i ++) {
				if ($scope.ItemsCollection[i].ItemID === nID) {
					$scope.SelectedDocumentItem = $scope.ItemsCollection[i]; 
					break;
				}
			}
			
			$scope.ItemActivity = "Finance.EditItem";
		};
		
		$scope.deleteItem = function(itemid) {
			$scope.cleanReportMessages();
			
			// Show confirm dialog
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
				function() {
					var nID = parseInt(itemid);
					if ($scope.SelectedDocumentItem.ItemID === nID) {
						$scope.SelectedDocumentItem = new hih.FinanceDocumentItem();
						$scope.ItemActivity = "Finance.CreateItem";
					}
							
					for(var i = 0; i < $scope.ItemsCollection.length; i ++) {
						if ($scope.ItemsCollection[i].ItemID === nID) {
							$scope.ItemsCollection.splice(i, 1);
							break;
						}
					}
					
					$scope.$apply();
			});
		};
		
		$scope.saveCurrentItem = function() {
			$scope.cleanReportMessages();
			
			// Change the IDs from String to Integer
			$scope.SelectedDocumentItem.AccountID = parseInt($scope.SelectedDocumentItem.AccountID);
			$scope.SelectedDocumentItem.ControlCenterID = parseInt($scope.SelectedDocumentItem.ControlCenterID);
			$scope.SelectedDocumentItem.OrderID = parseInt($scope.SelectedDocumentItem.OrderID);
			$scope.SelectedDocumentItem.TranTypeID = parseInt($scope.SelectedDocumentItem.TranTypeID);
			
			// Perform the check
			var rptMsgs = $scope.SelectedDocumentItem.Verify($translate);
			if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
				$q.all(rptMsgs)
					.then(function(response) {
						$scope.cleanReportMessages();
						Array.prototype.push.apply($scope.ReportedMessages, response);
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
					});
				return;
			}
			// Amount
			//$scope.SelectedDocumentItem.TranAmountInLC = $scope.SelectedDocumentItem.TranAmount_Org;
			
			// Build the relationship
			$scope.SelectedDocumentItem.buildRelationship($rootScope.arFinanceAccount,
				$rootScope.arFinanceControlCenter,
				$rootScope.arFinanceOrder,
				$rootScope.arFinanceTransactionType
				);

			// Next item ID
			if ($scope.SelectedDocumentItem.ItemID === -1) {
				$scope.updateNextItemID();
				$scope.SelectedDocumentItem.ItemID = $scope.nextItemID;				
				$scope.ItemsCollection.push($scope.SelectedDocumentItem);
			} else {
				// Update the selected one
				// It is updated automatically? Yes, it is!
			}
			
			// New item
			$scope.SelectedDocumentItem = new hih.FinanceDocumentItem();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		$scope.cancelCurrentItem = function() {
			$scope.cleanReportMessages();
			$scope.SelectedDocumentItem = new hih.FinanceDocumentItem();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		
		$scope.submit = function() {
			// Submit the items
			$scope.DocumentObject.Items = [];
			for(var i = 0; i < $scope.ItemsCollection.length; i ++) {
				$scope.DocumentObject.Items.push($scope.ItemsCollection[i]);
			}
			
			// Document type - change string to integer
			$scope.DocumentObject.DocTypeID = parseInt($scope.DocumentObject.DocTypeID);
			// Currency - bind
			var rptMsgs = $scope.DocumentObject.Verify($translate, $rootScope.objFinanceSetting.LocalCurrency);
			if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
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
			var strJSON = JSON && JSON.stringify($scope.DocumentObject) || $.toJSON($scope.DocumentObject);
			if (strJSON) {
				if ($scope.DocumentObject.DocID === -1) {
					utils.createFinanceDocumentQ(strJSON)
						.then(function(response) {
							// Take a look at the response
							if (response) {
								$scope.DocumentObject.buildRelationship(
									$rootScope.arFinanceDocumentType,
									$rootScope.arCurrency
								);
								// Document ID
								$scope.DocumentObject.DocID = parseInt(response);
								$rootScope.arFinanceDocument.push($scope.DocumentObject);
								// Now navigate to display
								$state.go("home.finance.document.display",  { docid : response });
							}
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				}
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.document.list");
		};
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
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'comment', field:'Comment', displayName: 'Common.Comment', headerCellFilter: "translate", width: 150 },
			{ name: 'edit', field:'RuleID', displayName: 'Common.Edit', headerCellFilter: "translate",  width: 240,
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
			// ToDo: delete the settlement rule
		};
		
		$scope.saveCurrentItem = function() {
			$scope.cleanReportMessages();
			
			// Control center
			if ($scope.SelectedRuleObject.ControlCenterObject.selected) {
				$scope.SelectedRuleObject.ControlCenterID = $scope.SelectedRuleObject.ControlCenterObject.selected.ID; 
				//$scope.SelectedRuleObject.ControlCenterObject = $scope.SelectedRuleObject.ControlCenterObject.selected;
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
			var strJSON = JSON && JSON.stringify($scope.OrderObject) || $.toJSON($scope.OrderObject);
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
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "To-Do: reason");
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.order.list");
		};				
	}])

	.controller("FinanceReportBSController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, uiGridConstants, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;
		
		// The class sevice for Balance sheet
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'dataReport';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'acntname', field: 'AccountObject.Name', displayName: 'Finance.Account', headerCellFilter: "translate", width:150 },
	    	{ name:'dbtbalance', field: 'DebitBalance', displayName: 'Finance.Incoming', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'cdtbalance', field: 'CreditBalance', displayName: 'Finance.Outgoing', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'balance', field: 'Balance', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum }
		];

		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.AccountID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.AccountID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.dataReport = [];
		var promise1 = utils.loadFinanceAccountsQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2)
			.then(function(response) {
				utils.loadFinanceReportBSQ()
					.then(function(response2) {
						$scope.dataReport = $rootScope.arFinanceReportBS;
					}, function(reason2) {
						$rootScope.$broadcast("ShowMessage", "Error", reason2);
					});
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])
	
	.controller("FinanceReportTTController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, uiGridConstants, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;

		// The class sevice for Balance sheet
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'dataReport';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		//$scope.gridOptions.showGridFooter = true;
		//$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'ttname', field: 'Name', displayName: 'Finance.TransactionType', headerCellFilter: "translate", width:150 },
	    	{ name:'ttepx', field: 'ExpenseFlag', displayName: 'Finance.ExpenseFlag', headerCellFilter: "translate", width:50 },
			{ name:'tranamount', field: 'TranAmount', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180  }
		];

		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.TranTypeID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.TranTypeID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.dataReport = [];
		$scope.ValidFromDate = new Date();
		$scope.ValidToDate = new Date();

        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = "yyyy-MM-dd";
		$scope.dateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openValidfromDate = function ($event) {			
		    $event.preventDefault();
		    $event.stopPropagation();

	        $scope.isValidfromDateOpened = true;				
		};
		$scope.openValidtoDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

	        $scope.isValidtoDateOpened = true;				
		};
		
		var promise1 = utils.loadFinanceTransactionTypesQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2).
			then(function(response) {
				utils.loadFinanceReportTranTypeQ('19900101', '99991231')
					.then(function(response) {
						$scope.displayTTReport();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
		
		$scope.submit = function() {
			var vfrmdate = hih.ModelUtility.DatabaseDateFormatter($scope.ValidFromDate);
			var vtodate = hih.ModelUtility.DatabaseDateFormatter($scope.ValidToDate);
			
			utils.loadFinanceReportTranTypeQ(vfrmdate, vtodate)
				.then(function(response) {
					$scope.displayTTReport();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		};
		
		$scope.displayTTReport = function() {
			$scope.dataReport = [];
			
			if ($.isArray($rootScope.arFinanceReportTT) && $rootScope.arFinanceReportTT.length > 0) {
				$.each($rootScope.arFinanceReportTT, function(idx, obj) {
					var dataentry = {};
					if (obj.TranTypeObject) {
						dataentry.Name = obj.TranTypeObject.FullDisplayName;
						dataentry.ExpenseFlag = obj.TranTypeObject.ExpenseFlag;
						if (dataentry.ExpenseFlag) {
							dataentry.TranAmount = obj.TranAmount * -1;
						} else {
							dataentry.TranAmount = obj.TranAmount;
						}						
					}
					$scope.dataReport.push(dataentry);
				});
				
				$scope.dataReport.sort(function(a, b) {
					if (a.ExpenseFlag !== b.ExpenseFlag) {
						if (a.ExpenseFlag) return -1;
						return 1;
					}
											
					return a.Name.localeCompare(b.Name);
				});
			}
			//$scope.dataReport = $rootScope.arFinanceReportTT;
			
			
			// $scope.labelsCC = [];
			// $scope.dataCC = [];
			// var arData = [];
			// if ($.isArray($scope.dataReport) && $scope.dataReport.length > 0) {
			// 	$.each($scope.dataReport, function(idx, obj) {
			// 		$scope.labelsCC.push(obj.ControlCenterObject.Name);
			// 		if (obj.TranAmount && !isNaN(obj.TranAmount)) {
			// 			arData.push(obj.TranAmount);						
			// 		} else {
			// 			arData.push(0.0);
			// 		}
			// 	});
			// 	
			// 	$scope.dataCC.push(arData);
			// }
		};
	}])
	
	.controller("FinanceReportCCController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, uiGridConstants, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;

		// The class sevice for Balance sheet
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'dataReport';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'ccname', field: 'ControlCenterObject.Name', displayName: 'Finance.ControlCenter', headerCellFilter: "translate", width:150 },
			{ name:'dbamt', field: 'TranDebitAmount', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'ctamt', field: 'TranCreditAmount', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum },
			{ name:'balance', field: 'TranAmount', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum }
		];

		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.ControlCenterID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.ControlCenterID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.dataReport = [];
		$scope.ValidFromDate = new Date();
		$scope.ValidToDate = new Date();

        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = "yyyy-MM-dd";
		$scope.dateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openValidfromDate = function ($event) {			
		    $event.preventDefault();
		    $event.stopPropagation();

	        $scope.isValidfromDateOpened = true;				
		};
		$scope.openValidtoDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

	        $scope.isValidtoDateOpened = true;				
		};
		
		var promise1 = utils.loadFinanceControlCentersQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2).
			then(function(response) {
				utils.loadFinanceReportControlCenterQ('19900101', '99991231')
					.then(function(response) {
						$scope.displayCCReport();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
		
		$scope.submit = function() {
			var vfrmdate = hih.ModelUtility.DatabaseDateFormatter($scope.ValidFromDate);
			var vtodate = hih.ModelUtility.DatabaseDateFormatter($scope.ValidToDate);
			
			utils.loadFinanceReportControlCenterQ(vfrmdate, vtodate)
				.then(function(response) {
					$scope.displayCCReport();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		};
		
		$scope.displayCCReport = function() {
			
			$scope.dataReport = [];
			if ($.isArray($rootScope.arFinanceReportCC) && $rootScope.arFinanceReportCC.length > 0) {
				$scope.dataReport = angular.copy($rootScope.arFinanceReportCC);
			}
			$scope.$apply();
			
			// For chart
			$scope.labelsCC = [];
			$scope.dataCC = [];
			var arData = [];
			if ($.isArray($scope.dataReport) && $scope.dataReport.length > 0) {
				$.each($scope.dataReport, function(idx, obj) {
					$scope.labelsCC.push(obj.ControlCenterObject.Name);
					if (obj.TranAmount && !isNaN(obj.TranAmount)) {
						arData.push(obj.TranAmount);						
					} else {
						arData.push(0.0);
					}
				});
				
				$scope.dataCC.push(arData);
			}
		};
	}])
	
	.controller("FinanceReportOrderController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'uiGridConstants', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, uiGridConstants, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;

		// The class sevice for Balance sheet
		$scope.gridOptions = {};
		$scope.gridOptions.data = 'dataReport';
		$scope.gridOptions.enableSorting = true;
		$scope.gridOptions.enableColumnResizing = true;
		$scope.gridOptions.enableFiltering = true;
		$scope.gridOptions.enableGridMenu = false;
		$scope.gridOptions.enableColumnMenus = false;
		$scope.gridOptions.showGridFooter = true;
		$scope.gridOptions.showColumnFooter = true;
		
		$scope.gridOptions.columnDefs = [
	    	{ name:'ordername', field: 'OrderObject.Name', displayName: 'Finance.Order', headerCellFilter: "translate", width:150 },
	    	{ name:'ordvalfrm', field: 'OrderObject.ValidFrom', displayName: 'Common.ValidFrom', headerCellFilter: "translate", width:100 },
	    	{ name:'ordvalto', field: 'OrderObject.ValidTo', displayName: 'Common.ValidTo', headerCellFilter: "translate", width:100 },
			{ name:'balance', field: 'Balance', displayName: 'Finance.Balance', headerCellFilter: "translate", width:180,
				cellClass: 'amountcell', aggregationType:uiGridConstants.aggregationTypes.sum }
		];

		$scope.gridOptions.rowIdentity = function(row) {
		 	return row.AccountID;
		};
		$scope.gridOptions.getRowIdentity = function(row) {
		 	return row.AccountID;
		};			
		$scope.gridOptions.onRegisterApi = function(gridApi) {
  			$scope.gridApi = gridApi;
		};
		
		$scope.dataReport = [];
		var promise1 = utils.loadFinanceOrderQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2)
			.then(function(response) {
				utils.loadFinanceReportOrderQ()
					.then(function(response2) {
						$scope.dataReport = $rootScope.arFinanceReportOrder;
					}, function(reason2) {
						$rootScope.$broadcast("ShowMessage", "Error", reason2);
					});
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
	}])
	;
}()
);

