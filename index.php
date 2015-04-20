<?php
// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'script/utility.php';

if (isset ( $_SESSION ['HIH_CurrentUser'] )) {

	if ($_SERVER ["REQUEST_METHOD"] === "POST") { 
		$reqtype = $_POST['TYPE'];
		
		if ($reqtype === HIH_ACTIVITY_CHANGETHEME) {
			$newtheme = $_POST['theme'];
			var_dump($newtheme);
			if ( IsNullOrEmptyString ( $newtheme )) {
				$newtheme = 'default';
			}
			if (!isset($_SESSION[HIH_Theme])) {
				$_SESSION[HIH_Theme] = $newtheme;
			} else {
				if (strcmp($_SESSION[HIH_Theme], $newtheme) !== 0) {
					$_SESSION[HIH_Theme] = $newtheme;
				}
			}
			var_dump($_SESSION[HIH_Theme]);
			exit();	
		}
	} else if($_SERVER ["REQUEST_METHOD"] === "GET") {
		$reqtype = $_GET ["TYPE"];
		
		if (! IsNullOrEmptyString ( $reqtype )) {
			switch ($reqtype) 
			{
				case HIH_ACTIVITY_LOGOUT:
				{
					// Logout
					session_destroy();
					
					header ( "location: user_login.php" );
					exit();
				}
				break;
				
				default: break;
			}
		}
	
		// Show main page in any case
		$objUser = unserialize ( $_SESSION ['HIH_CurrentUser'] );
		if (HIH_DEBUGMODE_USER) {
			var_dump ( $objUser );
		}
			
		$curTheme = 'default';
		if (isset($_SESSION[HIH_Theme])) {
			$curTheme = $_SESSION[HIH_Theme];
		}
			
		echo strtr ( file_get_contents ( 'templates/tmpl_pageheader.html' ), array () );
		echo strtr ( file_get_contents ( 'templates/tmpl_pagenav.html' ), array (
				"{currentuser}" => $objUser->DisplayAs,
				"{currenttheme}" => $curTheme
		) );
		echo strtr(file_get_contents ( 'templates/tmpl_mainpage.html' ), array () );
		echo strtr(file_get_contents ( 'templates/tmpl_pagefooter.html' ), array());
		exit();
	}
} else {
 	// Set default language here
// // 	//petenv('LANG=zh_CN');
// // 	putenv('LC_ALL=zh_CN' );	
// // 	$reallocl = setlocale(LC_ALL, 'zh_CN');
// 	// 	putenv('LANG=en_US' );
//  	//putenv('LANGUAGE=en_US' );
//  	putenv('LANG=zh');
//  	$reallocl = setlocale(LC_ALL, 'zh');
	
// 	echo("Now it should be '$reallocl' !!!<br />");
	
// 	$domain = 'hih' ;
// 	$path = bindtextdomain($domain, "locale/");
// 	echo("Now the path is '$path'");
// 	textdomain($domain);
	
// 	echo("<br />");
// 	bind_textdomain_codeset($domain ,  'UTF-8' );
	
// 	echo(gettext("User"));
	header ( "location: user_login.php" );
	exit ();
}

?>
