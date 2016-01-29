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
                .state("home.lib.setting", {
                    url: "/setting",
                    templateUrl: 'app/views/lib/setting.html',
                    controller: 'LibSettingController'
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
				
				.state("home.lib.booktype", {
					url: "/booktype",
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state("home.lib.booktype.list", {
					url: "",
					templateUrl: 'app/views/lib/booktypelist.html',
					controller: 'LibBookTypeListController'
				})
                .state("home.lib.booktype.hierarchy", {
                    url: "/hierarchy",
                    templateUrl: 'app/views/lib/booktypehier.html',
                    controller: 'LibBookTypeHierController'
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
				.state("home.lib.bookgroup", {
					url: "/bookgroup",
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state("home.lib.bookgroup.list", {
					url: "",
					templateUrl: 'app/views/lib/bookgrouplist.html',
					controller: 'LibBookGroupListController'
				})
                .state("home.lib.bookgroup.create", {
                    url: "/create",
                    templateUrl: 'app/views/lib/bookgroup.html',
                    controller: 'LibBookGroupController'
                })
                .state("home.lib.bookgroup.display", {
                    url: "/display/:id",
                    templateUrl: 'app/views/lib/bookgroup.html',
                    controller: 'LibBookGroupController'
                })
                .state("home.lib.bookgroup.maintain", {
                    url: "/maintain/:id",
                    templateUrl: 'app/views/lib/bookgroup.html',
                    controller: 'LibBookGroupController'
                })
			;
		}])

        .controller('LibSettingController', ['$scope', '$rootScope', '$state', '$http', '$log', '$q', '$translate', 'utils', 
            function($scope, $rootScope, $state, $http, $log, $q, $translate, utils) {
                $scope.displayedCollection = [];
                
                if ($rootScope.objLibSetting) {
                    // Local currency
                    $scope.displayedCollection.push({
                        "Name": $rootScope.objLibSetting.BookAuthorDesp,
                        "Value": $rootScope.objLibSetting.BookAuthorTags,
                        "Others": $rootScope.objLibSetting.BookAuthorSelectSQL
                    });
                    $scope.displayedCollection.push({
                        "Name": $rootScope.objLibSetting.BookPressDesp,
                        "Value": $rootScope.objLibSetting.BookPressTags,
                        "Others": $rootScope.objLibSetting.BookPressSelectSQL
                    });
                }
            }])		

		.controller('LibLanguageListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
				utils.loadLibLanguageQ()
					.then(function (response) {
						// Do nothing....
					}, function (reason) {
						$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
					});
			}])

		.controller('LibBookTypeListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, utils) {
			$scope.dispList = [];
			
			utils.loadLibBookTypeQ()
				.then(function (response) {
					$scope.dispList = [].concat($rootScope.arLibBookType);
				}, function (reason) {
					$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
				});
			}])
        
        .controller('LibBookTypeHierController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', 
            function($scope, $rootScope, $state, $http, $log, utils) {
                
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
                            url: "app/3rdparty/jstree-3.2.1/themes/default-dark/style.min.css",
                            responsive: true,
                            stripes: true,
                            dots: true
                        }
                    },
                    version : 1,
                    plugins : [ 'wholerow' ]
                };

            utils.loadLibBookTypeQ()
                .then(function (response) {
                    $scope.treeData = [];
                    $.each($rootScope.arLibBookType, function (idx, obj) {
                        var treenode = obj.getJsTreeNode();
                        $scope.treeData.push(treenode);
                    });
                    $scope.treeConfig.version++;
            	}, function (reason) {
                    $rootScope.$broadcast("ShowMessageEx", "Error", [{ Type: 'danger', Message: reason }]);
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
				$scope.removeItem = function (row) {
                    var nID = -1;
                    if (row) {
                        nID = row.ID;
                    } else {
                        var nSelectedCount = 0;
                        for(var i = 0; i < $scope.dispList.length; i ++) {
                            if ($scope.dispList[i].isSelected) {
                                nID = $scope.dispList[i].ID;
                                nSelectedCount ++;
                            }
                        }
                        if (nSelectedCount !== 1) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type:'danger', Message: "Select only one group to delete!"}]);
                            return;
                        }
                    }
                    
                    // Popup dialog for confirm
                    $rootScope.$broadcast('ShowMessage', "Delete", "Will delete the selected item!", "warning", function() {
                        $http.post(
                                'script/hihsrv.php',
                                {
                                    objecttype : 'DELETELIBLOC',
                                    id: nID
                                })
                            .success(
                                function(data, status, headers, config) {
                                    $scope.refreshList(true);
                                })
                            .error(
                                function(data, status, headers, config) {
                                    $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
                                });
                    });
				};
				$scope.refreshList = function (bReload) {
					utils.loadLibLocationQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibLocation);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
                        // var msgTab2 = [];
						// $.foreach(translations, function(idx, obj) {
                        //     msgTab2.push({Type:'danger', Message: obj});
						// });
                        // $rootScope.$broadcast("ShowMessageEx", "Error", msgTab2);
					// 	});
					// 	return;
					// }
				 
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
						utils.createLibLocationQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibLocationQ($scope.LocationObject)
							.then(function (response) {
								$state.go("home.lib.loc.display", { id: $scope.LocationObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
				$scope.removeItem = function (row) {
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

                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
                        function() {
                            utils.deleteLibPersonQ(nid)
                                .then(function(response) {
                                    $scope.refreshList(true);
                                }, function(reason) {
                                    $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
                                });
                    });
				};

				$scope.refreshList = function (bReload) {
					utils.loadLibPersonQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibPerson);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});
				};

				$scope.refreshList(false);
			}])

		.controller('LibPersonController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', '$log', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, $log, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;
                // Error messges
                $scope.ReportedMessages = [];
                $scope.cleanReportMessages = function() {
                    $scope.ReportedMessages = [];
                };
                
				$scope.PersonObject = new hih.LibPerson();
                $scope.TagControlInstance = null;
                $scope.tagsConfig = {
                    create: true, // Allow create!
                    delimiter: '|',
                    maxItems: 10,
                    onChange: function(value){
                        $log.info('LibPersonController, tags control, event onChange, ', value);
                    },
                    onInitialize: function(objselectize){
                        $scope.TagControlInstance = objselectize;
                    }
                };

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
                                    $.each($scope.PersonObject.Tags, function(idx, obj) {
                                        $scope.TagControlInstance.createItem(obj); 
                                    });
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
                    $scope.cleanReportMessages();
                    
					// Verify it!
					var msgTab = $scope.PersonObject.Verify($translate);
					if (msgTab && msgTab.length > 0) {
						$q.all(msgTab).then(function (translations) {
							// Show errors
                            var msgTab2 = [];
                            $.foreach(translations, function(idx, obj) {
                                msgTab2.push({Type:'danger', Message: obj});
                            });
                            $rootScope.$broadcast("ShowMessageEx", "Error", msgTab2);
						});
						return;
					}
 				 
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
						utils.createLibPersonQ($scope.PersonObject)
							.then(function (response) {
								$state.go("home.lib.person.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibPersonQ($scope.PersonObject)
							.then(function (response) {
								$state.go("home.lib.person.display", { id: $scope.PersonObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
				$scope.removeItem = function (row) {
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

                    // Show confirm dialog
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
                        function() {
                            utils.deleteLibOrganizationQ(nid)
                                .then(function(response) {
                                    $scope.refreshList(true);
                                }, function(reason) {
                                    $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
                                });
                    });
				};

				$scope.refreshList = function (bReload) {
					utils.loadLibOrganizationQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibOrganization);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});
				};

				$scope.refreshList(false);
			}])

		.controller('LibOrganizationController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', '$log', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, $log, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;
                // Error messges
                $scope.ReportedMessages = [];
                $scope.cleanReportMessages = function() {
                    $scope.ReportedMessages = [];
                };

				$scope.OrganizationObject = new hih.LibOrganization();
                $scope.TagControlInstance = null;
                $scope.tagsConfig = {
                    create: true, // Allow create!
                    delimiter: '|',
                    maxItems: 10,
                    onChange: function(value){
                        $log.info('LibOrganizationController, tags control, event onChange, ', value);
                    },
                    onInitialize: function(objselectize){
                        $scope.TagControlInstance = objselectize;
                    }
                };

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
                                    $.each($scope.OrganizationObject.Tags, function(idx, obj) {
                                        $scope.TagControlInstance.createItem(obj); 
                                    });
									return false;
								}
							});
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});

				} else {
					$scope.Activity = "Common.Create";
					$scope.ActivityID = hih.Constants.UIMode_Create;
				};

				$scope.submit = function () {
                    $scope.cleanReportMessages();
                    
					// Verify it!
					var msgTab = $scope.OrganizationObject.Verify($translate);
					if (msgTab && msgTab.length > 0) {
						$q.all(msgTab).then(function (translations) {
							// Show errors
                            var msgTab2 = [];
                            $.foreach(translations, function(idx, obj) {
                                msgTab2.push({Type:'danger', Message: obj});
                            });
                            $rootScope.$broadcast("ShowMessageEx", "Error", msgTab2);
						});
						return;
					}
				 
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
						utils.createLibOrganizationQ($scope.OrganizationObject)
							.then(function (response) {
								$state.go("home.lib.org.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibOrganizationQ($scope.OrganizationObject)
							.then(function (response) {
								$state.go("home.lib.org.display", { id: $scope.OrganizationObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.org.list");
				};
			}])
            
		.controller('LibBookGroupListController', ['$scope', '$rootScope', '$state', '$http', '$interval', '$translate', '$log', '$q', 'utils',
			function ($scope, $rootScope, $state, $http, $interval, $translate, $log, $q, utils) {
				$scope.dispList = [];

				$scope.newItem = function () {
					utils.loadLibBookForGroupQ()
                        .then(function(response) {
                            $state.go("home.lib.bookgroup.create");
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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

					utils.loadLibBookForGroupQ()
                        .then(function(response) {
                            $state.go("home.lib.bookgroup.display", { id: nid });                            
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
					
					utils.loadLibBookForGroupQ()
						.then(function(response) {
							$state.go("home.lib.bookgroup.maintain", { id: nid });
						}, function(reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});					
				};
				$scope.removeItem = function (row) {
                    var nID = -1;
                    if (row) {
                        nID = row.ID;
                    } else {
                        var nSelectedCount = 0;
                        for(var i = 0; i < $scope.dispList.length; i ++) {
                            if ($scope.dispList[i].isSelected) {
                                nID = $scope.dispList[i].ID;
                                nSelectedCount ++;
                            }
                        }
                        if (nSelectedCount !== 1) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type:'danger', Message: "Select only one group to delete"}]);
                            return;
                        }
                    }
                    
                    // Popup dialog for confirm
                    $rootScope.$broadcast('ShowMessage', "Delete", "Will delete the selected item!", "warning", function() {
                        $http.post(
                                'script/hihsrv.php',
                                {
                                    objecttype : 'DELETELIBBOOKGROUP',
                                    id: nID
                                })
                            .success(
                                function(data, status, headers, config) {
                                    $scope.refreshList(true);
                                })
                            .error(
                                function(data, status, headers, config) {
                                    $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
                                });
                    });
				};
				
				$scope.refreshList = function (bReload) {
					utils.loadLibBookGroupQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibBookGroup);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});
				};

				$scope.refreshList(false);
			}])

		.controller('LibBookGroupController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', '$q', '$log', 'utils',
			function ($scope, $rootScope, $state, $stateParams, $http, $translate, $q, $log, utils) {
				$scope.Activity = "";
				$scope.ActivityID = hih.Constants.UIMode_Create;
                
                // Error messges
                $scope.ReportedMessages = [];
                $scope.cleanReportMessages = function() {
                    $scope.ReportedMessages = [];
                };
    
				$scope.BookGroupObject = new hih.LibBookGroup();
                $scope.bookList = [];

				if (angular.isDefined($stateParams.id)) {
					if ($state.current.name === "home.lib.bookgroup.maintain") {
						$scope.Activity = "Common.Edit";
						$scope.ActivityID = hih.Constants.UIMode_Change;
					} else if ($state.current.name === "home.lib.bookgroup.display") {
						$scope.Activity = "Common.Display";
						$scope.ActivityID = hih.Constants.UIMode_Display;
					}

					utils.readLibBookGroupQ(parseInt($stateParams.id))
						.then(function (response) {
							$.each($rootScope.arLibBookGroup, function (idx, obj) {
								if (obj.ID === parseInt($stateParams.id)) {
									$scope.BookGroupObject = angular.copy(obj);
                                    
                                    // bookList
                                    if (obj.Books && obj.Books.length > 0) {
                                        for(var i = 0; i < obj.Books.length; i ++) {
                                            var objNew = {};
                                            objNew.isEditing = false;
                                            objNew.ID = parseInt(obj.Books[i]);
                                            
                                            $.each($rootScope.arLibBookBrief, function(idx3, obj3) {
                                                if (parseInt(obj3.id) === objNew.ID) {
                                                    objNew.Names_RT = obj3.name;
                                                    return false;
                                                } 
                                            });
                                            $scope.bookList.push(objNew);
                                        }
                                    }
                                    
									return false;
								}
							});
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});

				} else {
					$scope.Activity = "Common.Create";
					$scope.ActivityID = hih.Constants.UIMode_Create;
				};
                
                $scope.addItem = function() {
                    $scope.cleanReportMessages();
                    
                    var objNew = {};
                    objNew.isEditing = true;
                    objNew.ID = -1;
                    objNew.Names_RT= "N/A";
                    $scope.bookList.push(objNew);
                };
                
                $scope.saveItem = function(row) {
                    $scope.cleanReportMessages();
                    
                    var bExist = false;
                    var nRowID = parseInt(row.ID);
                    
                    // Check the ID
                    if (isNaN(nRowID) || nRowID === -1) {                        
                    } else {
                        $.each($rootScope.arLibBookBrief, function(idx, obj) {
                            if (parseInt(obj.id) === nRowID) {
                                row.Names_RT = obj.name;
                                bExist = true;
                                return false;
                            } 
                        });
                    }
                    
                    if (!bExist) {
                        row.Names_RT = "Invalid Book ID";
                    } else {
                        row.isEditing = false;
                    }
                };
                
                $scope.editItem = function(row) {
                    $scope.cleanReportMessages();
                    row.isEditing = true;
                };
                
                $scope.cancelEditItem = function(row) {
                    $scope.cleanReportMessages();
                    row.isEditing = false;
                };
                
                $scope.removeItem = function(row) {
                    $scope.cleanReportMessages();
                    
                    //var index = $scope.bookList.indexOf(row);
                    if (this.$index !== -1) {
                        $scope.bookList.splice(this.$index, 1);
                    }
                };
                
				$scope.submit = function () {
                    $scope.cleanReportMessages();
                    
                    $scope.BookGroupObject.Books = [];
                    $.each($scope.bookList, function(idx, obj) {
                       $scope.BookGroupObject.Books.push(obj.ID); 
                    });
                    
					// Verify it!
					var msgTab = $scope.BookGroupObject.Verify($translate);
					if (msgTab && msgTab.length > 0) {
						$q.all(msgTab).then(function (translations) {
							// Show errors
                            var msgTab2 = [];
                            $.foreach(translations, function(idx, obj) {
                                msgTab2.push({Type:'danger', Message: obj});
                            });
                            $rootScope.$broadcast("ShowMessageEx", "Error", msgTab2);
						});
						return;
					}
				 
					// Now, submit to the server
					if ($scope.ActivityID === hih.Constants.UIMode_Create) {
						utils.createLibBookGroupQ($scope.BookGroupObject)
							.then(function (response) {
								$state.go("home.lib.bookgroup.display", { id: response });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibBookGroupQ($scope.BookGroupObject)
							.then(function (response) {
                                // Refresh it!
								$state.go("home.lib.bookgroup.display", { id: $scope.BookGroupObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					}
				};

				$scope.close = function () {
					$state.go("home.lib.bookgroup.list");
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
					var q5 = utils.loadLibBookTypeQ(false);
					$q.all([q1, q2, q3, q4, q5])
                        .then(function(response) {
                            $state.go("home.lib.book.create");
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
					var q5 = utils.loadLibBookTypeQ(false);
					$q.all([q1, q2, q3, q4, q5])
                        .then(function(response) {
                            $state.go("home.lib.book.display", { id: nid });                            
                        }, function(reason) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
					var q5 = utils.loadLibBookTypeQ(false);
					$q.all([q1, q2, q3, q4, q5])
						.then(function(response) {
							$state.go("home.lib.book.maintain", { id: nid });
						}, function(reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
						});					
				};
				$scope.removeItem = function (row) {
                    var nID = -1;
                    if (row) {
                        nID = row.ID;
                    } else {
                        var nSelectedCount = 0;
                        for(var i = 0; i < $scope.dispList.length; i ++) {
                            if ($scope.dispList[i].isSelected) {
                                nID = $scope.dispList[i].ID;
                                nSelectedCount ++;
                            }
                        }
                        if (nSelectedCount !== 1) {
                            $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: "Select only one group to delete."}]);
                            return;
                        }
                    }
                    
                    // Popup dialog for confirm
                    $rootScope.$broadcast('ShowMessage', "Delete", "Will delete the selected item!", "warning", function() {
                        $http.post(
                                'script/hihsrv.php',
                                {
                                    objecttype : 'DELETELIBBOOK',
                                    id: nID
                                })
                            .success(
                                function(data, status, headers, config) {
                                    $scope.refreshList(true);
                                })
                            .error(
                                function(data, status, headers, config) {
                                    $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
                                });
                    });
				};
				
				$scope.refreshList = function (bReload) {
					utils.loadLibBookQ(bReload)
						.then(function (response) {
							$scope.dispList = [].concat($rootScope.arLibBook);
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
                $scope.SelectedAuthorObject = new hih.LibBookAuthor();
                $scope.SelectedPressObject = new hih.LibBookPress();
                $scope.SelectedLocationObject = new hih.LibBookLocation();
                $scope.LanguagesCollection = [];
                $scope.NamesCollection = [];
                $scope.AuthorsCollection = [];
                $scope.PressesCollection = [];
                $scope.LocationsCollection = [];
                //$scope.LangControlInstance = null;
                $scope.arAuthors = [];
                $scope.arPresses = [];
                
                utils.loadLibAuthorQ()
                    .then(function(response) {
                        if ($.isArray(response) && response.length > 0) {
                            $.each(response, function(idx, obj) {
                                var bs = new hih.LibPerson();
                                bs.setContent(obj);
                                $scope.arAuthors.push(bs);
                            });
                        }                        
                    }, function(reason) {
                        $log.error(reason);
                    });
                utils.loadLibPressQ()
                    .then(function(response) {
                        if ($.isArray(response) && response.length > 0) {
                            $.each(response, function(idx, obj) {
                                var bs = new hih.LibOrganization();
                                bs.setContent(obj);
                                $scope.arPresses.push(bs);
                            });
                        }                        
                    }, function(reason) {
                        $log.error(reason);
                    });
                    
                $scope.nameLangConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Name Language control, event onChange, ', value);
                        $scope.SelectedNameObject.LangName = this.options[value].NativeName;
                    },
                    valueField: 'Language',
                    labelField: 'NativeName',
                    maxItems: 1,
                    required: true
                };
                $scope.langConfig = {
                    create: true,
                    onChange: function(value){
                        $log.info('LibBookController, Language control, event onChange, ', value);
                    },
                    onInitialize: function(objselectize){
                        //$scope.LangControlInstance = objselectize;
                    },
                    valueField: 'Language',
                    labelField: 'NativeName',
                    maxItems: 10,
                    required: true
                };
                $scope.typeConfig = {
                    create: true,
                    onChange: function(value){
                        $log.info('LibBookController, Type control, event onChange, ', value);
                    },
                    onInitialize: function(objselectize){
                        //$scope.LangControlInstance = objselectize;
                    },
                    valueField: 'ID',
                    labelField: 'FullDisplayName',
                    maxItems: 10
                };
                $scope.personConfig = {
                    create: false,
                    onChange: function(value){
                        $log.info('LibBookController, Person control, event onChange, ', value);
                        $scope.SelectedAuthorObject.Name = this.options[value].Name;
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
                        $scope.SelectedPressObject.Name = this.options[value].Name;
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
                        $scope.SelectedLocationObject.Name = this.options[value].Name;
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
                                    $scope.LanguagesCollection = [];
                                    $scope.NamesCollection = [].concat(obj.Names);
                                    $scope.AuthorsCollection = [].concat(obj.Authors);
                                    $scope.PressesCollection = [].concat(obj.Presses);
                                    $scope.LocationsCollection = [].concat(obj.Locations);
                                    
                                    // Set the language
                                    $.each($scope.BookObject.Languages, function(idx2, obj2) {
                                         $scope.LanguagesCollection.push(obj2.Language); //.createItem(obj); 
                                         //$scope.LangControlInstance.createItem(obj2.Language);
                                    });
                                    // // Set the type
                                    // $.each($scope.BookObject.Types, function(idx2, obj2) {
                                    //      $scope.BookTypesCollection.push(obj2.ID); //.createItem(obj); 
                                    // });
                                    
									return false;
								}
							});
						}, function (reason) {
							$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
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
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
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
                    if ($.isArray(rptMsgs) && rptMsgs.length > 0) {
                        $q.all(rptMsgs)
                            .then(function(response) {
                                Array.prototype.push.apply($scope.ReportedMessages, response);
                            }, function(reason) {
                                $rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: "Fatal error on loading texts!"}]);
                            });
                        return;
                    }
                    
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
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
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
                    
                    // Checks? to-do
                    
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
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
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
                    //             $rootScope.$broadcast("ShowMessageEx", "Error", "Fatal error on loading texts!");
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
                    $rootScope.$broadcast('ShowMessageEx', 'Delete Confirmation', [{Type: 'warning', Message: 'Confirm on deleta the selected item?'}], 
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
                    //             $rootScope.$broadcast("ShowMessageEx", "Error", "Fatal error on loading texts!");
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
                    $scope.cleanReportMessages();
                    
					// Verify it!
					// var msgTab = $scope.CategoryObject.Verify();
					// if (msgTab && msgTab.length > 0) {
					// 	$translate(msgTab).then(function (translations) {
					// 		// Show errors
					// 		$.each(translations, function (idx, obj) {
					// 			$rootScope.$broadcast("ShowMessageEx", "Error", obj);
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
					if ($scope.LanguagesCollection.length <= 0) return;
					$.each($scope.LanguagesCollection, function(idx, obj) {
                        var blang = new hih.LibBookLang();
                        blang.Language = obj;
						$scope.BookObject.Languages.push(blang);
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
					 			$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
					 		});
					} else if ($scope.ActivityID === hih.Constants.UIMode_Change) {
						utils.updateLibBookQ($scope.BookObject)
							.then(function (response) {
								$state.go("home.lib.book.display", { id: $scope.BookObject.ID });
							}, function (reason) {
								$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: reason}]);
							});
					 }
				};

				$scope.close = function () {
					$state.go("home.lib.book.list");
				};
			}])
	   ;
})();
