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
		
		$name = escape( $_POST['name'] );
		$parent = (int) escape( $_POST['parent'] );
		$comment = escape( $_POST['comment'] );

		$error = "";
		if ( IsNullOrEmptyString($name ) ) { $error = "Name is mandatory!"; }
		else if ($ctgyid === 0) { $error = "Category is mandatory."; }

		if (!IsNullOrEmptyString($error)) {
			echo json_encode(array(
				'type'=>'E',
				'Message'=>$error
			));
			exit();
		}
		if ($parent === 0) {
			$parent = null;
		}
		$rtnarray = finance_controlcenter_create($name, $parent, $comment);

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
