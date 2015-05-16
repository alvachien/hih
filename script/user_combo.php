<?php
// set error reporting level
if (version_compare ( phpversion (), '5.3.0', '>=' ) == 1)
	error_reporting ( E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
else
	error_reporting ( E_ALL & ~ E_NOTICE );


session_start ();
require_once 'utility.php';

if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
	
	header('Content-type: application/json');
	$rtnarray = user_combo( );
	
	if (!IsNullOrEmptyString ( $rtnarray[0] )) {
		header('HTTP/1.1 500 Internal Server Error');
		echo json_encode(array(
				'type'=>'E',
				'Message'=>$rtnarray[0]
		));
	} else {
		echo json_encode($rtnarray[1]);
	}
	exit();
} else {
	header ( "location: ./../user_login.php" );
	exit ();
}


?>
