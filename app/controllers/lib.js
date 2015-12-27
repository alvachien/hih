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
                utils.loadLibLanguageQ()
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

                    utils.loadLibLanguageQ()
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
                    utils.loadLibLanguageQ()
                    .then(function(response) {
                        $state.go("home.lib.book.maintain", { id: nid });
                    }, function(reason) {
                        $rootScope.$broadcast("ShowMessage", "Error", reason);
                    });					
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
                $scope.NamesCollection = [];
                $scope.LangsCollection = [];
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
                
                // Name related methods
                $scope.displayName = function(row) {
                    
                };
                $scope.editName = function(row) {
                    
                };
                $scope.removeName = function(row) {
                    
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
                    $scope.SelectedNameObject = new hih.LibBookName();
                    $scope.NameActivity = "Common.Create";
                    $scope.NameActivityID = hih.Constants.UIMode_Create;
                };
                
                // Language related methods
                $scope.displayLang = function(row) {
                    
                };
                $scope.editLang = function(row) {
                    
                };
                $scope.removeLang = function(row) {
                    
                };
                $scope.LangActivity = "Common.Create";
                $scope.LangActivityID = hih.Constants.UIMode_Create;
                $scope.nextLangID = 0;
                $scope.updateNextLangID = function () {
                    if (angular.isArray($scope.LangsCollection) && $scope.LangsCollection.length > 0) {
                        $scope.nextLangID = 0;
                        
                        $.each($scope.nameColl, function (idx, obj) {
                            var nLangID = parseInt(obj.LangID);
                                
                            if ($scope.nextLangID < nLangID) {
                                $scope.nextLangID = nLangID;
                            }
                        });
                        
                        $scope.nextLangID++;
                    } else {
                        $scope.nextLangID = 1;
                    }
                };
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
                    if ($scope.SelectedLangObject.LangID === -1) {
                        $scope.updateNextLangID();
                        $scope.SelectedLangObject.LangID = $scope.nextLangID;				
                        $scope.LangsCollection.push($scope.SelectedLangObject);
                    } else {
                        // Update the selected one
                        // It is updated automatically? Yes, it is!
                    }
                    
                    // Reset the selected lang
                    $scope.cancelCurrentLang();
                };
                $scope.cancelCurrentLang = function() {
                    $scope.SelectedLangObject = new hih.LibBookLang();
                    $scope.LangActivity = "Common.Create";
                    $scope.LangActivityID = hih.Constants.UIMode_Create;
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
						utils.createLibBookQ($scope.BookObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessage", "Error", reason);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibBookQ($scope.BookObject)
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
