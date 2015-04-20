<?php

// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'script/utility.php';

if ($_SERVER ["REQUEST_METHOD"] == "POST") {
	// User register page
	$sLogin = escape ( $_POST ['loginuser'] );
	$sPass = escape ( $_POST ['pwd'] );
	$sCPass = escape ( $_POST ['cpwd'] );
	$sEmail = escape ( $_POST ['email'] );
	$iGender = ( int ) $_POST ['gender'];
	$sAlias = escape ( $_POST ['displayas'] );
	
	$sErrors = "";
	if (strlen ( $sLogin ) >= LoginName_MinLength and strlen ( $sLogin ) <= LoginName_MaxLength) {
		if (strlen ( $sPass ) >= LoginPassword_MinLength and strlen ( $sPass ) <= LoginPassword_MaxLength) {
			if (strlen ( $sEmail ) >= LoginEmail_MinLength and strlen ( $sEmail ) <= LoginEmail_MaxLength) {
				if (strlen ( $sAlias ) >= LoginAlias_MinLength and strlen ( $sAlias ) <= LoginAlias_MaxLength) {
					if ($sPass == $sCPass) {
						if (ereg ( '^[a-zA-Z0-9\-\.\_]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$', $sEmail )) {
							if ($iGender == '1' xor $iGender == '0') {
								// Save it to DB
								$sErrors = user_register($sLogin, $sPass, $sAlias, $iGender, $sEmail);
							} else {
								$sErrors = 'Gender is wrong';
							}
						} else {
							$sErrors = 'Email is wrong';
						}
					} else {
						$sErrors = 'Passwords are not the same';
					}
				} else {
					$sErrors = 'Display As is too long/short';
				}
			} else {
				$sErrors = 'Email is too long';
			}
		} else {
			$sErrors = 'Password is too long';
		}
	} else {
		$sErrors = 'Login is too long';
	}
	
	header('Content-type: application/json');
	if (! empty ( $sErrors )) {
		echo json_encode(array(
				'type'=>'E',
				'Message'=>$sErrors
		));
		exit();		
	} else {
		// Fill the user object
		$objUser = new HIHUser();
		$objUser->ID = $sLogin;
		$objUser->DisplayAs = $sAlias;
		$objUser->CreatedOn = $_SERVER['SERVER_TIME'];
		$objUser->Gender = $iGender;
	
		// 1. Set current user
		$_SESSION ['HIH_CurrentUser'] = serialize($objUser);
		
		echo json_encode(array(
				'type'=>'S',
				'Message'=>'Succeed'
		));
		exit();		
	}	
} else {
	// Default: empty page
	echo strtr ( file_get_contents ( 'templates/tmpl_pageheader.html' ), array() );
	echo strtr ( file_get_contents ( 'templates/tmpl_user_register.html' ), array () );
}

?>
