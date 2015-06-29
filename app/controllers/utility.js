(function() {
	"use strict";

	angular
			.module('hihApp.Utility', [])

			.factory(
					'utils',
					function($rootScope, $http) {
						return {
							// Util for finding an object by its 'id' property
							// among an array
							findById : function findById(a, id) {
								for (var i = 0; i < a.length; i++) {
									if (a[i].id == id)
										return a[i];
								}
								return null;
							},

							// Util for returning a random key from a collection
							// that also isn't the current key
							newRandomKey : function newRandomKey(coll, key,
									currentKey) {
								var randKey;
								do {
									randKey = coll[Math.floor(coll.length
											* Math.random())][key];
								} while (randKey == currentKey);
								return randKey;
							},

							// Learn part
							loadLearnObjects : function loadLearnObjects() {
								if (!$rootScope.isLearnObjectLoad) {
									$http
											.post(
													'script/hihsrv.php',
													{
														objecttype : 'GETLEARNOBJECTLIST'
													})
											.success(
													function(data, status,
															headers, config) {
														$rootScope.arLearnObject = data;
														$rootScope.isLearnObjectLoad = true;

														$rootScope
																.$broadcast("LearnObjectLoaded");
													}).error(
													function(data, status,
															headers, config) {
														// called asynchronously if an error occurs or server returns response with an error status.
														$rootScope.$broadcast(
																"ShowMessage",
																"Error",
																data.Message);
													});
								}
							},
							loadLearnHistories : function loadLearnHistories() {
								if (!$rootScope.isLearnHistoryLoaded) {
									$http
											.post(
													'script/hihsrv.php',
													{
														objecttype : 'GETLEARNHISTORYLIST'
													})
											.success(
													function(data, status,
															headers, config) {
														$rootScope.arLearnHistory = data;
														$rootScope.isLearnHistoryLoaded = true;

														$rootScope
																.$broadcast("LearnHistoryLoaded");
													}).error(
													function(data, status,
															headers, config) {
														// called asynchronously if an error occurs or server returns response with an error status.
														$rootScope.$broadcast(
																"ShowMessage",
																"Error",
																data.Message);
													});
								}
							},
							loadLearnAwards : function loadLearnAwards() {
								if (!$rootScope.isLearnAwardLoaded) {
									$http
											.post(
													'script/hihsrv.php',
													{
														objecttype : 'GETLEARNAWARDLIST'
													})
											.success(
													function(data, status,
															headers, config) {
														$rootScope.arLearnAward = data;
														$rootScope.isLearnAwardLoaded = true;

														$rootScope
																.$broadcast("LearnAwardLoaded");
													}).error(
													function(data, status,
															headers, config) {
														// called asynchronously if an error occurs or server returns response with an error status.
														$rootScope.$broadcast(
																"ShowMessage",
																"Error",
																data.Message);
													});
								}
							},
							loadLearnCategories : function loadLearnCategories() {
								if (!$rootScope.isLearnCategoryLoaded) {
									$http
											.post(
													'script/hihsrv.php',
													{
														objecttype : 'GETLEARNCATEGORYLIST'
													})
											.success(
													function(data, status,
															headers, config) {
														$rootScope.arLearnCategory = data;
														$rootScope.isLearnCategoryLoaded = true;

														$rootScope
																.$broadcast("LearnCategoryLoaded");
													}).error(
													function(data, status,
															headers, config) {
														// called asynchronously if an error occurs or server returns response with an error status.
														$rootScope.$broadcast(
																"ShowMessage",
																"Error",
																data.Message);
													});
								}
							},

							// Util for communicate with backend
							sendRequest : function sendRequest(reqData,
									funcSucc, funcErr) {
								$http.post('script/hihsrv.php', reqData)
										.success(
												function(data, status, headers,
														config) {
													funcSucc(data, status,
															headers, config);
												}).error(
												function(data, status, headers,
														config) {
													funcErr(data, status,
															headers, config);
												});
							}
						};
					});
})();
