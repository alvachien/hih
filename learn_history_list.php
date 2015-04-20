<?php
// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'script/utility.php';

if ($_SERVER ["REQUEST_METHOD"] == "POST") {
} else {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		$reqtype = $_GET ["TYPE"];

		if (! IsNullOrEmptyString ( $reqtype )) {
				
			switch ($reqtype) {
				case HIH_ACTIVITY_GETLIST :
					{
						header('Content-type: application/json');
						
						$username = $_GET["userid"];
					
						// Get list
						$lrnobjrst = array();
						if (IsNullOrEmptyString($username)) {
							$lrnobjrst = learn_hist_listread ();
						} else {
							$lrnobjrst = learn_hist_listread_byuser ($username);
						}						
						
						$sErrors = $lrnobjrst [0];

						if (! IsNullOrEmptyString ( $lrnctgyrst [0] )) {
							echo json_encode ( array (
									'type' => 'E',
									'Message' => $lrnctgyrst [0]
							) );
						} else {
							echo json_encode ( $lrnobjrst [1] );
						}
					}
					break;

				default :
					break;
			}
		} else {
				
			// Show learn object in list
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
			echo strtr ( file_get_contents ( 'templates/tmpl_learn_history_list.html' ), array () );
			echo strtr ( file_get_contents ( 'templates/tmpl_pagefooter.html' ), array () );
		}
	} else {
		// $_SESSION [ 'HIH_Location '] = 'Login';
		header ( "location: user_login.php" );
		exit ();
	}
}

?>
