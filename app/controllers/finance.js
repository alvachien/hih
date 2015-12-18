/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';

	angular.module('hihApp.Finance', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 
		'ngSanitize', 'ngTouch', 'selectize', 'chart.js', 'smart-table'])
	    
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state("home.finance", {
            url: "/finance",
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state("home.finance.setting", {
        	url: "/setting",
        	templateUrl: 'app/views/finance/financesetting.html',
        	controller: 'FinanceSettingController'
        })
        .state("home.finance.exgratelist", {
        	url: "/exgratelist",
        	templateUrl: 'app/views/finance/financeexgratelist.html',
        	controller: 'FinanceExchangeRateListController'
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
        .state("home.finance.document.hierarchy", {
        	url: "/hierarchy",
        	templateUrl: 'app/views/finance/financedocumenthier.html',
        	controller: 'FinanceDocumentHierarchyController'
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
		.state("home.finance.document.dptmpdoc_post", {
			url: '/downpaytmpdoc_post/:docid',
			templateUrl: 'app/views/finance/financedpdoc_post.html',
			controller: 'FinanceDocumentDownPayTmpPostController'
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
        .state("home.finance.document.display_downpay", {
        	url: '/display_downpay/:docid',
        	templateUrl: 'app/views/finance/financedocument_downpay.html',
        	controller: 'FinanceDocumentDownPayController'
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
	
	.controller('FinanceSettingController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
			$scope.displayedCollection = [];
			
			if ($rootScope.objFinanceSetting) {
				// Local currency
				$scope.displayedCollection.push({
					"Name": $rootScope.objFinanceSetting.LocalCurrencyComment,
					"Value": $rootScope.objFinanceSetting.LocalCurrency
				});
				$scope.displayedCollection.push({
					"Name": $rootScope.objFinanceSetting.CurrencyExchangeToilenceComment,
					"Value": $rootScope.objFinanceSetting.CurrencyExchangeToilence
				});
			}
		}])		
		
	.controller('FinanceExchangeRateListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
		utils.loadFinanceExchangeRateInfoQ()
			.then(function(response) {
				if ($.isArray($rootScope.arFinanceExchangeRate) && $rootScope.arFinanceExchangeRate.length > 0) {
					
				}
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
			
		$scope.displayDoc = function(row) {
			$state.go("home.finance.document.display",  { docid : row.ID });
		};
		}])
		
	.controller('FinanceAccountListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
		$scope.dispList = [].concat($rootScope.arFinanceAccount);

	    var promise1 = utils.loadCurrenciesQ();
	    var promise2 = utils.loadFinanceAccountCategoriesQ();	  
	    $q.all([promise1, promise2])
	  	    .then(function(response) {
			    utils.loadFinanceAccountsQ()
			  	    .then(function(response2) {
						  // Do nothing...
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
			var nAccntID = 0;
			if (row) {
				nAccntID = row.ID;
			} else {
				for(var i = 0; i < $scope.dispList.length; i ++) {
					if ($scope.dispList[i].isSelected) {
						nAccntID = $scope.dispList[i].ID;
						break;
					}
				}
				if (0 === nAccntID) {
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
			}
			
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
				utils.deleteFinanceAccountQ(nAccntID)
					.then(function(response) {
						
						// Just refresh it!
						$scope.refreshList();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			});
	    };
	    
	    // Display
	    $scope.displayItem = function (row) {
			var nAccntID = 0;
			if (row) {
				nAccntID = row.ID;
			} else {
				for(var i = 0; i < $scope.dispList.length; i ++) {
					if ($scope.dispList[i].isSelected) {
						nAccntID = $scope.dispList[i].ID;
						break;
					}
				}
			}
			
	    	$state.go("home.finance.account.display",  { accountid : nAccntID });
	    };
		
	    // Edit
	    $scope.editItem = function (row) {
			var nAccntID = 0;
			if (row) {
				nAccntID = row.ID;
			} else {
				for(var i = 0; i < $scope.dispList.length; i ++) {
					if ($scope.dispList[i].isSelected) {
						nAccntID = $scope.dispList[i].ID;
						break;
					}
				}
			}
			
		    $state.go("home.finance.account.maintain",  { accountid : nAccntID });
	    };
		
	    // Create
	    $scope.newItem = function() {
	        $state.go('home.finance.account.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceAccountsQ(true)
			    .then(function(response2) {
					// Do nothing!
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
                     	name: 'default',
    					url: "//cdn.bootcss.com/jstree/3.2.1/themes/default/style.min.css",
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
		$scope.ActivityID = hih.Constants.UIMode_Create;
		
		$scope.AccountObject = new hih.FinanceAccount();
		$scope.ShowDownpaymentInfo = false;
		$scope.DPAccountInfo = null;
		$scope.DPTmpDoc = [];
		$scope.SafeDPTmpDoc = [];
		
		// Messages
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};

        if (angular.isDefined($stateParams.accountid)) {
			if ($state.current.name === "home.finance.account.maintain") {
			    $scope.Activity = "Common.Edit";
				$scope.ActivityID = hih.Constants.UIMode_Change;
			} else if ($state.current.name === "home.finance.account.display") {
				$scope.Activity = "Common.Display";
				$scope.ActivityID = hih.Constants.UIMode_Display;
			}
			
			var nAcntID = parseInt($stateParams.accountid);
			$.each($rootScope.arFinanceAccount, function (idx, obj) {				
				if (obj.ID === nAcntID) {
					$scope.AccountObject = angular.copy(obj);
					
					if ($scope.AccountObject && $scope.AccountObject.CategoryObject
						&& ( $scope.AccountObject.CategoryObject.AssetFlag === hih.Constants.AccountCategoryAssetFlag_DownpayOut
						|| $scope.AccountObject.CategoryObject.AssetFlag === hih.Constants.AccountCategoryAssetFlag_DownpayIn) ) {
						// Read the info out
						utils.loadFinanceAccountDPInfoQ(nAcntID)
							.then(function(response){								
								$scope.ShowDownpaymentInfo = true;
								
								// Downpayment info
								$scope.DPAccountInfo = response[0];
								if ($.isArray(response[1]) && response[1].length > 0) {
									$.each(response[1], function(idx3, obj3) {
										$scope.DPTmpDoc.push(obj3);
									})
								}								
							}, function(reason){
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							})
					}
					return false;
				}
			});
		} else {
			$scope.Activity = "Common.Create";
			$scope.ActivityID = hih.Constants.UIMode_Create;
		}
		 
		$scope.submit = function() {
			$scope.cleanReportMessages();
			
			// String => Integer
			$scope.AccountObject.CategoryID = parseInt($scope.AccountObject.CategoryID);
			 
			var errMsgs = $scope.AccountObject.Verify($translate);
			if (errMsgs && errMsgs.length > 0) {
				$q.all(errMsgs).then(function (translations) {
					Array.prototype.push.call($scope.ReportedMessages, translations);
  				}, function(reason) {
					  $rootScope.$broadcast("ShowMessage", "Error", reason);
				  });				
				return;
			}
			
			// Now submit to the server side
			var strJSON = JSON && JSON.stringify($scope.AccountObject) || $.toJSON($scope.AccountObject);
			if (strJSON) {
				if (this.ActivityID === hih.Constants.UIMode_Create) {
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
				} else if (this.ActivityID === hih.Constants.UIMode_Change) {
					utils.changeFinanceAccountQ($scope.AccountObject)
						.then(function(response) {
							// First of all, update the rootScope
							if (response) {
								$state.go("home.finance.account.display",  { accountid : $scope.AccountObject.ID });
							} else {
								$state.go("home.finance.account.list");
							}
						}, function(reason) {
							// Failed, throw out error message
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});					
				}
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "To-Do: reason");
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.account.list");
		};
	}])	
	
	.controller('FinanceDocumentListController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
			
		$scope.docCollection = [].concat($rootScope.arFinaneDocument);
		
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
							// Do nothing
						}, function(reason3) {
							$rootScope.$broadcast("ShowMessage", "Error", reason3);
						});
				}, function(reason2) {
					$rootScope.$broadcast("ShowMessage", "Error", reason2);
				})
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			var nDocID = 0;
			if (row) {
				nDocID = row.DocID;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						nDocID = $scope.docCollection[i].DocID;
						break;
					}
				}
				if (0 === nDocID) {
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
			}
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
				utils.deleteFinanceDocumentQ(nDocID)
					.then(function(response) {
						// Just refresh it!
						$scope.refreshList();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			});
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			var ralrow = null;
			
			if (row) {
				ralrow = row;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						ralrow = $scope.docCollection[i];
						break;
					}
				}
			}
			
			if (ralrow.DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.display_tran",  { docid : ralrow.DocID });	
			} else if(ralrow.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.display_currexg",  { docid : ralrow.DocID });
			} else {
		    	$state.go("home.finance.document.display",  { docid : ralrow.DocID });
			}
		};
		
		// Edit
		$scope.editItem = function (row) {
			var ralrow = null;
			
			if (row) {
				ralrow = row;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						ralrow = $scope.docCollection[i];
						break;
					}
				}
			}
			
			if (ralrow.DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.maintain_tran",  { docid : ralrow.DocID });	
			} else if(ralrow.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.maintain_currexg",  { docid : ralrow.DocID });
			} else {
		    	$state.go("home.finance.document.maintain",  { docid : ralrow.DocID });
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
						
						// Force it refresh!
						$scope.$apply();
					};
				}, function(reason2) {
				    // Error occurred
				    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])

	.controller('FinanceDocumentHierarchyController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
	    function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {

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
						//name: 'default-dark',
						//url: "//cdn.bootcss.com/jstree/3.2.1/themes/default-dark/style.min.css",
						//responsive: true,
						//stripes: true,
						//variant : "large"
						name: 'default',
						url: "//cdn.bootcss.com/jstree/3.2.1/themes/default/style.min.css",
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
		
		$scope.docitemCollection = [];
		$scope.safedocitemColl = [];
		
		$scope.onTreeNodeChanged = function(e, data) {
			$scope.docitemCollection = [];
			
			if (data.selected.length > 0) {
				var typ = data.instance.get_node(data.selected[0]).type;
				var id = data.instance.get_node(data.selected[0]).id;
				if (typ === "Account") {
					utils.loadFinanceDocumentItemsByAccountQ(id.substring(4))
						.then(function(response) {
							$scope.safedocitemColl = [].concat($rootScope.arFinanceDocumentItemByAccount);
							$scope.docitemCollection = [].concat($rootScope.arFinanceDocumentItemByAccount);
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				} else if (typ === "Category") {
					utils.loadFinanceDocumentItemsByCategoryQ(id.substring(4))
						.then(function(response) {
							$scope.safedocitemColl = [].concat($rootScope.arFinanceDocumentItemByAccount);
							$scope.docitemCollection = [].concat($rootScope.arFinanceDocumentItemByAccount);
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				} else if (typ === "Journey") {
					//id.substring()
				}
			}
			var i, j, r = [];
    		for(i = 0, j = data.selected.length; i < j; i++) {
      			r.push(data.instance.get_node(data.selected[i]).text);
    		}
			
			$log.info("HIH DocumentHierarchyView, Selected Nodes:" + r.join(', '));
		};
	
		var promise1 = utils.loadCurrenciesQ();
		var promise2 = utils.loadFinanceTransactionTypesQ();
		var promise3 = utils.loadFinanceAccountCategoriesQ();
		var promise4 = utils.loadFinanceDocumentTypesQ();
		var promise10 = utils.loadFinanceControlCentersQ();
		var promise11 = utils.loadFinanceOrderQ();
		//var promise12 = utils.loadFinanceAccountHierarchyQ();
		$q.all(promise1, promise2, promise3, promise4, promise10, promise11)
			.then(function(response) {
				utils.loadFinanceAccountsQ().then(function(response2) {
					utils.loadFinanceAccountHierarchyQ()
						.then(function(response3) {
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
						}, function(reason3) {
							$rootScope.$broadcast("ShowMessage", "Error", reason3);
						});
				}, function(reason2) {
					$rootScope.$broadcast("ShowMessage", "Error", reason2);
				})
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			var nDocID = 0;
			if (row) {
				nDocID = row.DocID;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						nDocID = $scope.docCollection[i].DocID;
						break;
					}
				}
				if ( 0 === nDocID ) {
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
			}
			
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', function() {
				utils.deleteFinanceDocumentQ(nDocID)
					.then(function(response) {
						// Just refresh it!
						$scope.refreshList();
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			});
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			var ralrow = null;
			
			if (row) {
				ralrow = row;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						ralrow = $scope.docCollection[i];
						break;
					}
				}
			}
			
			if (ralrow.DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.display_tran",  { docid : ralrow.DocID });	
			} else if(ralrow.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.display_currexg",  { docid : ralrow.DocID });
			} else {
		    	$state.go("home.finance.document.display",  { docid : ralrow.DocID });
			}
		};
		
		// Edit
		$scope.editItem = function (row) {
			var ralrow = null;
			
			if (row) {
				ralrow = row;
			} else {
				for(var i = 0; i < $scope.docCollection.length; i ++) {
					if ($scope.docCollection[i].isSelected) {
						ralrow = $scope.docCollection[i];
						break;
					}
				}
			}
			
			if (ralrow.DocTypeID === hih.Constants.FinDocType_Transfer) {
				$state.go("home.finance.document.maintain_tran",  { docid : ralrow.DocID });	
			} else if(ralrow.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
				$state.go("home.finance.document.maintain_currexg",  { docid : ralrow.DocID });
			} else {
		    	$state.go("home.finance.document.maintain",  { docid : ralrow.DocID });
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
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
			var rptMsgs = $scope.DocumentObject.Verify($translate, $rootScope.objFinanceSetting.LocalCurrency,
				$rootScope.objFinanceSetting.CurrencyExchangeToilence);
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
								if (!$rootScope.arFinanceDocument) {
									$rootScope.arFinanceDocument = [];
								}
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
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
		// This class serviced for the creation/display/maintenance of Down payment document
		$scope.Activity = "";
		$scope.isReadonly = false;
		
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};

		$scope.DocumentObject = new hih.FinanceDocument();
		$scope.TranCurrencyIsLocal = true;
		$scope.DownpaymentType = "1";
		$scope.SourceAccountID = -1;
		$scope.SourceCCID = -1;
		$scope.SourceOrderID = -1;
		$scope.SourceTranTypeID = -1;
		$scope.AccountRepeatTypeString = "0";
		
		$scope.AccountObject = new hih.FinanceAccountDownpayment();
		$scope.DPItems = [];
		$scope.safeItemList = [];
		$scope.selectedDPItem = new hih.FinanceDPTempDoc();
		
		// Currency select control
		$scope.currConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentDownPayController, Currency control, event onChange, ', value);
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
		$scope.srcaccountConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentDownPayController, Account control, event onChange, ', value);
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
		$scope.srctrantypeConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentDownPayController, Tran. Type control, event onChange, ', value);
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
		$scope.srcccConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentDownPayController, Control Center control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		// Order select control
		$scope.srcorderConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceDocumentDownPayController, Order control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1,
    		required: true
  		};
		 
        // For date control
		$scope.isDateOpened = false;
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
		// Start date
		$scope.isStartDateOpened = false;
		$scope.startDateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openStartDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isStartDateOpened = true;				
			}
		};
		// End date
		$scope.isEndDateOpened = false;
		$scope.endDateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openEndDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isEndDateOpened = true;				
			}
		};
		// Item date
		$scope.isItemDateOpened = false;
		$scope.itemDateOptions = {
		    formatYear: 'yyyy',
		    startingDay: 1
		};
		$scope.openItemDate = function ($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

		    if (!$scope.isReadonly) {
		        $scope.isItemDateOpened = true;				
			}
		};
		
		if (angular.isDefined($stateParams.docid)) {
			if ($state.current.name === "home.finance.document.maintain_downpay") {
				$scope.Activity = "Common.Edit";
			} else if ($state.current.name === "home.finance.document.display_downpay") {
				$scope.Activity = "Common.Display";
				$scope.isReadonly = true;
			}
		} else {
			// Set the default currency to local currency
			$scope.DocumentObject.TranCurrency = $rootScope.objFinanceSetting.LocalCurrency;
			$scope.DocumentObject.DocTypeID = hih.Constants.FinDocType_Downpay;
			$scope.TranCurrencyIsLocal = true;

		    $scope.Activity = "Common.Create";
		}
		
		$scope.genItems = function() {
			$scope.DPItems = [];
			
			var nType = parseInt($scope.AccountRepeatTypeString);
			var ndays = hih.ModelUtility.DaysBetween($scope.AccountObject.StartDate, $scope.AccountObject.EndDate);
			var ntimes = 0;
			var i = 0;
			var arDays = [];
			
			switch(nType) {
				case hih.Constants.DownpayRepeatType_PerMonth:
					ntimes = Math.floor(ndays / 30);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate());
						nDate.setMonth(nDate.getMonth() + i);
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownpayRepeatType_PerFortnight:
					ntimes = Math.floor(ndays / 14);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate() + 14 * i);
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownpayRepeatType_PerWeek:
					ntimes = Math.floor(ndays / 7);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate() + 7 * i);
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownpayRepeatType_PerDay:
					ntimes = ndays;
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate() + i);
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownpayRepeatType_PerQuarter:
					ntimes = Math.floor(ndays / 91);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate());
						nDate.setMonth(nDate.getMonth() + 3 * (i + 1));
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownPayRepeatType_PerHalfYear:
					ntimes = Math.floor(ndays / 182);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate());
						nDate.setMonth(nDate.getMonth() + 6 * (i + 1));
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownPayRepeatType_PerYear:
					ntimes = Math.floor(ndays / 365);
					for(i = 0; i < ntimes; i ++) {
						var nDate = new Date();
						nDate.setDate($scope.AccountObject.StartDate.getDate());
						nDate.setYear(nDate.getYear() + i);
						arDays.push(nDate);
					}
				break;
				
				case hih.Constants.DownRayRepeatType_Manual:
					ntimes = 0;
				break;
				
				others:
				break;
			}
			for(i = 0; i < ntimes; i ++) {
				var item = new hih.FinanceDPTempDoc();
				item.DocID = i + 1;
				item.TranDate = arDays[i];
				item.Amount = $scope.DocumentObject.TranAmount / ntimes;
				$scope.DPItems.push(item);
			}
			
			if (ntimes === 0) {
				item = new hih.FinanceDPTempDoc();
				item.DocID = 1;
				item.TranDate = $scope.AccountObject.StartDate;
				item.Amount = $scope.DocumentObject.TranAmount / ntimes;
				$scope.DPItems.push(item);				
			}
			
			$scope.updateNextItemID();
			$scope.selectedDPItem = new hih.FinanceDPTempDoc();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		
		$scope.nextItemID = 0;
		$scope.updateNextItemID = function () {
			if (angular.isArray($scope.DPItems) && $scope.DPItems.length > 0) {
				$scope.nextItemID = 0;
				
				$.each($scope.DPItems, function (idx, obj) {
	                var nItemID = parseInt(obj.DocID);
						
					if ($scope.nextItemID < nItemID) {
						$scope.nextItemID = nItemID;
		            }
		        });
				
				$scope.nextItemID++;
			} else {
				$scope.nextItemID = 1;
			}
		};
		$scope.displayItem = function(itemid) {
			$scope.cleanReportMessages();
			var nID = parseInt(itemid);
			for(var i = 0; i < $scope.DPItems.length; i ++) {
				if ($scope.DPItems[i].DocID === nID) {
					$scope.selectedDPItem = $scope.DPItems[i]; 
					break;
				}
			}

			$scope.ItemActivity = "Finance.DisplayItem";
		};
		$scope.editItem = function(itemid) {
			$scope.cleanReportMessages();
			var nID = parseInt(itemid);
			for(var i = 0; i < $scope.DPItems.length; i ++) {
				if ($scope.DPItems[i].DocID === nID) {
					$scope.selectedDPItem = $scope.DPItems[i]; 
					break;
				}
			}

			$scope.ItemActivity = "Finance.MaintainItem";
		};
		$scope.removeItem = function(itemid) {
			$scope.cleanReportMessages();
			
			// Show confirm dialog
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
				function() {
					var nID = parseInt(itemid);
					if ($scope.selectedDPItem.DocID === nID) {
						$scope.selectedDPItem = new hih.FinanceDPTempDoc();
						$scope.ItemActivity = "Finance.CreateItem";
					}
							
					for(var i = 0; i < $scope.DPItems.length; i ++) {
						if ($scope.DPItems[i].DocID === nID) {
							$scope.DPItems.splice(i, 1);
							break;
						}
					}
					
					$scope.$apply();
			});
		};

		$scope.saveCurrentItem = function() {
			$scope.cleanReportMessages();
			
			// Next item ID
			if ($scope.selectedDPItem.DocID === -1) {
				$scope.updateNextItemID();
				$scope.selectedDPItem.DocID = $scope.nextItemID;				
				$scope.DPItems.push($scope.selectedDPItem);
			} else {
				// Update the selected one
				// It is updated automatically? Yes, it is!
			}
 			
 			// New item
			$scope.selectedDPItem = new hih.FinanceDPTempDoc();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		$scope.cancelCurrentItem = function() {
			$scope.cleanReportMessages();
			
			$scope.selectedDPItem = new hih.FinanceDPTempDoc();
			$scope.ItemActivity = "Finance.CreateItem";
		};
		$scope.submit = function() {
			$scope.cleanReportMessages();
			$scope.genItems();
			
			// Origianl documents & its items
			$scope.DocumentObject.DocTypeID = 5; // Fixed
			$scope.DocumentObject.Items = [];
			var docItem = new hih.FinanceDocumentItem();
			docItem.ItemID = 1;
			docItem.AccountID = $scope.SourceAccountID;
			docItem.TranTypeID = $scope.SourceTranTypeID;
			docItem.TranAmount_Org = $scope.DocumentObject.TranAmount;
			docItem.TranAmount = $scope.DocumentObject.TranAmount;
			docItem.ControlCenterID = $scope.SourceCCID;
			docItem.OrderID = $scope.SourceOrderID;
			docItem.Desp = $scope.DocumentObject.Desp;
			docItem.UseCurrency2 = false;
			$scope.DocumentObject.Items.push(docItem);
			
			// Account
			var objAccount = new hih.FinanceAccount();
			objAccount.Name = $scope.DocumentObject.Desp;
			objAccount.Comment = objAccount.Name;
			if (parseInt($scope.DownpaymentType) === 1)
				objAccount.CategoryID = 8; // Outgoing
			else 
				objAccount.CategoryID = 9;
			
			// Account additional for downpayment
			$scope.AccountObject.RepeatType = parseInt($scope.AccountRepeatTypeString);
			$scope.AccountObject.Direct = parseInt($scope.DownpaymentType);
			// Deducted document for the first posting, really need? Maybe not
			
			// Temp Documents
			$.each($scope.DPItems, function(idx, obj) {
				obj.TranTypeID = $scope.SourceTranTypeID;
				obj.ControlCenterID = $scope.SourceCCID;
				obj.OrderID = $scope.SourceOrderID;
				
				obj.Desp = $scope.DocumentObject.Desp + " | " + (idx + 1).toString() + " / " + $scope.DPItems.length.toString() + " | " + hih.ModelUtility.DateFormatter(obj.TranDate);
			});
			
			var json1 = JSON && JSON.stringify($scope.DocumentObject) || $.toJSON($scope.DocumentObject);
			var json2 = objAccount.toJSON();
			var json3 = $scope.AccountObject.ToJSON();
			var json4 = JSON && JSON.stringify($scope.DPItems) || $.toJSON($scope.DPItems);
			
			utils.createFinanceDPDocumentQ(json1, json2, json3, json4)
				.then(function(response) {
					// Take a look at the response
					if (response) {
						$scope.DocumentObject.buildRelationship(
							$rootScope.arFinanceDocumentType,
							$rootScope.arCurrency
						);
						// Document ID
						$scope.DocumentObject.DocID = parseInt(response);
						if ($rootScope.arFinanceDocument) {								
						} else {
							$rootScope.arFinanceDocument = [];
						}
						$rootScope.arFinanceDocument.push($scope.DocumentObject);
						
						// Now navigate to display
						$state.go("home.finance.document.display",  { docid : response });
					}
				}, function(reason) {
					// Errors
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		};
		$scope.backToList = function() {
		    $state.go("home.finance.document.list");
		};
	}])
	
	.controller('FinanceDocumentDownPayTmpPostController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
			
		// Error messges
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};

		$scope.DocumentObject = new hih.FinanceDocument();
		$scope.DocumentItemObject = new hih.FinanceDocumentItem();
		$scope.AccountIDAndName = "";
		$scope.TranTypeIDAndName = "";
		$scope.CCIDAndName = "";
		$scope.OrderIDAndName = "";
		$scope.DPTmpDocID = -1;
		
        // For date control
		$scope.isDateOpened = false;
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
		    utils.getFinanceDPDocumentQ($stateParams.docid)
				.then(function(response) {
					if ($.isArray(response) && response.length === 1) {
						$scope.DPTmpDocID = parseInt(response[0].docid);
						
						$scope.DocumentObject.TranDate = new Date(response[0].trandate);
						$scope.DocumentObject.TranAmount = parseFloat(response[0].tranamount);
						$scope.DocumentObject.Desp = response[0].desp;
						$scope.DocumentObject.DocTypeID = hih.Constants.FinDocType_Normal;
						$scope.DocumentObject.TranCurrency = response[0].trancurr;
						if (response[0].exgrate) {
							$scope.DocumentObject.ExchangeRate = parseFloat(response[0].exgrate);
						} else {
							$scope.DocumentObject.ExchangeRate = null;
						}
						if (response[0].exgrate_plan) {
							$scope.DocumentObject.ProposedExchangeRate = response[0].exgrate_plan;
						} else {
							$scope.DocumentObject.ProposedExchangeRate = null;
						}
						
						$scope.DocumentItemObject.ItemID = 1;
						$scope.AccountIDAndName = response[0].accountid + " | " + response[0].accountname;
						$scope.DocumentItemObject.AccountID = parseInt(response[0].accountid);
						if (response[0].ccid) {
							$scope.DocumentItemObject.ControlCenterID = parseInt(response[0].ccid);
							$scope.CCIDAndName = response[0].ccid + " | " + response[0].ccname;
						}
						$scope.TranTypeIDAndName = response[0].trantype + " | " + response[0].trantypename;
						$scope.DocumentItemObject.TranTypeID = parseInt(response[0].trantype);
						if (response[0].orderid) {
							$scope.DocumentItemObject.OrderID = parseInt(response[0].orderid);
							$scope.OrderIDAndName = response[0].orderid + " | " + response[0].ordername;
						}
						$scope.DocumentItemObject.UseCurrency2 = false;
					}					
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
		}
		
		$scope.submit = function() {
			// Submit the items
			$scope.DocumentObject.Items = [];
			$scope.DocumentItemObject.TranAmount_Org = $scope.DocumentObject.TranAmount;
			$scope.DocumentItemObject.TranAmount = $scope.DocumentObject.TranAmount;
			$scope.DocumentItemObject.Desp = $scope.DocumentObject.Desp;			
			$scope.DocumentObject.Items.push($scope.DocumentItemObject);
			
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
				utils.createFinanceDocumentFromDPTmpQ(strJSON, $scope.DPTmpDocID)
					.then(function(response) {
						// Take a look at the response
						if (response) {
							$scope.DocumentObject.buildRelationship(
								$rootScope.arFinanceDocumentType,
								$rootScope.arCurrency
							);
							// Document ID
							$scope.DocumentObject.DocID = parseInt(response);
							if ($rootScope.arFinanceDocument) {								
							} else {
								$rootScope.arFinanceDocument = [];
							}
							$rootScope.arFinanceDocument.push($scope.DocumentObject);
							
							// Now navigate to display
							$state.go("home.finance.document.display",  { docid : response });
						}
					}, function(reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			} else {
				$rootScope.$broadcast("ShowMessage", "Error", "Fatal error!");
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.document.list");
		};
	}])
	
	.controller('FinanceDocumentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$log', '$q', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $q, $translate, utils) {
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
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
                     	name: 'default',
    					url: "//cdn.bootcss.com/jstree/3.2.1/themes/default/style.min.css",
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
	  	$scope.ccList = [];
		  
	    utils.loadFinanceControlCentersQ()
			.then(function(response) {
				$scope.ccList = [];
				if (angular.isArray($rootScope.arFinanceControlCenter ) && $rootScope.arFinanceControlCenter.length > 0) {
					$.each($rootScope.arFinanceControlCenter, function(idx, obj) {
						$scope.ccList.push(angular.copy(obj));					
				    });
				}
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});

		// Remove to the real data holder
	    $scope.removeCC = function(row) {
			var nCCID = 0;
			if (row) {
				nCCID = row.ID;
			} else {
				for(var i = 0; i < $scope.ccList.length; i ++) {
					if ($scope.ccList[i].isSelected) {
						nCCID = $scope.ccList[i].ID;
						break;
					}
				}
				if (0 === nCCID) {
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
			}
			utils.deleteControlCenterQ(nCCID)
				.then(function(response) {
					// Just refresh it!
					$scope.refreshList();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
	    };
	    
	    // Display
	    $scope.displayCC = function (row) {
			var nCCID = 0;
			if (row) {
				nCCID = row.ID;
			} else {
				for(var i = 0; i < $scope.ccList.length; i ++) {
					if ($scope.ccList[i].isSelected) {
						nCCID = $scope.ccList[i].ID;
						break;
					}
				}
			}
			$state.go("home.finance.controlcenter.display",  { id : nCCID });
	    };
		
	    // Edit
	    $scope.editCC = function (row) {
			var nCCID = 0;
			if (row) {
				nCCID = row.ID;
			} else {				
				for(var i = 0; i < $scope.ccList.length; i ++) {
					if ($scope.ccList[i].isSelected) {
						nCCID = $scope.ccList[i].ID;
						break;
					}
				}
			}
			$state.go("home.finance.controlcenter.maintain",  { id : nCCID });
	    };
		
	    // Create
	    $scope.newCC = function() {
	        $state.go('home.finance.controlcenter.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceControlCentersQ(true)
			    .then(function(response2) {
					if (angular.isArray($rootScope.arFinanceControlCenter ) && $rootScope.arFinanceControlCenter.length > 0) {
						// Do nothing
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
                     	name: 'default',
    					url: "//cdn.bootcss.com/jstree/3.2.1/themes/default/style.min.css",
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
		$scope.ActivityID = hih.Constants.UIMode_Create;
		$scope.isReadonly = false;
		
		$scope.ControlCenterObject = new hih.FinanceControlCenter();

		// Selective control for control center
		$scope.ccConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceControlCenterController, CC control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1
  		};
		 
        if (angular.isDefined($stateParams.id)) {
			if ($state.current.name === "home.finance.controlcenter.maintain") {
			    $scope.Activity = "Common.Edit";
				$scope.ActivityID = hih.Constants.UIMode_Change;
			} else if ($state.current.name === "home.finance.controlcenter.display") {
				$scope.Activity = "Common.Display";
				$scope.ActivityID = hih.Constants.UIMode_Display;
				$scope.isReadonly = true;
			}
			
			var nCCID = parseInt($stateParams.id);
			$.each($rootScope.arFinanceControlCenter, function (idx, obj) {				
				if (obj.ID === nCCID) {
					$scope.ControlCenterObject = angular.copy(obj);
					return false;
				}
			});
		} else {
			$scope.Activity = "Common.Create";
			$scope.ActivityID = hih.Constants.UIMode_Create;
		}

		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		 
		$scope.submit = function() {
			$scope.cleanReportMessages();
			
			if ($scope.ControlCenterObject.ParentID === -1) {
				$scope.ControlCenterObject.ParentID = 0;
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
			if ($scope.ActivityID === hih.Constants.UIMode_Create) {
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
			}
		};
		
		$scope.close = function() {
		    $state.go("home.finance.controlcenter.list");
		};
	}])
				
	.controller("FinanceOrderListController", ['$scope', '$rootScope', '$state', '$http', '$q', '$translate', '$log', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $translate, $log, utils) {
			
		$scope.orderList = [];
	    utils.loadFinanceOrderQ()
			.then(function(response) {
				// Do nothing
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
		
		// Remove to the real data holder
	    $scope.removeItem = function removeItem(row) {
			var nID = 0;
			if (row) {
				nID = row.ID;
			} else {
				for(var i = 0; i < $scope.orderList.length; i ++) {
					if ($scope.orderList[i].isSelected) {
						nID = $scope.orderList[i].ID;
						break;
					}
				}
				
				if (0 === nID) {
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
			}
			
			utils.deleteFinanceOrderQ(nID)
				.then(function(response) {
					// Just refresh it!
					$scope.refreshList();
				}, function(reason) {
					$rootScope.$broadcast("ShowMessage", "Error", reason);
				});
	    };
	    
	    // Display
	    $scope.displayItem = function (row) {
			var nID = 0;
			if (row) {
				nID = row.ID;
			} else {				
				for(var i = 0; i < $scope.orderList.length; i ++) {
					if ($scope.orderList[i].isSelected) {
						nID = $scope.orderList[i].ID;
						break;
					}
				}
			}
			
	    	$state.go("home.finance.order.display",  { id : nID });
	    };
		
	    // Edit
	    $scope.editItem = function (row) {
			var nID = 0;
			if (row) {
				nID = row.ID;
			} else {				
				for(var i = 0; i < $scope.orderList.length; i ++) {
					if ($scope.orderList[i].isSelected) {
						nID = $scope.orderList[i].ID;
						break;
					}
				}
			}
			
	    	$state.go("home.finance.order.maintain",  { id : nID });
	    };
		
	    // Create
	    $scope.newItem = function() {
	        $state.go('home.finance.order.create');
	    };
		
		// Refresh the list
		$scope.refreshList = function() {
			utils.loadFinanceOrderQ(true)
			    .then(function(response) {
					// Do nothing
				}, function(reason2) {
				    // Error occurred
				    $rootScope.$broadcast("ShowMessage", "Error", reason2);
				});
		};
	}])

	.controller("FinanceOrderController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
		$scope.Activity = "";
		$scope.ActivityID = hih.Constants.UIMode_Create;
		$scope.isReadonly = false;
		
		$scope.showhdr = true; // Default value
		
		$scope.ItemActivity = "Finance.CreateRule";
		$scope.OrderObject = new hih.FinanceOrder();
		$scope.RuleObjects = [];
		$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
		
		$scope.ReportedMessages = [];
		$scope.cleanReportMessages = function() {
			$scope.ReportedMessages = [];
		};
		
		// Selective control for control center
		$scope.ccConfig = {
			create: false,
			onChange: function(value){
      			$log.info('FinanceOrderController, CC control, event onChange, ', value);
    		},
			valueField: 'ID',
			labelField: 'Name',
		    maxItems: 1
  		};
		
	    utils.loadFinanceControlCentersQ().
			then(function(response) {
				$scope.AllCostCenter = $rootScope.arFinanceControlCenter;
				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.finance.order.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.finance.order.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
						$scope.isReadonly = true;
					}
			
					var nOrdID = parseInt($stateParams.id);
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
				} else {
					$scope.Activity = "Common.Create";
					$scope.ActivityID = hih.Constants.UIMode_Create;
				}
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
 		$scope.displayedCollection = [].concat($scope.RuleObjects);
		
        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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

		$scope.displayItem = function(row) {
			$scope.cleanReportMessages();
			$scope.SelectedRuleObject = row;
			$scope.ItemActivity = "Finance.DisplayRule";
		};
		
		$scope.editItem = function(row) {
			$scope.cleanReportMessages();
			$scope.SelectedRuleObject = row;
			$scope.ItemActivity = "Finance.EditRule";
		};
		
		$scope.removeItem = function(row) {
			$scope.cleanReportMessages();
			
			$rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
				function() {
					if ($scope.SelectedRuleObject.RuleID === row.RuleID) {
						$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
						$scope.ItemActivity = "Finance.CreateRule";
					}
									
					for(var i = 0; i < $scope.RuleObjects.length; i ++) {
						if ($scope.RuleObjects[i].ItemID === row.RuleID) {
							$scope.RuleObjects.splice(i, 1);
							break;
						}
					}
				});
		};
		
		$scope.saveCurrentItem = function() {
			$scope.cleanReportMessages();
			
			// String to integer
			$scope.SelectedRuleObject.ControlCenterID = parseInt($scope.SelectedRuleObject.ControlCenterID);
			
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
			
			$scope.SelectedRuleObject.buildRelationship($rootScope.arFinanceControlCenter);
			
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
			$scope.ItemActivity = "Finance.CreateRule";
		};
		$scope.cancelCurrentItem = function() {
			$scope.cleanReportMessages();
			
			$scope.SelectedRuleObject = new hih.FinanceOrderSettlementRule();
			$scope.ItemActivity = "Finance.CreateRule";
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
				if ($scope.ActivityID === hih.Constants.UIMode_Create) {
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

	.controller("FinanceReportBSController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;
		
		$scope.dataReport = [];
		$scope.dataIncoming = [];
		$scope.dataOutgoing = [];
		$scope.labelsIncoming = [];
		$scope.labelsOutgoing = [];
		$scope.rptCollection = [].concat($rootScope.arFinanceReportBS);
		
		var promise1 = utils.loadFinanceAccountsQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2)
			.then(function(response) {
				utils.loadFinanceReportBSQ()
					.then(function(response2) {						
						$scope.displayBSContent();
					}, function(reason2) {
						$rootScope.$broadcast("ShowMessage", "Error", reason2);
					});
			}, function(reason) {
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
			
		$scope.displayBSContent = function() {
			$scope.dataReport = [];
			$scope.dataIncoming = [];
			$scope.dataOutgoing = [];
			$scope.labelsIncoming = [];
			$scope.labelsOutgoing = [];
			
			if ($.isArray($rootScope.arFinanceReportBS) && $rootScope.arFinanceReportBS.length > 0) {
				$.each($rootScope.arFinanceReportBS, function(idx, obj) {
					$scope.dataReport.push(angular.copy(obj));
					
					$scope.dataIncoming.push(obj.DebitBalance);
					$scope.dataOutgoing.push(obj.CreditBalance);
					$scope.labelsIncoming.push(obj.AccountObject.Name);
					$scope.labelsOutgoing.push(obj.AccountObject.Name);
				});
			}
			//$scope.dataReport = $rootScope.arFinanceReportBS;			
		};
	}])
	
	.controller("FinanceReportTTController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;
		
		// Chart incoming
		$scope.dataChartIncoming = [];
		$scope.labelsChartIncoming = [];
		// Chart outgoing
		$scope.dataChartOutgoing = [];
		$scope.labelsChartOutgoing = [];
		// Filter
		$scope.ValidFromDate = new Date();
		$scope.ValidToDate = new Date();

        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
			$scope.rptInCollection = [].concat($rootScope.dataReportIncoming);
			$scope.rptOutCollection = [].concat($rootScope.dataReportOutgoing);
			$scope.dataReportIncoming = [];
			$scope.dataReportOutgoing = [];
			$scope.dataChartOutgoing = [];
			$scope.labelsChartOutgoing = [];
			$scope.dataChartOutgoing = [];
			$scope.labelsChartOutgoing = [];
			
			if ($.isArray($rootScope.arFinanceReportTT) && $rootScope.arFinanceReportTT.length > 0) {
				$.each($rootScope.arFinanceReportTT, function(idx, obj) {
					
					if (obj.TranAmount > 0.0) {
						var dataentry = {};
						if (obj.TranTypeObject) {
							dataentry.Name = obj.TranTypeObject.FullDisplayName;
							dataentry.ExpenseFlag = obj.TranTypeObject.ExpenseFlag;
							if (dataentry.ExpenseFlag) {							
								dataentry.TranAmount = obj.TranAmount;
								
								$scope.dataReportOutgoing.push(dataentry);
								$scope.dataChartOutgoing.push(dataentry.TranAmount);
								$scope.labelsChartOutgoing.push(dataentry.Name);
							} else {
								dataentry.TranAmount = obj.TranAmount;
								
								$scope.dataReportIncoming.push(dataentry);
								$scope.dataChartIncoming.push(dataentry.TranAmount);
								$scope.labelsChartIncoming.push(dataentry.Name);
							}		
						}						
					}
				});
				
				if ($.isArray($scope.dataReportIncoming) && $scope.dataReportIncoming.length > 0) {
					$scope.dataReportIncoming.sort(function(a, b) {
						return a.Name.localeCompare(b.Name);
					});					
				}
				if ($.isArray($scope.dataReportOutgoing) && $scope.dataReportOutgoing.length > 0) {
					$scope.dataReportOutgoing.sort(function(a, b) {
						return a.Name.localeCompare(b.Name);
					});
				}
			}
		};
	}])
	
	.controller("FinanceReportCCController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;

		// Chart option
		$scope.optionsCC = {
			scaleBeginAtZero : true
		};
		$scope.dataReport = [];
		$scope.ValidFromDate = new Date();
		$scope.ValidToDate = new Date();

        // For date control
		$scope.isValidfromDateOpened = false;
		$scope.isValidtoDateOpened = false;
		$scope.DateFormat = hih.Constants.UI_DateFormat;
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
			$scope.rptCollection = [].concat($scope.dataReport);
			
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
	
	.controller("FinanceReportOrderController", ['$scope', '$rootScope', '$state', '$http', '$q', '$log', '$stateParams', '$translate', 'utils', 
		function($scope, $rootScope, $state, $http, $q, $log, $stateParams, $translate, utils) {
			
		$scope.ReportCurrency = $rootScope.objFinanceSetting.LocalCurrency;

		$scope.dataReport = [];
		$scope.rptCollection = [].concat($scope.dataReport);
		var promise1 = utils.loadFinanceOrderQ();
		var promise2 = utils.loadCurrenciesQ();
		$q.all(promise1, promise2)
			.then(function(response) {
				utils.loadFinanceReportOrderQ()
					.then(function(response2) {
						$scope.dataReport = $rootScope.arFinanceReportOrder;
						$scope.rptCollection = [].concat($scope.dataReport);
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

