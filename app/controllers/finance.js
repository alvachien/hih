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
    ;
	}])
	
	.controller('FinanceAccountListController', ['$scope', '$rootScope', '$state', '$http', 'utils', function($scope, $rootScope, $state, $http, utils) {
		utils.loadFinanceAccounts();
		utils.loadFinanceAccountCategories();

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

	.controller('LearnObjectController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'utils', 
	                                      function($scope, $rootScope, $state, $stateParams, $http, utils) {
		$scope.Activity = "";
		$scope.ErrorDetail = "";
	}])
	
	;
}()
);
