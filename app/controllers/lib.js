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
                .state("home.lib.book.display", {
                    url: "/display/:id",
                    templateUrl: 'app/views/lib/book.html',
                    controller: 'LibBookController'
                })
                .state("home.lib.book.maintain", {
                    url: "/maintain/:id",
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
				$scope.refreshList = function (bReload) {
					utils.loadLibLocationQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibLocation);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList(false);
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

				$scope.refreshList = function (bReload) {
					utils.loadLibPersonQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibPerson);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList(false);
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

				$scope.refreshList = function (bReload) {
					utils.loadLibOrganizationQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibOrganization);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList(false);
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

		.controller('LibBookListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', '$q', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, $q, utils) {
				$scope.dispList = [];

				$scope.newItem = function () {
					var q1 = utils.loadLibLanguageQ(false);
					var q2 = utils.loadLibPersonQ(false);
					var q3 = utils.loadLibOrganizationQ(false);
					var q4 = utils.loadLibLocationQ(false);
					$q.all([q1, q2, q3, q4])
                        .then(function(response) {
                            $state.go("home.lib.book.create");
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessage", "Error", reason);
                        });					
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

					var q1 = utils.loadLibLanguageQ(false);
					var q2 = utils.loadLibPersonQ(false);
					var q3 = utils.loadLibOrganizationQ(false);
					var q4 = utils.loadLibLocationQ(false);
					$q.all([q1, q2, q3, q4])
                        .then(function(response) {
                            $state.go("home.lib.book.display", { id: nid });                            
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessage", "Error", reason);
                        });					
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
					
					var q1 = utils.loadLibLanguageQ(false);
					var q2 = utils.loadLibPersonQ(false);
					var q3 = utils.loadLibOrganizationQ(false);
					var q4 = utils.loadLibLocationQ(false);
					$q.all([q1, q2, q3, q4])
						.then(function(response) {
							$state.go("home.lib.book.maintain", { id: nid });
						}, function(reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});					
				};
				$scope.removeItem = function () {
					// ToDo					
				};
				
				$scope.refreshList = function (bReload) {
					utils.loadLibBookQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibBook);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});
				};

				$scope.refreshList(false);
			}])

		.controller('LibBookController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', '$log', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, $log, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;
                // Error messges
                $scope.ReportedMessages = [];
                $scope.cleanReportMessages = function() {
                    $scope.ReportedMessages = [];
                };

				$scope.BookObject = new hih.LibBook();
                $scope.SelectedNameObject = new hih.LibBookName();
                $scope.SelectedLangObject = new hih.LibBookLang();
                $scope.SelectedAuthorObject = new hih.LibBookAuthor();
                $scope.SelectedPressObject = new hih.LibBookPress();
                $scope.SelectedLocationObject = new hih.LibBookLocation();
                $scope.NamesCollection = [];
                $scope.LangsCollection = [];
                $scope.AuthorsCollection = [];
                $scope.PressesCollection = [];
                $scope.LocationsCollection = [];
                
                $scope.nameLangConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Name Language control, event onChange, ', value);
                    },
                    valueField: 'Language',
                    labelField: 'NativeName',
                    maxItems: 1,
                    required: true
                };
                $scope.langLangConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Lang Language control, event onChange, ', value);
                    },
                    valueField: 'Language',
                    labelField: 'NativeName',
                    maxItems: 1,
                    required: true
                };
                $scope.personConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Person control, event onChange, ', value);
                    },
                    valueField: 'ID',
                    labelField: 'Name',
                    maxItems: 1,
                    required: true
                };
                $scope.orgConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Press control, event onChange, ', value);
                    },
                    valueField: 'ID',
                    labelField: 'Name',
                    maxItems: 1,
                    required: true
                };
                $scope.locConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Location control, event onChange, ', value);
                    },
                    valueField: 'ID',
                    labelField: 'Name',
                    maxItems: 1,
                    required: true
                };
                
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
							$.each($rootScope.arLibBook, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.BookObject = angular.copy(obj);
                                    $scope.NamesCollection = [].concat(obj.Names);
                                    $scope.LangsCollection = [].concat(obj.Languages);
                                    $scope.AuthorsCollection = [].concat(obj.Authors);
                                    $scope.PressesCollection = [].concat(obj.Presses);
                                    $scope.LocationsCollection = [].concat(obj.Locations);
                                    
									return false;
								}
							});
						}, function (reason) {
							$rootScope.$broadcast("ShowMessage", "Error", reason);
						});

				} else {
					$scope.Activity = "Common.Create";
					$scope.ActivityID = hih.Constants.UIMode_Create;
				};
                
                // Name related methods
                $scope.displayName = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedNameObject = row;
                    $scope.NameActivity = "Common.Display";
                    $scope.NameActivityID = hih.Constants.UIMode_Display;
                };
                $scope.editName = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedNameObject = row;
                    $scope.NameActivity = "Common.Edit";
                    $scope.NameActivityID = hih.Constants.UIMode_Change;
                };
                $scope.removeName = function(row) {
                    $scope.cleanReportMessages();
                    
                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
                        function() {
                            if ($scope.SelectedNameObject.NameID === row.NameID) {
                                $scope.cancelCurrentName();
                            }
                                    
                            for(var i = 0; i < $scope.NamesCollection.length; i ++) {
                                if ($scope.NamesCollection[i].NameID === row.NameID) {
                                    $scope.NamesCollection.splice(i, 1);
                                    break;
                                }
                            }
                            
                            $scope.$apply();
                    });
                };
                $scope.NameActivity = "Common.Create";
                $scope.NameActivityID = hih.Constants.UIMode_Create;
                $scope.nextNameID = 0;
                $scope.updateNextNameID = function () {
                    if (angular.isArray($scope.NamesCollection) && $scope.NamesCollection.length > 0) {
                        $scope.nextBookID = 0;
                        
                        $.each($scope.NamesCollection, function (idx, obj) {
                            var nNameID = parseInt(obj.NameID);
                                
                            if ($scope.nextNameID < nNameID) {
                                $scope.nextNameID = nNameID;
                            }
                        });
                        
                        $scope.nextNameID++;
                    } else {
                        $scope.nextNameID = 1;
                    }
                };
                $scope.saveCurrentName = function() {
                    $scope.cleanReportMessages();
                    
                    // Perform the check
                    var rptMsgs = $scope.SelectedNameObject.Verify($translate);
                    // if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                    //     $q.all(rptMsgs)
                    //         .then(function(response) {
                    //             $scope.cleanReportMessages();
                    //             Array.prototype.push.apply($scope.ReportedMessages, response);
                    //         }, function(reason) {
                    //             $rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
                    //         });
                    //     return;
                    // }
                    
                    // Next name ID
                    if ($scope.SelectedNameObject.NameID === -1) {
                        $scope.updateNextNameID();
                        $scope.SelectedNameObject.NameID = $scope.nextNameID;				
                        $scope.NamesCollection.push($scope.SelectedNameObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected name
                    $scope.cancelCurrentName();
                };
                $scope.cancelCurrentName = function() {
                    $scope.cleanReportMessages();
                    $scope.SelectedNameObject = new hih.LibBookName();
                    $scope.NameActivity = "Common.Create";
                    $scope.NameActivityID = hih.Constants.UIMode_Create;
                };
                
                // Language related methods
                $scope.displayLang = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedLangObject = row;
                    $scope.LangActivity = "Common.Display";
                    $scope.LangActivityID = hih.Constants.UIMode_Display;
                };
                $scope.editLang = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedLangObject = row;
                    $scope.LangActivity = "Common.Edit";
                    $scope.LangActivityID = hih.Constants.UIMode_Change;
                };
                $scope.removeLang = function(row) {
                    $scope.cleanReportMessages();
                    
                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
                        function() {
                            if ($scope.SelectedLangObject.Language === row.Language) {
                                $scope.cancelCurrentLang();
                            }
                                    
                            for(var i = 0; i < $scope.LangsCollection.length; i ++) {
                                if ($scope.LangsCollection[i].Language === row.Language) {
                                    $scope.LangsCollection.splice(i, 1);
                                    break;
                                }
                            }
                            
                            $scope.$apply();
                    });
                };
                $scope.LangActivity = "Common.Create";
                $scope.LangActivityID = hih.Constants.UIMode_Create;
                $scope.saveCurrentLang = function() {
                    $scope.cleanReportMessages();
                    
                    // Perform the check
                    // var rptMsgs = $scope.SelectedNameObject.Verify($translate);
                    // if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                    //     $q.all(rptMsgs)
                    //         .then(function(response) {
                    //             $scope.cleanReportMessages();
                    //             Array.prototype.push.apply($scope.ReportedMessages, response);
                    //         }, function(reason) {
                    //             $rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
                    //         });
                    //     return;
                    // }
                    
                    // Next lang ID
                    if ($scope.LangActivityID === hih.Constants.UIMode_Create) {
                        $scope.LangsCollection.push($scope.SelectedLangObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected lang
                    $scope.cancelCurrentLang();
                };
                $scope.cancelCurrentLang = function() {
                    $scope.cleanReportMessages();
                    $scope.SelectedLangObject = new hih.LibBookLang();
                    $scope.LangActivity = "Common.Create";
                    $scope.LangActivityID = hih.Constants.UIMode_Create;
                };
                // Authors
                $scope.displayAuthor = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedAuthorObject = row;
                    $scope.AuthorActivity = "Common.Display";
                    $scope.AuthorActivityID = hih.Constants.UIMode_Display;
                };
                $scope.editAuthor = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedAuthorObject = row;
                    $scope.AuthorActivity = "Common.Edit";
                    $scope.AuthorActivityID = hih.Constants.UIMode_Change;
                };
                $scope.removeAuthor = function(row) {
                    $scope.cleanReportMessages();
                    
                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
                        function() {
                            var nID = parseInt(row.ID);
                            if ($scope.SelectedAuthorObject.ID === nID) {
                                $scope.cancelCurrentAuthor();
                            }
                                    
                            for(var i = 0; i < $scope.AuthorsCollection.length; i ++) {
                                if ($scope.AuthorsCollection[i].ID === nID) {
                                    $scope.AuthorsCollection.splice(i, 1);
                                    break;
                                }
                            }
                            
                            $scope.$apply();
                    });
                };
                $scope.AuthorActivity = "Common.Create";
                $scope.AuthorActivityID = hih.Constants.UIMode_Create;
                $scope.saveCurrentAuthor = function() {
                    $scope.cleanReportMessages();
                    
                    // Perform the check
                    // var rptMsgs = $scope.SelectedNameObject.Verify($translate);
                    // if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                    //     $q.all(rptMsgs)
                    //         .then(function(response) {
                    //             $scope.cleanReportMessages();
                    //             Array.prototype.push.apply($scope.ReportedMessages, response);
                    //         }, function(reason) {
                    //             $rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
                    //         });
                    //     return;
                    // }
                    
                    if ($scope.AuthorActivityID === hih.Constants.UIMode_Create) {
                        $scope.AuthorsCollection.push($scope.SelectedAuthorObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected lang
                    $scope.cancelCurrentAuthor();
                };
                $scope.cancelCurrentAuthor = function() {
                    $scope.cleanReportMessages();
                    $scope.SelectedAuthorObject = new hih.LibBookAuthor();
                    $scope.AuthorActivity = "Common.Create";
                    $scope.AuthorActivityID = hih.Constants.UIMode_Create;
                };
				
                // Presses
                $scope.displayPress = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedPressObject = row;
                    $scope.PressActivity = "Common.Display";
                    $scope.PressActivityID = hih.Constants.UIMode_Display;
                };
                $scope.editPress = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedPressObject = row;
                    $scope.PressActivity = "Common.Edit";
                    $scope.PressActivityID = hih.Constants.UIMode_Change;
                };
                $scope.removePress = function(row) {
                    $scope.cleanReportMessages();
                    
                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
                        function() {
                            var nID = parseInt(row.ID);
                            if ($scope.SelectedPressObject.ID === nID) {
                                $scope.cancelCurrentPress();
                            }
                                    
                            for(var i = 0; i < $scope.PressesCollection.length; i ++) {
                                if ($scope.PressesCollection[i].ID === nID) {
                                    $scope.PressesCollection.splice(i, 1);
                                    break;
                                }
                            }
                            
                            $scope.$apply();
                    });
                };
                $scope.PressActivity = "Common.Create";
                $scope.PressActivityID = hih.Constants.UIMode_Create;
                $scope.saveCurrentPress = function() {
                    $scope.cleanReportMessages();
                    
                    // Perform the check
                    // var rptMsgs = $scope.SelectedPressObject.Verify($translate);
                    // if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                    //     $q.all(rptMsgs)
                    //         .then(function(response) {
                    //             $scope.cleanReportMessages();
                    //             Array.prototype.push.apply($scope.ReportedMessages, response);
                    //         }, function(reason) {
                    //             $rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
                    //         });
                    //     return;
                    // }
                    
                    if ($scope.PressActivityID === hih.Constants.UIMode_Create) {
                        $scope.PressesCollection.push($scope.SelectedPressObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected press
                    $scope.cancelCurrentPress();
                };
                $scope.cancelCurrentPress = function() {
                    $scope.cleanReportMessages();
                    $scope.SelectedPressObject = new hih.LibBookPress();
                    $scope.PressActivity = "Common.Create";
                    $scope.PressActivityID = hih.Constants.UIMode_Create;
                };
				
                // Locations
                $scope.displayLocation = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedLocationObject = row;
                    $scope.LocationActivity = "Common.Display";
                    $scope.LocationActivityID = hih.Constants.UIMode_Display;
                };
                $scope.editLocation = function(row) {
                    $scope.cleanReportMessages();
                    $scope.SelectedLocationObject = row;
                    $scope.LocationActivity = "Common.Edit";
                    $scope.LocationActivityID = hih.Constants.UIMode_Change;
                };
                $scope.removeLocation = function(row) {
                    $scope.cleanReportMessages();
                    
                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageNeedTranslate', 'Common.DeleteConfirmation', 'Common.ConfirmToDeleteSelectedItem', 'warning', 
                        function() {
                            var nID = parseInt(row.ID);
                            if ($scope.SelectedLocationObject.ID === nID) {
                                $scope.cancelCurrentLocation();
                            }
                                    
                            for(var i = 0; i < $scope.LocationsCollection.length; i ++) {
                                if ($scope.LocationsCollection[i].ID === nID) {
                                    $scope.LocationsCollection.splice(i, 1);
                                    break;
                                }
                            }
                            
                            $scope.$apply();
                    });
                };
                $scope.LocationActivity = "Common.Create";
                $scope.LocationActivityID = hih.Constants.UIMode_Create;
                $scope.saveCurrentLocation = function() {
                    $scope.cleanReportMessages();
                    
                    // Perform the check
                    // var rptMsgs = $scope.SelectedNameObject.Verify($translate);
                    // if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                    //     $q.all(rptMsgs)
                    //         .then(function(response) {
                    //             $scope.cleanReportMessages();
                    //             Array.prototype.push.apply($scope.ReportedMessages, response);
                    //         }, function(reason) {
                    //             $rootScope.$broadcast("ShowMessage", "Error", "Fatal error on loading texts!");
                    //         });
                    //     return;
                    // }
                    
                    // Next item ID
                    if ($scope.AuthorActivityID === hih.Constants.UIMode_Create) {
                        $scope.LocationsCollection.push($scope.SelectedLocationObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected location
                    $scope.cancelCurrentLocation();
                };
                $scope.cancelCurrentLocation = function() {
                    $scope.SelectedLocationObject = new hih.LibBookLocation();
                    $scope.LocationActivity = "Common.Create";
                    $scope.LocationActivityID = hih.Constants.UIMode_Create;
                };

                // Sumbit the whole object
				$scope.submit = function () {
                    $scope.clearReportMessages();
                    
					// Verify it!
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
					
					$scope.BookObject.Names = [];
					$scope.BookObject.Languages = [];
                    $scope.BookObject.Authors = [];
                    $scope.BookObject.Presses = [];
                    $scope.BookObject.Locations = [];
					// Names
					if ($scope.NamesCollection.length <= 0) return;
					$.each($scope.NamesCollection, function(idx, obj) {
						$scope.BookObject.Names.push(obj);
					});
					// Languages
					if ($scope.LangsCollection.length <= 0) return;
					$.each($scope.LangsCollection, function(idx, obj) {
						$scope.BookObject.Languages.push(obj);
					});
                    // Authors
					$.each($scope.AuthorsCollection, function(idx, obj) {
						$scope.BookObject.Authors.push(obj);
					});
                    // Presses
					$.each($scope.PressesCollection, function(idx, obj) {
						$scope.BookObject.Presses.push(obj);
					});
                    // Locations
					$.each($scope.LocationsCollection, function(idx, obj) {
						$scope.BookObject.Locations.push(obj);
					});
                    
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
					 	utils.createLibBookQ($scope.BookObject)
					 		.then(function (response) {
					 			$state.go("home.lib.book.display", { id: response });
					 		}, function (reason) {
					 			$rootScope.$broadcast("ShowMessage", "Error", reason);
					 		});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						// utils.updateLibBookQ($scope.BookObject)
						// 	.then(function (response) {
						// 		$state.go("home.lib.book.maintain", { id: $scope.LocationObject.ID });
						// 	}, function (reason) {
						// 		$rootScope.$broadcast("ShowMessage", "Error", reason);
						// 	});
					 }
				};

				$scope.close = function () {
					$state.go("home.lib.book.list");
				};
			}])
	   ;
})();
