<?php
// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'script/utility.php';

if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
	
	$reqtype = $_GET ["TYPE"];
	
	if (! IsNullOrEmptyString ( $reqtype )) {
		switch ($reqtype) {
			case HIH_ACTIVITY_GETLIST :
				{
					header ( 'Content-type: application/json' );
					
					$username = $_GET ["userid"];
					
					// Get list
					$lrnawdrst = array ();
					if (IsNullOrEmptyString ( $username )) {
						$lrnawdrst = learn_award_listread ();
					} else {
						$lrnawdrst = learn_award_listread_byuser ( $username );
					}
					$rsttable = $lrnawdrst [1];
					
					if (! IsNullOrEmptyString ( $lrnawdrst [0] )) {
						echo json_encode ( array (
								'type' => 'E',
								'Message' => $lrnawdrst [0] 
						) );
					} else {
						$prejson = array ();
						$prejson ['total'] = count ( $rsttable );
						$prejson ['rows'] = $rsttable;
						
						if (count ( $rsttable ) > 0) {
							$footerar = array ();
							$footerar [] = array (
									'displayas' => 'Avg',
									'score' => round ( $lrnawdrst [2] [0] ['avg'], 2 ) 
							);
							$footerar [] = array (
									'displayas' => 'Total',
									'score' => round ( $lrnawdrst [2] [0] ['total'], 2 ) 
							);
							$prejson ['footer'] = $footerar;
						} else {
							$footerar = array ();
							$footerar [] = array (
									'displayas' => 'Avg',
									'score' => 0 
							);
							$footerar [] = array (
									'displayas' => 'Total',
									'score' => 0 
							);
							$prejson ['footer'] = $footerar;
						}
						
						// Parse the data into new format
						echo json_encode ( $prejson );
					}
				}
				break;
			
			case HIH_ACTIVITY_CREATE :
				{
				}
				break;
			
			default :
				break;
		}
	} else {
		
		// Show learn category
		$objUser = unserialize ( $_SESSION ['HIH_CurrentUser'] );
		if (HIH_DEBUGMODE_USER) {
			var_dump ( $objUser );
		}
		
		$curTheme = 'default';
		if (isset ( $_SESSION [HIH_Theme] )) {
			$curTheme = $_SESSION [HIH_Theme];
		}
		
		echo strtr ( file_get_contents ( 'templates/tmpl_pageheader.html' ), array () );
		echo strtr ( file_get_contents ( 'templates/tmpl_pagenav.html' ), array (
				"{currentuser}" => $objUser->DisplayAs,
				"{currenttheme}" => $curTheme 
		) );
		echo strtr ( file_get_contents ( 'templates/tmpl_learn_award.html' ), array () );
		echo strtr ( file_get_contents ( 'templates/tmpl_pagefooter.html' ), array () );
	}
} else {
	// $_SESSION [ 'HIH_Location '] = 'Login';
	header ( "location: user_login.php" );
	exit ();
}

?>
