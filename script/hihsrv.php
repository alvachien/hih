<?php

// set error reporting level
// if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
// error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
// else
// error_reporting ( E_ALL & ~ E_NOTICE );
error_reporting ( E_ERROR );

session_start ();

require_once 'utility.php';

if ($_SERVER ["REQUEST_METHOD"] === "POST") {
	
	header ( 'Content-type: application/json; charset=utf-8' );
	
	$realParamArr = json_decode ( file_get_contents ( 'php://input' ), true );
	$sObject = escape ( $realParamArr ['objecttype'] );
	$sErrors = "";
	$arRst = array ();
	$username = "";
	
	switch ($sObject) {
		// ===========================================================================================
		// Login and User Part
		// ===========================================================================================
		
		case "USERLOGIN" :
			{
				$sLogin = escape ( $realParamArr ['loginuser'] );
				$sPass = escape ( $realParamArr ['loginpassword'] );
				
				if (strlen ( $sLogin ) >= LoginName_MinLength and strlen ( $sLogin ) <= LoginName_MaxLength) {
					if (strlen ( $sPass ) >= LoginPassword_MinLength and strlen ( $sPass ) <= LoginPassword_MaxLength) {
					} else {
						$sErrors = "Password is too long or too small";
					}
				} else {
					$sErrors = "Login is too long or too small";
				}
				
				// Validate the password via the database
				$objUser = null;
				if (IsNullOrEmptyString ( $sErrors )) {
					$arRst = user_login ( $sLogin, $sPass );
					$sErrors = $arRst [0];
					$objUser = $arRst [1];
				}
				
				if (IsNullOrEmptyString ( $sErrors )) {
					$_SESSION ['HIH_CurrentUser'] = serialize ( $objUser );
					echo json_encode ( array (
							'type' => 'S',
							'UserID' => $objUser->ID,
							'UserDisplayAs' => $objUser->DisplayAs,
							'UserCreatedOn' => $objUser->CreatedOn,
							'UserGender' => $objUser->Gender 
					) );
				}
			}
			break;
		
		case "USERLOGOUT" :
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					
					$objUsr = unserialize($_SESSION ['HIH_CurrentUser']);
					user_hist_add($objUsr->ID, HIHConstants::GC_UserHistType_Logout, NULL);
					
					session_destroy ();
				}			
			}
			break;
			
		case "GETUSERLIST":
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$arRst = user_combo ();
					$sErrors = $arRst [0];
					
					if (! IsNullOrEmptyString ( $arRst [0] )) {
						export_error ( $arRst [0] );
					} else {
						echo json_encode ( $arRst [1] );
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( $sErrors );
				}				
			}
			break;
			
		case "GETUSERLOGHIST": {
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$objUsr = unserialize($_SESSION ['HIH_CurrentUser']);

					$arRst = user_hist_getlist( $objUsr->ID );
					if (! IsNullOrEmptyString ( $arRst [0] )) {
						export_error ( $arRst [0] );
					} else {
						echo json_encode ( $arRst [1] );
					}
				}
			}
			break;
		
		case "REGISTERUSER": {
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$objUsr = new HIHUser($jsondata);
				
				$errCodes = $objUsr->CheckValid();
				if ($errCodes && count($errCodes) > 0) {
					export_error ( implode( ';', $errCodes) );
				} else {
					$errString = user_register2($objUsr);
					if (empty ( $errString )) {
					} else {
						export_error( $errString );
					}
				}
			}
			break;
			
		// ===========================================================================================
		// Learn Part
		// ===========================================================================================
		case "GETLEARNOBJECTLIST" :
			{
				HIHSrv_Function( 'learn_object_listread' );
			}
			break;
			
		case "GETLEARNOBJECTHIERARCHY": 
			{
				HIHSrv_Function( 'learn_object_hierread' );
			}
			break;
		
		case "GETLEARNHISTORYLIST" :
			{
				$username = $realParamArr ["userid"];
				if (IsNullOrEmptyString ( $username )) {
					HIHSrv_Function( 'learn_hist_listread' );
				} else {
					HIHSrv_Function( 'learn_hist_listread_byuser' );
				}
			}
			break;
		
		case "GETLEARNAWARDLIST" :
			{
				$username = $realParamArr ["userid"];
				if (IsNullOrEmptyString ( $username )) {
					HIHSrv_Function( 'learn_award_listread' );
				} else {
					HIHSrv_Function( 'learn_award_listread_byuser' );
				}
			}
			break;
		
		case "GETLEARNCATEGORYLIST" :
			{
				HIHSrv_Function( 'learn_category_read' );
			}
			break;

		case "CREATELEARNCATEGORY": 
			{
				// For JSON-based parameter, can NOT escape it directly!
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loCtgy = new HIHLearnCategory($jsondata);
				$errCodes = $loCtgy->CheckValid();
				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'learn_category_create2', $loCtgy);
				}
			}
			break;
			
		case "CHANGELEARNCATEGORY": {
				// For JSON-based parameter, can NOT escape it directly!
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loCtgy = new HIHLearnCategory($jsondata);
				$errCodes = $loCtgy->CheckValid(true);
				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'learn_category_change', $loCtgy);
				}			
			}
			break;
			
		case "CHECKLEARNCATEGORYUSAGE": 
			{
				$objids =  explode(',', escape( $realParamArr ['ids'] ));
				
				HIHSrv_Function_1Param( 'learn_category_checkusage', $objids );			
			}	
			break;
			
		case "DELETELEARNCATEGORY": {
			
			}
			break;
			
		case "CREATELEARNOBJECT" :
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$category = escape( $realParamArr['category'] );
					$name = escape( $realParamArr['name'] );
					$content = escape( $realParamArr['content'] );
					
					// To-Do: Validate!
					
					$arRst = learn_object_create( $category, $name, $content);
					if (! IsNullOrEmptyString ( $arRst [0] )) {
						export_error ( $arRst [0] );
					} else {
						echo json_encode ( $arRst [1] );
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}			
			}
			break;

		case "CREATELEARNOBJECT2" :
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					// For JSON-based parameter, can NOT escape it directly!
					$jsondata = json_decode( $realParamArr ['jsonData'] );
					$loObj = new HIHLearnObject($jsondata);
					$errCodes = $loObj->CheckValid();
					if (!empty($errCodes)) {
						export_error ( implode( ';', $errCodes) );
					} else {
						HIHSrv_Function_1Param( 'learn_object_create2', $loObj);
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}			
			}
			break;
			
		case "CHANGELEARNOBJECT":
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					// For JSON-based parameter, can NOT escape it directly!
					$jsondata = json_decode( $realParamArr ['jsonData'] );
					$loObj = new HIHLearnObject($jsondata);
					$errCodes = $loObj->CheckValid(true);
					if (!empty($errCodes)) {
						export_error ( implode( ';', $errCodes) );
					} else {
						HIHSrv_Function_1Param( 'learn_object_change2', $loObj);
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}			
			}
			break;
		
		case "CHECKLEARNOBJECTSUSAGE": 
			{
				$objids =  explode(',', escape( $realParamArr ['ids'] ));
				
				HIHSrv_Function_1Param( 'learn_object_checkusage', $objids );			
			}	
			break;
		
		case "DELETELEARNOBJECT": 
			{
				$objid = escape ( $realParamArr ['id'] );
				HIHSrv_Function_1Param( 'learn_object_delete', $objid );
			}
			break;
			
		case "DELETELEARNOBJECTS": 
			{
				$objids =  explode(',', escape( $realParamArr ['ids'] ));
				
				HIHSrv_Function_1Param( 'learn_object_multidelete', $objids );
			}
			break;
			
		case "CREATELEARNHISTORY" :
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$jsondata = json_decode( $realParamArr ['jsonData'] );
					$loHist = new HIHLearnHistory($jsondata);
					$errCodes = $loHist->CheckValid();

					if (!empty($errCodes)) {
						export_error ( implode( ';', $errCodes) );
					} else {
						$chkexistarray = learn_hist_exist ( $loHist->UserID,  $loHist->ObjectID, $loHist->LearnDate );
						if (! empty ( $chkexistarray [0] )) {
							export_error($chkexistarray [0]);
						} else {
							if ($chkexistarray [1] === true) {
								export_error(HIHConstants::EC_LearnHistoryExist);
							} else {
								HIHSrv_Function_1Param( 'learn_hist_create2', $loHist);
							}
						}
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}
			}
			break;

		case "CHANGELEARNHISTORY" :
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$jsondata = json_decode( $realParamArr ['jsonData'] );
					$loHist = new HIHLearnHistory($jsondata);
					$errCodes = $loHist->CheckValid(true);

					if (!empty($errCodes)) {
						export_error ( implode( ';', $errCodes) );
					} else {
						$chkexistarray = learn_hist_exist ( $loHist->UserID,  $loHist->ObjectID, $loHist->LearnDate );
						if (!empty ( $chkexistarray [0] )) {
							export_error($chkexistarray [0]);
						} else {
							if ($chkexistarray [1] === true) {
								HIHSrv_Function_1Param( 'learn_hist_change', $loHist);
							} else {								
								export_error(HIHConstants::EC_LearnHistoryNotExist);
							}
						}						
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}
			}
			break;
			
		case "DELETELEARNHISTORY": 
			{
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loHist = new HIHLearnHistory($jsondata);
				HIHSrv_Function_3Param( 'learn_hist_delete', $loHist->UserID,  $loHist->ObjectID, $loHist->LearnDate );
			}
			break;
		
		case "CREATELEARNAWARD":
			{
				if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
					$name = escape( $realParamArr['user'] );
					$adate = escape( $realParamArr['awarddate'] );
					$score = escape( $realParamArr['awardscore'] );
					$score = (int) $score;
					$reason = escape( $realParamArr['awardreason']);
					
					// To-Do: Validate!
					
					$arRst = learn_award_create($name, $adate, $score, $reason);
					if (! IsNullOrEmptyString ( $arRst [0] )) {
						export_error ( $arRst [0] );
					} else {
						echo json_encode ( $arRst [1] );
					}
				} else {
					$sErrors = "User not login yet";
					export_error ( sErrors );
				}
			}
			break;
			
		case "CREATELEARNAWARD2": {
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loAward = new HIHLearnAward($jsondata);
				$errCodes = $loAward->CheckValid(true);

				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'learn_award_create2', $loAward );
				}
			}
			break;
			
		case "CHANGELEARNAWARD": {
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loAward = new HIHLearnAward($jsondata);
				$errCodes = $loAward->CheckValid();

				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'learn_award_change', $loAward );
				}			
			}
			break; 
		
		case "DELETELEARNAWARD":
			{
				$id = escape ( $realParamArr ['id'] );
				HIHSrv_Function_1Param( 'learn_award_delete', $id );
			}
			break;

		case "DELETELEARNAWARDS":
			{
				$objids =  explode(',', escape( $realParamArr ['ids'] ));
				HIHSrv_Function_1Param( 'learn_award_multidelete', $objids );
			}
			break;
			
		case "GETLEARNPLANLIST" :
			{
				HIHSrv_Function( 'learn_plan_listread' );
			}
			break;
			
		case "CREATELEARNPLAN":
			{
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loPlan = new HIHLearnPlan($jsondata);
				HIHSrv_Function_1Param( 'learn_plan_create', $loPlan );
			}
			break;
			
		case "CHANGELEARNPLAN":
			{
				$jsondata = json_decode( $realParamArr ['jsonData'] );
				$loPlan = new HIHLearnPlan($jsondata);
				HIHSrv_Function_1Param( 'learn_plan_change', $loPlan );				
			}
			break;
			
		case "DELETELEARNPLAN":
			{
				$nID = escape( $realParamArr['planid'] );
				HIHSrv_Function_1Param( 'learn_plan_delete', $nID );				
			}
			break;
			
		// ===========================================================================================
		// Finance Part
		// ===========================================================================================
		case "GETFINANCESETTING": {
			HIHSrv_Function( 'finance_setting_listread' );
		}
		break;
		
		case "GETFINANCEEXGRATEINFO": {
			HIHSrv_Function( 'finance_exgrate_listread' );
		}
		break;
		
		case "GETFINANCEACCOUNTLIST": {
			HIHSrv_Function( 'finance_account_listread' );
		}
		break;
			
		case "CREATEFINANCEACCOUNT":
			{
				// For JSON-based parameter, can NOT escape it directly!
				$acdata = json_decode( $realParamArr ['acdata'] );
				$acObj = new HIHAccount($acdata);
				$errCodes = $acObj->CheckValid();
				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'finance_account_create', $acObj);
				}
				
				// if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
				// 	$name = escape( $realParamArr['name'] );
				// 	$ctgyid = escape( $realParamArr['ctgyid'] );
				// 	$comment = escape( $realParamArr['comment'] );
				// 	
				// 	// To-Do: Validate!
				// 	
				// 	$arRst = finance_account_create($name, $ctgyid, $comment);
				// 	if (! IsNullOrEmptyString ( $arRst [0] )) {
				// 		export_error ( $arRst [0] );
				// 	} else {
				// 		echo json_encode ( $arRst [1] );
				// 	}
				// } else {
				// 	$sErrors = "User not login yet";
				// 	export_error ( sErrors );
				// }
			}
			break;
			
		case "CHANGEFINANCEACCOUNT": {
				$acdata = json_decode( $realParamArr ['acdata'] );
				$acObj = new HIHAccount($acdata);
				$errCodes = $acObj->CheckValid();
				if (!empty($errCodes)) {
					export_error ( implode( ';', $errCodes) );
				} else {
					HIHSrv_Function_1Param( 'finance_account_change', $acObj);
				}			
			}	
			break;
			
		case "DELETEFINANCEACCOUNT": {
			// ToDo: Check the usage first!
			// Throw error if it is still in use;
			
			$acntid = escape ( $realParamArr ['acntid'] );
			HIHSrv_Function_1Param( 'finance_account_delete', $acntid);	
		}
		break;
			
		case "GETCURRENCYLIST": {
			HIHSrv_Function( 'finance_currency_listread' );
		}
		break;
		
		case "GETFINANCEDPACCOUNTDETAIL": {
			$acntid = escape ( $realParamArr ['acntid'] );
			HIHSrv_Function_1Param( 'finance_dpaccount_getdetail', $acntid);
		}
		break;
			
		case "GETFINANCEACCOUNTCATEGORYLIST": { 
			HIHSrv_Function( 'finance_account_category_listread' );			
		}
		break;
			
		case "GETFINANCEDOCUMENTLIST": {
			HIHSrv_Function( 'finance_document_listread' );
		}
		break;
			
		case "GETFINANCEDOCUMENTTYPELIST": {
			HIHSrv_Function( 'finance_doctype_listread' );
		}
		break;
		
		case "GETFINANCEDOCUMENTLIST_CURREXG": {
			HIHSrv_Function( 'finance_document_curexg_listread' );
		}
		break;
			
		case "GETFINANCEDOCUMENTITEMLIST_BYDOC": {
			$docid = escape ( $realParamArr ['docid'] );
			HIHSrv_Function_1Param( 'finance_documentitem_listread', $docid );
		}
		break;
		
		case "GETFINANCEDOCUMENTITEMLIST_BYACCNT": {
			$acntid = escape ( $realParamArr ['accountid'] );
			HIHSrv_Function_1Param( 'finance_documentitem_listreadbyaccount', $acntid );
		}
		break;

		case "GETFINANCEDOCUMENTITEMLIST_BYCTGY": {
			$ctgyid = escape ( $realParamArr ['categoryid'] );
			HIHSrv_Function_1Param( 'finance_documentitem_listreadbyacntctgy', $ctgyid );
		}
		break;
		
		case "CREATEFINANCEDOCUMENT": {
			// For JSON-based parameter, can NOT escape it directly!
			$docdata = json_decode( $realParamArr ['docdata'] );
			$docObj = new HIHDocument($docdata);
			HIHSrv_Function_1Param( 'finance_document_post', $docObj);
		}
		break;
		
		case "CREATEFINANCEDOCUMENT_DP": {
			// For JSON-based parameter, cannot escape.
			$docdata = json_decode($realParamArr ['docdata'] );
			$docObj = new HIHDocument($docdata);
			
			$acntdata = json_decode($realParamArr [ 'accountdata' ]);
			$acntObj = new HIHAccount($acntdata);
			
			$acntdp =  json_decode($realParamArr [ 'accountdp' ]);
			$acntDPObj = new HIHAccountDP($acntdp);
			
			$dpitems = json_decode($realParamArr [ 'dpitems' ], true);
			$docObjs = array ();
			if (is_array($dpitems)) {
				$count = count($dpitems);
				for ($i = 0; $i < $count; $i++) {
					$docObjs[] = new HIHDPTempDoc(json_decode($dpitems[ $i ]));
				}
			}
			
			HIHSrv_Function_4Param( 'finance_dpdoc_post', $docObj, $acntObj, $acntDPObj, $docObjs);
		}
		break;
		
		case "CREATEFINANCEDOCUMENT_FOR_DPTMP": {
			$docdata = json_decode($realParamArr ['docdata'] );
			$docObj = new HIHDocument($docdata);
			$dptmpid = escape ( $realParamArr ['dptmpid'] );
			
			HIHSrv_Function_2Param( 'finance_dptmpdoc_post', $docObj, $dptmpid);			
		}
		break;
		
		case "GETFINANCEDOCUMENTLIST_DP": {
			$acntid = escape ( $realParamArr ['accountid'] );
			HIHSrv_Function_1Param( 'finance_dpdoc_listread', $acntid);
		}
		break;

		case "GETFINANCEACCOUNTLIST_DP_TBP": {
			$tdate = escape ( $realParamArr ['tdate'] );
			HIHSrv_Function_1Param( 'finance_dpaccount_listread_tdate', $tdate);
		}
		break;
		
		case "GETFINANCEDOCUMENT_DP": {
			$docid = escape ( $realParamArr ['docid'] );
			HIHSrv_Function_1Param( 'finance_dpdoc_get', $docid);
		}
		break;
		
		case "DELETEFINANCEDOCUMENT": {
			$docid = escape ( $realParamArr ['docid'] );
			HIHSrv_Function_1Param( 'finance_document_delete', $docid);
		}
		break;
			
		case "GETFINANCETRANSACTIONTYPELIST": {
			HIHSrv_Function_1Param( 'finance_trantype_listread', false );				
		}
		break;
			
		case "GETFINANCETRANSACTIONTYPEHIERARCHY": {
			HIHSrv_Function( 'finance_trantype_hierread' );				
		}
		break;
			
		case "GETFINANCEACCOUNTHIERARCHY": {
			HIHSrv_Function( 'finance_account_hierread' );
		}
		break;
			
		case "GETFINANCECONTROLCENTERLIST": {
			HIHSrv_Function_1Param( 'finance_controlcenter_listread', false );
		}
		break;
			
		case "GETFINANCECONTROLCENTERHIERARCHY": {
			HIHSrv_Function_AfterProc( 'finance_controlcenter_listread', 'build_financecontrolcenter_tree' );
		}
		break;
			
		case "CREATEFINANCECONTROLCENTER": {
			$ccname = escape ( $realParamArr ['name'] );
			$ccparent = escape ( $realParamArr ['parent'] );
			if (empty($ccparent)) {
				$ccparent = NULL;
			}			
			$cccomment = escape ( $realParamArr ['comment'] );
			
			HIHSrv_Function_3Param('finance_controlcenter_create', $ccname, $ccparent, $cccomment);
		}
		break;
		
		case "DELETEFINANCECONTROLCENTER": {
			// ToDo: Check the usage first!
			// Throw error if it is still in use;
			
			$ccid = escape ( $realParamArr ['ccid'] );
			HIHSrv_Function_1Param( 'finance_controlcenter_delete', $ccid);			
		}
		break;
			
		case "GETFINANCEORDERLIST": {
			HIHSrv_Function( 'finance_internalorder_listread' );
		}
		break;
		
		case "GETSETTLEMENTRULELIST_BYORDER": {
			$orderid = escape ( $realParamArr ['orderid'] );
			HIHSrv_Function_1Param( 'finance_internalordersr_listread', $orderid);
		}
		break;
		
		case "CREATEFINANCEORDER": {
			// For JSON-based parameter, can NOT escape it directly!
			$orderdata = json_decode( $realParamArr ['orderdata'] );
			$ordObj = new HIHInternalOrder($orderdata);
			HIHSrv_Function_1Param( 'finance_internalorder_create', $ordObj);
		}
		break;
		
		case "DELETEFINANCEORDER": {
			// ToDo: Check the usage first!
			// Throw error if it is still in use;
			$orderid = escape ( $realParamArr ['orderid'] );
			HIHSrv_Function_1Param( 'finance_internalorder_delete', $orderid);
		}
		break;
		
		case "GETFINANCEREPORTBS": {
			HIHSrv_Function( 'finance_report_balancesheet' );
		}
		break;

		case "GETFINANCEREPORTORDER": {
			HIHSrv_Function( 'finance_report_internalorder' );
		}
		break;
		
		case "GETFINANCEREPORTCC": {
			$startdate = escape( $realParamArr['startdate'] );
			$enddate = escape( $realParamArr['enddate'] );
			HIHSrv_Function_2Param( 'finance_report_controlcenter', $startdate, $enddate );
		}
		break;
		
		case "GETFINANCEREPORTTT": {
			$startdate = escape( $realParamArr['startdate'] );
			$enddate = escape( $realParamArr['enddate'] );
			HIHSrv_Function_2Param( 'finance_report_trantype', $startdate, $enddate );			
		}
		break;
		
		// ===========================================================================================
		// Libraries
		// ===========================================================================================
		
        case "GETLIBLANG": {
            HIHSrv_Function( 'lib_lang_listread' );
        }
        break;
		
		case "GETLIBLOCLIST": {
			HIHSrv_Function( 'lib_loc_listread' );
		}
		break;
		
		case "GETLIBLOCDETAIL": {
			$nid = escape( $realParamArr['id'] );
			HIHSrv_Function_1Param( 'lib_loc_listread', $nid );
		}
		break;
		
		case "CREATELIBLOC": {
			$jsondata = json_decode($realParamArr ['data'] );
			$objLoc = new HIHLibLocation($jsondata);
			$errMsg = $objLoc->CheckValid();
			if (!empty($errMsg)) {
				export_error ( $errMsg );
			} else {
				HIHSrv_Function_1Param( 'lib_loc_create', $objLoc);
			}
		}
		break;
		
		case "UPDATELIBLOC": {
			$jsondata = json_decode($realParamArr ['data'] );
			$objLoc = new HIHLibLocation($jsondata);
			$errMsg = $objLoc->CheckValid();
			if (!empty($errMsg)) {
				export_error ( $errMsg );
			} else {
				HIHSrv_Function_1Param( 'lib_loc_update', $objLoc);
			}			
		}
		break;
		
		case "DELETELIBLOC": {
			
		}
		break;

		case "GETLIBPERSONLIST": {
			HIHSrv_Function( 'lib_person_listread' );
		}
		break;
		
		case "GETLIBPERSONDETAIL": {
			$nid = escape( $realParamArr['id'] );
			HIHSrv_Function_1Param( 'lib_person_listread', $nid );
		}
		break;
		
		case "CREATELIBPERSON": {
			$jsondata = json_decode($realParamArr ['data'] );
			$objPerson = new HIHLibPerson($jsondata);
			$errMsg = $objPerson->CheckValid();
			if (!empty($errMsg)) {
				export_error ( $errMsg );
			} else {
				HIHSrv_Function_1Param( 'lib_person_create', $objPerson);
			}
		}
		break;
		
		case "UPDATELIBPERSON": {
			
		}
		break;
		
		case "DELETELIBPERSON": {
			
		}
		break;

		case "GETLIBORGLIST": {
			HIHSrv_Function( 'lib_org_listread' );
		}
		break;
		
		case "GETLIBORGDETAIL": {
			$nid = escape( $realParamArr['id'] );
			HIHSrv_Function_1Param( 'lib_org_listread', $nid );
		}
		break;
		
		case "CREATELIBORG": {
			$jsondata = json_decode($realParamArr ['data'] );
			$objOrg = new HIHLibOrganization($jsondata);
			$errMsg = $objOrg->CheckValid();
			if (!empty($errMsg)) {
				export_error ( $errMsg );
			} else {
				HIHSrv_Function_1Param( 'lib_org_create', $objOrg);
			}
		}
		break;
		
		case "UPDATELIBORG": {
			
		}
		break;
		
		case "DELETELIBORG": {
			
		}
		break;
        
		// ===========================================================================================
		// Others
		// ===========================================================================================
		default :
			$sErrors = "Input object cannot be handle: " . $realParamArr ['objecttype'] . "; Users: " . $realParamArr ['loginuser'];
			break;
	}
	
	if (! empty ( $sErrors )) {
		export_error ( $sErrors );
	}
} else {
	export_error ( "HIH Wrong request method: " . $_SERVER ["REQUEST_METHOD"] );
}

?>
