/* global $ */
/* global hih */
/* global angular */
(function() {
	"use strict";	
	
	angular.module('hihApp', ["ui.router", "ngAnimate", "hihApp.Login", "hihApp.Utility", 'hihApp.Learn', 'hihApp.Lib', 'ui.bootstrap', 'ngSanitize', 
		'hihApp.Finance', 'pascalprecht.translate', 'ngJsTree', 'ngTouch', 'selectize', 'chart.js'])
        
		.run(['$rootScope', '$state', '$stateParams', '$timeout', '$http', '$log', 
            function ($rootScope, $state, $stateParams, $timeout, $http, $log) {
			 $rootScope.$state = $state;
			 $rootScope.$stateParams = $stateParams;
             
             $.ajax({  
                async: false,  
                type: "GET",  
                url:  "script/hihsrv.php",  
                data: { objecttype : 'GETCURRENTUSER' },  
                success: function(response){
                    if (response.type === "S" && response.UserID.length > 0) {
                        $rootScope.isLogin = true;
                        $rootScope.CurrentUser = {
                            userid          : response.UserID,
                            userdisplayas   : response.UserDisplayAs,
                            usercreatedon   : response.UserCreatedOn,
                            usergender      : response.UserGender
                        };
                    }
                }  
                });  

			    $rootScope.$on('$stateChangeStart', 
		    		function(event, toState, toParams, fromState, fromParams) {
		    			$log.info('HIH: state change start, target url is ' + toState.url + "; state is " + toState.name);
		    			
		    			if (toState.name === 'login' || toState.name === 'register') {
		    				if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
		    					$log.info('HIH: state change failed: already login but ask for login page, redirect to home page...');
		    					event.preventDefault();
		    					$state.go("home.welcome");
		    				} 
		    				return;
		    			}  
		    			
		    			if (angular.isDefined($rootScope.isLogin) && $rootScope.isLogin) {
		    				return;
		    			}

		    			$log.info('HIH: state change failed: not login, redirect to login page...');
	    		    	event.preventDefault();
	    		    	$state.go("login");
			    	}
			    );
			}
		])

	.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        .when('/welcome', '/home')
        .when('/about', '/home/about')
        .when('/userdetail', '/home/userdetail')
        .when('/learn', '/home/learn')
        .when('/learnobject', '/home/learn/object')
        .when('/learnhistory', '/home/learn/history')
        .when('/learnaward', '/home/learn/award')
        .when('/finance', '/home/finance')
		.when('/financeaccount', '/home/finance/account')
		.when('/financedocument', '/home/finance/document')
		.when('/financereport', '/home/finance/report')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/home');

      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider
	      
        .state("home", {
        	url: "/home",
        	abstract: true,
        	templateUrl: 'app/views/home.html',
        	controller: 'HomeController',
        	data: {
        		rule: function($rootScope) {
        			if (!angular.isDefined($rootScope.isLogin)) return false;
        		
        			return $rootScope.isLogin;
        		}  
        	},
          
        	onEnter: function($rootScope) {
        		console.log('HIH Home: Entering page!');
        	}
        })        
        .state('home.welcome', {
        	url: '',
        	templateUrl: 'app/views/welcome.html'
        })
		.state('home.userlist', {
        	url: '/userlist',
        	templateUrl: 'app/views/userlist.html',
			controller: 'UserListController'
		})
        .state('home.userdetail', {
        	url: '/userdetail',
        	templateUrl: 'app/views/userdetail.html'
        })
        .state('home.about', {
          url: '/about',
          templateUrl: 'app/views/about.html',
          controller: 'AboutController'
        });
		
		// Translate configurations
		$translateProvider.useStaticFilesLoader({
		    files: [{
		        prefix: 'locales/',
		        suffix: '.json'
		    }]
		});
        
		// Enable escaping of HTML
  		$translateProvider.useSanitizeValueStrategy('escaped');		
		$translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
		    'en_US': 'en',
		    'en_UK': 'en',
		    'zh_CN': 'zh',
			'zh-CN': 'zh'
		  })
		  .determinePreferredLanguage()
		  //.preferredLanguage('zh')
		  .fallbackLanguage('en');		
	}])
	
    .controller('PopupDialogController',  ['$scope', '$rootScope', '$log', '$translate', '$uibModalInstance', 'TitleStr', 'Details', 
        function($scope, $rootScope, $log, $translate, $uibModalInstance, TitleStr, Details) {
            $scope.TitleStr = TitleStr;
            $scope.DetailList = Details;
            
            $scope.ok = function() {
                $uibModalInstance.close();
            };
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])
        
	.controller('MainController', ['$scope', '$rootScope', '$log', '$translate', '$uibModal', 'utils', 
        function($scope, $rootScope, $log, $translate, $uibModal, utils) {
		$scope.currentTheme = "lumen"; // Default theme: , readable
		
		var arCSS = utils.getThemeCSSPath($scope.currentTheme);
		$scope.bootstrapcss = arCSS[0];
		$scope.bootstrap_defaultcss = arCSS[1];
		
		$scope.$on('ThemeChange', function (oEvent, newtheme) {
			$log.info('HIH: Theme has changed!');
			
			if ($scope.currentTheme !== newtheme) {
				$scope.currentTheme = newtheme;
				
				var arCSS = utils.getThemeCSSPath($scope.currentTheme);
				$scope.bootstrapcss = arCSS[0];
				$scope.bootstrap_defaultcss = arCSS[1];
			}
		});
		
		$scope.$on('ShowMessage', function (oEvent, msgHeader, msgDetail, msgType, conf_func) {
			$log.info('HIH: ShowMessage event occurred');
            $log.info("HIH Show message: header: " + msgHeader + "; detail: " + msgDetail);
			
			if (conf_func && angular.isFunction(conf_func)) {
				window.swal({ 
                    title: msgHeader,   
					text: msgDetail,   
					type: msgType || "warning", 
					showCancelButton: true, 
					confirmButtonColor: "#DD6B55", 
					confirmButtonText: "Yes, delete it!", 
					closeOnConfirm: true }, 
					conf_func
					);
			} else {
				window.swal(msgHeader, msgDetail, msgType || "error");
			}
		});
		
		$scope.$on('ShowMessageNeedTranslate', function (oEvent, msgHeaderStr, msgDetailStr, msgType, conf_func) {
			$log.info('HIH: ShowMessageNeedTranslate event occurred');
            $log.info("HIH Show message: header: " + msgHeaderStr + "; detail: " + msgDetailStr);
			
			$translate([msgHeaderStr, msgDetailStr]).then(function (translations) {
				var hdr = translations[msgHeaderStr];
				var dtal = translations[msgDetailStr];

				if (conf_func && angular.isFunction(conf_func)) {
					window.swal({ title: hdr,   
								text: dtal,   
								type: msgType || "warning", 
								showCancelButton: true, 
								confirmButtonColor: "#DD6B55", 
								confirmButtonText: "Yes, delete it!", 
								closeOnConfirm: true }, 
								conf_func
					);
				} else {
					window.swal(hdr, dtal, msgType || "error");
				}
			});
		});
        
        $scope.$on('ShowMessageEx', function(oEvent, TitleStr, Details) {
            var modalInstance = $uibModal.open({
                //animation: true,
                templateUrl: 'app/views/modaldlg.html',
                controller: 'PopupDialogController',
                size: '',
                resolve: {
                    TitleStr: function() { return TitleStr; },
                    Details: function() { return Details; }
                }
            });
            
            modalInstance.result.then(function(){
               $log.info("HIH Modal: closed at: " + new Date()); 
            }, function() {
               $log.info("HIH Modal: dismissed at: " + new Date()); 
            });
        });
	}])
	
	.controller('HomeController', ['$scope', '$rootScope', '$state', '$stateParams','$http', '$log', '$translate', 'utils', 
		function($scope, $rootScope, $state, $stateParams, $http, $log, $translate, utils) {		
		$scope.CurrentUser = $rootScope.CurrentUser;
		
		// Load the finance setting out
		utils.loadFinanceSettingQ()
			.then(function(response) {
				// Do nothing here~~~
			}, function(reason) {
                $log.error(reason);
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});            
		utils.loadFinanceExchangeRateInfoQ()
			.then(function(response) {
				// Do nothing here~~~
			}, function(reason) {
                $log.error(reason);
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			});
		utils.loadLibSettingQ()
			.then(function(response) {
				// Do nothing here~~~
			}, function(reason) {
                $log.error(reason);
				$rootScope.$broadcast("ShowMessage", "Error", reason);
			}); 
                       
		// Welcome page
		$scope.listUsrAct = [];	
		utils.loadUserLogListQ()
			.then(function(response) {
				// Do nothing
				var nCount1 = 0;
				var nCount2 = 0;
				var dtLast = null;
				var dtLastWeek = new Date();
				dtLastWeek.setDate(dtLastWeek.getDate() - 7);
				var dtLastMonth = new Date();
				dtLastMonth.setDate(dtLastMonth.getDate() - 30);
				
				$.each($rootScope.arUserLogList, function(idx, obj) {
					if (!dtLast) {
						dtLast = obj.TimePoint;
					} else {
						if (dtLast < obj.TimePoint) {
							dtLast = obj.TimePoint;
						}
					}
					
					if (obj.LogType === hih.Constants.UserHistType_Login) {
						if (obj.TimePoint > dtLastWeek) nCount1 ++;
						if (obj.TimePoint > dtLastMonth) nCount2 ++;						
					}					
				});
				$scope.listUsrAct = [
					{ Activity: 'Count of logins in last week', Detail: nCount1 },
					{ Activity: 'Count of logins in last month', Detail: nCount2 },
					{ Activity: 'Last login time', Detail: dtLast }
				];
			}, function(reason) {
				// Do nothing either!
			});
			
		$scope.listModInfo = [];
		utils.getAccountListForDownPaymentQ()
			.then(function(response) {
				for(var i = 0; i < response.length; i++) {
					var modinfo = {
						Module: 'FI Downpayment',
						Date: response[i].trandate,
						Detail: "Account: " + response[i].accountname + "; Amount: " + response[i].tranamount ,
						AccountID: response[i].accountid,
						DPTempID: response[i].tmpdocid
					};
					$scope.listModInfo.push(modinfo);
				}
				// $scope.listModInfo = [
				// 	{ Module: 'Learn Plan Items', Detail: 0 },
				// 	{ Module: 'Downpayment Temp Docs', Detail: 0 },
				// ];
			}, function(reason) {
				// Do nothing.
			});
			
		$scope.goDetail = function(row) {
			if (row.AccountID) {
				// Go to the downpayment relevant doc
				$state.go('home.finance.document.dptmpdoc_post', { docid: row.DPTempID });
			}
		};
		$scope.refreshTodo = function() {
			$scope.listModInfo = [];
			
			utils.getAccountListForDownPaymentQ()
				.then(function(response) {
					for(var i = 0; i < response.length; i++) {
						var modinfo = {
							Module: 'FI Downpayment',
							Date: response[i].trandate,
							Detail: "Account: " + response[i].accountname + "; Amount: " + response[i].tranamount ,
							AccountID: response[i].accountid,
							DPTempID: response[i].tmpdocid
						};
						$scope.listModInfo.push(modinfo);
					}
					// $scope.listModInfo = [
					// 	{ Module: 'Learn Plan Items', Detail: 0 },
					// 	{ Module: 'Downpayment Temp Docs', Detail: 0 },
					// ];
				}, function(reason) {
					// Error dialog?
					// ToDo
				});
		};
		
		// User detail page
		$scope.listCurUserLogList = [];
		
		$scope.displayedCollection = [
			{userobj: 'Common.ID', 		usercont: $scope.CurrentUser.userid},
			{userobj: 'Login.DisplayAs', usercont: $scope.CurrentUser.userdisplayas},
			{userobj: 'Login.Gender',		usercont: utils.genderFormatter($scope.CurrentUser.usergender)},
			{userobj: 'Login.RegisterDate', usercont: $scope.CurrentUser.usercreatedon}
			];
		
		$scope.logout = function() {
			$log.info("HIH: Logout triggerd!");
			utils.sendRequest( { objecttype: 'USERLOGOUT' }, function (data, status, headers, config) {
				
				// Clear the current user information
				$rootScope.isLogin = false;
				$rootScope.CurrentUser = {};
				$scope.CurrentUser = {};
				
				for(var prop in $rootScope) {
				    if($rootScope.hasOwnProperty(prop)) {
						$log.log("HIH Logout: " + prop);
						if (prop.charAt(0) !== "$" ){
							delete $rootScope[prop];
                            $log.log("HIH Logout: " + prop + " removed");
						}			
					}						
				}
				
				// Redirect to login page
				$state.go('login');
			}, function(data, status, headers, config) {
				// Throw out error message				
				$rootScope.$broadcast('ShowMessage', 'Error', 'Failed to logout!');
			});
		};
		
		$scope.setTheme = function(theme) {
			$log.info("HIH: Theme change triggerd!");

			var realtheme = "";			
			if (theme && theme.length > 0) {
				// Now replace the CSS
				realtheme = theme;
			} else {
				// Go for default theme
				realtheme = "default";
			}			
			$rootScope.$broadcast('ThemeChange', realtheme);
		};
		
		$scope.setLanguage = function(newLang) {
			$log.info("HIH: Language change triggerd!");
			$translate.use(newLang);
			
		  	// if (newLang === "zh") {
			// 	i18nService.setCurrentLang('zh-CN');					  
			// } else {
			// 	i18nService.setCurrentLang('en');
			// }
		};
	}])

	.controller('UserListController', ['$scope', '$rootScope', '$state', '$http', '$log', 'utils', function($scope, $rootScope, $state, $http, $log, utils) {
		utils.loadUserListQ()
			.then(function(response) {
				// Do nothing
			}, function(reason) {
				$rootScope.$broadcast('ShowMessage', 'Error', reason);
			});
	}])
	
	.controller('MessageBoxController', ['$scope', '$rootScope','$modalInstance', function($scope, $rootScope, $modalInstance) {
		$scope.MessageHeader = $rootScope.MessageHeader;
		$scope.MessageDetail = $rootScope.MessageDetail;
		
		$scope.ok = function () {
		    $modalInstance.close();
		  };
        $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
		  
//		$scope.$on("ShowMessage",function (oEvent, msgHeader, msgDetail) {
//			console.log('HIH MessageBox Controller: ShowMessage event occurred');
//			$scope.MessageHeader = msgHeader;
//			$scope.MessageDetail = msgDetail;
//
//			var modalInstance = $modal.open({
//			      animation: true,
//			      templateUrl: 'hihMessageDialog.html',
//			      resolve: {
//			          msgHeader: $scope.msgHeader,
//			          msgDetail: $scope.msgDetail			          
//			        }
//		      });
//		
//			modalInstance.result.then(function () {
//		      //$scope.selected = selectedItem;
//		    }, function () {
//		      $log.info('HIH: Message dialog dismissed at: ' + new Date());
//		    });			
//			
//			$('#dlgMessage').modal('hide');
//			var dlg = $('#dlgMessage');
//			if (dlg)
//				dlg.modal('show');
//		});
	}])	
	
	.controller('AboutController', ['$scope', '$rootScope', function($scope, $rootScope) {
		// $scope.myInterval = 5000;
		// 
		// var slides = $scope.slides = [];
		// $scope.addSlide = function(url, infotxt) {
		//     slides.push({
		//     	image: url,
		//     	text: infotxt
		//     });
		//  };
		 
		//$scope.addSlide('app/img/Duoduo2013.jpg', 'Duoduo @ 2013');
		//$scope.addSlide('app/img/JiaotongUniversity.jpg', 'Jiaotong University');
		//$scope.addSlide('app/img/LD.jpg', 'LD @ 2013');
		//$scope.addSlide('app/img/SpeedOfShanghai.jpg', 'Speed of Shanghai');
		//$scope.addSlide('app/img/TheAutumn.jpg', 'The Autumn');
	}])
	;
})();
