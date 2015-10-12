/* global $ */
/* global angular */
/* global hih */
(function() {
	"use strict";

	angular.module('hihApp.Utility', [])

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
							if (nGen === 1) return "Male";
							return "Female";
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
							var urlcss1 = "//cdn.bootcss.com/bootswatch/3.3.5/";
							var urlcss2 = "/bootstrap.min.css";
							
							if (theme !== "default") {
								arCSS.push(urlcss1.concat(theme, urlcss2));
								arCSS.push("app/css/empty.css"); 
							} else {
								arCSS.push("//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css");
								arCSS.push("//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap-theme.min.css");
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
														objUsr.setContent(obj1.id, obj1.text);
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
														"ShowMessage",
														"Error",
														data.Message);
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
												objUsr.setContent(obj.id, obj.text);
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
												$rootScope.$broadcast("ShowMessage", "Error", data.Message);
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
												$rootScope.$broadcast(
														"ShowMessage",
														"Error",
														data.Message);
											});
							}
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
														lrnhist.buildRelationship($rootScope.arUser, $rootScope.arLearnObject);
														$rootScope.arLearnHistory.push(lrnhist);
													});
												}
												$rootScope.isLearnHistoryLoaded = true;

												$rootScope.$broadcast("LearnHistoryLoaded");
											})
									 .error(
											function(data, status, headers, config) {
												$rootScope.$broadcast("ShowMessage","Error",data.Message);
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
												lrnhist.buildRelationship($rootScope.arUser, $rootScope.arLearnObject);
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
												$rootScope.$broadcast("ShowMessage", "Error",data.Message);
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
										$rootScope.$broadcast("ShowMessage", "Error", data.Message);
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
										// The response object has these properties:
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

////////////////////////////////////////////////////////////////////
// Finance part
////////////////////////////////////////////////////////////////////

// Finance part: Setting
						rtnObj.loadFinanceSettingQ = function() {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							$http.post('script/hihsrv.php', { objecttype : 'GETFINANCESETTING' })
								.then(function(response) {
									$rootScope.arCurrency = [];
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
															"ShowMessage",
															"Error",
															data.Message);
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
															"ShowMessage",
															"Error",
															data.Message);
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
															"ShowMessage",
															"Error",
															data.Message);
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
															"ShowMessage",
															"Error",
															data.Message);
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
															"ShowMessage",
															"Error",
															data.Message);
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
												$rootScope.$broadcast("ShowMessage", "Error", data.Message);
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
									parent: ccObj.ParentID,
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

