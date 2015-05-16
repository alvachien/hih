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
		$action = escape ( $_POST ['action'] );
		$objNewIO = null;
		
		if (isset ( $_SESSION ['HIH_NewIO'] )) {
			$objNewIO = unserialize( $_SESSION['HIH_NewIO']);
		} else {
			$objNewIO = new HIHInternalOrder();			
		}
		
		switch($action) 
		{
			case 'addItem':
				{
					$objNewItem = new HIHInternalOrderSRule();
					$objNewItem->ControlCenterID = escape ( $_POST ['ccID'] );
					$objNewItem->ControlCenterName = escape( $_POST['ccname']);
					$objNewItem->Precent = escape ( $_POST ['precent'] );
					$objNewItem->Comment = escape ( $_POST ['comment'] );
					
					$rst = $objNewIO->AddItem($objNewItem);

					if (! IsNullOrEmptyString ($rst[0])) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
							'type'=>'E',
							'Message'=>$rst[0]
						));
					} else {
						$_SESSION [ 'HIH_NewIO' ] = serialize($objNewIO);
						echo json_encode($rst[1]);
					}					
				}
				break;
				
			case 'delItem':
				{
					$itemid = escape($_POST['itemid']);
					$objNewIO->DeleteItem($itemid);
					
					// Need update the session...
					$_SESSION [ 'HIH_NewIO' ] = serialize($objNewIO);
					echo json_encode($rst[1]);
				}
				break;
				
			case 'saveIO':
				{
					$objNewIO->IntOrdName = escape($_POST['name']);
					$objNewIO->ValidFrom = escape($_POST['validfrom']);
					$objNewIO->ValidTo = escape($_POST['validto']);
					$objNewIO->Comment = escape($_POST['comment']);
					
					$rst = $objNewIO->CheckValid();
					if (!IsNullOrEmptyString($rst)) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
								'type'=>'E',
								'Message'=>$rst
						));
						exit();						
					}
					unset($rst);
					
					// Do the real creation
					$rst = finance_internalorder_create($objNewIO);
					if (!IsNullOrEmptyString($rst[0])) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
								'type'=>'E',
								'Message'=>$rst[0]
						));
						exit();						
					} else {
						// Clear session
						unset($_SESSION ['HIH_NewIO']);
						exit();
					}
				}
				break;
				
			default: break;			
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
