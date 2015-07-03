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
		 }
	    
		// Display
		$scope.displayItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.account.display",  { accountid : row.id });
		    }
		}
		
		// Edit
		$scope.editItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.account.maintain",  { accountid : row.id });
		    }
		}
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.account.create');
		}
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
		 }
	}])	
	
	.controller('FinanceDocumentListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceDocuments();
		utils.loadFinanceDocumentTypes();
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();
		utils.loadCurrencies();

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
		 }
	    
		// Display
		$scope.displayItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.document.display",  { docid : row.id });
		    }
		}
		
		// Edit
		$scope.editItem = function (row) {
			var index = $scope.rowCollection.indexOf(row);
		    if (index !== -1) {
		    	// $scope.rowCollection.splice(index, 1);
		    	$state.go("home.finance.document.maintain",  { docid : row.id });
		    }
		}
		
		// Create
		$scope.newItem = function() {
			//$location.path('/learnobject');
			$state.go('home.finance.document.create');
		}
	}])
		
	.controller('FinanceDocumentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', function($scope, $rootScope, $state, $stateParams, $http, utils) {
		$scope.Activity = "";
		$scope.ErrorDetail = "";
		$scope.isReadonly = false;
		
		$scope.DocumentID = -1;
		$scope.DocumentType = {};
		$scope.DocumentTranDate = new Date();
		$scope.DocumentCurrency = {};
		$scope.DocumentDesp = "";
		$scope.DocumentAmount = 0;
		
		 if (angular.isDefined($stateParams.docid)) {
			 $scope.DocumentID = parseInt($stateParams.docid);
			 
			 if ($state.current.name === "home.finance.document.maintain") {
				 $scope.Activity = "Edit";
			 } else if ($state.current.name === "home.finance.document.display") {
				 $scope.Activity = "Display";
				 $scope.isReadonly = true;
			 }
			 
			 $.each($rootScope.arFinanceDocument, function(idx, obj) {
				 if (obj.docid === $stateParams.docid) {
					 
					 $scope.DocumentAmount = obj.tranamount;
					 $scope.DocumentDesp = obj.desp;
					 
					 return false;
				 }
			 });
		 } else {
			 $scope.Activity = "Create";
		 }
		 
		 $scope.close = function() {
			 $state.go("home.finance.document.list");
		 }
	}])	
	;
}()
);
