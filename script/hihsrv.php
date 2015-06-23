<?php

// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'utility.php';

if ($_SERVER ["REQUEST_METHOD"] === "POST") {
	
	header('Content-type: application/json');

	$realParamArr = json_decode(file_get_contents('php://input'),true);	
	$sObject = escape( $realParamArr['objecttype'] );
	$sErrors = "";
	
	switch ($sObject)
	{
		case "USERLOGIN":
			{
				$sLogin = escape ( $realParamArr['loginuser'] );
				$sPass = escape ( $realParamArr['loginpassword'] );
				
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
				if (IsNullOrEmptyString($sErrors)) {
					$arRst = user_login($sLogin, $sPass);
					$sErrors = $arRst[0];
					$objUser = $arRst[1];
				}
				
				if (IsNullOrEmptyString($sErrors)) {
					$_SESSION [ 'HIH_CurrentUser' ] = serialize($objUser);						
					echo json_encode(array(
						'type'=>'S',
						'UserID'=>$objUser->ID,
						'UserDisplayAs'=>$objUser->DisplayAs
					));
				}
			}				
			break;
			
		case "USERLOGOUT": {
				session_destroy();			
			}
		break;
			
		default:
			$sErrors = "Input object cannot be handle: ". $realParamArr['objecttype']. " Users: ". $realParamArr['loginuser'];
			break;
	}
	
	if (!empty ( $sErrors )) {
		header('HTTP/1.1 500 Internal Server Error');
		echo json_encode(array(
				'type'=>'E',
				'Message'=>$sErrors
		));
	}
} else {
	header('HTTP/1.1 500 Internal Server Error');
	echo json_encode(array(
			'type'=>'E',
			'Message'=>"Wrong request method: ". $_SERVER ["REQUEST_METHOD"]
	));	
}

?>
