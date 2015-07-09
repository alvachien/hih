/* global $ */
/* global angular */
(function() {
	'use strict';

	angular.module('hihApp.Finance', ["ui.router", "ngAnimate", "smart-table", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 'ui.select'])
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
	
	.controller('FinanceAccountListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();
		utils.loadCurrencies();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceAccount;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("FinanceAccountLoaded", function() {
	    	console.log("HIH FinanceAccount List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arFinanceAccount;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	    
	    $scope.$on("FinanceAccountCategoryLoaded", function() {
	    	console.log("HIH FinanceAccount List: Category Loaded event fired!");
	    });	

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// Popup dialog for confirm
		    	
		    	// Then, communicate the sever for deleting
		    	
		    	// Last, update the UI part
//		    	$scope.rowCollection.splice(index, 1);
		    }
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.account.display",  { accountid : row.id });
		    }
		};
		
		// Edit
		$scope.editItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.account.maintain",  { accountid : row.id });
		    }
		};
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.account.create');
		};
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
				 $scope.Activity = "Edit";
			 } else if ($state.current.name === "home.finance.account.display") {
				 $scope.Activity = "Display";
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
			 $scope.Activity = "Create";
		 }
		 
		 $scope.close = function() {
			 $state.go("home.finance.account.list");
		 };
	}])	
	
	.controller('FinanceDocumentListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceDocuments();
		utils.loadFinanceDocumentTypes();
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();
		utils.loadCurrencies();
		utils.loadFinanceTransactionTypes();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceDocument;
	    $scope.displayedCollection = [].concat($scope.rowCollection);
	    $scope.itemsByPage = 15;
	    $scope.pagesTotal = 1;

	    $scope.$on("FinanceDocumentLoaded", function() {
	    	console.log("HIH FinanceDocument List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arFinanceDocument;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	    
	    $scope.$on("FinanceDocumentTypeLoaded", function() {
	    	console.log("HIH FinanceDocument List: Type Loaded event fired!");
	    });	

		// Remove to the real data holder
		$scope.removeItem = function removeItem(row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// Popup dialog for confirm
		    	
		    	// Then, communicate the sever for deleting
		    	
		    	// Last, update the UI part
//		    	$scope.rowCollection.splice(index, 1);
		    }
		 };
	    
		// Display
		$scope.displayItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
			if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.document.display",  { docid : row.docid });
		    }
		};
		
		// Edit
		$scope.editItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
			if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.document.maintain",  { docid : row.docid });
		    }
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
		$scope.ItemActivity = "Create an Item";
		
        // For select control
		$scope.AllAccounts = $rootScope.arFinanceAccount;
		$scope.AllCurrencies = $rootScope.arCurrency;
		$scope.AllDocumentTypes = $rootScope.arFinanceDocumentType;
		$scope.AllTransactionTypes = $rootScope.arFinanceTransactionType;

        // Attributes
		$scope.DocumentHeader = {};
		$scope.SelectedDocumentItem = {};		
		
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
		        $scope.Activity = "Edit";
		    } else if ($state.current.name === "home.finance.document.display") {
		        $scope.Activity = "Display";
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
		    $scope.Activity = "Create";
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
		
		$scope.displayItem = function (row) {
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
	
	.controller('FinanceTransactionTypeListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceTransactionTypes();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceTransactionType;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("FinanceTransactionTypeLoaded", function() {
	    	console.log("HIH FinanceTransactionType List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arFinanceTransactionType;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	}])

	.controller('FinanceDocumentTypeListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceDocumentTypes();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceDocumentType;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("FinanceDocumentTypeLoaded", function() {
	    	console.log("HIH FinanceDocumentType List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arFinanceDocumentType;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	}])

	.controller('FinanceAccountCategoryListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceAccountCategories();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceAccountCategory;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("FinanceAccountCategoryLoaded", function() {
	    	console.log("HIH FinanceAccountCategory List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arFinanceAccountCategory;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	}])	
	
	.controller('FinanceCurrencyListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadCurrencies();

		$scope.rowCollection = [];     
	    $scope.displayedCollection = [];	    
	    $scope.rowCollection = $rootScope.arFinanceAccount;
	    $scope.displayedCollection = [].concat($scope.rowCollection);

	    $scope.$on("CurrencyLoaded", function() {
	    	console.log("HIH Currency List: Loaded event fired!");
	    	
	    	$scope.rowCollection = $rootScope.arCurrency;
		    if ($scope.rowCollection && $scope.rowCollection.length > 0) {
				// copy the references (you could clone ie angular.copy but
				// then have to go through a dirty checking for the matches)
		    	$scope.displayedCollection = [].concat($scope.rowCollection);
		    }
	    });
	}])		
	;
}()
);

