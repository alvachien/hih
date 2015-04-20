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
		$objNewDoc = null;
		
		if (isset ( $_SESSION ['HIH_NewDocu'] )) {
			$objNewDoc = unserialize( $_SESSION['HIH_NewDocu']);
		} else {
			$objNewDoc = new HIHDocument();			
		}
		
		switch($action) 
		{
			case 'addItem':
				{
					$objNewItem = new HIHDocumentItem();
					$objNewItem->AccountID = (int) escape ( $_POST ['acntID'] );
					$objNewItem->AccountName = escape ( $_POST ['acntname'] );
					$objNewItem->TranType = (int) escape ( $_POST ['trantype'] );
					$objNewItem->TranTypeName = escape ( $_POST ['trantypename'] );
					$objNewItem->TranAmount = escape ( $_POST ['amt'] );
					$objNewItem->ControlCenterID = (int)escape($_POST['ccID']);
					$objNewItem->ControlCenterName = escape($_POST['ccname']);
					$objNewItem->OrderID = (int)escape($_POST['ordID']);
					$objNewItem->OrderName = escape($_POST['ordname']);
					$objNewItem->OrderValidfrom = escape($_POST['ordvalidfrom']);
					$objNewItem->OrderValidto = escape($_POST['ordvalidto']);
					$objNewItem->TranDesp = escape ( $_POST ['itemdesp'] );					
					
					$rst = $objNewDoc->AddItem($objNewItem);

					if (! IsNullOrEmptyString ($rst[0])) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
							'type'=>'E',
							'Message'=>$rst[0]
						));
					} else {
						$_SESSION [ 'HIH_NewDocu' ] = serialize($objNewDoc);
						echo json_encode($rst[1]);
					}					
				}
				break;
				
			case 'delItem':
				{
					$itemid = (int) escape($_POST['itemid']);
					$objNewDoc->DeleteItem($itemid);
					
					$_SESSION [ 'HIH_NewDocu' ] = serialize($objNewDoc);
					echo json_encode($rst[1]);
				}
				break;
				
			case 'postDoc':
				{
					$objNewDoc->DocType = (int) escape($_POST['doctype']);
					$objNewDoc->DocDate = escape($_POST['docdate']);
					$objNewDoc->DocCurrency	= escape($_POST['doccurr']);
					$objNewDoc->DocDesp = escape($_POST['docdesp']);
					
					$rst = $objNewDoc->CheckValid();
					if (!IsNullOrEmptyString($rst)) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
							'type'=>'E',
							'Message'=>$rst
						));
						exit();						
					}
					unset($rst);
					
					// Do the real posting
					$rst = finance_document_post($objNewDoc);
					if (!IsNullOrEmptyString($rst[0])) {
						header ( 'HTTP/1.1 500 Internal Server Error' );
						echo json_encode(array(
							'type'=>'E',
							'Message'=>$rst[0]
						));
						exit();						
					} else {
						// Clear session
						unset($_SESSION ['HIH_NewDocu']);
						
						echo json_encode(array(
							'type'=>'S',
							'Message'=>'Document posted successfully!'
						));
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
