/* global $ */
/* global angular */
/* global hih */
(function() {
	'use strict';
    
	angular.module('hihApp.Lib', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize', 
		'ngJsTree', 'ngTouch', 'selectize', 'smart-table'])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
	      $stateProvider
	        .state("home.lib", {
	            url: "/lib",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.language", {
	            url: "/language",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.language.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/languagelist.html',
	        	controller: 'LibLanguageListController'
	        })
	        .state("home.lib.person", {
	            url: "/person",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.person.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/personlist.html',
	        	controller: 'LibPersonListController'
	        })
	        .state("home.lib.org", {
	            url: "/org",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.org.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/orglist.html',
	        	controller: 'LibOrgListController'
	        })
	        .state("home.lib.loc", {
	            url: "/loc",
	            abstract: true,
	            template: '<div ui-view></div>'
	        })
	        .state("home.lib.loc.list", {
	        	url: "",
	        	templateUrl: 'app/views/lib/locationlist.html',
	        	controller: 'LibLocationListController'
	        })
	        .state("home.lib.loc.create", {
	        	url: "/create",
	        	templateUrl: 'app/views/lib/location.html',
	        	controller: 'LibLocationController'
	        })
	        .state("home.lib.loc.display", {
	        	url: "/display/:id",
	        	templateUrl: 'app/views/lib/location.html',
	        	controller: 'LibLocationController'
	        })
	        .state("home.lib.loc.maintain", {
	        	url: "/maintain/:id",
	        	templateUrl: 'app/views/lib/location.html',
	        	controller: 'LibLocationController'
	        })
			;
		}])
		
	   .controller('LibLanguageListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils', 
		  function($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
              utils.loadLibLanguageQ()
                .then(function(response) {
                    // Do nothing....
                }, function(reason) {
                    $rootScope.$broadcast("ShowMessage", "Error", reason);
                });
	   }])
       
		.controller('LibLocationListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				$scope.dispList = [];
				
				$scope.newItem = function () {
					$state.go("home.lib.loc.create");
				};
				$scope.displayItem = function(row) {
					$state.go("home.lib.loc.display", { id: row.ID });
				};
				$scope.editItem = function(row) {
					$state.go("home.lib.loc.maintain", { id: row.ID });
				};
				$scope.removeItem = function() {
					// ToDo
				};
				$scope.refreshList = function() {
					utils.loadLibLocationQ()
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibLocation);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});					
				};
				
				$scope.refreshList();
			}])

		.controller('LibLocationController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;

				$scope.LocationObject = new hih.LibLocation();

				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.lib.location.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.location.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}
					
					utils.readLibLocationQ(parseInt($stateParams.id))
						.then(function(response) {
						$.each($rootScope.arLibLocation, function (idx, obj) {
							if (obj.ID === parseInt($stateParams.id)) {
								$scope.LocationObject = angular.copy(obj);
								return false;
							}
						});
						}, function(reason) {
							// Errors!
						});

				} else {
					$scope.Activity = "Common.Create";
					$scope.ActivityID = hih.Constants.UIMode_Create;
				};

				$scope.submit = function () {
					// // Verify it!
					// var msgTab = $scope.CategoryObject.Verify();
					// if (msgTab && msgTab.length > 0) {
					// 	$translate(msgTab).then(function (translations) {
					// 		// Show errors
					// 		$.each(translations, function (idx, obj) {
					// 			$rootScope.$broadcast("ShowMessage", "Error", obj);
					// 		});
					// 	});
					// 	return;
					// }
				 
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
						utils.createLibLocationQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibLocationQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: $scope.LocationObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.loc.list");
				};
			}])
			   
		.controller('LibPersonListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibPersonQ()
					.then(function (response) {
						// Do nothing...
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});

				$scope.newItem = function () {

				};
				$scope.deleteItem = function() {
					
				};
				
			}])

		.controller('LibOrgListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibOrganizatioinQ()
					.then(function (response) {
						// Do nothing...
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});

				$scope.newItem = function () {

				};
				$scope.deleteItem = function() {
					
				};
				
			}])
	   ;
})();
