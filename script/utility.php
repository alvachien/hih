<?php

include_once 'model.inc';
require_once 'config.php';

/*
 * Defintion of the methods in this file
 * Importing parameters: depends
 * Exporting parameters: is an array
 * 		First element in the array: error string. If it's not empty, error occurs;
 * 		Second element in the array: the real output ;
 * 
 * 
 * Call to MySql Stored Procedure
 * Exporting parameters:
 * 		CODE: CHAR(5); '00000' stands for success;
 *  	MSG: TEXT 
 */

//
// 0. Utility part
//
// extra useful function to make POST variables more safe
function escape($data) {
	$data = trim ( $data );
	$data = stripslashes ( $data );
	$data = htmlspecialchars ( $data );
	return $data;
}

function IsNullOrEmptyString($question){
	return (!isset($question) || trim($question)==='');
}

function SetLanguage($lan) {
	if ( $lan  ==  'zh_CN' ){
		putenv('LANG=zh_CN' );
		setlocale(LC_ALL, 'zh_CN' );  //指定要用的语系，如：en_US、zh_CN、zh_TW
	} elseif  ( $lan  ==  'zh_TW' ){
		putenv('LANG=zh_TW' );
		setlocale(LC_ALL, 'zh_TW' );  //指定要用的语系，如：en_US、zh_CN、zh_TW
	} elseif  ( $lan  ==  'en_US' ) {
		putenv('LANG=en_US' );
		setlocale(LC_ALL, 'en_US' );  //指定要用的语系，如：en_US、zh_CN、zh_TW
	}	

	//bindtextdomain ( HIH_I18N_DOMAIN ,  HIH_I18N_DOMAIN_PATH ); //设置某个域的mo文件路径
	//bind_textdomain_codeset(HIH_I18N_DOMAIN ,  'UTF-8' );  //设置mo文件的编码为UTF-8
	//textdomain(HIH_I18N_DOMAIN );
}

//
// 1. Database part
//
function user_login($userid, $userpwd) {
	/*
	 * $con = mysql_connect($MySqlHost, $MySqlUser, $MySqlPwd);
	 * if (!$con)
	 * {
	 * die('Could not connect: ' . mysql_error());
	 * }
	 *
	 * mysql_select_db($MySqlDB, $con);
	 *
	 * $result = mysql_query("SELECT * FROM " . $MySqlUserTabel. " WHERE USER_NAME = '". $userid. "'");
	 * if ($result){
	 * $row = mysql_fetch_array($result);
	 * if ($row) {
	 * //die('User Name exists already.');
	 *
	 * } else {
	 * die( 'User Name not exist!');
	 * // 			$genderidx = 1;
	 * // 			if ($gender == "female") $genderidx = 0;
	 * // 			$querystring = "INSERT INTO " . $GLOBALS['UserTabel'] . " VALUES ('" .
	 * // 					$username. "', '". $password. "', '". $displayas. "', now(), ". $genderidx. ", '". $comment. "')" ;
	 * // 			//echo "<p>". $querystring . "</p>";
	 *
	 * // 			$result = mysql_query($querystring);
	 * // 			if ($result) {
	 * // 				//$row = mysql_fetch_array($result);
	 * // 				//if ($row) {
	 * // 				//}
	 * // 			} else {
	 * // 				die('User created failed');
	 * // 				//mysql_free_result($result);
	 * // 			}
	 * }
	 *
	 * //mysql_free_result($result);
	 * } else die("Failed in execution:".mysql_error());
	 *
	 * mysql_close($con);
	 */
	
	// Object oriented style
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* Check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: " . mysqli_connect_error (), null);
	}
	
	$query = "SELECT * FROM " . MySqlUserTabel . " WHERE USERID = '" . $userid . "'";
	$sErrorString = "";
	
	$exist = false;
	$objUser = null;
	$sPwdHash = hash ( "sha256", $userpwd );
	if ($result = $mysqli->query ( $query )) {
		/* fetch object array */
		while ( $row = $result->fetch_row () ) {
			$exist = true;
			
			if (strcmp ( $row [2], $sPwdHash ) != 0) {
				$sErrorString = "User/password not match";
			} else {
				// Fill the user object
				$objUser = new HIHUser ();
				$objUser->ID = $userid;
				$objUser->DisplayAs = $row [1];
				$objUser->CreatedOn = $row [3];
				$objUser->Gender = $row [4];
			}
			
			break;
		}
		
		if (! $exist) {
			$sErrorString = "User not exist!";
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sErrorString = "Failed to execute query!";
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
			$sErrorString,
			$objUser 
	);
	
	// Procedural style
	// $link = mysqli_connect("localhost", "my_user", "my_password", "world");
	
	// /* check connection */
	// if (mysqli_connect_errno()) {
	// printf("Connect failed: %s\n", mysqli_connect_error());
	// exit();
	// }
	
	// $query = "SELECT Name, CountryCode FROM City ORDER by ID DESC LIMIT 50,5";
	
	// if ($result = mysqli_query($link, $query)) {
	
	// /* fetch associative array */
	// while ($row = mysqli_fetch_row($result)) {
	// printf ("%s (%s)\n", $row[0], $row[1]);
	// }
	
	// /* free result set */
	// mysqli_free_result($result);
	// }
	
	// /* close connection */
	// mysqli_close($link);
}

// 1.1 User and login
function user_register($userid, $userpwd, $useralias, $usergender, $useremail) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	$bExist = false;
	
	// Check existence of the User ID
	$query = "SELECT COUNT(*) FROM " . MySqlUserTabel . " WHERE USERID = '" . $userid . "'";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$cnt = (int) $row[0];
			if ($cnt > 0) {
				$bExist = true;
				$sError = "User already exist!";
				break;
			}
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	// Insert it into database
	if (IsNullOrEmptyString($sError)) {
		$sPwdHash = hash ( "sha256", $userpwd );
		$query = "INSERT INTO " . MySqlUserTabel . " VALUES ('" . $userid . "', '" . $useralias . "', '" . $sPwdHash . "', now(), " . $usergender . ", '" . $useremail . "')";
		if ($result = mysqli_query ( $link, $query )) {
			/* free result set */
			// mysqli_free_result($result);
		} else {
			$sError = "Failed to execute query.";
		}
	}
	
	/* close connection */
	mysqli_close ( $link );
	return $sError;
}
function user_combo() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Check existence of the User ID
	$usertable = array();
	$query = "SELECT USERID, DISPLAYAS FROM " . MySqlUserTabel;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$usertable[] = array (
					"id" => $row [0],
					"text" => $row [1]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $usertable);
}

// 1.2 Learn category
function learn_category_read() {
	// NOTE:
	// This method reserved for using jstree
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read catregory
	$ctgytable = array();
	$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . MySqlLearnCatgTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$sParent = "";
			if ($row [1] == null)
				$sParent = '#';
			else 
				$sParent = $row[1];
			
			$ctgytable [] = array (
					"id" => $row [0],
					"parent" => $sParent,
					"text" => $row [2]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $ctgytable);
}
function learn_category_readex() {
	// NOTE: 
	// This method reserved for using jeasyui
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";

	// Read category
	$ctgytable = array();
	$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . MySqlLearnCatgTable;

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {				
			$ctgytable [] = array (
					"id" => $row [0],
					"parent" => $row[1],
					"text" => $row [2],
					"attributes" => array(
						"comment" => $row[3],
						),
			);
		}

		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $ctgytable);
}
function learn_category_create($parctgy, $name, $comment) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create award: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlLearnCategoryCreateProc . "(?, ?, ?);";
	
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("iss", $parctgy, $name, $content);
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($code, $msg, $lastid);
				
			/* fetch values */
			while ($stmt->fetch()) {
				$nCode = (int) $code;
				$sMsg = $msg;
				$nNewid = (int)$lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	$rsttable = array();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . MySqlLearnCatgTable . " WHERE ID = ". $nNewid;
	
		if ($result = $mysqli->query($query)) {
			/* fetch associative array */
			while ($row = $result->fetch_row()) {
				$rsttable [] = array (
					"id" => $row [0],
					"parent" => $row[1],
					"text" => $row [2],
					"attributes" => array(
						"comment" => $row[3],
						),
				);
			}
			/* free result set */
			$result->close();
		} else {
			$sError = "Failed to execute query: ". $query . " ; Error: ". $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $rsttable);
}
function learn_category_delete( $ctgyid ) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	$sSuccess = "";
	
	// Check existence of the User ID
	$query = "DELETE FROM ". MySqlLearnCatgTable. " WHERE ID = '$id';";
	
	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!";
	} else {
		$sSuccess = sprintf("%d Row deleted.\n", mysqli_affected_rows($link));
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $sSuccess);	
}
// 1.3 Learn object 
function learn_object_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";

	// Check existence of the User ID
	$objtable = array();
	$query = "SELECT ID, CATEGORY_ID, CATEGORY_NAME, NAME, CONTENT FROM " . MySqlLearnObjListView;

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
					"id" => $row [0],
					"categoryid" => $row [1],
					"categoryname" => $row [2],
					"name" => $row[3],
					"content" => $row[4]
			);
		}

		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable);
}
function learn_object_create($ctgyid, $name, $content) { 
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create award: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlLearnObjectCreateProc . "(?, ?, ?);";
	
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("iss", $ctgyid, $name, $content);	
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($code, $msg, $lastid);
			
			/* fetch values */
			while ($stmt->fetch()) {
				$nCode = (int) $code;
				$sMsg = $msg;
				$nNewid = (int)$lastid;
			}				
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}	
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;		
	}

	$rsttable = array();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT ID, CATEGORY_ID, CATEGORY_NAME, NAME, CONTENT FROM " . MySqlLearnObjListView . " WHERE ID = ". $nNewid;
		
		if ($result = $mysqli->query($query)) {
			/* fetch associative array */
			while ($row = $result->fetch_row()) {
				$rsttable [] = array (
						"id" => $row [0],
						"categoryid" => $row [1],
						"categoryname" => $row [2],
						"name" => $row[3],
						"content" => $row[4]
						);
			}
			/* free result set */
			$result->close();
		} else {
			$sError = "Failed to execute query: ". $query . " ; Error: ". $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $rsttable);	
}
function learn_object_change($id, $ctgyid, $name, $content) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	$sSuccess = "";
	
	// Check existence of the User ID
	$name = mysqli_real_escape_string($link, $name);
	$content = mysqli_real_escape_string($link, $content);
	$query = "UPDATE ". MySqlLearnObjTable. " SET CATEGORY = '$ctgyid', NAME = '$name', CONTENT = '$content' WHERE ID = '$id';";

	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!";
	} else {
		$sSuccess = sprintf("%d Row changed.\n", mysqli_affected_rows($link));		
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $sSuccess);	
}
function learn_object_delete($id) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	$sSuccess = "";
	
	// Check existence of the User ID
	$query = "DELETE FROM ". MySqlLearnObjTable. " WHERE ID = '$id';";
	
	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!";
	} else {
		$sSuccess = sprintf("%d Row deleted.\n", mysqli_affected_rows($link));
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $sSuccess);	
}
function learn_object_combo() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Check existence of the User ID
	$objtable = array();
	$query = "SELECT ID, NAME FROM " . MySqlLearnObjTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable[] = array (
					"id" => $row [0],
					"text" => $row [1]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable);	
}
function learn_object_hierread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
		
		// Check existence of the User ID
	$objtable = array ();
	$parhavechld = array ();
	$query = "SELECT CATEGORY_ID, CATEGORY_NAME, CATEGORY_PAR_ID, OBJECT_ID, OBJECT_NAME, OBJECT_CONTENT FROM " . MySqlLearnObjHierView . " ORDER BY CATEGORY_ID";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		$sParent = "";
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($row [3] != null) {
				if (array_key_exists ( $row [0], $parhavechld )) {
					$parhavechld [$row [0]] += 1;
				} else {
					$parhavechld [$row [0]] = 1;
				}
			}
			
			if ($row [2] == null)
				$sParent = '#';
			else
				$sParent = $row [2];
			
			$objtable [] = array (
					"categoryid" => $row [0],
					"categoryname" => $row [1],
					"categoryparid" => $sParent,
					"objectid" => $row [3],
					"objectname" => $row [4],
					"objectcontent" => $row [5] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$objtable,
			$parhavechld 
	);
}
// 1.4 Learn history
function learn_hist_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Check existence of the User ID
	$objtable = array ();
	$query = "SELECT USERID, DISPLAYAS, OBJECTID, OBJECTNAME, CATEGORYID, CATEGORYNAME, LEARNDATE, OBJECTCONTENT, COMMENT FROM " . MySqlLearnHistListView;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
					"userid" => $row [0],
					"displayas" => $row [1],
					"objectid" => $row [2],
					"objectname" => $row[3],
					"categoryid" => $row[4],
					"categoryname" => $row[5],
					"learndate" => $row[6],
					"objectcontent" => $row[7],
					"comment" => $row[8]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable);
}
function learn_hist_listread_byuser ($username){
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Check existence of the User ID
	$objtable = array ();
	$query = "SELECT USERID, DISPLAYAS, OBJECTID, OBJECTNAME, CATEGORYID, CATEGORYNAME, LEARNDATE, OBJECTCONTENT, COMMENT FROM " 
			. MySqlLearnHistListView
			. " WHERE USERID = '". $username. "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
				"userid" => $row [0],
				"displayas" => $row [1],
				"objectid" => $row [2],
				"objectname" => $row[3],
				"categoryid" => $row[4],
				"categoryname" => $row[5],
				"learndate" => $row[6],
				"objectcontent" => $row[7],
				"comment" => $row[8]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable);
	
}
function learn_hist_listreadbyid($username, $objid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	
	// Check existence of the User ID
	$objtable = array ();
	$query = "SELECT USERID, DISPLAYAS, OBJECTID, OBJECTNAME, CATEGORYID, CATEGORYNAME, LEARNDATE, OBJECTCONTENT, COMMENT FROM " . MySqlLearnHistListView . 
			" WHERE USERID = '". $username . "' AND OBJECTID = '". $objid. "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
				"userid" => $row [0],
				"displayas" => $row [1],
				"objectid" => $row [2],
				"objectname" => $row[3],
				"categoryid" => $row[4],
				"categoryname" => $row[5],
				"learndate" => $row[6],
				"objectcontent" => $row[7],
				"comment" => $row[8]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable);
}
function learn_hist_hierread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Check existence of the User ID
	$objtable = array();
	$parhavechld = array();
	$query = "SELECT CATEGORYID, CATEGORYPARID, CATEGORYNAME, USERID, DISPLAYAS, LEARNDATE, OBJECTID, OBJECTNAME, OBJECTCONTENT FROM " 
			. MySqlLearnHistHierView
			. " ORDER BY CATEGORYID";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */		
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$sParent = "";			
			if ($row[6] != null) {
				if (array_key_exists($row[0], $parhavechld) ) {
					$parhavechld[ $row[0] ] += 1;
				} else {
					$parhavechld[ $row[0] ] = 1;
				}
			}
				
			if ($row [1] == null)
				$sParent = '#';
			else
				$sParent = $row[1];
				
			$objtable [] = array (
					"categoryid" => $row [0],
					"categoryparid" => $row [1],
					"categoryname" => $row [2],
					"userid" => $row[3],
					"displayas" => $row[4],
					"learndate" => $row[5],
					"objectid" => $row[6],
					"objectname" => $row[7],
					"objectcontent" => $row[8],
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $objtable, $parhavechld);
	
}
function learn_hist_exist($username, $objid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	$bExist = false;
	
	// Check existence of the User ID
	//$rsttable = array();
	$query = "SELECT COUNT(*) FROM " . MySqlLearnHistTable . " WHERE USERID = '" . $username ."' AND OBJECTID = '" . $objid . "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if (( (int) $row[0] ) > 0) {
				$bExist = true;
				break;
			}
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: SELECT COUNT(*) FROM LEARHISTABLE.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $bExist);
}
function learn_hist_create( $username, $objid, $learndate, $comment) {
	// Check the existence first  => why do let the stored procedure to do the check?
	$rtnarray = learn_hist_exist($username, $objid);
	if ( !empty($rtnarray[0]) ) {
		return $rtnarray;
	} else {
		if ($rtnarray[1] === true) {
			return array("Record exist already!", null);
		}
	}	
	
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Check existence of the User ID
	//$learndate = date( 'Y-m-d', $learndate );
	//$learndate = mysqli_real_escape_string($link, $learndate);
	//$learndate = date('Y-m-d', strtotime(str_replace('-', '/', $learndate)));
	$query = "CALL " . MySqlLearnHistoryCreateProc . "('" . $username ."', '" . $objid . "', '" . $learndate . "', '". $comment ."');";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$pro_code = (int) $row[0];
			if ($pro_code != 0) {
				$sError = $row[1];
			}
			break;
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: CALL LEARNHISTCALLPROC.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, null);
}
function learn_hist_change($categoryid, $username, $learndate, $content) {
}
function learn_hist_delete ($userid, $objid ) {
	// Check the existence first
	$rtnarray = learn_hist_exist($userid, $objid);
	if ( !empty($rtnarray[0]) ) {
		return $rtnarray;
	} else {
		if ($rtnarray[1] === false) {
			return array("Record doesn't exist yet!", null);
		}
	}
	
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	$query = "DELETE FROM " . MySqlLearnHistTable . " WHERE USERID = '" . $userid ."' AND OBJECTID = '" . $objid . "';";
	
	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!" . $query;
	} else {
		$sSuccess = sprintf("%d Row deleted.\n", mysqli_affected_rows($link));
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $sSuccess);	
}
// 1.5 Learn award
function learn_award_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Perform the query
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlLearnAwardView. " ORDER BY ADATE desc";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"userid" => $row [1],
					"displayas" => $row [2],
					"adate" => $row[3],
					"score" => $row[4],
					"reason" => $row[5]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	// Average and total score
	$footer = array();
	if (count($rsttable) > 0 ) {
		$query = "SELECT avg(score), sum(score) FROM ".MySqlLearnAwardTable. ";";
	
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$footer [] = array (
					"avg" => $row[0],
					"total" => $row[1]
				);
			}
	
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query.";
		}
	} else {
		$footer [] = array (
			"avg" => 0,
			"total" => 0
		);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable, $footer);	
}
function learn_award_listread_byuser( $username ) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Perform the query
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlLearnAwardView. " WHERE userid = '". $username . "' ORDER BY ADATE desc";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"userid" => $row [1],
					"displayas" => $row [2],
					"adate" => $row[3],
					"score" => $row[4],
					"reason" => $row[5]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	// Average and total score
	$footer = array();
	if (count($rsttable) > 0 ) {
		$query = "SELECT userid, avg(score), sum(score) FROM ".MySqlLearnAwardTable. " WHERE userid = '". $username. "' group by userid;";
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$footer [] = array (
						"avg" => $row [1],
						"total" => $row [2]
						);
			}
		
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query.";
		}
	} else {
		$footer [] = array (
				"avg" => 0,
				"total" => 0
		);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable, $footer);	
}
function learn_award_create($userid, $adate, $score, $reason) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create award: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlLearnAwardCreateProc . " (?,?,?,?);";

	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("ssis", $userid, $adate, $score, $reason);	
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($code, $msg, $lastid);
			
			/* fetch values */
			while ($stmt->fetch()) {
				$nCode = (int) $code;
				$sMsg = $msg;
				$nNewid = (int)$lastid;
			}				
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}	
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;		
	}

	$rsttable = array();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT id, userid, displayas, adate, score, reason FROM " . MySqlLearnAwardView . " WHERE id = ". $nNewid;
		
		if ($result = $mysqli->query($query)) {
			/* fetch associative array */
			while ($row = $result->fetch_row()) {
				$rsttable [] = array (
						"id" => $row[0],
						"userid" => $row[1],
						"displayas" => $row[2],
						"adate" => $row[3],
						"score" => $row[4],
						"reason" => $row[5]
				);
			}
			/* free result set */
			$result->close();
		} else {
			$sError = "Failed to execute query: ". $query . " ; Error: ". $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	
	return array($sError, $rsttable);	
}
function learn_award_delete ($id ) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";

	$query = "DELETE FROM " . MySqlLearnAwardTable . " WHERE ID = '" . $id ."';";

	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!" . $query;
	} else {
		$sSuccess = sprintf("%d Row deleted.\n", mysqli_affected_rows($link));
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $sSuccess);
}
// 1.6 Finance account
function finance_account_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Perform the query
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinAccountView;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"ctgyid" => $row [1],
				"name" => $row [2],
				"comment" => $row[3],
				"ctgyname" => $row[4],
				"assetflag" => $row[5]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable );	
}
function finance_account_hierread() {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$acntctg = array();
	$acnts = array();
	
	/* Prepare an select statement on category first */
	$query = "SELECT * FROM " . MySqlFinAccountCtgyTable;
	
	if ($stmt = $mysqli->prepare($query)) {
		//$stmt->bind_param("iss", $ctgyid, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($ctgyid, $name, $assetflg, $cmt);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$acntctg[] = array($ctgyid, $name, $assetflg, $cmt);
			}
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$sError = "Failed to parpare statement: ". $query;
	}
	
	if (!empty($sError)) {
		return array($sError, null);
	}
	
	/* Prepare an select statement on account then */
	$query = "SELECT * FROM " . MySqlFinAccountTable;
	if ($stmt = $mysqli->prepare($query)) {
		//$stmt->bind_param("iss", $ctgyid, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($acntid, $ctgyid, $name, $cmt);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$acnts[] = array($acntid, $ctgyid, $name, $cmt);
			}
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$sError = "Failed to parpare statement: ". $query;
	}
	
	if (!empty($sError)) {
		return array($sError, null);
	}
	
	/* close connection for further processing */
	$mysqli->close();
	
	/* Now build the hierarchy */
	$rsttable = array();
	// Cash Journey
	$rsttable[] = array(
		'id' => '-1',
		'parent' => null,
		'text' => 'Cash Journey'
	);
	// For category
	foreach ($acntctg as $value) {
		$ctgvaluepar = 'Ctgy'. $value[0];
		$ctgvalue = array(
			'id' => $ctgvaluepar,
			'parent' => null,
			'text' => $value[1],
			'attributes' => array(
					'assetflag' => $value[2],
					'comment' => $value[3]
			)	
		);
		
		foreach($acnts as $acntval) {
			if ($acntval[1] === $value[0]) {
				if (!array_key_exists('children', $ctgvalue)) {
					$ctgvalue['children'] = array();
				}
				
				$ctgvalue['children'][] = array(
					'id' => 'Acnt'.$acntval[0],
					'parent' => $ctgvaluepar,
					'text' => $acntval[2],
					'attributes' => array(
							'comment' => $acntval[3]
					)
				);
			}
		}
		
		$rsttable[] = $ctgvalue;
	}
	
	return array($sError, $rsttable);
}
function finance_account_create($name, $ctgyid, $comment) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlFinAccountCreateProc . " (?,?,?);";
	
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("iss", $ctgyid, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($code, $msg, $lastid);
				
			/* fetch values */
			while ($stmt->fetch()) {
				$nCode = (int) $code;
				$sMsg = $msg;
				$nNewid = (int)$lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	$rsttable = array();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT * FROM " . MySqlFinAccountView . " WHERE id = ". $nNewid;
	
		if ($result = $mysqli->query($query)) {
			/* fetch associative array */
			while ($row = $result->fetch_row()) {
				$rsttable [] = array (
				"id" => $row [0],
				"ctgyid" => $row [1],
				"name" => $row [2],
				"comment" => $row[3],
				"ctgyname" => $row[4],
				"assetflag" => $row[5]
				);
			}
			/* free result set */
			$result->close();
		} else {
			$sError = "Failed to execute query: ". $query . " ; Error: ". $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	
	return array($sError, $rsttable);	
}
// 1.7 Finance account category
function finance_account_category_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Perform the query
	$rsttable = array();
	$query = "SELECT * FROM " .MySqlFinAccountCtgyTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"name" => $row [1],
					"assetflag" => $row [2],
					"comment" => $row[3]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable );	
}
// 1.8 Finance currency
function finance_currency_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$sError = "";
	
	// Perform the query
	$rsttable = array();
	$query = "SELECT * FROM " .MySqlFinCurrencyTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"curr" => $row [0],
					"name" => $row [1],
					"symbol" => $row [2]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable );	
}
// 1.9 Finance transaction type
function finance_trantype_listread($usetext) {
	// NOTE:
	// This method reserved for using jeasyui
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT ID, PARID, NAME, EXPENSE, COMMENT FROM " . MySqlFinTranTypeTable. " ORDER BY EXPENSE";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($usetext ) {
				$rsttable [] = array (
						"id" => $row [0],
						"parent" => $row[1],
						"text" => $row [2],
						"expense" => $row[3],
						"comment" => $row[4],
						//"iconCls" => ($row[3])? "icon-remove" : "icon-add"
				);
				
			}	else {
				$rsttable [] = array (
						"id" => $row [0],
						"parent" => $row[1],
						"name" => $row [2],
						"expense" => $row[3],
						"comment" => $row[4],
						//"iconCls" => ($row[3])? "icon-remove" : "icon-add"
				);				
			}
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);	
}
// 1.10 Finance document type
function finance_doctype_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT ID, NAME, COMMENT FROM " . MySqlFinDocumentTypeTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"name" => $row[1],
					"comment" => $row [2]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);	
}
// 1.11 Finance document
function finance_document_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinDocumentView;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"doctype" => $row[1],
				"doctypename" => $row [2],
				"trandate" => $row [3],
				"trancurr" => $row [4],
				"trancurrname" => $row [5],
				"desp" => $row [6],
				"tranamount" => $row [7]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);
}
function finance_document_post($docobj) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$mysqli->autocommit(false);
	
	$sError = "";
	$nDocID = 0;
	
	/* Prepare an insert statement on header */
	$query = "INSERT INTO ".MySqlFinDocumentTable."(`DOCTYPE`, `TRANDATE`, `TRANCURR`, `DESP`) VALUES (?, ?, ?, ?);";
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("isss", $docobj->DocType, $docobj->DocDate, $docobj->DocCurrency, $docobj->DocDesp);
		/* Execute the statement */
		if ($stmt->execute()) {	
			$nDocID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	}
	/* Prepare an insert statement on header */
	if (empty($sError)) 
	{
		$query = "INSERT INTO ".MySqlFinDocumentItemTable. "(`DOCID`, `ITEMID`, `ACCOUNTID`, `TRANTYPE`, `TRANAMOUNT`, `CONTROLCENTERID`, `ORDERID`, `DESP`) "
				." VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

		foreach ($docobj->ItemsArray as $value) 
		{
			if ($newstmt = $mysqli->prepare($query)) {
				$newstmt->bind_param("iiiidiis", $nDocID,  $value->ItemID, $value->AccountID, $value->TranType,
						$value->TranAmount, $value->ControlCenterID, $value->OrderID, $value->TranDesp);
				
				/* Execute the statement */
				if ($newstmt->execute()) {
				} else {
					$sError = "Failed to execute query: ". $query;
					break;
				}
			}
		}
	}
	
	if (empty($sError)) 
	{
		if(!$mysqli->errno){
			$mysqli->commit();
		} else {
			$mysqli->rollback();
			$sError = $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $nDocID);
}
function finance_document_delete($docid) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$mysqli->autocommit(false);
	
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM ".MySqlFinDocumentTable." WHERE ID=?;";
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("i", $docid);
		/* Execute the statement */
		if ($stmt->execute()) {	
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	}
	
	/* Prepare an delete statement on items */
	if (empty($sError)) 
	{
		$query = "DELETE FROM ".MySqlFinDocumentItemTable. " WHERE DOCID=?;";

		if ($newstmt = $mysqli->prepare($query)) {
			$newstmt->bind_param("i", $docid);
			
			/* Execute the statement */
			if ($newstmt->execute()) {
			} else {
				$sError = "Failed to execute query: ". $query;
				break;
			}
		}
	}
	
	if (empty($sError)) 
	{
		if(!$mysqli->errno){
			$mysqli->commit();
		} else {
			$mysqli->rollback();
			$sError = $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $nDocID);
}
// 1.12 Finance document item
function finance_documentitem_listread($docid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinDocumentItemView3 . " WHERE docid = '". $docid . "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"docid" => $row [0],
					"itemid" => $row[1],
					"accountid" => $row [2],
					"accountname" => $row [3],
					"trantype" => $row [4],
					"trantypename" => $row [5],
					"tranamount" => $row [6],
					"controlcenterid" => $row[7],
					"controlcentername" => $row[8],
					"orderid" => $row[9],
					"ordername" => $row[10],
					"desp" => $row [11],
					"trantypeexpense" => $row[12],
					"accountcategory" => $row[13],
					"accountcategoryname" => $row[14],
					"doctype" => $row[15],
					"doctypename" => $row[16],
					"trandate" => $row[17],
					"trancurr" => $row[18],
					"trancurrname" => $row[19]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);
}
function finance_documentitem_listreadbyaccount($accountid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";

	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinDocumentItemView3 . " WHERE accountid = '". $accountid . "';";

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"docid" => $row [0],
					"itemid" => $row[1],
					"accountid" => $row [2],
					"accountname" => $row [3],
					"trantype" => $row [4],
					"trantypename" => $row [5],
					"tranamount" => $row [6],
					"controlcenterid" => $row[7],
					"controlcentername" => $row[8],
					"orderid" => $row[9],
					"ordername" => $row[10],
					"desp" => $row [11],
					"trantypeexpense" => $row[12],
					"accountcategory" => $row[13],
					"accountcategoryname" => $row[14],
					"doctype" => $row[15],
					"doctypename" => $row[16],
					"trandate" => $row[17],
					"trancurr" => $row[18],
					"trancurrname" => $row[19]
			);
		}

		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);
}
function finance_documentitem_listreadbyacntctgy($acntctgyid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";

	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinDocumentItemView3 . " WHERE accountcategory = '". $acntctgyid . "';";

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"docid" => $row [0],
					"itemid" => $row[1],
					"accountid" => $row [2],
					"accountname" => $row [3],
					"trantype" => $row [4],
					"trantypename" => $row [5],
					"tranamount" => $row [6],
					"controlcenterid" => $row[7],
					"controlcentername" => $row[8],
					"orderid" => $row[9],
					"ordername" => $row[10],
					"desp" => $row [11],
					"trantypeexpense" => $row[12],
					"accountcategory" => $row[13],
					"accountcategoryname" => $row[14],
					"doctype" => $row[15],
					"doctypename" => $row[16],
					"trandate" => $row[17],
					"trancurr" => $row[18],
					"trancurrname" => $row[19]					
			);
		}

		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);
}
// 1.13 Finance internal order
function finance_internalorder_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinInternalOrderTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"name" => $row[1],
					"valid_from" => $row [2],
					"valid_to" => $row [3],
					"comment" => $row [4],
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);	
}
function finance_internalordersr_listread($ordid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinInternalOrderSettRuleView. " WHERE INTORDID = ". $ordid;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"intordid" => $row [0],
					"intordname" => $row[1],
					"intordvalidfrom" => $row [2],
					"intordvalidto" => $row [3],
					"ruleid" => $row [4],
					"controlcenterid" => $row [5],
					"controlcentername" => $row[6],
					"precent" => $row [7],
					"comment" => $row [8],
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);	
}
function finance_internalorder_create($objIO) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$mysqli->autocommit(false);
	
	$sError = "";
	$nOrdID = 0;
	
	/* Prepare an insert statement on header */
	$query = "INSERT INTO ".MySqlFinInternalOrderTable." (`NAME`, `VALID_FROM`, `VALID_TO`, `COMMENT`) VALUES (?, ?, ?, ?);";
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("ssss", $objIO->IntOrdName, $objIO->ValidFrom, $objIO->ValidTo, $objIO->Comment );
		/* Execute the statement */
		if ($stmt->execute()) {
			$nOrdID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	}
	
	/* Prepare an insert statement on srules */
	if (empty($sError))
	{
		$query = "INSERT INTO ".MySqlFinInternalOrderSettRuleTable. " (`INTORDID`, `RULEID`, `CONTROLCENTERID`, `PRECENT`, `COMMENT`) "
				." VALUES (?, ?, ?, ?, ?);";
	
		foreach ($objIO->ItemsArray as $value)
		{
			if ($newstmt = $mysqli->prepare($query)) {
				$newstmt->bind_param("iiiis", $nOrdID,  $value->RuleID, $value->ControlCenterID, $value->Precent,
						$value->Comment);
	
				/* Execute the statement */
				if ($newstmt->execute()) {
				} else {
					$sError = "Failed to execute query: ". $query;
					break;
				}
			}
		}
	}
	
	if (empty($sError))
	{
		if(!$mysqli->errno){
			$mysqli->commit();
		} else {
			$mysqli->rollback();
			$sError = $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $nOrdID);	
}
// 1.14 Finance control center
function finance_internalorder_delete($ordid) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	$mysqli->autocommit(false);
	
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM ".MySqlFinInternalOrderTable." WHERE ID=?;";
	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("i", $docid);
		/* Execute the statement */
		if ($stmt->execute()) {
		} else {
			$sError = "Failed to execute query: ". $query;
		}
	}
	
	/* Prepare an delete statement on items */
	if (empty($sError))
	{
		$query = "DELETE FROM ".MySqlFinInternalOrderSettRuleTable. " WHERE INTORDID=?;";
	
		if ($newstmt = $mysqli->prepare($query)) {
			$newstmt->bind_param("i", $docid);
				
			/* Execute the statement */
			if ($newstmt->execute()) {
			} else {
				$sError = "Failed to execute query: ". $query;
				break;
			}
		}
	}
	
	if (empty($sError))
	{
		if(!$mysqli->errno){
			$mysqli->commit();
		} else {
			$mysqli->rollback();
			$sError = $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	return array($sError, $nDocID);
	
}
// 1.14 Finance control center
function finance_controlcenter_listread($usetext) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";

	// Read category
	$rsttable = array();
	$query = "SELECT * FROM " . MySqlFinControlCenterTable;

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($usetext) {
				$rsttable [] = array (
						"id" => $row [0],
						"text" => $row[1],
						"parent" => $row [2],
						"comment" => $row [3],
				);
				
			} else 
			{
				$rsttable [] = array (
						"id" => $row [0],
						"name" => $row[1],
						"parent" => $row [2],
						"comment" => $row [3],
				);				
			}
		}

		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query.";
	}

	/* close connection */
	mysqli_close ( $link );
	return array($sError, $rsttable);
}
function finance_controlcenter_create($name, $parent, $comment) {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlFinControlCenterCreateProc . " (?,?,?);";
	
	if ($stmt = $mysqli->prepare($query)) {
		if (!isset($parent)) { 
			$parent = null;
		}
		if (!isset($comment)) {
			$comment = null;
		}
		$stmt->bind_param("iss", $parent, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($code, $msg, $lastid);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$nCode = (int) $code;
				$sMsg = $msg;
				$nNewid = (int)$lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	$rsttable = array();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT * FROM " . MySqlFinControlCenterTable . " WHERE id = ". $nNewid;
	
		if ($result = $mysqli->query($query)) {
			/* fetch associative array */
			while ($row = $result->fetch_row()) {
				$rsttable [] = array (
						"id" => $row [0],
						"name" => $row [1],
						"parent" => $row [2],
						"comment" => $row[3],
				);
			}
			/* free result set */
			$result->close();
		} else {
			$sError = "Failed to execute query: ". $query . " ; Error: ". $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close();
	
	return array($sError, $rsttable);	
}
// 1.15 Finance Report: Daily Balance Sheet
function finance_report_dailybalance($fromdate, $todate) {

	if (!isset($fromdate)) {
		//$fromdate = new DateTime();
		//$fromdate->setDate(1990, 1, 1);
		$fromdate = "19900101";	
	}
	if (!isset($todate)) {
		//$todate = new DateTime();
		//$todate->setDate(9999, 12, 31);
		$todate = "99991231";	
	}
	
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$docid = 0;
	$docitemid = 0;
	$trantypeid = 0;
	$tranamt = 0;
	$trantypename = "";
	$trantypeexpense = 0;
	$totalamount = 0;
	$precent = 0;
	$sMsg = "";
	$rstAr = array();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlFinDailyBalanceReportProc . " (?,?,?);";
	
	if ($stmt = $mysqli->prepare($query)) {
		$cur = 'CNY';
		$stmt->bind_param("sss", $fromdate, $todate, $cur);
		
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($docid, $docitemid, $trantypeid, $tranamt, $trantypename,
					$trantypeexpense, $totalamount, $precent);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$rstAr[] = array(
					"docid" => $docid, 
					"docitemid" => $docitemid, 
					"trantypeid" => $trantypeid, 
					"trantamount" => $tranamt, 
					"trantypename" => $trantypename,
					"trantypeexpense" => $trantypeexpense, 
					"totalamount" => $totalamount, 
					"precent" => $precent
					);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	return array($sMsg, $rstAr);	
}
// 1.16 Finance Report: Balance Sheet
function finance_report_balancesheet() {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$accountid = 0;
	$accountname = "";
	$categoryid = 0;
	$categoryassetflag = 0;
	$categoryname = "";
	$debitbalance = 0;
	$creditbalance = 0;
	$balance = 0;
	$trancurr = "";
	$trancurrname = "";

	$sMsg = "";
	$rstAr = array();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "SELECT * FROM " . MySqlFinBalanceSheetView . ";";
	
	if ($stmt = $mysqli->prepare($query)) {
	
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($accountid, $accountname, $categoryid, $categoryassetflag, $categoryname,
					$debitbalance, $creditbalance, $balance, $trancurr, $trancurrname);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$rstAr[] = array(
					"accountid" => $accountid,
					"accountname" => $accountname,
					"categoryid" => $categoryid,
					"categoryassetflag" => $categoryassetflag,
					"categoryname" => $categoryname,
					"debitbalance" => $debitbalance,
					"creditbalance" => $creditbalance,
					"balance" => $balance,
					"trancurr" => $trancurr,
					"trancurrname" => $trancurrname
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	return array($sMsg, $rstAr);	
}
// 1.17 Finance Report: Internal Order
function finance_report_internalorder() {
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}
	
	$sError = "";
	$ordid = 0;
	$ordname = "";
	$valid_from = 0;
	$valid_to = 0;
	$ordcomment = "";
	$balance = 0;
	$trancurr = 0;
	$trancurrname = "";
	
	$sMsg = "";
	$rstAr = array();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "SELECT * FROM " . MySqlFinIOReportView . ";";
	
	if ($stmt = $mysqli->prepare($query)) {
	
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($ordid, $ordname, $valid_from, $valid_to, $ordcomment,
					$balance, $trancurr, $trancurrname);
	
			/* fetch values */
			while ($stmt->fetch()) {
				$rstAr[] = array(
						"ordid" => $ordid,
						"ordname" => $ordname,
						"valid_from" => $valid_from,
						"valid_to" => $valid_to,
						"ordcomment" => $ordcomment,
						"balance" => $balance,
						"trancurr" => $trancurr,
						"trancurrname" => $trancurrname
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}
	
		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}
	
	return array($sMsg, $rstAr);
}
// 1.18 Finance Report: Control Center List
function finance_report_controlcenter( $fromdate, $todate ) {
	if (!isset($fromdate)) {
		//$fromdate = new DateTime();
		//$fromdate->setDate(1990, 1, 1);
		$fromdate = "19900101";	
	}
	if (!isset($todate)) {
		//$todate = new DateTime();
		//$todate->setDate(9999, 12, 31);
		$todate = "99991231";	
	}
	
	$mysqli = new mysqli( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return array("Connect failed: %s\n" . mysqli_connect_error (), null);
	}

	$sError = "";
	$ccid = 0;
	$ccname = "";
	$ccparid = 0;
	$tranamt = 0;
	$trancurr = "";
	$trancurrname = "";

	$sMsg = "";
	$rstAr = array();

	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . MySqlFinCCReportProc . " (?, ?);";

	if ($stmt = $mysqli->prepare($query)) {
		$stmt->bind_param("ss", $fromdate, $todate);
		
		/* Execute the statement */
		if ($stmt->execute()) {
			/* bind variables to prepared statement */
			$stmt->bind_result($ccid, $ccname, $ccparid, $tranamt, $trancurr, $trancurrname);

			/* fetch values */
			while ($stmt->fetch()) {
				$rstAr[] = array(
						"ccid" => $ccid,
						"ccname" => $ccname,
						"ccparid" => $ccparid,
						"tranamt" => $tranamt,
						"trancurr" => $trancurr,
						"trancurrname" => $trancurrname
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: ". $query;
		}

		/* close statement */
		$stmt->close();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: ". $query;
	}

	return array($sMsg, $rstAr);
}

//
// 2. UI part
//

// 2.1 Learn category
function build_learnctgy_tree($ctgytable) {
	$newctgytable = array();
	
	foreach($ctgytable as $key => $value) {
		if (IsNullOrEmptyString($value['parent'])) {
			$newctgytable[] = array(
				'id' => $value['id'],
				'text' => $value['text']
			);
		}
	}
	
 	foreach($newctgytable as $key=>$value) {
 		$newctgytable[$key] = build_learnctgy_tree_int($ctgytable, $value);
 	}
	
	return $newctgytable;
}
function build_learnctgy_tree_int($ctgytable, $curctgy) {
	foreach($ctgytable as $key => $value) {
		if (strcmp($value['parent'], $curctgy['id']) == 0) {
			
			if (!array_key_exists('children', $curctgy)) {
				$curctgy['children'] = array();
			}
			$curctgy['children'][] = array(
					'id' => $value['id'],
					'text' => $value['text']
			);
		}	
	}
	
	if (array_key_exists('children', $curctgy)) {
		foreach($curctgy['children'] as $key => $value) {
			$curctgy['children'][$key] = build_learnctgy_tree_int($ctgytable, $value);
		}
	}
	
	return $curctgy;
}
// 2.2 Learn object
function buildup_learnobject_tree($objtable, $parhavechld) {
	$realpar = "";
	$treetable = array();
	
	foreach ( $objtable as $key => $value ) {
	
		if (strcmp ( $value ['categoryparid'], '#' ) == 0) {
			$realpar = '#';
		} else {
			$realpar = "ctgy" . $value ['categoryparid'];
		}
	
		if (array_key_exists ( $value ['categoryid'], $parhavechld )
				&& $parhavechld [$value ['categoryid']] != 0) {
					// Categories and Objects
					$parhavechld [$value ['categoryid']] = 0;
						
					$treetable [] = array (
							"id" => "ctgy" . $value ['categoryid'],
							"parent" => $realpar,
							"text" => $value ['categoryname']
					);
					$treetable [] = array (
							"id" => "obj" . $value ['objectid'],
							"parent" => "ctgy" . $value ['categoryid'],
							"text" => $value ['objectname'],
							"icon" => "jstree-file"
					);
				} elseif(array_key_exists ( $value ['categoryid'], $parhavechld )
						&& $parhavechld [$value ['categoryid']] == 0) {
					// Objects
					$treetable [] = array (
							"id" => "obj" . $value ['objectid'],
							"parent" => "ctgy" . $value ['categoryid'],
							"text" => $value ['objectname'],
							"icon" => "jstree-file"
					);
				} elseif( !array_key_exists ( $value ['categoryid'], $parhavechld )) {
					// Categories without objects
					$treetable [] = array (
							"id" => "ctgy" . $value ['categoryid'],
							"parent" => $realpar,
							"text" => $value ['categoryname']
					);
				}
	}
	return $treetable;
}
// 2.3 Finance transaction type
function build_financetrantype_tree($typetable) {
	$newctgytable = array();
	
	// Root nodes
	foreach($typetable as $key => $value) {
		if (IsNullOrEmptyString($value['parent'])) {
			$newctgytable[] = $value;
		}
	}
	
	foreach($newctgytable as $key=>$value) {
		$newctgytable[$key] = build_financetrantype_tree_int($typetable, $value);
	}
	
	return $newctgytable;
	
}
function build_financetrantype_tree_int($ctgytable, $parhavechld) {
	$realpar = "";
	
	foreach ( $ctgytable as $key => $value ) {
		if (IsNullOrEmptyString($value['parent'])) {
			continue;
		}
		
		if ($value['parent'] === $parhavechld['id']) {
			$newvalue = build_financetrantype_tree_int($ctgytable, $value);
			
			if (!array_key_exists('children', $parhavechld)) {
				$parhavechld['children'] = array();
			}
				
			$parhavechld['children'] [] = $newvalue;
		}
	}
	return $parhavechld;	
}
// 2.4 Finance control center
function build_financecontrolcenter_tree($typetable) {
	$newctgytable = array();

	// Root nodes
	foreach($typetable as $key => $value) {
		if (IsNullOrEmptyString($value['parent'])) {
			$newctgytable[] = $value;
		}
	}

	foreach($newctgytable as $key=>$value) {
		$newctgytable[$key] = build_financecontrolcenter_tree_int($typetable, $value);
	}

	return $newctgytable;

}
function build_financecontrolcenter_tree_int($ctgytable, $parhavechld) {
	$realpar = "";

	foreach ( $ctgytable as $key => $value ) {
		if (IsNullOrEmptyString($value['parent'])) {
			continue;
		}

		if ($value['parent'] === $parhavechld['id']) {
			$newvalue = build_financetrantype_tree_int($ctgytable, $value);
				
			if (!array_key_exists('children', $parhavechld)) {
				$parhavechld['children'] = array();
			}

			$parhavechld['children'] [] = $newvalue;
		}
	}
	return $parhavechld;
}

	
/* Following parts For testing purpose only */
function getExchangeRt($from_Currency, $to_Currency) {

	//$amount = urlencode($amount);
	$from_Currency = urlencode($from_Currency);
	$to_Currency = urlencode($to_Currency);
	
	$url = "download.finance.yahoo.com/d/quotes.html?s=".$from_Currency.$to_Currency."=X&f=sl1d1t1ba&e=.html";
	$ch = curl_init();
	$timeout = 0;
	curl_setopt ($ch, CURLOPT_URL, $url);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch,  CURLOPT_USERAGENT , "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)");
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$rawdata = curl_exec($ch);
	curl_close($ch);
	$data = explode(',', $rawdata);
	return $data[1];
}


?>
