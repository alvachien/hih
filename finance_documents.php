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
					
					$rsttable = array ();
					switch ($_GET ["flt"]) {
						case 'Ctgy' :
							{
								$idStr = $_GET ["id"];
								
								$readdbrst = finance_documentitem_listreadbyacntctgy ( $idStr );
								if (! IsNullOrEmptyString ( $readdbrst [0] )) {
									echo json_encode ( array (
											'type' => 'E',
											'Message' => $readdbrst [0] 
									) );
									exit ();
								} else {
									$rsttable = $readdbrst [1];
								}
							}
							break;
						
						case 'Acnt' :
							{
								$idStr = $_GET ["id"];
								
								$readdbrst = finance_documentitem_listreadbyaccount ( $idStr );
								if (! IsNullOrEmptyString ( $readdbrst [0] )) {
									echo json_encode ( array (
											'type' => 'E',
											'Message' => $readdbrst [0] 
									) );
									exit ();
								} else {
									$rsttable = $readdbrst [1];
								}
							}
							break;
						
						case 'All' :
							{
								// Document
								$readdbrst = finance_document_listread ();
								if (! IsNullOrEmptyString ( $readdbrst [0] )) {
									echo json_encode ( array (
											'type' => 'E',
											'Message' => $readdbrst [0] 
									) );
									exit ();
								} else {
									$rsttable = $readdbrst [1];
								}
							}
							break;
						
						case 'Docu' :
							{
								// Specified document
								$docid = $_GET ['id'];
								
								$readdbrst = finance_documentitem_listread ( $docid );
								if (! IsNullOrEmptyString ( $readdbrst [0] )) {
									echo json_encode ( array (
											'type' => 'E',
											'Message' => $readdbrst [0] 
									) );
									exit ();
								} else {
									$rsttable = $readdbrst [1];
								}
							}
							break;
						
						default :
							break;
					}
					
					echo json_encode ( $rsttable );
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
		
		// Show finance transaction type
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
		echo strtr ( file_get_contents ( 'templates/tmpl_finance_documents.html' ), array () );
		echo strtr ( file_get_contents ( 'templates/tmpl_pagefooter.html' ), array () );
	}
} else {
	// $_SESSION [ 'HIH_Location '] = 'Login';
	header ( "location: user_login.php" );
	exit ();
}

?>