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
		
		$name = escape( $_POST['user'] );
		$adate = escape( $_POST['awarddate'] );
		$score = escape( $_POST['awardscore'] );
		$score = (int) $score;
		$reason = escape( $_POST['awardreason']);

		$error = "";
		if ( empty($name ) ) { $error = "Select a user!"; }
		else if ($score == 0) { $error = "Score shall not equal zero."; }
		else if (empty($reason)) { $error = "Reason is a must."; }
		
		if (!empty($error)) {			
			echo json_encode(array(
					'type'=>'E',
					'Message'=>$error
			));
			exit();
		}
		$rtnarray = learn_award_create($name, $adate, $score, $reason);		

		if (!IsNullOrEmptyString( $rtnarray[0] )) {
			header('HTTP/1.1 500 Internal Server Error');
			echo json_encode(array(
					'type'=>'E',
					'Message'=>$rtnarray[0]
			));
		} else {
			echo json_encode(array(
					'type'=>'S',
					'newobject'=>$rtnarray[1]
			)
			);
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