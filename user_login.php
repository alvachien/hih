<?php
// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'script/utility.php';

// $domain  =  'hih' ;                     
// bindtextdomain ( $domain ,  "locale/" ); 
// bind_textdomain_codeset($domain ,  'UTF-8' );
// textdomain($domain );

if ($_SERVER ["REQUEST_METHOD"] == "POST" ) {
	$sLogin = escape ( $_POST ["loginuser"] );
	$sPass = escape ( $_POST ['pass'] );
	$sErrors = "";

	if (strlen ( $sLogin ) >= LoginName_MinLength and strlen ( $sLogin ) <= LoginName_MaxLength) {
		if (strlen ( $sPass ) >= LoginPassword_MinLength and strlen ( $sPass ) <= LoginPassword_MaxLength) {
		} else {
			$sErrors = "Password is too long";
		}
	} else {
		$sErrors = "Login is too long";
	}

	// Validate the password via the database
	$objUser = null;
	if (IsNullOrEmptyString($sErrors)) {
		$arRst = user_login($sLogin, $sPass);
// 		if (HIH_DEBUGMODE) {
// 			var_dump($arRst);
// 		}
		$sErrors = $arRst[0];
		$objUser = $arRst[1];
	}
	
	header('Content-type: application/json');
	if (!empty ( $sErrors )) {
		echo json_encode(array(
				'type'=>'E',
				'Message'=>$sErrors
		));
	} else {
		// 1. Set current user
		$_SESSION [ 'HIH_CurrentUser' ] = serialize($objUser);

		echo json_encode(array(
				'type'=>'S',
				'Message'=>null
		));
	}
} else {
	// Default: empty page
	echo strtr ( file_get_contents ( 'templates/tmpl_pageheader.html' ), array() );
	echo strtr ( file_get_contents ( 'templates/tmpl_user_login.html' ), array(	
		) );
}

?>
