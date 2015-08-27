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
						
////////////////////////////////////////////////////////////////////						
// Learn part
////////////////////////////////////////////////////////////////////						
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
														lrnobj.setContent(obj1.id, obj1.categoryid, obj1.categoryname, obj1.name, obj1.content);
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
												lrnctgy.setContent(obj.id, obj.parent, obj.text, obj.comment);
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

////////////////////////////////////////////////////////////////////
// Finance part
////////////////////////////////////////////////////////////////////
						rtnObj.loadCurrencies = function() {
						    if (!$rootScope.isCurrencyLoaded) {
						        // Example JSON response
						        // {"curr":"CNY","name":"aaa","symbol":null}
								$http
										.post(
												'script/hihsrv.php',
												{
													objecttype : 'GETCURRENCYLIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arCurrency = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj) {
															var curobj = new hih.Currency();
															curobj.setContent(obj);
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
						rtnObj.loadCurrenciesQ = function() {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							if ($rootScope.isCurrencyLoaded) {
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
							    $http
										.post(
												'script/hihsrv.php',
												{
													objecttype : 'GETFINANCEACCOUNTLIST'
												})
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
						rtnObj.loadFinanceAccountHierarchy = function() {
							if (!$rootScope.isFinanceAccountHierarchyLoaded) {
							    // Example JSON response
							    $http
										.post(
												'script/hihsrv.php',
												{
													objecttype : 'GETFINANCEACCOUNTHIERARCHY'
												})
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
						rtnObj.loadFinanceAccountCategoriesQ = function() {
							// Load finance accounts with $q supports
							var deferred = $q.defer();
							if ($rootScope.isFinanceAccountCategoryLoaded) {
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
							    $http
										.post(
												'script/hihsrv.php',
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
						rtnObj.loadFinanceDocuments = function() {
						    if (!$rootScope.isFinanceDocumentLoaded) {
						        // Example JSON reponse
						        // {"docid":"5","doctype":"1","doctypename":"aaa","trandate":"2015-03-13","trancurr":"CNY","trancurrname":"aaa","desp":"aaa","tranamount":"-155"}
								$http
										.post(
												'script/hihsrv.php',
												{
													objecttype : 'GETFINANCEDOCUMENTLIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceDocument = [];
													if ($.isArray(data) && data.length > 0) {
														$.each(data, function(idx, obj){
															var fd = new hih.FinanceDocument();
															fd.setContent(obj);
															$rootScope.arFinanceDocument.push(fd);
														});
													}
													$rootScope.isFinanceDocumentLoaded = true;

													$rootScope.$broadcast("FinanceDocumentLoaded");
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
						rtnObj.loadFinanceDocumentTypesQ = function() {
							var deferred = $q.defer();
							if ($rootScope.isFinanceDocumentTypeLoaded) {
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
								$http
										.post(
												'script/hihsrv.php',
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
						rtnObj.loadFinanceDocumentItems = function (docid) {
						    // Example JSON response
						    // {    "docid":"6","itemid":"1","accountid":"4","accountname":"aaa","categoryname":"aaa","trantype":"46","trantypename":"aaa","tranamount":"-20",
						    //      "controlcenterid":"0","controlcentername":null,"orderid":"6","ordername":"aaa","desp":"aaa","trantypeexpense":"1",
						    //      "accountcategory":"1","accountcategoryname":"aaa","doctype":"1","doctypename":"aaa","trandate":"2015-04-09","trancurr":"CNY","trancurrname":"aaa"}
						    var bDocItemExist = false;
						    if (angular.isDefined($rootScope.arFinanceDocumentItem)) {
						        $.each($rootScope.arFinanceDocumentItem, function (idx, obj) {
						            if (obj.docid === docid) {
						                bDocItemExist = true;
						                return false;
						            }
						        });
						    }

						    if (bDocItemExist) {
						    } else {
						        $http
                                    .post(
                                        'script/hihsrv.php',
                                        {
                                            objecttype: 'GETFINANCEDOCUMENTITEMLIST',
                                            docid: docid
                                        })
                                    .success(
                                        function (data, status, headers, config) {
                                            if (angular.isDefined(data) && angular.isArray(data)) {
                                                if (!angular.isDefined($rootScope.arFinanceDocumentItem))
                                                    $rootScope.arFinanceDocumentItem = [];
                                                $.merge($rootScope.arFinanceDocumentItem, data);
                                            }

                                            $rootScope.$broadcast("FinanceDocumentItemLoaded");
                                        })
                                    .error(
                                        function (data, status, headers, config) {
                                            // called asynchronously if an error occurs or server returns response with an error status.
                                            $rootScope.$broadcast(
                                                "ShowMessage",
                                                "Error",
                                                data.Message);
                                        });
						    }
						};
						rtnObj.loadFinanceTransactionTypes = function() {
						    if (!$rootScope.isFinanceTransactionTypeLoaded) {
						        // Example JSON response
						        // {"id":"2","parent":null,"name":"\u4e3b\u4e1a\u6536\u5165","expense":"0","comment":null}
								$http
										.post(
												'script/hihsrv.php',
												{
													objecttype : 'GETFINANCETRANSACTIONTYPELIST'
												})
										.success(
												function(data, status, headers, config) {
													$rootScope.arFinanceTransactionType = data;
													$rootScope.isFinanceTransactionTypeLoaded = true;

													$rootScope.$broadcast("FinanceTransactionTypeLoaded");
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
						rtnObj.loadFinanceTransactionTypesQ = function() {
							var deferred = $q.defer();
							if ($rootScope.isFinanceTransactionTypeLoaded) {
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
								$http
									.post(
											'script/hihsrv.php',
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
												$rootScope.$broadcast(
														"ShowMessage",
														"Error",
														data.Message);
										});
							}
						};
						rtnObj.loadFinanceControlCentersQ = function() {
							var deferred = $q.defer();
							if ($rootScope.isFinanceControlCenterLoaded) {
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
										}
										$rootScope.isFinanceControlCenterLoaded = true;
										deferred.resolve(true);
									}, function(response) {
										deferred.reject(response.data.Message);
									});
							}
							return deferred.promise;
						};
						rtnObj.loadFinanceOrderQ = function() {
							var deferred = $q.defer();
							if ($rootScope.isFinanceOrderLoaded) {
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

