<?php

// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );

session_start ();
require_once 'utility.php';

if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
	
	if ($_SERVER ["REQUEST_METHOD"] === "POST") {
		header('Content-type: application/json');
		
		$username = escape ( $_POST ['user'] );
		$objid = escape ( $_POST ['learnobject'] );
		$learndate = escape ( $_POST ['learndate'] );
		$comment = escape ( $_POST ['comment'] );
		
		$rtnarray = learn_hist_create ( $username, $objid, $learndate, $comment );
		
		if (! IsNullOrEmptyString( $rtnarray [0] )) {
			header ( 'HTTP/1.1 500 Internal Server Error' );
			echo json_encode ( array (
					'type' => 'E',
					'Message' => $rtnarray [0] 
			) );
			exit();
		} else {
			$rtnarray2 = learn_hist_listreadbyid ( $username, $objid );
			if (! IsNullOrEmptyString ( $rtnarray2 [0] )) {
				header ( 'HTTP/1.1 500 Internal Server Error' );
				echo json_encode ( array (
						'type' => 'E',
						'Message' => $rtnarray2 [0] 
				) );
			} else {
				echo json_encode ( array (
						'type' => 'S',
						'newobject' => $rtnarray2 [1] 
				) );
			}
			
			exit();
		}
	} else {
		header ( "location: ./../user_login.php" );
		exit ();
	}
} else {
	header ( "location: ./../user_login.php" );
	exit ();
}

?>