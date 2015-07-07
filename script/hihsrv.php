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
				session_destroy ();
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
					export_error ( sErrors );
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
		
		// ===========================================================================================
		// Finance Part
		// ===========================================================================================
		case "GETFINANCEACCOUNTLIST": 
			{
				HIHSrv_Function( 'finance_account_listread' );
			}
			break;
			
		case "GETCURRENCYLIST": 
			{
				HIHSrv_Function( 'finance_currency_listread' );
			}
			break;
			
		case "GETFINANCEACCOUNTCATEGORYLIST":
			{ 
				HIHSrv_Function( 'finance_account_category_listread' );			
			}
			break;
			
		case "GETFINANCEDOCUMENTLIST":
			{
				HIHSrv_Function( 'finance_document_listread' );
			}
			break;
			
		case "GETFINANCEDOCUMENTTYPELIST":
			{
				HIHSrv_Function( 'finance_doctype_listread' );
			}
			break;
			
		case "GETFINANCEDOCUMENTITEMLIST":
			{
				$docid = escape ( $realParamArr ['docid'] );
				HIHSrv_Function_1Param( 'finance_documentitem_listread', $docid );
			}
			break;
			
		case "GETFINANCETRANSACTIONTYPELIST":
			{
				HIHSrv_Function_1Param( 'finance_trantype_listread', false );				
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
	export_error ( "Wrong request method: " . $_SERVER ["REQUEST_METHOD"] );
}

?>
