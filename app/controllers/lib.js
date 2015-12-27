/* global $ */
/* global angular */
/* global hih */
(function () {
	'use strict';

	angular.module('hihApp.Lib', ["ui.router", "ngAnimate", "hihApp.Utility", "ui.tinymce", 'ui.bootstrap', 'ngSanitize',
		'ngJsTree', 'ngTouch', 'selectize', 'smart-table'])
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
				.state("home.lib.person.create", {
					url: "/create",
					templateUrl: 'app/views/lib/person.html',
					controller: 'LibPersonController'
				})
				.state("home.lib.person.display", {
					url: "/display/:id",
					templateUrl: 'app/views/lib/person.html',
					controller: 'LibPersonController'
				})
				.state("home.lib.person.maintain", {
					url: "/maintain/:id",
					templateUrl: 'app/views/lib/person.html',
					controller: 'LibPersonController'
				})
				
				.state("home.lib.org", {
					url: "/org",
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state("home.lib.org.list", {
					url: "",
					templateUrl: 'app/views/lib/organizationlist.html',
					controller: 'LibOrgListController'
				})
				.state("home.lib.org.create", {
					url: "/create",
					templateUrl: 'app/views/lib/organization.html',
					controller: 'LibOrganizationController'
				})
				.state("home.lib.org.display", {
					url: "/display/:id",
					templateUrl: 'app/views/lib/organization.html',
					controller: 'LibOrganizationController'
				})
				.state("home.lib.org.maintain", {
					url: "/maintain/:id",
					templateUrl: 'app/views/lib/organization.html',
					controller: 'LibOrganizationController'
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

				.state("home.lib.book", {
					url: "/book",
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state("home.lib.book.list", {
					url: "",
					templateUrl: 'app/views/lib/booklist.html',
					controller: 'LibBookListController'
				})
                .state("home.lib.book.create", {
                    url: "/create",
                    templateUrl: 'app/views/lib/book.html',
                    controller: 'LibBookController'
                })
			;
		}])

		.controller('LibLanguageListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibLanguageQ()
					.then(function (response) {
						// Do nothing....
					}, function (reason) {
						$rootScope.$broadcast("ShowMessage", "Error", reason);
					});
			}])

		.controller('LibLocationListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				$scope.dispList = [];

				$scope.newItem = function () {
					$state.go("home.lib.loc.create");
				};
				$scope.displayItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}

					$state.go("home.lib.loc.display", { id: nid });
				};
				$scope.editItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}
					$state.go("home.lib.loc.maintain", { id: nid });
				};
				$scope.removeItem = function () {
					// ToDo
					
				};
				$scope.refreshList = function () {
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
					if ($state.current.name === "home.lib.loc.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.loc.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}

					utils.readLibLocationQ(parseInt($stateParams.id))
						.then(function (response) {
							$.each($rootScope.arLibLocation, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.LocationObject = angular.copy(obj);
									return false;
								}
							});
						}, function (reason) {
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
								$state.go("home.lib.loc.maintain", { id: $scope.LocationObject.ID });
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

				$scope.dispList = [];

				$scope.newItem = function () {
					$state.go("home.lib.person.create");
				};
				$scope.displayItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}

					$state.go("home.lib.person.display", { id: nid });
				};
				$scope.editItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}
					$state.go("home.lib.person.maintain", { id: nid });
				};
				$scope.removeItem = function () {
					// ToDo					
				};

				$scope.refreshList = function () {
					utils.loadLibPersonQ()
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibPerson);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList();
			}])

		.controller('LibPersonController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;

				$scope.PersonObject = new hih.LibPerson();

				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.lib.person.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.person.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}

					utils.readLibPersonQ(parseInt($stateParams.id))
						.then(function (response) {
							$.each($rootScope.arLibPerson, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.PersonObject = angular.copy(obj);
									return false;
								}
							});
						}, function (reason) {
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
						utils.createLibPersonQ($scope.PersonObject)
							.then(function (response) {
								$state.go("home.lib.person.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibPersonQ($scope.PersonObject)
							.then(function (response) {
								$state.go("home.lib.person.maintain", { id: $scope.PersonObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.person.list");
				};
			}])

		.controller('LibOrgListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {

				$scope.dispList = [];

				$scope.newItem = function () {
					$state.go("home.lib.org.create");
				};
				$scope.displayItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}

					$state.go("home.lib.org.display", { id: nid });
				};
				$scope.editItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}
					$state.go("home.lib.org.maintain", { id: nid });
				};
				$scope.removeItem = function () {
					// ToDo					
				};

				$scope.refreshList = function () {
					utils.loadLibOrganizationQ()
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibOrganization);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList();
			}])

		.controller('LibOrganizationController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;

				$scope.OrganizationObject = new hih.LibOrganization();

				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.lib.org.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.org.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}

					utils.readLibOrganizationQ(parseInt($stateParams.id))
						.then(function (response) {
							$.each($rootScope.arLibOrganization, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.OrganizationObject = angular.copy(obj);
									return false;
								}
							});
						}, function (reason) {
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
						utils.createLibOrganizationQ($scope.OrganizationObject)
							.then(function (response) {
								$state.go("home.lib.org.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibOrganizationQ($scope.OrganizationObject)
							.then(function (response) {
								$state.go("home.lib.org.maintain", { id: $scope.OrganizationObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.org.list");
				};
			}])

		.controller('LibBookListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				$scope.dispList = [];

				$scope.newItem = function () {
					$state.go("home.lib.book.create");
				};
				$scope.displayItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}

					$state.go("home.lib.book.display", { id: nid });
				};
				$scope.editItem = function (row) {
					var nid = null;
					if (row) {
						nid = row.ID;
					} else {
						for (var i = 0; i < $scope.dispList.length; i++) {
							if ($scope.dispList[i].isSelected) {
								nid = $scope.dispList[i].ID;
								break;
							}
						}
					}
					$state.go("home.lib.book.maintain", { id: nid });
				};
				$scope.removeItem = function () {
					// ToDo
					
				};
				$scope.refreshList = function () {
					utils.loadLibBookQ()
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibBook);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList();
			}])

		.controller('LibBookController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;

				$scope.BookObject = new hih.LibBook();

				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.lib.book.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.book.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}

					utils.readLibBookQ(parseInt($stateParams.id))
						.then(function (response) {
							$.each($rootScope.arLibLocation, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.LocationObject = angular.copy(obj);
									return false;
								}
							});
						}, function (reason) {
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
						utils.createLibBookQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibBookQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.maintain", { id: $scope.LocationObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.book.list");
				};
			}])
	   ;
})();
