/* global $ */
/* global angular */
/* global hih */
(function() {
	"use strict";

	angular.module('hihApp.Utility', ['smart-table'])
		.directive('stringToFloat', function() {
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

		.directive('stringToInt', function() {
			return {
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel) {
					ngModel.$parsers.push(function(value) {
						return '' + value;
					});
					ngModel.$formatters.push(function(value) {
						return parseInt(value);
					});
				}
			};
		})

		.filter('idTostring', function() {
			return function(inputval) {
                //console.log(inputval);
                if (inputval === -1) return "";
                return inputval; 
			};
		})
		
		.directive('csSelect', function () {
			return {
				require: '^stTable',
				template: '<input type="checkbox"/>',
				scope: {
					row: '=csSelect'
				},
				link: function (scope, element, attr, ctrl) {
					element.bind('change', function (evt) {
						scope.$apply(function () {
							ctrl.select(scope.row, 'multiple');
						});
					});
		
					scope.$watch('row.isSelected', function (newValue, oldValue) {
						if (newValue === true) {
							element.parent().addClass('st-selected');
						} else {
							element.parent().removeClass('st-selected');
						}
					});
				}
			};
		})
		
		.directive('cstSum', function () {
			return {
				restrict: 'E',
				require: '^stTable',
				template: '<div>{{ "Common.Sum" | translate }}: {{ sum_columnname }} </div>',
				scope: {
					columnname: '@columnname'					
				},
				controller: function ($scope) {
					$scope.sum_columnname = 0.0;
				},
				link: function (scope, element, attr, ctrl) {
					scope.$watch(ctrl.getFilteredCollection, function(val) {
						var nArr = (val || []);
						scope.sum_columnname = 0;
						for(var i = 0; i < nArr.length; i ++) {
							scope.sum_columnname += parseFloat(nArr[i][scope.columnname]);
						}
						scope.sum_columnname = scope.sum_columnname.toFixed(2);
					});
				}
			};
		})
			
		.directive('cstCount', function () {
			return {
				restrict: 'E',
				require: '^stTable',
				template: '<div>{{ "Common.Count" | translate }}: {{ cnt_columnname }} </div>',
				scope: {
				},
				controller: function ($scope) {
					$scope.cnt_columnname = 0;
				},
				link: function (scope, element, attr, ctrl) {
					scope.$watch(ctrl.getFilteredCollection, function(val) {
						var nArr = (val || []);
						scope.cnt_columnname = nArr.length;
					});
				}
			};
		})

		.directive('cstMax', function () {
			return {
				restrict: 'E',
				require: '^stTable',
				template: '<div>{{ "Common.Max" | translate }}: {{ max_columnname }} </div>',
				scope: {
						columnname: '@columnname'
				},
				controller: function ($scope) {
					$scope.max_columnname = 0;
				},
				link: function (scope, element, attr, ctrl) {
					scope.$watch(ctrl.getFilteredCollection, function(val) {
						var nArr = (val || []);
						for(var i = 0; i < nArr.length; i ++) {
							if (i === 1) {
								scope.max_columnname = nArr[i][scope.columnname];
							}
							
							if (scope.sum_columnname < nArr[i][scope.columnname]) {
								scope.sum_columnname = nArr[i][scope.columnname]
							}
						}
					});
				}
			};
		})

		.factory(
			'utils',
					function($rootScope, $http, $q) {
						
						var rtnObj = {};
						
						rtnObj.findById = function (a, id) {
							for (var i = 0; i < a.length; i++) {
								if (a[i].id === id)
									return a[i];
							}
							return null;
						};
						rtnObj.newRandomKey = function (coll, key, currentKey) {
							var randKey;
							do {
								randKey = coll[Math.floor(coll.length
										* Math.random())][key];
							} while (randKey === currentKey);
							return randKey;
						};
						
						rtnObj.assetFormatter = function(assetflg) {
							var nAsset = parseInt(assetflg);
							if (nAsset === 1) return "Asset";
							return "Liability";
						};
						rtnObj.genderFormatter = function(gender) {
							var nGen = parseInt(gender);
							if (nGen === 1) return "Login.Male";
							return "Login.Female";
						};
						rtnObj.dateformatter = function (date) {
							var y = date.getFullYear();
							var m = date.getMonth() + 1;
							var d = date.getDate();
							return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
						};
						rtnObj.datefromdbtoui = function (s) {
//							var dt1 = new Date();
//							if (!s) {}
//							else 
//							{
//								var ss = (s.split('-'));
//								var y = parseInt(ss[0], 10);
//								var m = parseInt(ss[1], 10);
//								var d = parseInt(ss[2], 10);
//								if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
//									dt1 = new Date(y, m - 1, d);
//								} else {
//									dt1 =  new Date();
//								}									
//							}
//							
//							return this.dateformatter(dt1);
						};
						rtnObj.flat2nested = function (arFlat) {
							var arOutput = [];
							var rec_func = function (curparid) {
								for(var i = 0; i < arFlat.length; i ++) {
									if(arFlat[i].parent === curparid) {
										var nnode = {};
										angular.copy(arFlat[i], nnode);
										
										arOutput.push(nnode);										
										rec_func(nnode.id);										
									}
								}
							};
							
							if (angular.isArray(arFlat) && arFlat.length > 0) {								 
								 rec_func("#");
							} 
							
							return arOutput;
						};
						rtnObj.dateparser = function(s) {
							if (!s)
								return new Date();
							var ss = (s.split('-'));
							var y = parseInt(ss[0], 10);
							var m = parseInt(ss[1], 10);
							var d = parseInt(ss[2], 10);
							if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
								return new Date(y, m - 1, d);
							} else {
								return new Date();
							}
						};
						rtnObj.getThemeCSSPath = function(theme) {
							var arCSS = [];
							var urlcss1 = "app/3rdparty/bootswatch-3.3.6-1/";
							var urlcss2 = "/bootstrap.min.css";
							
							arCSS.push(urlcss1.concat(theme, urlcss2));
							if (theme !== "default") {
								arCSS.push("app/css/empty.css"); 
							} else {
								arCSS.push(urlcss1.concat(theme, "/bootstrap-theme.min.css"));
							}
							
							return arCSS;
						};
		
////////////////////////////////////////////////////////////////////						
// Common part
////////////////////////////////////////////////////////////////////
						rtnObj.getExpectedExchangeRate = function(curdate, forgncurr) {
							// Then, search for the latest rate
							var allrates = [];
							$.each($rootScope.arFinanceExchangeRate, function(idx, obj) {
								if (obj.ForeignCurrency === forgncurr) {
									allrates.push(obj);
								}
							});
							
							if (allrates.length > 0) {
								allrates.sort(function(a, b) {
									if (a.TranDate < b.TranDate) return 1;
									else return -1;
								});
								
								// Then, get the latest one
								return allrates.shift().Rate;						
							} 
							return null;
						};					
						
////////////////////////////////////////////////////////////////////						
// User part
////////////////////////////////////////////////////////////////////						
						// User part
						rtnObj.loadUserList = function () {
							if (!$rootScope.isUserListLoad) {
								$http.post(
										'script/hihsrv.php',
										{
											objecttype : 'GETUSERLIST'
										})
									.success(
											function(data, status, headers, config) {
												$rootScope.arUserList = [];
												if ($.isArray(data) && data.length > 0) {
													$.each(data, function(idx1, obj1) {
														var objUsr = new hih.User();
														objUsr.setContent(obj1);
														$rootScope.arUserList.push(objUsr);
													});													
												}
												$rootScope.isUserListLoad = true;

												$rootScope.$broadcast("UserListLoaded");
											})
									.error(
											function(data, status, headers, config) {
												// called asynchronously if an error occurs or server returns response with an error status.
												$rootScope.$broadcast(
														"ShowMessageEx",
														"Error",
														[{Type: 'danger', Message: data.Message}]);
											});
							}							
						};
						rtnObj.loadUserListQ = function (bForceReload) {
							// Load users  with $q supports
							var deferred = $q.defer();
							if ($rootScope.isUserListLoad && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETUSERLIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arUserList = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var objUsr = new hih.User();
												objUsr.setContent(obj);
												$rootScope.arUserList.push(objUsr);
											});
										}
										$rootScope.isUserListLoad = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.registerUserQ = function(objRegUsr) {
							var deferred = $q.defer();
							var jsonUsr = objRegUsr.ToJSON();
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'REGISTERUSER', jsonData: jsonUsr })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response);
								});
							return deferred.promise;							
						};
						rtnObj.loadUserLogListQ = function() {
							var deferred = $q.defer();
							if ($rootScope.isUserLogListLoad) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETUSERLOGHIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arUserLogList = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var objUsrLog = new hih.UserLog();
												objUsrLog.setContent(obj);
												$rootScope.arUserLogList.push(objUsrLog);
											});
										}
										$rootScope.isUserLogListLoad = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
////////////////////////////////////////////////////////////////////						
// Learn part
////////////////////////////////////////////////////////////////////
						// Learn objects
						rtnObj.loadLearnObjects = function (bForceReload) {
							if (!$rootScope.isLearnObjectLoad || (angular.isDefined(bForceReload) && bForceReload)) {
								// Example JSON response
								// {"id":"1","categoryid":"2","categoryname":"aaa","name":"aaa","content":"aaa2"}
								$http.post(
											'script/hihsrv.php',
											{
												objecttype : 'GETLEARNOBJECTLIST'
											})
									.success(
											function(data, status, headers, config) {
												$rootScope.arLearnObject = [];
												if($.isArray(data) && data.length > 0) {
													$.each(data, function(idx1, obj1) {
														var lrnobj = new hih.LearnObject();
														lrnobj.setContent(obj1);
														$rootScope.arLearnObject.push(lrnobj);
													});													
												}
												$rootScope.isLearnObjectLoad = true;

												$rootScope.$broadcast("LearnObjectLoaded");
											})												
										.error(
											function(data, status, headers, config) {
												// called asynchronously if an error occurs or server returns response with an error status.
												$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
											});
							}
						};
						rtnObj.loadLearnObjectsQ = function (bForceReload) {
							var deferred = $q.defer();		
							if ($rootScope.isLearnObjectLoad && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLEARNOBJECTLIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arLearnObject = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj1) {
												var lrnobj = new hih.LearnObject();
												lrnobj.setContent(obj1);
												lrnobj.buildRelationship($rootScope.arLearnCategory);
												$rootScope.arLearnObject.push(lrnobj);
											});
										}
										$rootScope.isLearnObjectLoad = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadLearnObjectsHierarchy = function (bForceReload) {
							if (!$rootScope.isLearnObjectHierarchyLoad || (angular.isDefined(bForceReload) && bForceReload)) {
								// Example JSON response
								// {"categoryid":"1","categoryname":"aaa","categoryparid":"#","objectid":null,"objectname":null,"objectcontent":null}
								$http
									.post(
											'script/hihsrv.php',
											{
												objecttype : 'GETLEARNOBJECTHIERARCHY'
											})
									.success(
											function(data, status, headers, config) {
												$rootScope.isLearnObjectHierarchyLoad = true;
												$rootScope.arLearnObjectHierarchy = [];
												
												var ctgypre = "ctgy";
												var objpre = "obj";
												if (angular.isArray(data) && data.length > 0) {
													var arTmpCtgy = [];
													var bCtgyExist = false;
													$.each(data, function(idx, obj) {
														// Build up the real key for the hierarchy
														var lhn = {};
														if (!obj.objectid) {
															lhn.id = ctgypre.concat(obj.categoryid);
															if (obj.categoryparid === '#') {
																lhn.parent = '#';
															} else {
																lhn.parent = ctgypre.concat(obj.categoryparid);
															}
															lhn.text = obj.categoryname;
															lhn.type = "default";
														} else {
															bCtgyExist = false;
															if (arTmpCtgy.length > 0) {
																$.each(arTmpCtgy, function(idx3, obj3) {
																	if(obj3 === obj.categoryid) {
																		bCtgyExist = true;
																		return false;
																	} 
																});																	
															}
															
															if (!bCtgyExist) {
																arTmpCtgy.push(obj.categoryid);
																
																var lhn2 = {};
																lhn2.id = ctgypre.concat(obj.categoryid);
																if (obj.categoryparid === '#') {
																	lhn2.parent = '#';
																} else {
																	lhn2.parent = ctgypre.concat(obj.categoryparid);
																}
																lhn2.text = obj.categoryname;
																lhn.type = "default";
																$rootScope.arLearnObjectHierarchy.push(lhn2);
															}
															
															lhn.id = objpre.concat(obj.objectid);
															lhn.parent = ctgypre.concat(obj.categoryid);
															lhn.text = obj.objectname;
															lhn.type = "object";
														}										
														
														$rootScope.arLearnObjectHierarchy.push(lhn);	
													});
												}

												$rootScope.$broadcast("LearnObjectHierarchyLoaded");
											})												
										.error(
											function(data, status, headers, config) {
												// called asynchronously if an error occurs or server returns response with an error status.
												$rootScope.$broadcast( "ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
											});
							}
						};
                        rtnObj.readLearnObjectQ = function(nObjID) {
							var deferred = $q.defer();
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'GETLEARNOBJECTDETAIL', id: nObjID })
                                .then(function(response) {
                                    if ($.isArray(response.data) && response.data.length > 0) {
                                        $.each(response.data, function(idx, obj1) {
                                            var lrnobj = new hih.LearnObject();
                                            lrnobj.setContent(obj1);
                                            lrnobj.buildRelationship($rootScope.arLearnCategory);
                                            
                                            // Find out the elder one and replace it.
                                            if ( !$rootScope.arLearnObject) {
                                                $rootScope.arLearnObject = [];
                                                $rootScope.arLearnObject.push(lrnobj);
                                            } else {
                                                var realidx = -1;
                                                for(var i = 0; i < $rootScope.arLearnObject.length; i ++ ) {
                                                    if ($rootScope.arLearnObject[i].ID === lrnobj.ID) {
                                                        realidx = i;
                                                        break;
                                                    }
                                                }
                                                if (realidx !== -1) {
                                                    $rootScope.arLearnObject[realidx] = lrnobj;
                                                } else {
                                                    $rootScope.arLearnObject.push(lrnobj);
                                                }
                                            }
                                        });
                                    }
                                    deferred.resolve(true);
                                }, function(response) {
                                    deferred.reject(response.data.Message);
                                });
							
							return deferred.promise;
                        };
						rtnObj.createLearnObjectQ = function(objLearnObj) {
							var deferred = $q.defer();
							var jsonData = objLearnObj.toJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNOBJECT2', jsonData: jsonData } )
									.then(function(response) {
                                        deferred.resolve(response.data);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;							
						};
						rtnObj.changeLearnObjectQ = function(objLearnObj) {
							var deferred = $q.defer();
							var jsonData = objLearnObj.toJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CHANGELEARNOBJECT', jsonData: jsonData } )
									.then(function(response) {
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;
						};
						rtnObj.checkLearnObjectUsageQ = function(strIDs) {
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype: 'CHECKLEARNOBJECTSUSAGE', ids: strIDs } )
									.then(function(response) {
										deferred.resolve(parseInt(response.data));											
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;							
						};
						rtnObj.deleteLearnObjectsQ = function(strIDs) {
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype: 'DELETELEARNOBJECTS', ids: strIDs } )
									.then(function(response) {
										deferred.resolve(response.data);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;
						};
						// Learn histories
						rtnObj.loadLearnHistories = function (bForceReload) {
							if (!$rootScope.isLearnHistoryLoaded || (angular.isDefined(bForceReload) && bForceReload)) {
								$http.post('script/hihsrv.php',
											{
												objecttype : 'GETLEARNHISTORYLIST'
											})
									.success(
											function(data, status, headers, config) {
												// Sample response
												// userid, displayas, objectid, objectname, categoryid, categoryname, learndate, objectcontent, comment
												$rootScope.arLearnHistory = [];
												if ($.isArray(data) && data.length > 0) {
													$.each(data, function(idx, obj){
														var lrnhist = hih.LearnHistory.createNew();
														lrnhist.setContent(obj);
														lrnhist.buildRelationship($rootScope.arUserList, $rootScope.arLearnObject);
														$rootScope.arLearnHistory.push(lrnhist);
													});
												}
												$rootScope.isLearnHistoryLoaded = true;

												$rootScope.$broadcast("LearnHistoryLoaded");
											})
									 .error(
											function(data, status, headers, config) {
												$rootScope.$broadcast("ShowMessageEx","Error", [{Type: 'danger', Message: data.Message}]);
											});
							}
						};
						rtnObj.loadLearnHistoriesQ = function (bForceReload) {
							// Load learn histories with $q supports
							var deferred = $q.defer();							
							if ($rootScope.isLearnHistoryLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLEARNHISTORYLIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arLearnHistory = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var lrnhist = hih.LearnHistory.createNew();
												lrnhist.setContent(obj);
												lrnhist.buildRelationship($rootScope.arUserList, $rootScope.arLearnObject);
												$rootScope.arLearnHistory.push(lrnhist);
											});
										}
										$rootScope.isLearnHistoryLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.createLearnHistoryQ = function(objLearnHistory) {
							var deferred = $q.defer();
							var jsonData = objLearnHistory.toJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNHISTORY', jsonData: jsonData } )
								.then(function(response) {
									// Add it into the global memory
									var lrnHist = hih.LearnHistory.createNew();
									lrnHist.ObjectID = parseInt(objLearnHistory.ObjectID);
									lrnHist.LearnDate = objLearnHistory.LearnDate;
									lrnHist.UserID = objLearnHistory.UserID;
									lrnHist.Comment = objLearnHistory.Comment;
									lrnHist.Transfer();
									lrnHist.buildRelationship($rootScope.arUserList, $rootScope.arLearnObject);
									$rootScope.arLearnHistory.push(lrnHist);
									
									deferred.resolve(lrnHist.getLogicKey());
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;							
						};
						rtnObj.changeLearnHistoryQ = function(objLearnHistory) {
							var deferred = $q.defer();
							var jsonData = objLearnHistory.toJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CHANGELEARNHISTORY', jsonData: jsonData } )
									.then(function(response) {
										// Update the global memory
										var oldidx = -1;
										for(var idx = 0; idx < $rootScope.arLearnHistory.length; idx ++) {
											if ($rootScope.arLearnHistory[idx].getLogicKey() === objLearnHistory.getlogicKey()) {
												oldidx = idx;
												break;
											}
										}
										if (oldidx !== -1 ) {
											$rootScope.arLearnHistory.splice(oldidx, 1);
										}
										
										var lrnHist = hih.LearnHistory.createNew();
										lrnHist.ObjectID = parseInt(objLearnHistory.ObjectID);
										lrnHist.LearnDate = objLearnHistory.LearnDate;
										lrnHist.UserID = objLearnHistory.UserID;
										lrnHist.Comment = objLearnHistory.Comment;
										lrnHist.Transfer();
										lrnHist.buildRelationship($rootScope.arUserList, $rootScope.arLearnObject);
										$rootScope.arLearnHistory.push(lrnHist);
										
										deferred.resolve(lrnHist.getLogicKey());
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;							
						};
						rtnObj.deleteLearnHistoryQ = function(objLearnHistory) {
							var deferred = $q.defer();
							var jsonData = objLearnHistory.toJSON();
							$http.post('script/hihsrv.php', { objecttype: 'DELETELEARNHISTORY', jsonData: jsonData } )
									.then(function(response) {
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;
						};
						rtnObj.deleteLearnHistoriesQ = function(arHistories) {
							var deferred = $q.defer();
							deferred.reject("No multiple deletion allowed so far!");
							return deferred.promise;							
						};
						// Learn plans
						rtnObj.loadLearnPlansQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isLearnPlanLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLEARNPLANLIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arLearnPlan = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												if (idx === 0) { // Plan header
													$.each(obj, function(idx2, obj2) {
														var lrnplan = new hih.LearnPlan();
														lrnplan.setContent(obj2);
														lrnplan.buildRelationship($rootScope.arLearnObject, $rootScope.arUserList);
														$rootScope.arLearnPlan.push(lrnplan);
													});
												} else if (idx === 1) { // Plan detail
													$.each(obj, function(idx2, obj2) {
														$.each($rootScope.arLearnPlan, function(idx3, obj3) {
															if (obj3.ID === parseInt(obj2.id)) {
																var pdetail = new hih.LearnPlanDetail();
																pdetail.setContent(obj2);
																pdetail.buildRelationship($rootScope.arLearnObject);
																obj3.Details.push(pdetail);
															}
														});
													});
												} else if (idx === 2) { // Plan participant
													$.each(obj, function(idx2, obj2) {
														$.each($rootScope.arLearnPlan, function(idx3, obj3) {
															if (obj3.ID === parseInt(obj2.id)) {
																var ppart = new hih.LearnPlanParticipant();
																ppart.setContent(obj2);
																ppart.buildRelationship($rootScope.arUserList);
																obj3.Participants.push(ppart);
															}
														});
													});													
												}
											});
										}
										$rootScope.isLearnPlanLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.createLearnPlanQ = function(objLearnPlan) {
							var deferred = $q.defer();
							var jsonData = objLearnPlan.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNPLAN', jsonData: jsonData } )
								.then(function(response) {
									// Add it into the global memory
									var nPlanID = parseInt(response.data);
									objLearnPlan.ID = nPlanID;
									$.each(objLearnPlan.Details, function(idx, obj) {
										obj.ID = nPlanID;
									});
									$.each(objLearnPlan.Participants, function(idx, obj) {
										obj.ID = nPlanID;
									});
									
									objLearnPlan.buildRelationship($rootScope.arLearnObject);
									$rootScope.arLearnPlan.push(objLearnPlan);
									
									deferred.resolve(nPlanID);
								}, function(response) {
									deferred.reject(response.data.Message);
								});

							return deferred.promise;
						};
						rtnObj.changeLearnPlanQ = function(objLearnPlan) {
							var deferred = $q.defer();
							var jsonData = objLearnPlan.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CHANGELEARNPLAN', jsonData: jsonData } )
								.then(function(response) {
									// Update the global memory
									var oldidx = -1;
									for(var idx = 0; idx < $rootScope.arLearnPlan.length; idx ++) {
										if ($rootScope.arLearnPlan[idx].ID === objLearnPlan.ID) {
											oldidx = idx;
											break;
										}
									}
									if (oldidx !== -1 ) {
										$rootScope.arLearnPlan.splice(oldidx, 1);
									}
									
									objLearnPlan.buildRelationship($rootScope.arLearnObject);
									$rootScope.arLearnPlan.push(objLearnPlan);
									
									deferred.resolve(objLearnPlan.ID);
								}, function(response) {
									deferred.reject(response.data.Message);
								});

							return deferred.promise;							
						};
						rtnObj.deleteLearnPlanQ = function(nPlanID) {
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype: 'DELETELEARNPLAN', planid: nPlanID } )
								.then(function(response) {
									// Update the global memory
									var oldidx = -1;
									for(var idx = 0; idx < $rootScope.arLearnPlan.length; idx ++) {
										if ($rootScope.arLearnPlan[idx].ID === nPlanID) {
											oldidx = idx;
											break;
										}
									}
									if (oldidx !== -1 ) {
										$rootScope.arLearnPlan.splice(oldidx, 1);
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});

							return deferred.promise;							
						};
						// Learn awards
						rtnObj.loadLearnAwards = function (bForceReload) {
							if (!$rootScope.isLearnAwardLoaded || (angular.isDefined(bForceReload) && bForceReload)) {
								
								$http.post(
											'script/hihsrv.php',
											{
												objecttype : 'GETLEARNAWARDLIST'
											})
									.success(
											function(data, status,headers, config) {
												$rootScope.arLearnAward = [];
												// Sample response
												// id, userid, displayas, adate, score, reason
												if ($.isArray(data) && data.length >0 ) {
													$.each(data, function(idx, obj) {
														var lrnawd = new hih.LearnAward();
														lrnawd.setContent(obj);
														$rootScope.arLearnAward.push(lrnawd);
													});
												}
												$rootScope.isLearnAwardLoaded = true;

												$rootScope.$broadcast("LearnAwardLoaded");
											})
									.error(
											function(data, status, headers, config) {
												// called asynchronously if an error occurs or server returns response with an error status.
												$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
											});
							}
						};
						rtnObj.loadLearnAwardsQ = function (bForceReload) {
							var deferred = $q.defer();							
							if ($rootScope.isLearnAwardLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLEARNAWARDLIST' })
									.then(function(response) {
										// The response object has these properties:
										$rootScope.arLearnAward = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var lrnawd = new hih.LearnAward();
												lrnawd.setContent(obj);
												$rootScope.arLearnAward.push(lrnawd);
											});
										}
										$rootScope.isLearnAwardLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.createLearnAwardQ = function(objAward) {
							var deferred = $q.defer();
							var jsonData = objAward.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNAWARD2', jsonData: jsonData } )
								.then(function(response) {
									var nAwdID = -1;
									if ($.isArray(response.data) && response.data.length > 0 ) {
										$.each(response.data, function(idx, obj) {
											var newObj = new hih.LearnAward();
											newObj.setContent(obj);
											newObj.buildRelationship($rootScope.arUserList);
											nAwdID = newObj.ID;
											$rootScope.arLearnAward.push(newObj);
										});
									}
									deferred.resolve(nAwdID);
								}, function(response) {
									deferred.reject(response.data.Message);
								});

							return deferred.promise;							
						};
						rtnObj.changeLearnAwardQ = function(objAward) {
							var deferred = $q.defer();
							var jsonData = objAward.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CHANGELEARNAWARD', jsonData: jsonData } )
								.then(function(response) {
									// Update the global memory
									var oldidx = -1;
									for(var idx = 0; idx < $rootScope.arLearnAward.length; idx ++) {
										if ($rootScope.arLearnAward[idx].ID === objAward.ID) {
											oldidx = idx;
											break;
										}
									}
									if (oldidx !== -1 ) {
										$rootScope.arLearnAward.splice(oldidx, 1);
									}
									
									objAward.buildRelationship($rootScope.arUserList);
									$rootScope.arLearnAward.push(objAward);
									
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});

							return deferred.promise;
						};
						rtnObj.deleteLearnAwardQ = function(nAwardID) {
							// To-DO
						};
						// Learn categories
						rtnObj.loadLearnCategories = function () {
							if (!$rootScope.isLearnCategoryLoaded) {
								// Example JSON response:
								// {"id":"1","parent":"#","text":"aaa","comment":"aaa"}
								$http.post(
									'script/hihsrv.php',
									{
										objecttype : 'GETLEARNCATEGORYLIST'
									})
									.success(function(data, status, headers, config) {
										$rootScope.arLearnCategory = [];
										if ($.isArray(data) && data.length > 0){
											$.each(data, function(idx, obj){
												var lrnctgy = new hih.LearnCategory();
												lrnctgy.setContent(obj);
												$rootScope.arLearnCategory.push(lrnctgy);
											});
											
											// Then, build the runtime information
											$.each($rootScope.arLearnCategory, function(idx, obj) {
												obj.buildParentConnection($rootScope.arLearnCategory);
												obj.buildFullText();
											});
										}
										$rootScope.isLearnCategoryLoaded = true;

										$rootScope.$broadcast("LearnCategoryLoaded");
									})
									.error(function(data, status, headers, config) {
										// called asynchronously if an error occurs or server returns response with an error status.
										$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
									});
							}
						};
						rtnObj.loadLearnCategoriesQ = function (bForceReload) {
							var deferred = $q.defer();							
							if ($rootScope.isLearnCategoryLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLEARNCATEGORYLIST' })
									.then(function(response) {
										$rootScope.arLearnCategory = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var lrnctgy = new hih.LearnCategory();
												lrnctgy.setContent(obj);
												$rootScope.arLearnCategory.push(lrnctgy);
											});
											
											// Then, build the runtime information
											$.each($rootScope.arLearnCategory, function(idx, obj) {
												obj.buildParentConnection($rootScope.arLearnCategory);
												obj.buildFullText();
											});
										}
										$rootScope.isLearnCategoryLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.createLearnCategoryQ = function(objLearnCtgy) {
							var deferred = $q.defer();
							var jsonData = objLearnCtgy.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CREATELEARNCATEGORY', jsonData: jsonData } )
									.then(function(response) {
										if ($.isArray(response.data) && response.data.length >= 1) {
											var lrnctgy = new hih.LearnCategory();
											lrnctgy.setContent(response.data[0]);
											$rootScope.arLearnCategory.push(lrnctgy);
	
											deferred.resolve(lrnctgy.ID);
										}
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;							
						};
						rtnObj.changeLearnCategoryQ = function(objLearnCtgy) {
							var deferred = $q.defer();
							var jsonData = objLearnCtgy.ToJSON();
							$http.post('script/hihsrv.php', { objecttype: 'CHANGELEARNCATEGORY', jsonData: jsonData } )
									.then(function(response) {
										var oldidx = -1;
										for(var idx = 0; idx < $rootScope.arLearnCategory.length; idx ++) {
											if ($rootScope.arLearnCategory[idx].ID === objLearnCtgy.ID) {
												oldidx = idx;
												break;
											}
										}
										if (oldidx !== -1 ) {
											$rootScope.arLearnCategory.splice(oldidx, 1);
										}
										
										//objLearnCtgy.buildRelationship($rootScope.arLearnCategory);
										$rootScope.arLearnCategory.push(objLearnCtgy);
										
										deferred.resolve(objLearnCtgy.ID);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;
						};
						rtnObj.checkLearnCategoryUsageQ = function(strIDs) {
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype: 'CHECKLEARNCTGYSUSAGE', ids: strIDs } )
									.then(function(response) {
										deferred.resolve(parseInt(response.data));											
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;							
						};
						rtnObj.deleteLearnCategoryQ = function(strIDs) {
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype: 'DELETELEARNOBJECTS', ids: strIDs } )
									.then(function(response) {
										deferred.resolve(response.data);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							return deferred.promise;
						};
                        // Get the plans displayed in welcome page
                        rtnObj.getLearnPlanActListQ = function() {
							var todate = new Date();
							todate.setDate(todate.getDate() + 15);
							var todate2 = hih.ModelUtility.DatabaseDateFormatter(todate);
							
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'GETLEANPLAN_ACTLIST', tdate: todate2})
							.then(function(response) {
								deferred.resolve(response.data);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
                        };

////////////////////////////////////////////////////////////////////
// Finance part
////////////////////////////////////////////////////////////////////

// Finance part: Setting
						rtnObj.loadFinanceSettingQ = function() {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype : 'GETFINANCESETTING' })
								.then(function(response) {
									if ($.isArray(response.data) && response.data.length > 0) {
										var fs = new hih.FinanceSetting();
										fs.setContent(response.data);
										$rootScope.objFinanceSetting = fs;
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
// Finance part: Exg rate table
						rtnObj.loadFinanceExchangeRateInfoQ = function() {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype : 'GETFINANCEEXGRATEINFO' })
								.then(function(response) {
									// 	"trandate" => $row [0], "forgcurr" => $row [1], "exgrate" => $row [2], "refdocid" => $row [3]
									$rootScope.arFinanceExchangeRate = [];
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj){
											var er = new hih.FinanceExchangeRate();
											er.setContent(obj);
											$rootScope.arFinanceExchangeRate.push(er);
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};					
// Finance part: Currencies
						rtnObj.loadCurrencies = function() {
						    if (!$rootScope.isCurrencyLoaded) {
						        // Example JSON response
						        // {"curr":"CNY","name":"aaa","symbol":null}
								$http.post('script/hihsrv.php',
												{
													objecttype : 'GETCURRENCYLIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arCurrency = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj) {
															var curobj = new hih.Currency();
															curobj.setContent(obj, $rootScope.objFinanceSetting);
															$rootScope.arCurrency.push(curobj);
														});
													}
													$rootScope.isCurrencyLoaded = true;

													$rootScope.$broadcast("CurrencyLoaded");
												})
										 .error(
												function(data, status, headers, config) {
													// called asynchronously if an error occurs or server returns response with an error status.
													$rootScope.$broadcast(
															"ShowMessageEx",
															"Error",
															[{Type: 'danger', Message: data.Message}]);
												});
							}							
						};
						rtnObj.loadCurrenciesQ = function(bForceReload) {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							if ($rootScope.isCurrencyLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETCURRENCYLIST' })
									.then(function(response) {
										$rootScope.arCurrency = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var curobj = new hih.Currency();
												curobj.setContent(obj);
												$rootScope.arCurrency.push(curobj);
											});
										}
										$rootScope.isCurrencyLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};						
// Finance part: Account
						rtnObj.createFinanceAccountQ = function(jsonAcnt) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCEACCOUNT',
								acdata: jsonAcnt })
							.then(function(response) {
								if ($.isArray(response.data) && response.data.length === 1) {
									var finacnt = new hih.FinanceAccount();
									finacnt.setContent(response.data[0]);
									finacnt.buildCategory($rootScope.arFinanceAccountCategory);
									$rootScope.arFinanceAccount.push(finacnt);
	
									deferred.resolve(finacnt.ID);									
								} else {
									deferred.resolve(null);
								} 								
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;							
						};
						rtnObj.changeFinanceAccountQ = function(objAcnt) {
							var deferred = $q.defer();
							var strJSON = JSON && JSON.stringify(objAcnt);
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CHANGEFINANCEACCOUNT',
								acdata: strJSON })
							.then(function(response) {
								// Update the global memory
								var oldidx = -1;
								for(var idx = 0; idx < $rootScope.arFinanceAccount.length; idx ++) {
									if ($rootScope.arFinanceAccount[idx].ID === parseInt(objAcnt.ID)) {
										oldidx = idx;
										break;
									}
								}
								if (oldidx !== -1 ) {
									$rootScope.arFinanceAccount.splice(oldidx, 1);
								}
								
								objAcnt.buildCategory($rootScope.arFinanceAccountCategory);
								$rootScope.arFinanceAccount.push(objAcnt);
								
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.deleteFinanceAccountQ = function(acntid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'DELETEFINANCEACCOUNT', acntid: acntid})
							.then(function(response) {
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;							
						};
						rtnObj.loadFinanceAccountsQ = function(bForceReload) {
							// Load finance accounts with $q supports
							var deferred = $q.defer();							
							if ($rootScope.isFinanceAccountLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCEACCOUNTLIST' })
									.then(function(response) {
										// The response object has these properties:
										// data – {string|Object} – The response body transformed with the transform functions.
										// status – {number} – HTTP status code of the response.
										// headers – {function([headerName])} – Header getter function.
										// config – {Object} – The configuration object that was used to generate the request.
										// statusText – {string} – HTTP status text of the response.
										$rootScope.arFinanceAccount = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var finacnt = new hih.FinanceAccount();
												finacnt.setContent(obj);
												finacnt.buildCategory($rootScope.arFinanceAccountCategory);
												$rootScope.arFinanceAccount.push(finacnt);
											});
										}
										$rootScope.isFinanceAccountLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceAccountDPInfoQ = function(accountid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEDPACCOUNTDETAIL', acntid: accountid })
								.then(function(response) {
									var rst = [];
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											if (idx === 0) {
												// Accounts
												if ($.isArray(obj) && obj.length > 0) {
													var dpAcnt = new hih.FinanceAccountDownpayment();
													dpAcnt.setContent(obj[0]);
													rst.push(dpAcnt);
												}
											} else if (idx === 1) {
												// Tmp docs
												var tmpDocs = [];
												$.each(obj, function(idx2, obj2) {
													var tmpdoc = new hih.FinanceDPTempDoc();
													tmpdoc.setContent(obj2);
													tmpDocs.push(tmpdoc);
												});
												
												rst.push(tmpDocs);
											} else {
												console.log("Error occurs: ");
												console.log(response.data);
											}
										});
									}
									deferred.resolve(rst);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
								
							return deferred.promise;
						};
						rtnObj.loadFinanceAccounts = function() {
							if (!$rootScope.isFinanceAccountLoaded) {
							    // Example JSON response
							    // {"id":"4","ctgyid":"1","name":"aaa","comment":"aaa","ctgyname":"aaa","assetflag":"1"}
							    $http.post( 'script/hihsrv.php',
									{ objecttype : 'GETFINANCEACCOUNTLIST' })
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceAccount = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj) {
															var finacnt = new hih.FinanceAccount();
															finacnt.setContent(obj);
															finacnt.buildCategory($rootScope.arFinanceAccountCategory);
															$rootScope.arFinanceAccount.push(finacnt);
														});
													}
													$rootScope.isFinanceAccountLoaded = true;

													$rootScope.$broadcast("FinanceAccountLoaded");
												})
										 .error(
												function(data, status, headers, config) {
													// called asynchronously if an error occurs or server returns response with an error status.
													$rootScope.$broadcast(
															"ShowMessageEx",
															"Error",
															[{Type: 'danger', Message: data.Message}]);
												});
							}							
						};
						rtnObj.loadFinanceAccountHierarchyQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceAccountHierarchyLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post('script/hihsrv.php',
										{ objecttype : 'GETFINANCEACCOUNTHIERARCHY' })
									.then(function(response) {
										$rootScope.arFinanceAccountHierarchy = response.data;
										$rootScope.isFinanceAccountHierarchyLoaded = true;
										deferred.resolve(true);
									}, function(reason) {
										deferred.reject(reason.data.Message);
									})
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceAccountHierarchy = function() {
							if (!$rootScope.isFinanceAccountHierarchyLoaded) {
							    // Example JSON response
							    $http.post('script/hihsrv.php',
										{ objecttype : 'GETFINANCEACCOUNTHIERARCHY' })
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceAccountHierarchy = data;
													$rootScope.isFinanceAccountHierarchyLoaded = true;

													$rootScope.$broadcast("FinanceAccountHierarchyLoaded");
												})
										 .error(
												function(data, status, headers, config) {
													// called asynchronously if an error occurs or server returns response with an error status.
													$rootScope.$broadcast(
															"ShowMessageEx",
															"Error",
															[{Type: 'danger', Message: data.Message}]);
												});
							}							
						};
// Finance part: Account category
						rtnObj.loadFinanceAccountCategoriesQ = function(bForceReload) {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							if ($rootScope.isFinanceAccountCategoryLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCEACCOUNTCATEGORYLIST' })
									.then(function(response) {
										$rootScope.arFinanceAccountCategory = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var finacntctgy = new hih.FinanceAccountCategory();
												finacntctgy.setContent(obj);
												$rootScope.arFinanceAccountCategory.push(finacntctgy);
											});
										}
										$rootScope.isFinanceAccountCategoryLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceAccountCategories = function() {
							if (!$rootScope.isFinanceAccountCategoryLoaded) {
							    // Example JSON response
							    // {"id":"1","name":"aaa","assetflag":"1","comment":null}
							    $http.post( 'script/hihsrv.php',
												{
													objecttype : 'GETFINANCEACCOUNTCATEGORYLIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceAccountCategory = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj) {
															var finacntctgy = new hih.FinanceAccountCategory();
															finacntctgy.setContent(obj);
															$rootScope.arFinanceAccountCategory.push(finacntctgy);
														});
													}
													$rootScope.isFinanceAccountCategoryLoaded = true;

													$rootScope.$broadcast("FinanceAccountCategoryLoaded");
												})
										 .error(
												function(data, status, headers, config) {
													// called asynchronously if an error occurs or server returns response with an error status.
													$rootScope.$broadcast(
															"ShowMessageEx",
															"Error",
															[{Type: 'danger', Message: data.Message}]);
												});
							}							
						};
// Finance part: Documents
						rtnObj.loadFinanceDocumentsQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceDocumentLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCEDOCUMENTLIST' })
									.then(function(response) {
										$rootScope.arFinanceDocument = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var fdt = new hih.FinanceDocument();
												fdt.setContent(obj);
												fdt.buildRelationship($rootScope.arFinanceDocumentType,
													$rootScope.arCurrency)
												$rootScope.arFinanceDocument.push(fdt);
											});
										}
										$rootScope.isFinanceDocumentLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};						
						rtnObj.loadFinanceCurrencyExchangeDocumentsQ = function() {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEDOCUMENTLIST_CURREXG' })
								.then(function(response) {
									$rootScope.arFinanceCurrencyExchangeDocument = [];
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var fdt = new hih.FinanceDocument();
											fdt.setContent(obj);
											fdt.buildRelationship($rootScope.arFinanceDocumentType,
												$rootScope.arCurrency)
											$rootScope.arFinanceCurrencyExchangeDocument.push(fdt);
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
                        rtnObj.readFinanceDocumentQ = function(docid) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETLFINANCEDOCUMENTDETAIL', docid: docid })
								.then(function(response) {
									if ($.isArray(response.data) && response.data.length > 0 && response.data[0].length > 0)  {
                                        
                                        // 0. Header
										var docobj = new hih.FinanceDocument();
        								docobj.setContent(response.data[0][0]);
                                        docobj.buildRelationship(
								            $rootScope.arFinanceDocumentType,
								            $rootScope.arCurrency
								        );
                                        // 1. Items
										$.each(response.data[1], function(idx, obj) {
											var bs = new hih.FinanceDocumentItem();
											bs.setContent(obj);
                                            bs.buildRelationship($rootScope.arFinanceAccount,
													$rootScope.arFinanceControlCenter, 
													$rootScope.arFinanceOrder,
													$rootScope.arFinanceTransactionType);
                                            docobj.Items.push(bs);
										});
                                        
                                        // Find out the elder one and replace it.
                                        if ( !$rootScope.arFinanceDocument) {
                                            $rootScope.arFinanceDocument = [];
                                            $rootScope.arFinanceDocument.push(docobj);
                                        } else {
                                            var realidx = -1;
                                            for(var i = 0; i < $rootScope.arFinanceDocument.length; i ++ ) {
                                                if ($rootScope.arFinanceDocument[i].ID === docid) {
                                                    realidx = i;
                                                    break;
                                                }
                                            }
                                            if (realidx !== -1) {
                                                $rootScope.arFinanceDocument[realidx] = docobj;
                                            } else {
                                                $rootScope.arFinanceDocument.push(docobj);
                                            }
                                            
                                            $rootScope.arFinanceDocument = $rootScope.arFinanceDocument.sort(function(a,b){
                                                return b.TranDate.getTime() - a.TranDate.getTime();
                                            });
                                        }
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
                        };
						rtnObj.loadFinanceDocumentItemsQ = function(docid) {
							var deferred = $q.defer();
							var docObject;
							$.each($rootScope.arFinanceDocument, function(idx, obj){
								if (obj.DocID === parseInt(docid)) {
									docObject = obj;
									return false;
								}
							});
							if (!docObject) {
								deferred.reject("Document does not exist!");
							} else {
								if (docObject.Items.length > 0) {
									deferred.resolve(true);
								} else {
									$http.post(
										'script/hihsrv.php',
										{ objecttype: 'GETFINANCEDOCUMENTITEMLIST_BYDOC', docid: docid})
									.then(function(response) {
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var di = new hih.FinanceDocumentItem();
												di.setContent(obj);
												di.buildRelationship($rootScope.arFinanceAccount,
													$rootScope.arFinanceControlCenter, 
													$rootScope.arFinanceOrder,
													$rootScope.arFinanceTransactionType);
												docObject.Items.push(di);
											});
										}
										deferred.resolve(true);
									}, function(response){
										deferred.reject(response.data.Message);
									});
								}								
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceDocumentItemsByAccountQ = function(accountid) {
							var deferred = $q.defer();
							$rootScope.arFinanceDocumentItemByAccount = [];
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'GETFINANCEDOCUMENTITEMLIST_BYACCNT', accountid: accountid})
							.then(function(response) {
								if ($.isArray(response.data) && response.data.length > 0) {
									$.each(response.data, function(idx, obj) {
										var di = new hih.FinanceDocumentItemForDisp();
										di.setContent(obj);
										di.buildRelationship($rootScope.arFinanceAccount,
											$rootScope.arFinanceControlCenter, 
											$rootScope.arFinanceOrder,
											$rootScope.arFinanceTransactionType);
										$rootScope.arFinanceDocumentItemByAccount.push(di);
									});
								}
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							
							return deferred.promise;							
						};						
						rtnObj.loadFinanceDocumentItemsByCategoryQ = function(ctgyid) {
							var deferred = $q.defer();
							$rootScope.arFinanceDocumentItemByAccount = [];
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'GETFINANCEDOCUMENTITEMLIST_BYCTGY', categoryid: ctgyid})
							.then(function(response) {
								if ($.isArray(response.data) && response.data.length > 0) {
									$.each(response.data, function(idx, obj) {
										var di = new hih.FinanceDocumentItemForDisp();
										di.setContent(obj);
										di.buildRelationship($rootScope.arFinanceAccount,
											$rootScope.arFinanceControlCenter, 
											$rootScope.arFinanceOrder,
											$rootScope.arFinanceTransactionType);
										$rootScope.arFinanceDocumentItemByAccount.push(di);
									});
								}
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							
							return deferred.promise;							
						};
						rtnObj.createFinanceDocumentQ = function(jsonData) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCEDOCUMENT', docdata: jsonData})
							.then(function(response) {
								// It returns the new document id
								deferred.resolve(parseInt(response.data));
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.createFinanceDPDocumentQ = function(jsonDocData, jsonAcntData, jsonAcntDPData, jsonDPItems) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCEDOCUMENT_DP', docdata: jsonDocData, accountdata: jsonAcntData, accountdp: jsonAcntDPData, dpitems: jsonDPItems})
							.then(function(response) {
								// It returns the new document id
								deferred.resolve(parseInt(response.data));
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.createFinanceDocumentFromDPTmpQ = function(jsonDocData, nDPTmpDoc) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCEDOCUMENT_FOR_DPTMP', docdata: jsonDocData, dptmpid: nDPTmpDoc })
							.then(function(response) {
								// It returns the new document id
								deferred.resolve(parseInt(response.data));
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;							
						};
						rtnObj.getAccountListForDownPaymentQ = function() {
							var todate = new Date();
							todate.setDate(todate.getDate() + 15);
							var todate2 = hih.ModelUtility.DatabaseDateFormatter(todate);
							
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'GETFINANCEACCOUNTLIST_DP_TBP', tdate: todate2})
							.then(function(response) {
								deferred.resolve(response.data);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.getFinanceDPDocumentQ = function(docid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'GETFINANCEDOCUMENT_DP', docid: docid})
							.then(function(response) {
								deferred.resolve(response.data);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.deleteFinanceDocumentQ = function(docid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'DELETEFINANCEDOCUMENT', docid: docid})
							.then(function(response) {
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
// Finance part: Document types
						rtnObj.loadFinanceDocumentTypesQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceDocumentTypeLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCEDOCUMENTTYPELIST' })
									.then(function(response) {
										$rootScope.arFinanceDocumentType = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var fdt = new hih.FinanceDocumentType();
												fdt.setContent(obj);
												$rootScope.arFinanceDocumentType.push(fdt);
											});
										}
										$rootScope.isFinanceDocumentTypeLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceDocumentTypes = function() {
						    if (!$rootScope.isFinanceDocumentTypeLoaded) {
						        // Example JSON response
						        // {"id":"1","name":"aaa","comment":"aaa"}
								$http.post( 'script/hihsrv.php',
												{
													objecttype : 'GETFINANCEDOCUMENTTYPELIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceDocumentType = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj) {
															var fdt = new hih.FinanceDocumentType();
															fdt.setContent(obj);
															$rootScope.arFinanceDocumentType.push(fdt);
														});
													}
													//$rootScope.arFinanceDocumentType = data;
													$rootScope.isFinanceDocumentTypeLoaded = true;

													$rootScope.$broadcast("FinanceDocumentTypeLoaded");
												})
										 .error(
												function(data, status, headers, config) {
													// called asynchronously if an error occurs or server returns response with an error status.
													$rootScope.$broadcast(
															"ShowMessageEx",
															"Error",
															[{Type: 'danger', Message: data.Message}]);
												});
							}							
						};
// Finance part: Transaction types
						rtnObj.loadFinanceTransactionTypesQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceTransactionTypeLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCETRANSACTIONTYPELIST' })
									.then(function(response) {
										$rootScope.arFinanceTransactionType = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var finatrantyp = new hih.FinanceTransactionType();
												finatrantyp.setContent(obj);												
												$rootScope.arFinanceTransactionType.push(finatrantyp);
											});
										}
										$.each($rootScope.arFinanceTransactionType, function(idx, obj) {
											obj.buildParentInfo($rootScope.arFinanceTransactionType);
											obj.buildFullName();
										});
										// Sort it!
										$rootScope.arFinanceTransactionType.sort(function(a, b) {
											if (a.ExpenseFlag !== b.ExpenseFlag) {
												if (a.ExpenseFlag) return -1;
												return 1;
											}
											
											return a.FullDisplayName.localeCompare(b.FullDisplayName);
										});
										$rootScope.isFinanceTransactionTypeLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceTransactionTypeHierarchy = function() {
							if (!$rootScope.isFinanceTransactionHierarchyLoaded) {
								// Example JSON reponse
								$http.post( 'script/hihsrv.php',
											{
												objecttype : 'GETFINANCETRANSACTIONTYPEHIERARCHY'
											})
									.success(
											function(data, status, headers, config) {
												$rootScope.arFinanceTransactionTypeHierarchy = data;
												$rootScope.isFinanceTransactionHierarchyLoaded = true;

												$rootScope.$broadcast("FinanceTransactionTypeHierarchyLoaded");
											})
									 .error(
											function(data, status, headers, config) {
												// called asynchronously if an error occurs or server returns response with an error status.
												$rootScope.$broadcast("ShowMessageEx", "Error", [{Type: 'danger', Message: data.Message}]);
										});
							}
						};
// Finance part: Control Center
						rtnObj.loadFinanceControlCentersQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceControlCenterLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCECONTROLCENTERLIST' })
									.then(function(response) {
										$rootScope.arFinanceControlCenter = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var finacc = new hih.FinanceControlCenter();
												finacc.setContent(obj);
												$rootScope.arFinanceControlCenter.push(finacc);
											});
											
											$.each($rootScope.arFinanceControlCenter, function(idx, obj){
												obj.buildParentObject($rootScope.arFinanceControlCenter);
											});
										}
										$rootScope.isFinanceControlCenterLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceControlCenterHierarchyQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceControlCenterHierarchyLoaded  && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCECONTROLCENTERHIERARCHY' })
									.then(function(response) {
										$rootScope.arFinanceControlCenterHierarchy = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												$rootScope.arFinanceControlCenterHierarchy.push(obj);
											});
										}
										$rootScope.isFinanceControlCenterHierarchyLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.createControlCenterQ = function(ccObj) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCECONTROLCENTER', 
									name: ccObj.Name, 
									parent: ccObj.ParentID === 0? null : ccObj.ParentID,
									comment: ccObj.Comment })
							.then(function(response) {
								// The server returns the new object out
								if ($.isArray(response.data) && response.data.length === 1) {
									var fincc = new hih.FinanceControlCenter();
									fincc.setContent(response.data[0]);
									fincc.buildParentObject($rootScope.arFinanceControlCenter);
									$rootScope.arFinanceControlCenter.push(fincc);
	
									deferred.resolve(fincc.ID);									
								} else {
									deferred.resolve(null);
								}
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;							
						};
						rtnObj.deleteControlCenterQ = function(ccid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'DELETEFINANCECONTROLCENTER', ccid: ccid})
							.then(function(response) {
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;							
						};
// Finance part: Order
						rtnObj.loadFinanceOrderQ = function(bForceReload) {
							var deferred = $q.defer();
							if ($rootScope.isFinanceOrderLoaded && !bForceReload) {
								deferred.resolve(true);
							} else {
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETFINANCEORDERLIST' })
									.then(function(response) {
										$rootScope.arFinanceOrder = [];
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var finorder = new hih.FinanceOrder();
												finorder.setContent(obj);
												$rootScope.arFinanceOrder.push(finorder);
											});
										}
										$rootScope.isFinanceOrderLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceSettlementRulesQ = function(orderid) {
							var deferred = $q.defer();
							var ordObject;
							$.each($rootScope.arFinanceOrder, function(idx, obj){
								if (obj.ID === parseInt(orderid)) {
									ordObject = obj;
									return false;
								}
							});
							if (!ordObject) {
								deferred.reject("Order does not exist!");
							} else {
								if (ordObject.SRules.length > 0) {
									deferred.resolve(true);
								} else {
									$http.post(
										'script/hihsrv.php',
										{ objecttype: 'GETSETTLEMENTRULELIST_BYORDER', orderid: orderid})
									.then(function(response) {
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var sr = new hih.FinanceOrderSettlementRule();
												sr.setContent(obj);
												sr.buildRelationship($rootScope.arFinanceControlCenter, $rootScope.arFinanceOrder);
												ordObject.SRules.push(sr);
											});
										}
										deferred.resolve(true);
									}, function(response){
										deferred.reject(response.data.Message);
									});
								}								
							}
							return deferred.promise;
						};
						rtnObj.createFinanceOrderQ = function(jsonData) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'CREATEFINANCEORDER', orderdata: jsonData})
							.then(function(response) {
								// It returns the new order id								
								deferred.resolve(parseInt(response.data));
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
						rtnObj.deleteFinanceOrderQ = function(orderid) {
							var deferred = $q.defer();
							$http.post(
								'script/hihsrv.php',
								{ objecttype: 'DELETEFINANCEORDER', orderid: orderid})
							.then(function(response) {
								deferred.resolve(true);
							}, function(response){
								deferred.reject(response.data.Message);
							});
							return deferred.promise;
						};
// Finance part: report - balance sheet
						rtnObj.loadFinanceReportBSQ = function() {
							var deferred = $q.defer();
							$rootScope.arFinanceReportBS = [];
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEREPORTBS' })
								.then(function(response) {
									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.FinanceReportBalanceSheet();
											bs.setContent(obj);
											bs.buildRelationship($rootScope.arFinanceAccount);
											$rootScope.arFinanceReportBS.push(bs);
										});
									}
									$rootScope.isFinanceReportBSLoaded = true;
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
// Finance part: report - order
						rtnObj.loadFinanceReportOrderQ = function() {
							var deferred = $q.defer();
							$rootScope.arFinanceReportOrder = [];
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEREPORTORDER' })
								.then(function(response) {
									$rootScope.arFinanceReportOrder = [];
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.FinanceReportOrder();
											bs.setContent(obj);
											bs.buildRelationship($rootScope.arFinanceOrder);
											$rootScope.arFinanceReportOrder.push(bs);
										});
									}
									$rootScope.isFinanceReportOrderLoaded = true;
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
// Finance part: report - cc
						rtnObj.loadFinanceReportControlCenterQ = function(startdt, enddt) {
							var deferred = $q.defer();
							$rootScope.arFinanceReportCC = [];
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEREPORTCC', startdate: startdt, enddate: enddt })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.FinanceReportControlCenter();
											bs.setContent(obj);
											bs.buildRelationship($rootScope.arFinanceControlCenter);
											$rootScope.arFinanceReportCC.push(bs);
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
// Finance part: report - tt
						rtnObj.loadFinanceReportTranTypeQ = function(startdt, enddt) {
							var deferred = $q.defer();
							$rootScope.arFinanceReportTT = [];
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETFINANCEREPORTTT', startdate: startdt, enddate: enddt })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.FinanceReportTranType();
											bs.setContent(obj);
											bs.buildRelationship($rootScope.arFinanceTransactionType);
											$rootScope.arFinanceReportTT.push(bs);
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};

////////////////////////////////////////////////////////////////////
// Libraries part
////////////////////////////////////////////////////////////////////

// Libraries part: Setting
						rtnObj.loadLibSettingQ = function() {
							// Load lib setting with $q supports
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype : 'GETLIBSETTING' })
								.then(function(response) {
									if ($.isArray(response.data) && response.data.length > 0) {
										var fs = new hih.LibSetting();
										fs.setContent(response.data);
										$rootScope.objLibSetting = fs;
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						// Book type
						rtnObj.loadLibBookTypeQ = function(bForceReload) {
							var deferred = $q.defer();
                            
                            if ($rootScope.arLibBookType && $rootScope.arLibBookType.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
                                $rootScope.arLibBookType = [];
                                
                                $http.post(
                                    'script/hihsrv.php',
                                    { objecttype : 'GETLIBBOOKTYPELIST' })
                                    .then(function(response) {									
                                        if ($.isArray(response.data) && response.data.length > 0) {
                                            $.each(response.data, function(idx, obj) {
                                                var bs = new hih.LibBookType();
                                                bs.setContent(obj);
                                                $rootScope.arLibBookType.push(bs);
                                            });
    										$.each($rootScope.arLibBookType, function(idx, obj) {
    											obj.buildParentInfo($rootScope.arLibBookType);
    											obj.buildFullName();
    										});
                                        }
                                        deferred.resolve(true);
                                    }, function(response) {
                                        deferred.reject(response.data.Message);
                                    });
                            }
							return deferred.promise;
						};
                        // Language
                        rtnObj.loadLibLanguageQ = function(bForceReload) {
							var deferred = $q.defer();
                            
                            if ($rootScope.arLibLang && $rootScope.arLibLang.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
                                $rootScope.arLibLang = [];
                                
                                $http.post(
                                    'script/hihsrv.php',
                                    { objecttype : 'GETLIBLANG' })
                                    .then(function(response) {									
                                        if ($.isArray(response.data) && response.data.length > 0) {
                                            $.each(response.data, function(idx, obj) {
                                                var bs = new hih.LibLanguage();
                                                bs.setContent(obj);
                                                $rootScope.arLibLang.push(bs);
                                            });
                                        }
                                        deferred.resolve(true);
                                    }, function(response) {
                                        deferred.reject(response.data.Message);
                                    });
                            }
							return deferred.promise;
                        };
						// Locations
						rtnObj.loadLibLocationQ = function(bForceReload) {
							var deferred = $q.defer();
							
                            if ($rootScope.arLibLocation && $rootScope.arLibLocation.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
								$rootScope.arLibLocation = [];
								
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLIBLOCLIST' })
									.then(function(response) {									
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var bs = new hih.LibLocation();
												bs.setContent(obj);
												$rootScope.arLibLocation.push(bs);
											});
										}
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.readLibLocationQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETLIBLOCDETAIL', id: nID })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.LibLocation();
											bs.setContent(obj);
											
											// Find out the elder one and replace it.
											if ( !$rootScope.arLibLocation) {
												$rootScope.arLibLocation = [];
												$rootScope.arLibLocation.push(bs);
											} else {
												var realidx = -1;
												for(var i = 0; i < $rootScope.arLibLocation.length; i ++ ) {
													if ($rootScope.arLibLocation[i].ID === nID) {
														realidx = i;
														break;
													}
												}
												if (realidx !== -1) {
													$rootScope.arLibLocation[realidx] = bs;
												} else {
													$rootScope.arLibLocation.push(bs);
												}																								
											}
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.createLibLocationQ = function(objLibLoc) {
							var deferred = $q.defer();
							var jsonLoc = objLibLoc.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'CREATELIBLOC', data: jsonLoc })
								.then(function(response) {
									deferred.resolve(response.data);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.updateLibLocationQ = function(objLibLoc) {
							var deferred = $q.defer();
							var jsonLoc = objLibLoc.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'UPDATELIBLOC', data: jsonLoc })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.deleteLibLocationQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'DELETELIBLOC', id: nID })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						// Person
                        rtnObj.loadLibAuthorQ = function() {
							var deferred = $q.defer();
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'GETLIBAUTHORLIST' })
                                .then(function(response) {
                                    deferred.resolve(response.data);
                                }, function(response) {
                                    deferred.reject(response.data.Message);
                                });
                        
                            return deferred.promise;
                        };
						rtnObj.loadLibPersonQ = function(bForceReload) {
							var deferred = $q.defer();
							
                            if ($rootScope.arLibPerson && $rootScope.arLibPerson.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
								$rootScope.arLibPerson = [];
								
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLIBPERSONLIST' })
									.then(function(response) {									
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var bs = new hih.LibPerson();
												bs.setContent(obj);
												$rootScope.arLibPerson.push(bs);
											});
										}
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							
							return deferred.promise;
						};
						rtnObj.readLibPersonQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETLIBPERSONDETAIL', id: nID })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.LibPerson();
											bs.setContent(obj);
											
											// Find out the elder one and replace it.
											if ( !$rootScope.arLibPerson) {
												$rootScope.arLibPerson = [];
												$rootScope.arLibPerson.push(bs);
											} else {
												var realidx = -1;
												for(var i = 0; i < $rootScope.arLibPerson.length; i ++ ) {
													if ($rootScope.arLibPerson[i].ID === nID) {
														realidx = i;
														break;
													}
												}
												if (realidx !== -1) {
													$rootScope.arLibPerson[realidx] = bs;
												} else {
													$rootScope.arLibPerson.push(bs);
												}																								
											}
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.createLibPersonQ = function(objLibPerson) {
							var deferred = $q.defer();
							var jsonPerson = objLibPerson.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'CREATELIBPERSON', data: jsonPerson })
								.then(function(response) {
									deferred.resolve(response.data);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.updateLibPersonQ = function(objLibPerson) {
							var deferred = $q.defer();
							var jsonPerson = objLibPerson.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'UPDATELIBPERSON', data: jsonPerson })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.deleteLibPersonQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'DELETELIBPERSON', id: nID })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						
						// Organization
                        rtnObj.loadLibPressQ = function() {
							var deferred = $q.defer();
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'GETLIBPRESSLIST' })
                                .then(function(response) {
                                    deferred.resolve(response.data);
                                }, function(response) {
                                    deferred.reject(response.data.Message);
                                });
                        
                            return deferred.promise;
                        };
						rtnObj.loadLibOrganizationQ = function(bForceReload) {
							var deferred = $q.defer();
							
                            if ($rootScope.arLibOrganization && $rootScope.arLibOrganization.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
								$rootScope.arLibOrganization = [];
								
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLIBORGLIST' })
									.then(function(response) {									
										if ($.isArray(response.data) && response.data.length > 0) {
											$.each(response.data, function(idx, obj) {
												var bs = new hih.LibOrganization();
												bs.setContent(obj);
												$rootScope.arLibOrganization.push(bs);
											});
										}
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							
							return deferred.promise;
						};
						rtnObj.readLibOrganizationQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETLIBORGDETAIL', id: nID })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0) {
										$.each(response.data, function(idx, obj) {
											var bs = new hih.LibOrganization();
											bs.setContent(obj);
											
											// Find out the elder one and replace it.
											if ( !$rootScope.arLibOrganization) {
												$rootScope.arLibOrganization = [];
												$rootScope.arLibOrganization.push(bs);
											} else {
												var realidx = -1;
												for(var i = 0; i < $rootScope.arLibOrganization.length; i ++ ) {
													if ($rootScope.arLibOrganization[i].ID === nID) {
														realidx = i;
														break;
													}
												}
												if (realidx !== -1) {
													$rootScope.arLibOrganization[realidx] = bs;
												} else {
													$rootScope.arLibOrganization.push(bs);
												}
											}
										});
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.createLibOrganizationQ = function(objLibOrganization) {
							var deferred = $q.defer();
							var jsonOrganization = objLibOrganization.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'CREATELIBORG', data: jsonOrganization })
								.then(function(response) {
									deferred.resolve(response.data);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.updateLibOrganizationQ = function(objLibOrganization) {
							var deferred = $q.defer();
							var jsonOrganization = objLibOrganization.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'UPDATELIBORG', data: jsonOrganization })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						rtnObj.deleteLibOrganizationQ = function(nID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'DELETELIBOORG', id: nID })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
						};
						
                        // Book group
                        rtnObj.loadLibBookGroupQ = function(bForceReload) {
							var deferred = $q.defer();
							
                            if ($rootScope.arLibBookGroup && $rootScope.arLibBookGroup.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
								$rootScope.arLibBookGroup = [];
								
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLIBBOOKGROUPLIST' })
									.then(function(response) {
										if ($.isArray(response.data) && response.data.length === 2) {
                                            // Group header
											$.each(response.data[0], function(idx, obj) {
												var bs = new hih.LibBookGroup();
												bs.setContent(obj);
                                                // Books
                                                $.each(response.data[1], function(idx2, obj2) {
                                                    if (parseInt(obj2.grpid) === bs.ID) {
                                                        bs.Books.push(parseInt(obj2.bookid));
                                                    }
                                                });
												$rootScope.arLibBookGroup.push(bs);
											});
                                        }
                                        deferred.resolve(true);
                                    }, function(reason) {
									deferred.reject(reason.data.Message);
								});
                            }
                            
                            return deferred.promise;
                        };
                        rtnObj.readLibBookGroupQ = function(nID) {
                            var deferred = $q.defer();
                            
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'GETLIBBOOKGROUPDETAIL', id: nID })
                                .then(function(response) {
                                    if ($.isArray(response.data) && response.data.length === 2) {
                                        $.each(response.data[0], function(idx, obj) {
                                            var bs = new hih.LibBookGroup();
                                            bs.setContent(obj);
                                            // Books
                                            $.each(response.data[1], function(idx2, obj2) {
                                                bs.Books.push(parseInt(obj2.bookid));
                                            });
                                            
                                            // Find out the elder one and replace it.
                                            if ( !$rootScope.arLibBookGroup) {
                                                $rootScope.arLibBookGroup = [];
                                                $rootScope.arLibBookGroup.push(bs);
                                            } else {
                                                var realidx = -1;
                                                for(var i = 0; i < $rootScope.arLibBookGroup.length; i ++ ) {
                                                    if ($rootScope.arLibBookGroup[i].ID === bs.ID) {
                                                        realidx = i;
                                                        break;
                                                    }
                                                }
                                                if (realidx !== -1) {
                                                    $rootScope.arLibBookGroup[realidx] = bs;
                                                } else {
                                                    $rootScope.arLibBookGroup.push(bs);
                                                }
                                            }
                                        });
                                    }
                                    deferred.resolve(true);
                                }, function(reason) {
                                deferred.reject(reason.data.Message);
                            });
                            
                            return deferred.promise;
                        };
                        rtnObj.createLibBookGroupQ = function(objBookGroup) {
                            var deferred = $q.defer();
                            
                            var jsonData = objBookGroup.ToJSON();
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'CREATELIBBOOKGROUP', data: jsonData })
                                .then(function(response) {
                                    // return the ID
                                    deferred.resolve(response.data);
                                }, function(reason) {
                                deferred.reject(reason.data.Message);
                            });
                            
                            return deferred.promise;
                        };
                        rtnObj.updateLibBookGroupQ = function(objBookGroup) {
                            var deferred = $q.defer();
                            
                            var jsonData = objBookGroup.ToJSON();
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'UPDATELIBBOOKGROUP', data: jsonData })
                                .then(function(response) {
                                    // return the ID
                                    deferred.resolve(true);
                                }, function(reason) {
                                deferred.reject(reason.data.Message);
                            });
                            
                            return deferred.promise;
                        };
                        rtnObj.deleteLibBookGroupQ = function(nGroupID) {
                            var deferred = $q.defer();
                            
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'DELETELIBBOOKGROUP', id: nGroupID })
                                .then(function(response) {
                                    // return the ID
                                    deferred.resolve(true);
                                }, function(reason) {
                                deferred.reject(reason.data.Message);
                            });
                            
                            return deferred.promise;
                        };
                        rtnObj.loadLibBookForGroupQ = function() {
                            var deferred = $q.defer();
                            $rootScope.arLibBookBrief = [];
                            
                            $http.post(
                                'script/hihsrv.php',
                                { objecttype : 'GETLIBBOOKBRIEF' })
                                .then(function(response) {
                                    if ($.isArray(response.data)) {
                                        // Group header
                                        $.each(response.data, function(idx, obj) {
                                            $rootScope.arLibBookBrief.push(obj);
                                        });
                                    }
                                    deferred.resolve(true);
                                }, function(reason) {
                                deferred.reject(reason.data.Message);
                            });
                            
                            return deferred.promise;
                        };
                        
                        // Books
                        rtnObj.loadLibBookQ = function(bForceReload) {
							var deferred = $q.defer();
							
                            if ($rootScope.arLibBook && $rootScope.arLibBook.length > 0 && !bForceReload) {
                                deferred.resolve(true);
                            } else {
								$rootScope.arLibBook = [];
								
								$http.post(
									'script/hihsrv.php',
									{ objecttype : 'GETLIBBOOKLIST' })
									.then(function(response) {
										if ($.isArray(response.data) && response.data.length === 6) {
											// response.data[1] - Book language
											// response.data[2] - Book name
											// response.data[3] - Book author
											// response.data[4] - Book press
											// response.data[5] - Book location
											
											// 0. Book
											$.each(response.data[0], function(idx, obj) {
												var bs = new hih.LibBook();
												bs.setContent(obj);
												$rootScope.arLibBook.push(bs);
											});
											var arLang = [];
											var arName = [];
											var arAuthor = [];
											var arPress = [];
											var arLocation = [];
											// 1. Language
											$.each(response.data[1], function(idx, obj) {
												var bs = new hih.LibBookLang();
												bs.setContent(obj);
												arLang.push(bs);
											});
											// 2. Name
											$.each(response.data[2], function(idx, obj) {
												var bs = new hih.LibBookName();
												bs.setContent(obj);
												arName.push(bs);
											});
											// 3. Author
											$.each(response.data[3], function(idx, obj) {
												var bs = new hih.LibBookAuthor();
												bs.setContent(obj);
												arAuthor.push(bs);
											});
											// 4. Press
											$.each(response.data[4], function(idx, obj) {
												var bs = new hih.LibBookPress();
												bs.setContent(obj);
												arPress.push(bs);
											});
											// 5. Location
											$.each(response.data[5], function(idx, obj) {
												var bs = new hih.LibBookLocation();
												bs.setContent(obj);
												arLocation.push(bs);
											});
											
											$.each($rootScope.arLibBook, function(idx, obj) {
                                                if (arName.length > 0) {
                                                    for(var i = 0; i < arName.length; i ++) {
                                                        if (arName[i].BookID === obj.ID) {
                                                            obj.Names.push(arName[i]);
                                                        }
                                                    }
                                                }
                                                
                                                if (arLang.length > 0) {
                                                    for(var i = 0; i < arLang.length; i ++) {
                                                        if (arLang[i].BookID === obj.ID) {
                                                            obj.Languages.push(arLang[i]);
                                                        }
                                                    }                                               
                                                } 
											});
										}
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
                        };
                        rtnObj.readLibBookQ = function(nBookID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'GETLIBBOOKDETAIL', id: nBookID })
								.then(function(response) {									
									if ($.isArray(response.data) && response.data.length > 0 && response.data[0].length > 0)  {
                                        
                                        // 0. Book
										var book = new hih.LibBook();
        								book.setContent(response.data[0][0]);
                                        
                                        // 1. Language
										$.each(response.data[1], function(idx, obj) {
											var bs = new hih.LibBookLang();
											bs.setContent(obj);
											book.Languages.push(bs);
										});
                                        // 2. Name
										$.each(response.data[2], function(idx, obj) {
											var bs = new hih.LibBookName();
											bs.setContent(obj);
											book.Names.push(bs);
										});
                                        // 3. Author
										$.each(response.data[3], function(idx, obj) {
											var bs = new hih.LibBookAuthor();
											bs.setContent(obj);
											book.Authors.push(bs);
										});
                                        // 4. Press
										$.each(response.data[4], function(idx, obj) {
											var bs = new hih.LibBookPress();
											bs.setContent(obj);
											book.Presses.push(bs);
										});
                                        // 5. Location
										$.each(response.data[5], function(idx, obj) {
											var bs = new hih.LibBookLocation();
											bs.setContent(obj);
											book.Locations.push(bs);
										});
                                        
                                        // Find out the elder one and replace it.
                                        if ( !$rootScope.arLibBook) {
                                            $rootScope.arLibBook = [];
                                            $rootScope.arLibBook.push(book);
                                        } else {
                                            var realidx = -1;
                                            for(var i = 0; i < $rootScope.arLibBook.length; i ++ ) {
                                                if ($rootScope.arLibBook[i].ID === nBookID) {
                                                    realidx = i;
                                                    break;
                                                }
                                            }
                                            if (realidx !== -1) {
                                                $rootScope.arLibBook[realidx] = book;
                                            } else {
                                                $rootScope.arLibBook.push(book);
                                            }
                                        }
									}
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
                        };
                        rtnObj.createLibBookQ = function(objBook) {
							var deferred = $q.defer();
							var jsonBook = objBook.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'CREATELIBBOOK', data: jsonBook })
								.then(function(response) {
									deferred.resolve(response.data);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
                        };
                        rtnObj.updateLibBookQ = function(objBook) {
							var deferred = $q.defer();
							var jsonBook = objBook.ToJSON();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'UPDATELIBBOOK', data: jsonBook })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
                        };
                        rtnObj.deleteLibBookQ = function(nBookID) {
							var deferred = $q.defer();
							
							$http.post(
								'script/hihsrv.php',
								{ objecttype : 'DELETELIBBOOK', id: nBookID })
								.then(function(response) {
									deferred.resolve(true);
								}, function(response) {
									deferred.reject(response.data.Message);
								});
							return deferred.promise;
                        };

////////////////////////////////////////////////////////////////////
// Others
////////////////////////////////////////////////////////////////////
						
						// Util for communicate with backend
						rtnObj.sendRequest = function (reqData, funcSucc, funcErr) {
							$http.post('script/hihsrv.php', reqData)
									.success(
											function(data, status, headers,
													config) {
												funcSucc(data, status,
														headers, config);
											})
									.error(
											function(data, status, headers,
													config) {
												funcErr(data, status,
														headers, config);
											});
						};

						return rtnObj;
					});
})();

