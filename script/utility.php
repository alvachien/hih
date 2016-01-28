<?php

include_once 'model.inc';
require_once 'syscfg.php';
require_once 'config.php';

/*
 * Defintion of the methods in this file
 * Importing parameters: depends
 * Exporting parameters: is an array
 * First element in the array: error string. If it's not empty, error occurs;
 * Second element in the array: the real output ;
 *
 *
 * Call to MySql Stored Procedure
 * Exporting parameters:
 * CODE: CHAR(5); '00000' stands for success;
 * MSG: TEXT
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
function IsNullOrEmptyString($question) {
	return (! isset ( $question ) || trim ( $question ) === '');
}
function SetLanguage($lan) {
	if ($lan == 'zh_CN') {
		putenv ( 'LANG=zh_CN' );
		setlocale ( LC_ALL, 'zh_CN' ); // 指定要用的语系，如：en_US、zh_CN、zh_TW
	} elseif ($lan == 'zh_TW') {
		putenv ( 'LANG=zh_TW' );
		setlocale ( LC_ALL, 'zh_TW' ); // 指定要用的语系，如：en_US、zh_CN、zh_TW
	} elseif ($lan == 'en_US') {
		putenv ( 'LANG=en_US' );
		setlocale ( LC_ALL, 'en_US' ); // 指定要用的语系，如：en_US、zh_CN、zh_TW
	}
	
	// bindtextdomain ( HIH_I18N_DOMAIN , HIH_I18N_DOMAIN_PATH ); //设置某个域的mo文件路径
	// bind_textdomain_codeset(HIH_I18N_DOMAIN , 'UTF-8' ); //设置mo文件的编码为UTF-8
	// textdomain(HIH_I18N_DOMAIN );
}
function export_error($error) {
	header ( 'HTTP/1.1 500 Internal Server Error' );
	echo json_encode ( array (
			'type' => 'E',
			'Message' => $error 
	) );
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
	 * // $genderidx = 1;
	 * // if ($gender == "female") $genderidx = 0;
	 * // $querystring = "INSERT INTO " . $GLOBALS['UserTabel'] . " VALUES ('" .
	 * // $username. "', '". $password. "', '". $displayas. "', now(), ". $genderidx. ", '". $comment. "')" ;
	 * // //echo "<p>". $querystring . "</p>";
	 *
	 * // $result = mysql_query($querystring);
	 * // if ($result) {
	 * // //$row = mysql_fetch_array($result);
	 * // //if ($row) {
	 * // //}
	 * // } else {
	 * // die('User created failed');
	 * // //mysql_free_result($result);
	 * // }
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
		return array (
			"Connect failed: " . mysqli_connect_error (),
			null 
		);
	}

	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "SELECT * FROM " . HIHConstants::DT_User . " WHERE USERID = '" . $userid . "'";
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
				
				// And update the log info.
				$query2 = "CALL create_user_hist ('". $userid. "', ". HIHConstants::GC_UserHistType_Login. ", NULL)";
				
				if ($mysqli->query($query2)) {
					// Do nothing!
				} else {
					$sErrorString = "Failed to execute query: " .$query2 . " ; Error: " . $mysqli->error;
				}				
			}
			
			break;
		}
		
		if (! $exist) {
			$sErrorString = "User not exist!";
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sErrorString = "Failed to execute query: " .$query . " ; Error: " . $mysqli->error;
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
	$sError = "";
	if (!$link) {
    	$sError = "Error: Unable to connect to MySQL." . PHP_EOL . "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
		return $sError;
		exit;
	}
	$bExist = false;
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");

	// Check existence of the User ID
	$query = "SELECT COUNT(*) FROM " . MySqlUserTabel . " WHERE USERID = '" . $userid . "'";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$cnt = ( int ) $row [0];
			if ($cnt > 0) {
				$bExist = true;
				$sError = "User already exist!";
				break;
			}
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	// Insert it into database
	if (IsNullOrEmptyString ( $sError )) {
		$sPwdHash = hash ( "sha256", $userpwd );
		$query = "INSERT INTO " . MySqlUserTabel . " VALUES ('" . $userid . "', '" . $useralias . "', '" . $sPwdHash . "', now(), " . $usergender . ", '" . $useremail . "')";
		if ($result = mysqli_query ( $link, $query )) {
			/* free result set */
			// mysqli_free_result($result);
		} else {
			$sError = "Failed to execute query:". $query . " ; Error: " . mysqli_error($link);
		}
	}
	
	/* close connection */
	mysqli_close ( $link );
	return $sError;
}
function user_hist_add($userid, $logtype, $other) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* Check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: " . mysqli_connect_error (),
			null 
		);
	}

	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "CALL create_user_hist ('". $userid. "', ". $logtype. ", '". $other. "')";
	$sErrorString = "";
	
	if ($mysqli->query ( $query )) {
	} else {
		$sErrorString = "Failed to execute query: " .$query . " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sErrorString,
		NULL 
	);
}
function user_hist_getlist($userid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* Check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: " . mysqli_connect_error (),
			null 
		);
	}

	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "select * from ". HIHConstants::DT_UserHist . " WHERE userid = '". $userid. "' ORDER by seqno DESC;";
	$sError = "";
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
			$rsttable [] = array (
				"userid" => $row [0],
				"seqno" => $row [1],
				"histtype" => $row [2],
				"timepoint" => $row [3],
				"others" => $row [4] 
			);
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$rsttable 
	);	
}
function user_register2($objRegUsr) {
	return user_register($objRegUsr->UserID, $objRegUsr->Password, $objRegUsr->DisplayAs, $objRegUsr->Gender, $objRegUsr->Mailbox);
}
function user_combo() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");

	// Check existence of the User ID
	$usertable = array ();
	$query = "SELECT USERID, DISPLAYAS FROM " . MySqlUserTabel;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$usertable [] = array (
				"id" => $row [0],
				"text" => $row [1] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query:" . $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$usertable 
	);
}
// 1.2 Learn category
function learn_category_listread($nid = false) {
	// NOTE:
	// This method reserved for using jstree
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read catregory
	$ctgytable = array ();
	$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . HIHConstants::DT_LearnCategory;
    if ($nid) {
		$query = $query . " WHERE ID = ". $nid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$sParent = "";
			if ($row [1] == null)
				$sParent = '#';
			else
				$sParent = $row [1];
			
			$ctgytable [] = array (
				"id" => $row [0],
				"parent" => $sParent,
				"text" => $row [2],
				"comment" => $row [3] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$ctgytable 
	);
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
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$ctgytable = array ();
	$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . HIHConstants::DT_LearnCategory;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$ctgytable [] = array (
					"id" => $row [0],
					"parent" => $row [1],
					"text" => $row [2],
					"attributes" => array (
							"comment" => $row [3] 
					) 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$ctgytable 
	);
}
function learn_category_create($parctgy, $name, $comment) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_CreateLearnCategory . "(?, ?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "iss", $parctgy, $name, $comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $code, $msg, $lastid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $code;
				$sMsg = $msg;
				$nNewid = ( int ) $lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT ID, PARENT_ID, NAME, COMMENT FROM " . HIHConstants::DT_LearnCategory . " WHERE ID = " . $nNewid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"parent" => $row [1],
					"text" => $row [2],
					"attributes" => array (
						"comment" => $row [3] 
					) 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	return array ( $sError, $rsttable );
}
function learn_category_create2($objCtgy) {
	return learn_category_create($objCtgy->ParentID, $objCtgy->Name, $objCtgy->Comment);
}
function learn_category_change($objCtgy) {
	// To-Do!!!
}
function learn_category_delete($ctgyid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	$sSuccess = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check existence of the User ID
	$query = "DELETE FROM " . HIHConstants::DT_LearnCategory . " WHERE ID = '$id';";
	
	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!";
	} else {
		$sSuccess = sprintf ( "%d Row deleted.\n", mysqli_affected_rows ( $link ) );
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$sSuccess 
	);
}
// 1.3 Learn object
function learn_object_listread($nid = false) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check existence of the User ID
	$objtable = array ();
	$query = "SELECT ID, CATEGORY_ID, CATEGORY_NAME, NAME, CONTENT FROM " . HIHConstants::DV_LearnObjectList;
    if ($nid) {
		$query = $query . " WHERE ID = ". $nid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
				"id" => $row [0],
				"categoryid" => $row [1],
				"categoryname" => $row [2],
				"name" => $row [3],
				"content" => $row [4] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query . " ; Error: " . mysqli_error();
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (	$sError, $objtable	);
}
function learn_object_create($ctgyid, $name, $content) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create award: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_CreateLearnObject  . "(?, ?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "iss", $ctgyid, $name, $content );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $code, $msg, $lastid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $code;
				$sMsg = $msg;
				$nNewid = ( int ) $lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT ID, CATEGORY_ID, CATEGORY_NAME, NAME, CONTENT FROM " . HIHConstants::DV_LearnObjectList  . " WHERE ID = " . $nNewid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"categoryid" => $row [1],
					"categoryname" => $row [2],
					"name" => $row [3],
					"content" => $row [4] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	return array ( $sError, $rsttable );
}
function learn_object_create2($loObj) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = 0;
	
	/* Prepare an insert statement */
	$query = "INSERT INTO `t_learn_obj` (`CATEGORY`, `NAME`, `CONTENT`) VALUES (?,  ?, ?);";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "iss", $loObj->CategoryID, $loObj->Name, $loObj->Content );
		/* Execute the statement */
		if ($stmt->execute ()) {
            $nNewID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array ( $sError, $nNewID );
}
function learn_object_change($id, $ctgyid, $name, $content) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$sqlcode = 0;
	$sqlmsg = "";
	
	// Check existence of the User ID
	//$name = $mysqli->real_escape_string( $name );
	//$content = $mysqli->real_escape_string( $content );
	$query = "CALL " . HIHConstants::DP_UpdateLearnObject  . "(?, ?, ?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "iiss", $id, $ctgyid, $name, $content );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $sqlcode, $sqlmsg  );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $sqlcode;
				$sError = $sqlmsg;
				break;
			}
		} else {
			$nCode = 1;
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT ID, CATEGORY_ID, CATEGORY_NAME, NAME, CONTENT FROM " . HIHConstants::DV_LearnObjectList  . " WHERE ID = " . $id;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"categoryid" => $row [1],
					"categoryname" => $row [2],
					"name" => $row [3],
					"content" => $row [4] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	return array ( $sError, $rsttable );
}
function learn_object_change2( $loObj ) {
	return learn_object_change($loObj->ID, $loObj->CategoryID, $loObj->Name, $loObj->Content);
}
function learn_object_delete($id) {
	return learn_object_multidelete($id);
}
function learn_object_checkusage($ids) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array ("Connect failed: %s\n" . mysqli_connect_error (), null );
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	$nObjInUse = 0;
	
	//$in = join(',', array_fill(0, count($ids), '?'));
	//$array = array_map('intval', explode(',', $ids));
	$idarray = implode("','",$ids);	
	$prequery = "SELECT COUNT(*) FROM " . HIHConstants::DT_LearnHistory . " WHERE OBJECTID IN ('" . $idarray ."')";
	if ($prestmt = $mysqli->prepare ( $prequery )) {
		/* Execute the statement */
		if ($prestmt->execute ()) {
			/* bind variables to prepared statement */
			$prestmt->bind_result ( $nObjInUse );
			while ( $prestmt->fetch () ) {
				//if (nObjInUse > 0) {
				//}
			}
		} else {
			$sError = "Failed to execute query: " . $prequery. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$prestmt->close ();
	} else {
		$sError = "Failed to prepare statement: " . $prestmt. " ; Error: " . $mysqli->error;
	}

	/* close connection */
	$mysqli->close ();
	return array ($sError, $nObjInUse);
}
function learn_object_multidelete($ids) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array ("Connect failed: %s\n" . mysqli_connect_error (), null );
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	$nUsageAmt = 0;
	
	//$in = join(',', array_fill(0, count($ids), '?'));
	//$array = array_map('intval', explode(',', $ids));
	$idarray = implode("','",$ids);	
	
	$prequery = "SELECT COUNT(*) FROM " . HIHConstants::DT_LearnHistory . " WHERE OBJECTID IN ('" . $idarray ."')";
	if ($prestmt = $mysqli->prepare ( $prequery )) {
		/* Execute the statement */
		if ($prestmt->execute ()) {
			/* bind variables to prepared statement */
			$prestmt->bind_result ( $nUsageAmt );
			while ( $prestmt->fetch () ) {
				if ($nUsageAmt > 0) {
					$sError = "Object still in use! ";
				}
			}
		} else {
			$sError = "Failed to execute query: " . $prequery. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$prestmt->close ();
	} else {
		$sError = "Failed to prepare statement: " . $prestmt. " ; Error: " . $mysqli->error;
	}

	if (empty ( $sError )) {
		$query = "DELETE FROM " . HIHConstants::DT_LearnObject . " WHERE ID IN ('" . $idarray ."')";
		if ($stmt = $mysqli->prepare ( $query )) {
			//$stmt->bind_param ( str_repeat('i', count($ids)), $ids );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to prepare statement: " . $stmt. " ; Error: " . $mysqli->error;
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback( );
	}
	
	/* close connection */
	$mysqli->close ();
	return array ($sError, $ids);
}
function learn_object_combo() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");

	// Check existence of the User ID
	$objtable = array ();
	$query = "SELECT ID, CATEGORY_NAME, NAME FROM " . HIHConstants::DV_LearnObjectList;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
				"id" => $row [0],
				"categoryname" => $row [1],
				"name" => $row [2] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query:" .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$objtable 
	);
}
function learn_object_hierread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language	
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");

	// Check existence of the User ID
	$objtable = array ();
	$parhavechld = array ();
	$query = "SELECT CATEGORY_ID, CATEGORY_NAME, CATEGORY_PAR_ID, OBJECT_ID, OBJECT_NAME, OBJECT_CONTENT FROM " . HIHConstants::DV_LearnObjectHierarchy . " ORDER BY CATEGORY_ID";
	
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
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
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
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$objtable = array ();
	$query = "SELECT USERID, DISPLAYAS, OBJECTID, OBJECTNAME, CATEGORYID, CATEGORYNAME, LEARNDATE, OBJECTCONTENT, COMMENT FROM " . HIHConstants::DV_LearnHistoryList;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$objtable [] = array (
				"userid" => $row [0],
				"displayas" => $row [1],
				"objectid" => $row [2],
				"objectname" => $row [3],
				"categoryid" => $row [4],
				"categoryname" => $row [5],
				"learndate" => $row [6],
				"objectcontent" => $row [7],
				"comment" => $row [8] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query" . $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$objtable 
	);
}
function learn_hist_hierread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$objtable = array ();
	$parhavechld = array ();
	$query = "SELECT CATEGORYID, CATEGORYPARID, CATEGORYNAME, USERID, DISPLAYAS, LEARNDATE, OBJECTID, OBJECTNAME, OBJECTCONTENT FROM " . HIHConstants::DV_LearnHistoryHierarchy . " ORDER BY CATEGORYID";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$sParent = "";
			if ($row [6] != null) {
				if (array_key_exists ( $row [0], $parhavechld )) {
					$parhavechld [$row [0]] += 1;
				} else {
					$parhavechld [$row [0]] = 1;
				}
			}
			
			if ($row [1] == null)
				$sParent = '#';
			else
				$sParent = $row [1];
			
			$objtable [] = array (
				"categoryid" => $row [0],
				"categoryparid" => $row [1],
				"categoryname" => $row [2],
				"userid" => $row [3],
				"displayas" => $row [4],
				"learndate" => $row [5],
				"objectid" => $row [6],
				"objectname" => $row [7],
				"objectcontent" => $row [8] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query ". $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$objtable,
			$parhavechld 
	);
}
function learn_hist_exist($username, $objid, $lrndate) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	$bExist = false;
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check existence of the User ID
	// $rsttable = array();
	$query = "SELECT COUNT(*) FROM " . HIHConstants::DT_LearnHistory . " WHERE USERID = '" . $username . "' AND OBJECTID = '" . $objid . "' AND LEARNDATE = '" . $lrndate . "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ((( int ) $row [0]) > 0) {
				$bExist = true;
				break;
			}
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, $bExist	);
}
function learn_hist_create($username, $objid, $learndate, $comment) {
	
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );

	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check existence of the User ID
	// $learndate = date( 'Y-m-d', $learndate );
	// $learndate = mysqli_real_escape_string($link, $learndate);
	// $learndate = date('Y-m-d', strtotime(str_replace('-', '/', $learndate)));
	
	// The procedure not work for EXISTS, therefore using the INSERT statement directly.
	$query = "INSERT INTO " . HIHConstants::DT_LearnHistory . " VALUES ('" . $username . "', '" . $objid . "', '" . $learndate . "', '" . $comment . "');";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$pro_code = ( int ) $row [0];
			if ($pro_code != 0) {
				$sError = $row [1];
			}
			break;
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	// Don't need re-read because no LAST_INSERT_ID is this case.
		
	/* close connection */
	mysqli_close ( $link );
	return array ($sError, null	);
}
function learn_hist_create2($lohist) {
	return learn_hist_create($lohist->UserID, $lohist->ObjectID, $lohist->LearnDate, $lohist->Comment);
}
function learn_hist_change($lohist) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "CALL " . HIHConstants::DP_UpdateLearnHistory . "('" . $lohist->UserID . "', '" . $lohist->ObjectID . "', '" . $lohist->LearnDate . "', '" . $lohist->Comment . "');";
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$pro_code = ( int ) $row [0];
			if ($pro_code != 0) {
				$sError = $row [1];
			}
			break;
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	// Don't need re-read because no LAST_INSERT_ID is this case.
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, null );
}
function learn_hist_delete($userid, $objid, $learndate) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "CALL " . HIHConstants::DP_DeleteLearnHistory . "('" . $username . "', '" . $objid . "', '" . $learndate . "');";
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$pro_code = ( int ) $row [0];
			if ($pro_code != 0) {
				$sError = $row [1];
			}
			break;
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, null );
}
// 1.4a Learn plan
function learn_plan_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DT_LearnPlan;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"comment" => $row [2],
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query" . $query. " ; Error: " . mysqli_error($link);
	}
	
	$rsttable2 = array ();
	if (empty ( $sError ) && count ( $rsttable ) > 0) {
		$query = "SELECT * FROM " . HIHConstants::DT_LearnPlanDetail;
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$rsttable2 [] = array (
					"id" => $row [0],
					"objectid" => $row [1],
					"deferredday" => $row[2],
					"recurtype" => $row [3],
					"comment" => $row[4]
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . mysqli_error($link); 
		}
	}

	$rsttable3 = array ();
	if (empty ( $sError ) && count ( $rsttable ) > 0) {
		$query = "SELECT * FROM " . HIHConstants::DT_LearnPlanParticipant;
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				  $rsttable3 [] = array (
					"id" => $row [0],
					"userid" => $row [1],
					"startdate" => $row[2],
					"status" => $row [3],
					"comment" => $row[4]
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query:" . $query. " ; Error: " . mysqli_error($link);
		}
	}
	
	/* close connection */
	mysqli_close ( $link );
	$rtntable = array();
	if (count ( $rsttable2 ) > 0) {
		$rtntable[] = $rsttable;
		$rtntable[] = $rsttable2;
		$rtntable[] = $rsttable3;
	} else {
		if (count ( $rsttable ) > 0) {
			$rtntable[] = $rsttable;
		} else {
			// Do nothing
		}
	}
	return array (
		$sError,
		$rtntable 
	);
}
function learn_plan_create($objPlan) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nPlanID = 0;
	$sMsg = "";
	
	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* An insert on plan header first */
	$query = "INSERT INTO `". HIHConstants::DT_LearnPlan. "` (`NAME`, `COMMENT`) VALUES (?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ss", $objPlan->Name, $objPlan->Comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nCode = 0;
			$nPlanID = $mysqli->insert_id;
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Then on detail table */
	if ($nCode === 0 && $nPlanID > 0 && count($objPlan->DetailsArray) > 0) {
		$query = "INSERT INTO " . HIHConstants::DT_LearnPlanDetail . "(`ID`, `OBJECTID`, `DEFERREDDAY`, `RECURTYPE`, `COMMENT`) VALUES (?, ?, ?, ?, ?);";
		
		foreach ( $objPlan->DetailsArray as $value ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiiis", $nPlanID, $value->ObjectID, $value->DeferredDay, $value->RecurType, $value->Comment );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
				$newstmt->close();
			}
		}		
	} else {
		$sError = $sMsg;
	}
	
	/* Last, on registration table */
	if (empty ( $sError ) && $nCode === 0 && $nPlanID > 0 && count($objPlan->ParticipantsArray) > 0) {
		$query = "INSERT INTO " . HIHConstants::DT_LearnPlanParticipant . "(`ID`, `USERID`, `STARTDATE`, `STATUS`, `COMMENT`) VALUES (?, ?, ?, ?, ?);";
		
		foreach ( $objPlan->ParticipantsArray as $value ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "issis", $nPlanID, $value->UserID, $value->StartDate, $value->Status, $value->Comment );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
				$newstmt->close();
			}
		}		
	}
	
	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nPlanID 
	);	
}
function learn_plan_change($objPlan) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nPlanID = 0;
	
	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* An update on plan header first */
	$query = "UPDATE `". HIHConstants::DT_LearnPlan. "` SET `NAME` = ?, `COMMENT` = ? WHERE `ID` = ?;";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ssi", $objPlan->Name, $objPlan->Comment, $objPlan->ID );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nCode = 0;
		} else {
			$nCode = 1;
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Then on detail table */
	if ($nCode === 0) {
		$query = "DELETE FROM " . HIHConstants::DT_LearnPlanDetail . " WHERE `ID` = ?;";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "i", $objPlan->ID );
			/* Execute the statement */
			if ($stmt->execute ()) {
				$nCode = 0;
			} else {
				$nCode = 1;
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$nCode = 1;
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
		
		if ($nCode === 0) {
			$query = "INSERT INTO " . HIHConstants::DT_LearnPlanDetail . "(`ID`, `OBJECTID`, `DEFERREDDAY`, `RECURTYPE`, `COMMENT`) VALUES (?, ?, ?, ?, ?);";
			
			foreach ( $objPlan->DetailsArray as $value ) {
				if ($newstmt = $mysqli->prepare ( $query )) {
					$newstmt->bind_param ( "iiiis", $value->ID, $value->ObjectID, $value->DeferredDay, $value->RecurType, $value->Comment );
					
					/* Execute the statement */
					if ($newstmt->execute ()) {
					} else {
						$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
						break;
					}
					$newstmt->close();
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
			}
		}	
	}
	
	/* Last, on participant table */
	if (empty ( $sError ) && $nCode === 0 ) {
		$query = "DELETE FROM " . HIHConstants::DT_LearnPlanParticipant . " WHERE `ID` = ?;";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "i", $objPlan->ID );
			/* Execute the statement */
			if ($stmt->execute ()) {
				$nCode = 0;
			} else {
				$nCode = 1;
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$nCode = 1;
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
		
		if ($nCode === 0) {
			$query = "INSERT INTO " . HIHConstants::DT_LearnPlanParticipant . "(`ID`, `USERID`, `STARTDATE`, `STATUS`, `COMMENT`) VALUES (?, ?, ?, ?, ?);";
			
			foreach ( $objPlan->ParticipantsArray as $value ) {
				if ($newstmt = $mysqli->prepare ( $query )) {
					$newstmt->bind_param ( "issis", $objPlan->ID, $value->UserID, $value->StartDate, $value->Status, $value->Comment );
					
					/* Execute the statement */
					if ($newstmt->execute ()) {
					} else {
						$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
						break;
					}
					$newstmt->close();
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
			}
		}
	}
	
	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nPlanID 
	);	
}
function learn_plan_delete($nPlanID) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* A delete on plan header first */
	$query = "DELETE FROM `". HIHConstants::DT_LearnPlan. "` WHERE `ID` = ?;";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $nPlanID );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	// Details
	if (empty ( $sError ) ) {
		$query = "DELETE FROM " . HIHConstants::DT_LearnPlanDetail . " WHERE `ID` = ?;";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "i", $nPlanID );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}
	
	// Participants
	if (empty ( $sError ) ) {
		$query = "DELETE FROM " . HIHConstants::DT_LearnPlanParticipant . " WHERE `ID` = ?;";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "i", $nPlanID );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}
	
	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nPlanID 
	);	
}
function learn_plan_actlist_tdate($todate) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
    $rsttable1 = array();
    $rsttable2 = array();
	
    // Prepare the query for plan detail
	$query = "SELECT * FROM (select taba.userid, tabb.id as planid, tabb.name as planname, tabc.recurtype, tabc.deferredday, 
            ADDDATE(taba.startdate, tabc.deferredday + tabe.defdays) as ExpStartDate, tabc.objectid, tabd.name as objname 
        from t_learn_planpat as taba
	       join t_learn_plan as tabb
               on taba.id = tabb.id
           left outer join t_learn_plandtl as tabc
               on taba.id = tabc.id
           left outer join t_learn_obj as tabd
               on tabc.objectid = tabd.id
           left outer join t_learn_recurtypedates as tabe
               on tabc.recurtype = tabe.id
	    where (taba.status != 3 and taba.status != 4) ORDER BY userid asc, ExpStartDate asc ) as tabh where ExpStartDate <= ". $todate;
	
    if ($result = $mysqli->query ( $query )) {
        /* fetch associative array */
        while ( $row = $result->fetch_row () ) {
            $rsttable1 [] = array (
                "userid" => $row [0],
                "planid" => $row [1],
                "planname" => $row [2],
                "expstartdate" => $row [5],
                "objid" => $row [6],
                "objname" => $row [7] 
            );
        }
        /* free result set */
        $result->close ();
    } else {
        $sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
    }

    // Prepare the query for history
	$query = "SELECT USERID, OBJECTID, OBJECTNAME, LEARNDATE FROM " . HIHConstants::DV_LearnHistoryList.
	    " where LEARNDATE <= ". $todate.
        " ORDER BY userid asc, LEARNDATE asc";
	
    if ($result = $mysqli->query ( $query )) {
        /* fetch associative array */
        while ( $row = $result->fetch_row () ) {
            $rsttable2 [] = array (
                "userid" => $row [0],
                "objid" => $row [1],
                "objname" => $row [2],
                "learndate" => $row [3]
            );
        }
        /* free result set */
        $result->close ();
    } else {
        $sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
    }
    
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		array($rsttable1, $rsttable2) 
	);	    
}
// 1.5 Learn award
function learn_award_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_LearnAward . " ORDER BY ADATE desc";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"userid" => $row [1],
				"displayas" => $row [2],
				"adate" => $row [3],
				"score" => $row [4],
				"reason" => $row [5] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	// Average and total score
	$footer = array ();
	if (count ( $rsttable ) > 0) {
		$query = "SELECT avg(score), sum(score) FROM " . HIHConstants::DT_LearnAward . ";";
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$footer [] = array (
					"avg" => $row [0],
					"total" => $row [1] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query . " ; Error: " . mysqli_error($link);
		}
	} else {
		$footer [] = array (
			"avg" => 0,
			"total" => 0 
		);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable,
		$footer 
	);
}
function learn_award_listread_byuser($username) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_LearnAward . " WHERE userid = '" . $username . "' ORDER BY ADATE desc";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"userid" => $row [1],
				"displayas" => $row [2],
				"adate" => $row [3],
				"score" => $row [4],
				"reason" => $row [5] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	// Average and total score
	$footer = array ();
	if (count ( $rsttable ) > 0) {
		$query = "SELECT userid, avg(score), sum(score) FROM " . HIHConstants::DT_LearnAward . " WHERE userid = '" . $username . "' group by userid;";
		
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
			$sError = "Failed to execute query: ".$query. " ; Error: " . mysqli_error($link);
		}
	} else {
		$footer [] = array (
			"avg" => 0,
			"total" => 0 
		);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable,
			$footer 
	);
}
function learn_award_create($userid, $adate, $score, $reason) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create award: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_CreateLearnAward . " (?,?,?,?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ssis", $userid, $adate, $score, $reason );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $code, $msg, $lastid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $code;
				$sMsg = $msg;
				$nNewid = ( int ) $lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT id, userid, displayas, adate, score, reason FROM " . HIHConstants::DV_LearnAward . " WHERE id = " . $nNewid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"userid" => $row [1],
					"displayas" => $row [2],
					"adate" => $row [3],
					"score" => $row [4],
					"reason" => $row [5] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
			$sError,
			$rsttable 
	);
}
function learn_award_create2($objAwrd) {
	return learn_award_create($objAwrd->UserID, $objAwrd->AwardDate, $objAwrd->Score, $objAwrd->Reason);
}
function learn_award_change($objAward) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";

	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Select the rows for update */
	$query = "SELECT * FROM " . HIHConstants::DT_LearnAward . " WHERE ID = ? FOR UPDATE;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $objAward->ID );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Update the entry in DB */
	if (empty($sError)) {
		$query = "UPDATE " . HIHConstants::DT_LearnAward . " SET `USERID` = ?, `ADATE` = ?, `SCORE` = ?, `REASON` = ? WHERE ID = ?;";	
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "ssisi", $objAward->UserID, $objAward->AwardDate, $objAward->Score, $objAward->Reason, $objAward->ID );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}

	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		"" 
	);	
}
function learn_award_delete($id) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	$query = "DELETE FROM " . HIHConstants::DT_LearnAward . " WHERE ID = '" . $id . "';";
	
	if (false === mysqli_query ( $link, $query )) {
		$sError = "Execution failed, no results!" . $query . " ; Error: " . mysqli_error($link);
	} else {
		$sSuccess = sprintf ( "%d Row deleted.\n", mysqli_affected_rows ( $link ) );
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$sSuccess 
	);
}
function learn_award_multidelete($ids) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	
	//$in = join(',', array_fill(0, count($ids), '?'));
	//$array = array_map('intval', explode(',', $ids));
	$array = implode("','",$ids);	
	$query = "DELETE FROM " . HIHConstants::DT_LearnAward . " WHERE ID IN ('" . $array ."')";
	if ($stmt = $mysqli->prepare ( $query )) {
		//$stmt->bind_param ( str_repeat('i', count($ids)), $ids );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
			$sError,
			$ids 
	);
}
// 1.6.0 Finance setting
function finance_setting_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DT_FinSetting;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"setid" => $row [0],
				"setvalue" => $row [1],
				"comment" => $row [2]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, $rsttable );	
}
// 1.6.1 Finance Exchange rate
function finance_exgrate_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DT_FinExchangeRate;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		//   `TRANDATE`, `CURR`, `RATE`,  `REFDOCID`
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"trandate" => $row [0],
				"forgcurr" => $row [1],
				"exgrate" => $row [2],
				"refdocid" => $row [3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query" . $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, $rsttable );	
}
// 1.6 Finance account
function finance_account_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinAccountView;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"ctgyid" => $row [1],
				"name" => $row [2],
				"comment" => $row [3],
				"ctgyname" => $row [4],
				"assetflag" => $row [5] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_account_hierread() {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$acntctg = array ();
	$acnts = array ();
	
	/* Prepare an select statement on category first */
	$query = "SELECT * FROM " . MySqlFinAccountCtgyTable;
	
	if ($stmt = $mysqli->prepare ( $query )) {
		// $stmt->bind_param("iss", $ctgyid, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $ctgyid, $name, $assetflg, $cmt );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$acntctg [] = array (
						$ctgyid,
						$name,
						$assetflg,
						$cmt 
				);
			}
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	if (! empty ( $sError )) {
		return array (
				$sError,
				null 
		);
	}
	
	/* Prepare an select statement on account then */
	$query = "SELECT * FROM " . MySqlFinAccountTable;
	if ($stmt = $mysqli->prepare ( $query )) {
		// $stmt->bind_param("iss", $ctgyid, $name, $comment);
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $acntid, $ctgyid, $name, $cmt );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$acnts [] = array (
						$acntid,
						$ctgyid,
						$name,
						$cmt 
				);
			}
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	if (! empty ( $sError )) {
		return array (
				$sError,
				null 
		);
	}
	
	/* close connection for further processing */
	$mysqli->close ();
	
	/* Now build the hierarchy */
	$rsttable = array ();
	// Cash Journey
	$rsttable [] = array (
			'id' => '-1',
			//'parent' => null,
			'text' => 'Cash Journey',
			'type' => 'Journey' 
	);
	// For category
	foreach ( $acntctg as $value ) {
		$ctgvaluepar = 'Ctgy' . $value [0];
		$ctgvalue = array (
				'id' => $ctgvaluepar,
				//'parent' => null,
				'text' => $value [1],
				'type' => 'Category',
				'attributes' => array (
					'assetflag' => $value [2],
					'comment' => $value [3] 
				) 
		);
		
		foreach ( $acnts as $acntval ) {
			if ($acntval [1] === $value [0]) {
				if (! array_key_exists ( 'children', $ctgvalue )) {
					$ctgvalue ['children'] = array ();
				}
				
				$ctgvalue ['children'] [] = array (
					'id' => 'Acnt' . $acntval [0],
					//'parent' => $ctgvaluepar,
					'text' => $acntval [2],
					'type' => 'Account',
					'attributes' => array (
						'comment' => $acntval [3] 
					) 
				);
			}
		}
		
		$rsttable [] = $ctgvalue;
	}
	
	return array (
			$sError,
			$rsttable 
	);
}
function finance_dpaccount_getdetail($acntid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$acntable = array();
	$tmpdoctab = array();
	
	/* Prepare a select statement */
	$query = "SELECT * FROM t_fin_account_dp WHERE ACCOUNTID = " . $acntid;
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
			$acntable [] = array (
				"accountid" => $row [0],
				"direct" => $row [1],
				"startdate" => $row [2],
				"enddate" => $row [3],
				"rpttype" => $row [4],
				"refdocid" => $row [5],
				"comment" => $row [6] 
			);
		}
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " . $query . "; Error: " . $mysqli->error;
	}
	
	if (empty($sError)) {
		$query = "SELECT docid, refdocid, accountid, trandate, trantype, trantypename, tranamount, CONTROLCENTERID, ccname, orderid, ordername, desp FROM v_fin_dpdoc WHERE accountid = " . $acntid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$tmpdoctab [] = array (
					"docid" => $row [0],
					"refdocid" => $row [1],
					"accountid" => $row [2],
					"trandate" => $row [3],
					"trantype" => $row [4],
					"trantypename" => $row [5],
					"tranamount" => $row [6],
					"ccid" => $row[7],
					"ccname" => $row[8],
					"orderid" => $row[9],
					"ordername" => $row[10],
					"desp" => $row[11] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . "; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		array($acntable, $tmpdoctab) 
	);
}
function finance_account_create($acntObj) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_CreateFinAccount . " (?,?,?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "iss", $acntObj->CategoryID, $acntObj->Name, $acntObj->Comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $code, $msg, $lastid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $code;
				$sMsg = $msg;
				$nNewid = ( int ) $lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT * FROM " . HIHConstants::DV_FinAccount . " WHERE id = " . $nNewid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"ctgyid" => $row [1],
					"name" => $row [2],
					"comment" => $row [3],
					"ctgyname" => $row [4],
					"assetflag" => $row [5] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$rsttable 
	);
}
function finance_account_change($acntObj) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

	/* Select the rows for update */
	$query = "SELECT * FROM " . HIHConstants::DT_FinAccount . " WHERE ID = ? FOR UPDATE;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $acntObj->ID );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Then, update the account */
	$query = "UPDATE " . HIHConstants::DT_FinAccount . " SET `CTGYID` = ?, `NAME` = ?, `COMMENT` = ? WHERE ID = ?;";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "issi", $acntObj->CategoryID, $acntObj->Name, $acntObj->Comment, $acntObj->ID );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		"" 
	);
}
function finance_account_delete($acntid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array ("Connect failed: %s\n" . mysqli_connect_error (), null );
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM " . HIHConstants::DT_FinAccount . " WHERE ID = ?;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $acntid );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		/* close statement */
		$stmt->close ();
	}
	
	/* Commit or rollback */
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$acntid 
	);
}
// 1.7 Finance account category
function finance_account_category_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinAccountCtgyTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"name" => $row [1],
					"assetflag" => $row [2],
					"comment" => $row [3] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
// 1.8 Finance currency
function finance_currency_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinCurrencyTable;
	
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
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
// 1.9 Finance transaction type
function finance_trantype_listread($usetext = false) {
	// NOTE:
	// This method reserved for using jeasyui
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT ID, PARID, NAME, EXPENSE, COMMENT FROM " . MySqlFinTranTypeTable . " ORDER BY PARID";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($usetext) {
				$rsttable [] = array (
					"id" => $row [0],
					"parent" => $row [1],
					"text" => $row [2],
					"expense" => $row [3],
					"comment" => $row [4] 
				)
				// "iconCls" => ($row[3])? "icon-remove" : "icon-add"
				;
			} else {
				$rsttable [] = array (
					"id" => $row [0],
					"parent" => $row [1],
					"name" => $row [2],
					"expense" => $row [3],
					"comment" => $row [4] 
				)
				// "iconCls" => ($row[3])? "icon-remove" : "icon-add"
				;
			}
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_trantype_hierread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT ID, PARID, NAME, EXPENSE, COMMENT FROM " . MySqlFinTranTypeTable . " ORDER BY EXPENSE";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		//$tmptable = array();
		$sParent = '';
		
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($row [1] == null)
				$sParent = '#';
			else
				$sParent = $row [1];

			$rsttable [] = array (
				"id" => $row [0],
				"parent" => $sParent,
				"text" => $row [2],
				"expense" => $row [3],
				"comment" => $row [4] 
			);
		}
		
		//$rsttable = build_financetrantype_tree($tmptable);
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
// 1.10 Finance document type
function finance_doctype_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT ID, NAME, COMMENT FROM " . MySqlFinDocumentTypeTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
					"id" => $row [0],
					"name" => $row [1],
					"comment" => $row [2] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
// 1.11 Finance document
function finance_document_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocument . " ORDER BY trandate DESC, id desc";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"doctype" => $row [1],
				"trandate" => $row [2],
				"trancurr" => $row [3],	
				"desp" => $row [4],
				"exgrate" => $row[5],
				"exgrate_plan" => $row[6],
				"trancurr2" => $row [7],	
				"exgrate2" => $row[8],
				"exgrate_plan2" => $row[9],
				"tranamount" => $row [10] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, $rsttable );
}
function finance_document_curexg_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocument . " WHERE doctype = 3 ORDER BY trandate DESC, id DESC";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"doctype" => $row [1],
				"trandate" => $row [2],
				"trancurr" => $row [3],	
				"desp" => $row [4],
				"exgrate" => $row[5],
				"exgrate_plan" => $row[6],
				"trancurr2" => $row [7],	
				"exgrate2" => $row[8],
				"exgrate_plan2" => $row[9],
				"tranamount" => $row [10] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query:" . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);	
}
function finance_document_read($docid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
    $headertable = array();
    $itemtable = array();
 
    // Header table
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocument . " WHERE id = ". $docid;	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$headertable [] = array (
				"docid" => $row [0],
				"doctype" => $row [1],
				"trandate" => $row [2],
				"trancurr" => $row [3],	
				"desp" => $row [4],
				"exgrate" => $row[5],
				"exgrate_plan" => $row[6],
				"trancurr2" => $row [7],	
				"exgrate2" => $row[8],
				"exgrate_plan2" => $row[9],
				"tranamount" => $row [10] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query. " ; Error: " . mysqli_error($link);
	}

    // Item table
    if (empty($sError)) {
        $query = "SELECT * FROM " . HIHConstants::DV_FinDocumentItem . " WHERE docid = '" . $docid . "';";
        
        if ($result = mysqli_query ( $link, $query )) {
            /* fetch associative array */
            while ( $row = mysqli_fetch_row ( $result ) ) {
                $itemtable [] = array (
                    "docid" => $row [0],
                    "itemid" => $row [1],
                    "accountid" => $row [2],
                    "trantype" => $row [3],
                    "usecurr2" => $row[4],
                    "trancurr" => $row [5],
                    "tranamount_org" => $row [6],
                    "tranamount" => $row [7],
                    "tranamount_lc" => $row [8],
                    "controlcenterid" => $row [9],
                    "orderid" => $row [10],
                    "desp" => $row [11],
                );
            }
            
            /* free result set */
            mysqli_free_result ( $result );
        } else {
            $sError = "Failed to execute query: ". $query . " ; Error: " . mysqli_error($link);
        }
    }
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, array($headertable, $itemtable) );
}
function finance_dpaccount_listread_tdate($tdate) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	
	// Read category
	$rsttable = array ();
	$query = "select tabb.id, tabb.name, taba.trandate, taba.tranamount, taba.tmpdocid from (select docid as tmpdocid, accountid, trandate, tranamount from ". HIHConstants::DT_FinTempDocDP 
		." where refdocid is null AND DATEDIFF(trandate, '". $tdate ."') <= -1) " 
		. " as taba left outer join "
		. HIHConstants::DT_FinAccount . " as tabb on taba.accountid = tabb.id ";
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
			$rsttable [] = array (
				"accountid" => $row [0],
				"accountname" => $row [1],
				"trandate" => $row[2],
				"tranamount" => $row[3],
				"tmpdocid" => $row[4]
			);
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$rsttable 
	);
}
function finance_dpdoc_get($docid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDPTmpDoc . " WHERE docid = " . $docid . ";";
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"refdocid" => $row [1],
				"accountid" => $row [2],
				"accountname" => $row[3],
				"trandate" => $row [4],
				"trantype" => $row [5],
				"trantypename" => $row [6],
				"tranamount" => $row [7],
				"ccid" => $row [8],
				"ccname" => $row [9],
				"orderid" => $row[10],
				"ordername" => $row[11],
				"desp" => $row[12],
				"trancurr" => $row[13],
				"refcurexgdoc" => $row[14],
				"exgrate" => $row[15],
				"exgrate_plan" => $row[16] 
			);
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$rsttable 
	);	
}
function finance_dpdoc_listread($accountid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DT_FinTempDocDP . " WHERE accountid = " . $accountid . " ORDER BY trandate DESC";
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"refdocid" => $row [1],
				"accountid" => $row [2],
				"trandate" => $row [3],
				"trantype" => $row [4],
				"tranamount" => $row [5],
				"ccid" => $row [6],
				"orderid" => $row[7],
				"desp" => $row[8] 
			);
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$rsttable 
	);
}
function finance_docpost_core($docobj, $mysqli) {
	
	$nDocID = 0;
	$sError = "";
	
	/* Prepare an insert statement on header */
	$query = "INSERT INTO " . HIHConstants::DT_FinDocument . "(`DOCTYPE`, `TRANDATE`, `TRANCURR`, `DESP`, `EXGRATE`, `EXGRATE_PLAN`, `TRANCURR2`, `EXGRATE2`, `EXGRATE_PLAN2`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "isssddsdd", $docobj->DocTypeID, $docobj->DocDate, $docobj->DocCurrency, $docobj->DocDesp,
			$docobj->ExchangeRate, $docobj->ProposedExchangeRate, $docobj->DocCurrency2, $docobj->ExchangeRate2, $docobj->ProposedExchangeRate2 );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nDocID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Prepare an insert statement on item */
	if (empty ( $sError )) {
		$query = "INSERT INTO " . HIHConstants::DT_FinDocumentItem . "(`DOCID`, `ITEMID`, `ACCOUNTID`, `TRANTYPE`, `USECURR2`, `TRANAMOUNT`, `CONTROLCENTERID`, `ORDERID`, `DESP`) " . " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
		
		foreach ( $docobj->ItemsArray as $value ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiiiidiis", $nDocID, $value->ItemID, $value->AccountID, $value->TranTypeID, $value->UseCurrency2, $value->TranAmount, 
					$value->ControlCenterID, $value->OrderID, $value->Desp );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
		
				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}
	
	return array (
		$sError,
		$nDocID 
	);		
}
function finance_dpdoc_post($docobj, $acntObj, $dpacntObj, $dpObjs) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	$nDocID = 0;
	$nAccountID = 0;
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

	$arRst = finance_docpost_core($docobj, $mysqli, $nDocID, $sError);
	$sError = $arRst[0];
	$nDocID = $arRst[1];

	/* Prepare an insert statement on account header */
	if (empty ( $sError )) {
		$query = "INSERT INTO `t_fin_account`(`CTGYID`, `NAME`, `COMMENT`) VALUES(?, ?, ?);";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "iss", $acntObj->CategoryID, $acntObj->Name, $acntObj->Comment );
			/* Execute the statement */
			if ($stmt->execute ()) {
				$nAccountID = $mysqli->insert_id;
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}
	
	/* Prepare an insert statement on account downpayment part */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_fin_account_dp (`ACCOUNTID`, `DIRECT`, `STARTDATE`, `ENDDATE`, `RPTTYPE`, `REFDOCID`, `COMMENT`) VALUES (?, ?, ?, ?, ?, ?, ?);";	
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "iissiis", $nAccountID,  $dpacntObj->Direct, $dpacntObj->StartDate, $dpacntObj->EndDate, $dpacntObj->RepeatType,
				$nDocID, $dpacntObj->Comment );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}

	/* Prepare an insert statement on DP temp Docs */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_fin_tmpdoc_dp (`REFDOCID`, `ACCOUNTID`, `TRANDATE`, `TRANTYPE`, `TRANAMOUNT`, `CONTROLCENTERID`, `ORDERID`, `DESP`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";	
		foreach ( $dpObjs as $dpdoc ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iisidiis", $dpdoc->RefDocID, $nAccountID, $dpdoc->TranDate, $dpdoc->TranTypeID, $dpdoc->Amount, 
					$dpdoc->ControlCenterID, $dpdoc->OrderID, $dpdoc->Desp );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$nDocID 
	);
}
function finance_dptmpdoc_post($docobj, $dpdocid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");

	$sError = "";
	$nDocID = 0;
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

	$arRst = finance_docpost_core($docobj, $mysqli, $nDocID, $sError);
	$sError = $arRst[0];
	$nDocID = $arRst[1];

	/* Prepare an udpate statement on tmp doc */
	if (empty ( $sError )) {
		$query = "UPDATE t_fin_tmpdoc_dp SET refdocid = ? WHERE docid = ?;";
		if ($stmt = $mysqli->prepare ( $query )) {
			$stmt->bind_param ( "ii", $nDocID, $dpdocid );
			/* Execute the statement */
			if ($stmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
			}
			
			/* close statement */
			$stmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$nDocID 
	);
}
function finance_document_post($docobj) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nDocID = 0;
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	$arRst = finance_docpost_core($docobj, $mysqli, $nDocID, $sError);
	$sError = $arRst[0];
	$nDocID = $arRst[1];
	
	/* Prepare an insert into currency exchange */
	if (empty ( $sError ) && $docobj->DocTypeID == 3) {
		if ( isset($docobj->ExchangeRate) and $docobj->ExchangeRate != 1.0 and (!isset($docobj->ProposedExchangeRate) or $docobj->ProposedExchangeRate != 1.0) ) {
			$query = "INSERT INTO " . HIHConstants::DT_FinExchangeRate . "(`TRANDATE`, `CURR`, `RATE`, `REFDOCID`) VALUES (?, ?, ?, ?);";
			
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ssdi", $docobj->DocDate, $docobj->DocCurrency, $docobj->ExchangeRate, $nDocID );
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
				}
				
				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}		
		if (isset($docobj->ExchangeRate2) and $docobj->ExchangeRate2 != 1.0 and (!isset($docobj->ProposedExchangeRate2) or $docobj->ProposedExchangeRate2 != 1.0)) {
			$query = "INSERT INTO " . HIHConstants::DT_FinExchangeRate . "(`TRANDATE`, `CURR`, `RATE`, `REFDOCID`) VALUES (?, ?, ?, ?);";
			
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ssdi", $docobj->DocDate, $docobj->DocCurrency2, $docobj->ExchangeRate2, $nDocID );
					
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
				}
				
				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}			
		}		
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$nDocID 
	);
}
function finance_document_delete($docid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}

	$mysqli->autocommit ( false );
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM " . HIHConstants::DT_FinDocument . " WHERE ID = ?;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $docid );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}

		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Prepare an delete statement on items */
	if (empty ( $sError )) {
		$query = "DELETE FROM " . HIHConstants::DT_FinExchangeRate . " WHERE REFDOCID=?;";
		
		if ($newstmt = $mysqli->prepare ( $query )) {
			$newstmt->bind_param ( "i", $docid );
			
			/* Execute the statement */
			if ($newstmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
				break;
			}
			/* close statement */
			$newstmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}

	/* Prepare an delete statement on exchange rates */
	if (empty ( $sError )) {
		$query = "DELETE FROM " . HIHConstants::DT_FinDocumentItem . " WHERE DOCID=?;";
		
		if ($newstmt = $mysqli->prepare ( $query )) {
			$newstmt->bind_param ( "i", $docid );
			
			/* Execute the statement */
			if ($newstmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
				break;
			}
			/* close statement */
			$newstmt->close ();
		} else {
			$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
		}
	}
	
	/* Search for the account which built with that document - for downpayment case! */ 
	if (empty($sError)) {
		$query = "SELECT accountid FROM t_fin_account_dp WHERE REFDOCID = " . $docid;
		$nAccountID = 0;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$nAccountID = $row[0];
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
		
		if (empty($sError) && $nAccountID != 0) {
			// Delete Accounts
			$query = "DELETE FROM t_fin_account WHERE ID=?;";
			
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "i", $nAccountID );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
			}

			if (empty($sError)) {
				$query = "DELETE FROM t_fin_account_dp WHERE ACCOUNTID=?;";
				
				if ($newstmt = $mysqli->prepare ( $query )) {
					$newstmt->bind_param ( "i", $nAccountID );
					
					/* Execute the statement */
					if ($newstmt->execute ()) {
					} else {
						$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
						break;
					}
					/* close statement */
					$newstmt->close ();
				} else {
					$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
				}
			} 
			
			if (empty($sError)) {
				$query = "DELETE FROM t_fin_tmpdoc_dp WHERE ACCOUNTID=?;";
				
				if ($newstmt = $mysqli->prepare ( $query )) {
					$newstmt->bind_param ( "i", $nAccountID );
					
					/* Execute the statement */
					if ($newstmt->execute ()) {
					} else {
						$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
						break;
					}
					/* close statement */
					$newstmt->close ();
				} else {
					$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
				}
			} 

			if (empty($sError)) {
				// Workout the additional docids
				$query = "SELECT distinct(DOCID) as DOCID FROM t_fin_document_item WHERE ACCOUNTID = " . $nAccountID;
				$ids = array();
		
				if ($result = $mysqli->query ( $query )) {
					/* fetch associative array */
					while ( $row = $result->fetch_row () ) {
						$ids[] = $row[0];
					}
					/* free result set */
					$result->close ();
				} else {
					$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
				}

				$countids = count($ids);
				if ($countids > 0) {
					$idarray = implode("','",$ids);	
					$query = "DELETE FROM t_fin_document WHERE ID IN ('" . $idarray ."')";
					
					if ($newstmt = $mysqli->prepare ( $query )) {
						/* Execute the statement */
						if ($newstmt->execute ()) {
						} else {
							$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
							break;
						}
						/* close statement */
						$newstmt->close ();
					} else {
						$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
					}
					
					if (empty($sError)) {
						$query = "DELETE FROM t_fin_document_item WHERE DOCID IN ('" . $idarray ."')";
						if ($newstmt = $mysqli->prepare ( $query )) {
							/* Execute the statement */
							if ($newstmt->execute ()) {
							} else {
								$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
								break;
							}
							/* close statement */
							$newstmt->close ();
						} else {
							$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
						}
					}
				}				
			}
		}
	}
	
	/* Commit work */ 
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$docid 
	);
}
// 1.12 Finance document item
function finance_documentitem_listread($docid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocumentItem . " WHERE docid = '" . $docid . "';";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"itemid" => $row [1],
				"accountid" => $row [2],
				"trantype" => $row [3],
				"usecurr2" => $row[4],
				"trancurr" => $row [5],
				"tranamount_org" => $row [6],
				"tranamount" => $row [7],
				"tranamount_lc" => $row [8],
				"controlcenterid" => $row [9],
				"orderid" => $row [10],
				"desp" => $row [11],
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_documentitem_listreadbyaccount($accountid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocumentItem3 . " WHERE accountid = '" . $accountid . "' ORDER BY trandate DESC;";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"itemid" => $row [1],
				"accountid" => $row [2],
				"trantype" => $row [3],
				"usecurr2" => $row[4],
				"trancurr" => $row [5],
				"tranamount_org" => $row [6],
				"trantype_expense" => $row [7],
				"tranamount" => $row [8],
				"tranamount_lc" => $row [9],
				"controlcenterid" => $row [10],
				"orderid" => $row [11],
				"desp" => $row [12],
				"trandate" => $row [13],
				"categoryid" => $row[14],
				"categoryname" => $row[15]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_documentitem_listreadbyacntctgy($acntctgyid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . HIHConstants::DV_FinDocumentItem3 . " WHERE categoryid = '" . $acntctgyid . "' ORDER BY trandate DESC;";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"docid" => $row [0],
				"itemid" => $row [1],
				"accountid" => $row [2],
				"trantype" => $row [3],
				"usecurr2" => $row[4],
				"trancurr" => $row [5],
				"tranamount_org" => $row [6],
				"trantype_expense" => $row [7],
				"tranamount" => $row [8],
				"tranamount_lc" => $row [9],
				"controlcenterid" => $row [10],
				"orderid" => $row [11],
				"desp" => $row [12],
				"trandate" => $row [13],
				"categoryid" => $row[14],
				"categoryname" => $row[15]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
// 1.13 Finance internal order
function finance_internalorder_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinInternalOrderTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"valid_from" => $row [2],
				"valid_to" => $row [3],
				"comment" => $row [4] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query:" . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_internalordersr_listread($ordid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinInternalOrderSettRuleView . " WHERE INTORDID = " . $ordid;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"intordid" => $row [0],
				"intordname" => $row [1],
				"intordvalidfrom" => $row [2],
				"intordvalidto" => $row [3],
				"ruleid" => $row [4],
				"controlcenterid" => $row [5],
				"controlcentername" => $row [6],
				"precent" => $row [7],
				"comment" => $row [8] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query:" . $query . " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable 
	);
}
function finance_internalorder_create($objIO) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nOrdID = 0;
	
	/* Prepare an insert statement on header */
	$query = "INSERT INTO " . MySqlFinInternalOrderTable . " (`NAME`, `VALID_FROM`, `VALID_TO`, `COMMENT`) VALUES (?, ?, ?, ?);";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ssss", $objIO->Name, $objIO->ValidFrom, $objIO->ValidTo, $objIO->Comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nOrdID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}

		/* close statement */
		$stmt->close ();
	}
	
	/* Prepare an insert statement on srules */
	if (empty ( $sError )) {
		$query = "INSERT INTO " . MySqlFinInternalOrderSettRuleTable . " (`INTORDID`, `RULEID`, `CONTROLCENTERID`, `PRECENT`, `COMMENT`) " . " VALUES (?, ?, ?, ?, ?);";
		
		foreach ( $objIO->ItemsArray as $value ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiiis", $nOrdID, $value->RuleID, $value->ControlCenterID, $value->Precent, $value->Comment );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}
				/* close statement */
				$newstmt->close ();
			}
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
			$sError,
			$nOrdID 
	);
}
// 1.14 Finance control center
function finance_internalorder_delete($ordid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM " . MySqlFinInternalOrderTable . " WHERE ID=?;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $ordid );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		/* close statement */
		$stmt->close ();
	}
	
	/* Prepare an delete statement on items */
	if (empty ( $sError )) {
		$query = "DELETE FROM " . MySqlFinInternalOrderSettRuleTable . " WHERE INTORDID=?;";
		
		if ($newstmt = $mysqli->prepare ( $query )) {
			$newstmt->bind_param ( "i", $ordid );
			
			/* Execute the statement */
			if ($newstmt->execute ()) {
			} else {
				$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
				break;
			}
			/* close statement */
			$newstmt->close ();
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
			$sError,
			$ordid 
	);
}
// 1.14 Finance control center
function finance_controlcenter_listread($usetext) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return "Connect failed: %s\n" . mysqli_connect_error ();
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Read category
	$rsttable = array ();
	$query = "SELECT * FROM " . MySqlFinControlCenterTable;
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			if ($usetext) {
				$rsttable [] = array (
					"id" => $row [0],
					"text" => $row [1],
					"parent" => $row [2],
					"comment" => $row [3] 
				);
			} else {
				$rsttable [] = array (
					"id" => $row [0],
					"name" => $row [1],
					"parent" => $row [2],
					"comment" => $row [3] 
				);
			}
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: ". $query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);
}
function finance_controlcenter_create($name, $parent, $comment) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nCode = 0;
	$nNewid = 0;
	$sMsg = "";
	
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_CreateFinControlCenter . " (?,?,?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		if (! isset ( $parent )) {
			$parent = null;
		}
		if (! isset ( $comment )) {
			$comment = null;
		}
		$stmt->bind_param ( "iss", $parent, $name, $comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $code, $msg, $lastid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$nCode = ( int ) $code;
				$sMsg = $msg;
				$nNewid = ( int ) $lastid;
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	$rsttable = array ();
	if ($nCode > 0) {
		$sError = $sMsg;
	} else if ($nCode === 0 && $nNewid > 0) {
		$query = "SELECT * FROM " . HIHConstants::DT_FinControlCenter . " WHERE id = " . $nNewid;
		
		if ($result = $mysqli->query ( $query )) {
			/* fetch associative array */
			while ( $row = $result->fetch_row () ) {
				$rsttable [] = array (
					"id" => $row [0],
					"name" => $row [1],
					"parent" => $row [2],
					"comment" => $row [3] 
				);
			}
			/* free result set */
			$result->close ();
		} else {
			$sError = "Failed to execute query: " . $query . " ; Error: " . $mysqli->error;
		}
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$rsttable 
	);
}
function finance_controlcenter_delete($ccid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$mysqli->autocommit ( false );
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an delete statement on header */
	$query = "DELETE FROM " . HIHConstants::DT_FinControlCenter . " WHERE ID=?;";
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "i", $ccid );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		/* close statement */
		$stmt->close ();
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	return array (
		$sError,
		$ccid 
	);
}
// 1.15 Finance Report: Daily Balance Sheet
function finance_report_dailybalance($fromdate, $todate) {
	// Not necessary
}
// 1.16 Finance Report: Balance Sheet
function finance_report_balancesheet() {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$accountid = 0;
	$categoryid = 0;
	$debitbalance = 0;
	$creditbalance = 0;
	$balance = 0;
	
	$sMsg = "";
	$rstAr = array ();
	
	// Create account: return code, message and last insert id
	$query = "SELECT * FROM " . HIHConstants::DV_FinReportBS . ";";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $accountid, $debitbalance, $creditbalance, $balance, $categoryid );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$rstAr [] = array (
					"accountid" => $accountid,
					"categoryid" => $categoryid,
					"debitbalance" => $debitbalance,
					"creditbalance" => $creditbalance,
					"balance" => $balance
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	return array (
		$sMsg,
		$rstAr 
	);
}
// 1.17 Finance Report: Internal Order
function finance_report_internalorder() {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$ordid = 0;
	$ordname = "";
	$valid_from = 0;
	$valid_to = 0;
	$debitamt = 0;
	$creditamt = 0;
	$balance = 0;
	
	$sMsg = "";
	$rstAr = array ();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "SELECT * FROM " . HIHConstants::DV_FinReportOrder . ";";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $ordid, $ordname, $valid_from, $valid_to, $debitamt, $creditamt, $balance );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$rstAr [] = array (
					"ordid" => $ordid,
					"ordname" => $ordname,
					"valid_from" => $valid_from,
					"valid_to" => $valid_to,
					"debitamt" => $debitamt,
					"creditamt" => $creditamt,
					"balance" => $balance 
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	return array (
			$sMsg,
			$rstAr 
	);
}
// 1.18 Finance Report: Control Center List
function finance_report_controlcenter($fromdate = '19000101', $todate = '99991231') {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
	
	$sError = "";
	$ccid = 0;
	$ccname = "";
	$ccparid = 0;
	$tranamt_d = 0;
	$tranamt_c = 0;
	$tranamt = 0;
	
	$sMsg = "";
	$rstAr = array ();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_FinReportCC . " (?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ss", $fromdate, $todate );
		
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $ccid, $ccname, $ccparid, $tranamt_d, $tranamt_c, $tranamt );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$rstAr [] = array (
					"ccid" => $ccid,
					"ccname" => $ccname,
					"ccparid" => $ccparid,
					"debitamt" => $tranamt_d,
					"creditamt" => $tranamt_c,
					"tranamt" => $tranamt
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	return array ( $sMsg, $rstAr );
}
// 1.19 Finance report: transaction type
function finance_report_trantype($fromdate = '19000101', $todate = '99991231') {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
	
	$sError = "";
	$ttid = 0;
	$ttname = "";
	$ttexpense = 0;
	$ttparid = 0;
	$ttcomment = "";
	$tranamt = 0;
	
	$sMsg = "";
	$rstAr = array ();
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "CALL " . HIHConstants::DP_FinReportTT . " (?, ?);";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "ss", $fromdate, $todate );
		
		/* Execute the statement */
		if ($stmt->execute ()) {
			/* bind variables to prepared statement */
			$stmt->bind_result ( $ttid, $ttname, $ttexpense, $ttparid, $ttcomment, $tranamt );
			
			/* fetch values */
			while ( $stmt->fetch () ) {
				$rstAr [] = array (
					"id" => $ttid,
					"tranamt" => $tranamt 
				);
			}
		} else {
			$nCode = 1;
			$sMsg = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$nCode = 1;
		$sMsg = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	return array ( $sMsg, $rstAr );
}

//
// 2. UI part
//

// 2.1 Learn category
function build_learnctgy_tree($ctgytable) {
	$newctgytable = array ();
	
	foreach ( $ctgytable as $key => $value ) {
		if (IsNullOrEmptyString ( $value ['parent'] )) {
			$newctgytable [] = array (
					'id' => $value ['id'],
					'text' => $value ['text'] 
			);
		}
	}
	
	foreach ( $newctgytable as $key => $value ) {
		$newctgytable [$key] = build_learnctgy_tree_int ( $ctgytable, $value );
	}
	
	return $newctgytable;
}
function build_learnctgy_tree_int($ctgytable, $curctgy) {
	foreach ( $ctgytable as $key => $value ) {
		if (strcmp ( $value ['parent'], $curctgy ['id'] ) == 0) {
			
			if (! array_key_exists ( 'children', $curctgy )) {
				$curctgy ['children'] = array ();
			}
			$curctgy ['children'] [] = array (
					'id' => $value ['id'],
					'text' => $value ['text'] 
			);
		}
	}
	
	if (array_key_exists ( 'children', $curctgy )) {
		foreach ( $curctgy ['children'] as $key => $value ) {
			$curctgy ['children'] [$key] = build_learnctgy_tree_int ( $ctgytable, $value );
		}
	}
	
	return $curctgy;
}
// 2.2 Learn object
function buildup_learnobject_tree($objtable, $parhavechld) {
	$realpar = "";
	$treetable = array ();
	
	foreach ( $objtable as $key => $value ) {
		
		if (strcmp ( $value ['categoryparid'], '#' ) == 0) {
			$realpar = '#';
		} else {
			$realpar = "ctgy" . $value ['categoryparid'];
		}
		
		if (array_key_exists ( $value ['categoryid'], $parhavechld ) && $parhavechld [$value ['categoryid']] != 0) {
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
		} elseif (array_key_exists ( $value ['categoryid'], $parhavechld ) && $parhavechld [$value ['categoryid']] == 0) {
			// Objects
			$treetable [] = array (
					"id" => "obj" . $value ['objectid'],
					"parent" => "ctgy" . $value ['categoryid'],
					"text" => $value ['objectname'],
					"icon" => "jstree-file" 
			);
		} elseif (! array_key_exists ( $value ['categoryid'], $parhavechld )) {
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
	$newctgytable = array ();
	
	// Root nodes
	foreach ( $typetable as $key => $value ) {
		if (IsNullOrEmptyString ( $value ['parent'] ) || $value ['parent'] == '#') {
			$newctgytable [] = $value;
		}
	}
	
	foreach ( $newctgytable as $key => $value ) {
		$newctgytable [$key] = build_financetrantype_tree_int ( $typetable, $value );
	}
	
	return $newctgytable;
}
function build_financetrantype_tree_int($ctgytable, $parhavechld) {
	$realpar = "";
	
	foreach ( $ctgytable as $key => $value ) {
		if (IsNullOrEmptyString ( $value ['parent'] )) {
			continue;
		}
		
		if ($value ['parent'] === $parhavechld ['id']) {
			$newvalue = build_financetrantype_tree_int ( $ctgytable, $value );
			
			if (! array_key_exists ( 'children', $parhavechld )) {
				$parhavechld ['children'] = array ();
			}
			
			$parhavechld ['children'] [] = $newvalue;
		}
	}
	return $parhavechld;
}
// 2.4 Finance control center
function build_financecontrolcenter_tree($typetable) {
	$newctgytable = array ();
	
	// Root nodes
	foreach ( $typetable as $key => $value ) {
		if (IsNullOrEmptyString ( $value ['parent'] )) {
			$newctgytable [] = $value;
		}
	}
	
	foreach ( $newctgytable as $key => $value ) {
		$newctgytable [$key] = build_financecontrolcenter_tree_int ( $typetable, $value );
	}
	
	return $newctgytable;
}
function build_financecontrolcenter_tree_int($ctgytable, $parhavechld) {
	$realpar = "";
	
	foreach ( $ctgytable as $key => $value ) {
		if (IsNullOrEmptyString ( $value ['parent'] )) {
			continue;
		}
		
		if ($value ['parent'] === $parhavechld ['id']) {
			$newvalue = build_financetrantype_tree_int ( $ctgytable, $value );
			
			if (! array_key_exists ( 'children', $parhavechld )) {
				$parhavechld ['children'] = array ();
			}
			
			$parhavechld ['children'] [] = $newvalue;
		}
	}
	return $parhavechld;
}

/* Libraries */
function lib_setting_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM t_lib_setting";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"setname" => $row [0],
				"setdesp" => $row [1],
				"setvalue" => $row [2]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array ( $sError, $rsttable );	
}
function lib_lang_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM t_language";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"lang" => $row [0],
				"name" => $row [1],
				"navname" => $row [2] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}

function lib_booktype_listread($nid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM t_lib_booktype";
	if ($nid) {
		$query = $query . " WHERE ID = ". $nid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2],
				"parid" => $row [3]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
			$sError,
			$rsttable
	);
}
function lib_bookgroup_listread($nid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
				"Connect failed: %s\n" . mysqli_connect_error (),
				null
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
    $grpbooktable = array();
	$query = "SELECT ID, NAME, OTHERS FROM t_lib_bookgroup";
	if ($nid) {
		$query = $query . " WHERE ID = ". $nid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2]
			);
		}
	
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}

	// Books
	if (empty($sError)) {
		$query = "SELECT GRPID, BOOKID FROM t_lib_bookgroup_cont ";
        // Using GROUP_CONCAT method?
		if ($nid) {
			$query = $query . " WHERE GRPID = ". $nid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$grpbooktable [] = array (
					"grpid" => $row [0],
					"bookid" => $row [1]
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		array($rsttable, $grpbooktable)
	);
}
function lib_bookgroup_create($objGrp) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = -1;
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Prepare an insert statement */
	$query = "INSERT INTO t_lib_bookgroup(NAME, OTHERS, PARID) VALUES(?, ?, ?)";
	 
	if ($stmt = $mysqli->prepare ( $query )) {
	 	$stmt->bind_param ( "ssi", $objGrp->Name, $objGrp->Others, $objGrp->ParentID );
	 	/* Execute the statement */
	 	if ($stmt->execute ()) {
	 		$nNewID = $mysqli->insert_id;
	 	} else {
	 		$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
	 	}
	 	
	 	/* close statement */
	 	$stmt->close ();
	} else {
	 	$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Insert on content */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookgroup_cont (`GRPID`, `BOOKID`) VALUES (?, ?);";
		foreach ( $objGrp->BookArray as $bookid ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ii", $nNewID, $bookid );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}

	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nNewID 
	);
}
function lib_bookgroup_change($objGrp) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Prepare an insert statement */
	$query = "UPDATE t_lib_bookgroup SET NAME = ?, OTHERS = ?, PARID =? WHERE ID = ?";
	 
	if ($stmt = $mysqli->prepare ( $query )) {
	 	$stmt->bind_param ( "ssii", $objGrp->Name, $objGrp->Others, $objGrp->ParentID, $objGrp->ID );
	 	/* Execute the statement */
	 	if ($stmt->execute ()) {
	 	} else {
	 		$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
	 	}
	 	
	 	/* close statement */
	 	$stmt->close ();
	} else {
	 	$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
    
	/* Delete the content */
	if (empty ( $sError )) {
	   $query = "DELETE FROM t_lib_bookgroup_cont WHERE GRPID = ?";
       if ($stmt = $mysqli->prepare ( $query )) {
           $stmt->bind_param ( "i", $objGrp->ID );

           /* Execute the statement */
           if ($stmt->execute ()) {
           } else {
               $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
           }
            
           /* close statement */
           $stmt->close ();
       } else {
           $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
       }
    }
	
	/* Insert on content */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookgroup_cont (`GRPID`, `BOOKID`) VALUES (?, ?);";
		foreach ( $objGrp->BookArray as $bookid ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ii", $objGrp->ID, $bookid );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}

	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}
function lib_bookgroup_delete($grpid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Prepare an insert statement */
	$query = "DELETE FROM t_lib_bookgroup WHERE ID = ?";
	 
	if ($stmt = $mysqli->prepare ( $query )) {
	 	$stmt->bind_param ( "i", $grpid );
	 	/* Execute the statement */
	 	if ($stmt->execute ()) {
	 	} else {
	 		$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
	 	}
	 	
	 	/* close statement */
	 	$stmt->close ();
	} else {
	 	$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
    
	/* Delete the content */
	if (empty ( $sError )) {
	   $query = "DELETE FROM t_lib_bookgroup_cont WHERE GRPID = ?";
       if ($stmt = $mysqli->prepare ( $query )) {
           $stmt->bind_param ( "i", $grpid );

           /* Execute the statement */
           if ($stmt->execute ()) {
           } else {
               $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
           }
            
           /* close statement */
           $stmt->close ();
       } else {
           $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
       }
    }
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}
function lib_bookgroup_bookbrief_listread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "select taba.id, GROUP_CONCAT(tabb.Name) from t_lib_book as taba left outer join t_lib_bookname as tabb on taba.id = tabb.bookid group by taba.id";
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_loc_listread($nlocid = false) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT * FROM t_lib_loc";
	if ($nlocid) {
		$query = $query . " WHERE ID = ". $nlocid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"details" => $row [2], 
				"comment" => $row [3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_loc_create($objLoc) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = -1;
	
	// Create account: return code, message and last insert id
	/* Prepare an insert statement */
	$query = "INSERT INTO t_lib_loc(NAME, DETAILS, COMMENT) VALUES(?, ?, ?)";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sss", $objLoc->Name, $objLoc->Detail, $objLoc->Comment );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nNewID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nNewID 
	);
}
function lib_loc_update($objLoc) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	$query = "UPDATE t_lib_loc SET NAME = ?, DETAILS = ?, COMMENT = ? WHERE ID = ?";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sssi", $objLoc->Name, $objLoc->Detail, $objLoc->Comment, $objLoc->ID );
		/* Execute the statement */
		if ($stmt->execute ()) {
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}
function lib_loc_delete($id) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
    $nUsedCount = 0;
    
    // Check the usage first
	$query = "SELECT count(*) FROM t_lib_bookloc WHERE LOCID = ". $id;
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
            $nUsedCount = $row[0];
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
    if ($nUsedCount > 0) {
        $sError = "Location ". $perid. " still in use, cannot delete!";
    }
	
    // Then, delete
    if (empty($sError)) {
        $query = "DELETE FROM t_lib_loc WHERE ID = ?";
        
        if ($stmt = $mysqli->prepare ( $query )) {
            $stmt->bind_param ( "i", $id );
            /* Execute the statement */
            if ($stmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
            }
            
            /* close statement */
            $stmt->close ();
        } else {
            $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
        }
    }
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}

function lib_person_listread($npersonid = false) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT ID, NAME, OTHERS, TAGS FROM t_lib_person";
	if ($npersonid) {
		$query = $query . " WHERE ID = ". $npersonid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2],
                "tags" => $row[3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_person_authorlistread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
    $authortag = "";
	$query = "SELECT setvalue FROM t_lib_setting WHERE setname = 'BOOKAUTHOR'";
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
            $authortag = json_decode($row[0], true);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
    
    // Parse the tags
    $query = "SELECT ID, NAME, OTHERS, TAGS FROM t_lib_person";
    $tagscount = count($authortag);
    if ($tagscount > 0) {
        $query = $query. " WHERE TAGS LIKE '%";
        for($i = 0; $i < $tagscount; $i ++) {
            $query = $query . $authortag[$i] . "%' ";
            if ($i > $tagscount - 1) {
                $query = $query . " AND TAGS LIKE '%";
            }
        }
    }

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2],
                "tags" => $row[3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_person_create($objPerson) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = -1;
	
	/* Prepare an insert statement */
	$query = "INSERT INTO t_lib_person(NAME, OTHERS, TAGS) VALUES(?, ?, ?)";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sss", $objPerson->Name, $objPerson->Others, $objPerson->Tags );

		/* Execute the statement */
		if ($stmt->execute ()) {
			$nNewID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nNewID 
	);
}
function lib_person_change($objPerson) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an insert statement */
	$query = "UPDATE t_lib_person SET NAME = ?, OTHERS = ?, TAGS = ? WHERE ID = ?";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sssi", $objPerson->Name, $objPerson->Others, $objPerson->Tags, $objPerson->ID );

		/* Execute the statement */
		if ($stmt->execute ()) {
			// Do nothing
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		NULL 
	);
}
function lib_person_delete($perid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check the usage on that person!
    $nUsedCount = 0;
	$query = "SELECT count(*) FROM t_lib_bookauthor WHERE PERSONID = ". $perid;
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
            $nUsedCount = $row[0];
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
    if ($nUsedCount > 0) {
        $sError = "Person ". $perid. " still in use, cannot delete!";
    }
    
    // Now, perform the real deletion
    if ( empty($sError)) {
	   $query = "DELETE FROM t_lib_person WHERE ID = ". $perid;
        if ($stmt = $mysqli->prepare ( $query )) {
            /* Execute the statement */
            if ($stmt->execute ()) {
                // Do nothing here!
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
            }
            
            /* close statement */
            $stmt->close ();
        } else {
            $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
        }
    }
    
	/* close connection */
    $mysqli->close();
	return array (
		$sError,
		NULL 
	);    
}

function lib_org_presslistread() {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
    $presstag = "";
	$query = "SELECT setvalue FROM t_lib_setting WHERE setname = 'BOOKPRESS'";
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
            $presstag = json_decode($row[0], true);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
    
    // Parse the tags
    $query = "SELECT ID, NAME, OTHERS, TAGS FROM t_lib_org";
    $tagscount = count($presstag);
    if ($tagscount > 0) {
        $query = $query. " WHERE TAGS LIKE '%";
        for($i = 0; $i < $tagscount; $i ++) {
            $query = $query . $presstag[$i] . "%' ";
            if ($i > $tagscount - 1) {
                $query = $query . " AND TAGS LIKE '%";
            }
        }
    }

	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2],
                "tags" => $row[3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_org_listread($norgid = false) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	$sError = "";
	
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$rsttable = array ();
	$query = "SELECT ID, NAME, OTHERS, TAGS FROM t_lib_org";
	if ($norgid) {
		$query = $query . " WHERE ID = ". $norgid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$rsttable [] = array (
				"id" => $row [0],
				"name" => $row [1],
				"others" => $row [2],
                "tags" => $row[3]
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		$rsttable 
	);   
}
function lib_org_create($objOrg) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = -1;
	
	/* Prepare an insert statement */
	$query = "INSERT INTO t_lib_org(NAME, OTHERS, TAGS) VALUES(?, ?, ?)";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sss", $objOrg->Name, $objOrg->Others, $objOrg->Tags );
		/* Execute the statement */
		if ($stmt->execute ()) {
			$nNewID = $mysqli->insert_id;
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nNewID 
	);
}
function lib_org_change($objOrg) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	/* Prepare an insert statement */
	$query = "UPDATE t_lib_org SET NAME = ?, OTHERS = ?, TAGS = ? WHERE ID = ?";
	
	if ($stmt = $mysqli->prepare ( $query )) {
		$stmt->bind_param ( "sssi", $objOrg->Name, $objOrg->Others, $objOrg->Tags, $objOrg->ID );

		/* Execute the statement */
		if ($stmt->execute ()) {
            // Do nothing
		} else {
			$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
		}
		
		/* close statement */
		$stmt->close ();
	} else {
		$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		NULL
	);
}
function lib_org_delete($orgid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Check the usage!
    $nUsedCount = 0;
	$query = "SELECT count(*) FROM t_lib_bookpress WHERE PRESSID = ". $orgid;
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
            $nUsedCount = $row[0];
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
    if ($nUsedCount > 0) {
        $sError = "Organization ". $perid. " still in use, cannot delete!";
    }
    
    // Now, perform the real deletion
    if ( empty($sError)) {
	   $query = "DELETE FROM t_lib_org WHERE ID = ". $orgid;
        if ($stmt = $mysqli->prepare ( $query )) {
            /* Execute the statement */
            if ($stmt->execute ()) {
                // Do nothing here!
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
            }
            
            /* close statement */
            $stmt->close ();
        } else {
            $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
        }
    }
    
	/* close connection */
    $mysqli->close();
	return array (
		$sError,
		NULL 
	);    
}

function lib_book_listread($nbookid) {
	$link = mysqli_connect ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}

	$sError = "";
	$booktable = array();
	$booklangtable = array();
	$booknametable = array();
	$bookauthtable = array();
	$bookpresstable = array();
    $bookloctable = array();
		
	// Set language
	mysqli_query($link, "SET NAMES 'UTF8'");
	mysqli_query($link, "SET CHARACTER SET UTF8");
	mysqli_query($link, "SET CHARACTER_SET_RESULTS=UTF8'");
	
	// Perform the query
	$query = "SELECT * FROM t_lib_book";
	if ($nbookid) {
		$query = $query . " WHERE ID = ". $nbookid;
	}
	
	if ($result = mysqli_query ( $link, $query )) {
		/* fetch associative array */
		while ( $row = mysqli_fetch_row ( $result ) ) {
			$booktable [] = array (
				"id" => $row [0],
				"isbn" => $row [1],
				"types" => $row [2],
				"others" => $row [3] 
			);
		}
		
		/* free result set */
		mysqli_free_result ( $result );
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
	// Book language
	if (empty($sError)) {
		$query = "SELECT taba.BOOKID, taba.LANG, tabb.NAME as langname, tabb.NAVNAME as langnavname FROM t_lib_booklang AS taba left outer join t_language AS tabb ON taba.LANG = tabb.LANG ";
		if ($nbookid) {
			$query = $query . " WHERE taba.BOOKID = ". $nbookid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$booklangtable [] = array (
					"bookid" => $row [0],
					"lang" => $row [1],
					"langname" => $row [2],
                    "langnavname" => $row [3] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}
	}
	// Book name 
	if (empty($sError)) {
		$query = "SELECT taba.BOOKID, taba.nameid, taba.LANG, tabb.NAME as langname, taba.name FROM t_lib_bookname AS taba left outer join t_language AS tabb ON taba.LANG = tabb.LANG ";
		if ($nbookid) {
			$query = $query . " WHERE taba.BOOKID = ". $nbookid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$booknametable [] = array (
					"bookid" => $row [0],
					"nameid" => $row [1],
					"lang" => $row [2],
					"langname" => $row [3],
					"name" => $row [4] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}
	}
	// Book author
	if (empty($sError)) {
		$query = "SELECT taba.BOOKID, taba.PERSONID, taba.TRANFLAG, tabb.NAME as personname FROM t_lib_bookauthor AS taba left outer join t_lib_person AS tabb ON taba.PERSONID = tabb.ID ";
		if ($nbookid) {
			$query = $query . " WHERE taba.BOOKID = ". $nbookid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$bookauthtable [] = array (
					"bookid" => $row [0],
					"personid" => $row [1],
					"tranflag" => $row [2],
					"personname" => $row [3] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}
	}
	// Book press
	if (empty($sError)) {
		$query = "SELECT taba.BOOKID, taba.PRESSID, tabb.NAME as pressname FROM t_lib_bookpress AS taba left outer join t_lib_org AS tabb ON taba.PRESSID = tabb.ID ";
		if ($nbookid) {
			$query = $query . " WHERE taba.BOOKID = ". $nbookid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$bookpresstable [] = array (
					"bookid" => $row [0],
					"pressid" => $row [1],
					"pressname" => $row [2] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}
	}    
    // Book location 
    if (empty($sError)) {
		$query = "SELECT taba.BOOKID, taba.LOCID, taba.media, taba.comment, tabb.NAME as locname FROM t_lib_bookloc AS taba left outer join t_lib_loc AS tabb ON taba.LOCID = tabb.ID ";
		if ($nbookid) {
			$query = $query . " WHERE taba.BOOKID = ". $nbookid;
		}
		
		if ($result = mysqli_query ( $link, $query )) {
			/* fetch associative array */
			while ( $row = mysqli_fetch_row ( $result ) ) {
				$bookloctable [] = array (
					"bookid" => $row [0],
					"locid" => $row [1],
					"media" => $row [2],
                    "comment" => $row[3],
                    "locname" => $row[4] 
				);
			}
			
			/* free result set */
			mysqli_free_result ( $result );
		} else {
			$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
		}        
    } 
	
	/* close connection */
	mysqli_close ( $link );
	return array (
		$sError,
		array($booktable, $booklangtable, $booknametable, $bookauthtable, $bookpresstable, $bookloctable) 
	);   
}
function lib_book_create($objBook) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	$nNewID = -1;
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Prepare an insert statement */
	$query = "INSERT INTO t_lib_book(ISBN, TYPES, OTHERS) VALUES(?, ?, ?)";
	 
	if ($stmt = $mysqli->prepare ( $query )) {
	 	$stmt->bind_param ( "sss", $objBook->ISBN, $objBook->Types, $objBook->Others );
	 	/* Execute the statement */
	 	if ($stmt->execute ()) {
	 		$nNewID = $mysqli->insert_id;
	 	} else {
	 		$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
	 	}
	 	
	 	/* close statement */
	 	$stmt->close ();
	} else {
	 	$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Insert on names */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookname (`BOOKID`, `NAMEID`, `LANG`, `NAME`) VALUES (?, ?, ?, ?);";	
		foreach ( $objBook->NameArray as $objname ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiss", $nNewID, $objname->NameID, $objname->Lang, $objname->Name );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}

	/* Insert on languages */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_booklang (`BOOKID`, `LANG`) VALUES (?, ?);";	
		foreach ( $objBook->LangArray as $objlang ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "is", $nNewID, $objlang->Language );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Insert on authors */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookauthor (`BOOKID`, `PERSONID`, `TRANFLAG`) VALUES (?, ?, ?);";	
		foreach ( $objBook->AuthorArray as $objauthor ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iii", $nNewID, $objauthor->AuthorID, $objauthor->TranFlag );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Insert on presses */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookpress (`BOOKID`, `PRESSID`) VALUES (?, ?);";	
		foreach ( $objBook->PressArray as $objpress ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ii", $nNewID, $objpress->PressID );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Insert on locations */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookloc (`BOOKID`, `LOCID`, `MEDIA`, `COMMENT`) VALUES (?, ?, ?, ?);";
		foreach ( $objBook->LocationArray as $objloc ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiss", $nNewID, $objloc->LocID, $objloc->Media, $objloc->Comment );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		$nNewID 
	);
}
function lib_book_change($objBook) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
		
	$sError = "";
	
	$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
	
	/* Prepare an insert statement */
	$query = "UPDATE t_lib_book SET ISBN = ?, TYPES = ?, OTHERS = ? WHERE ID = ?";
	 
	if ($stmt = $mysqli->prepare ( $query )) {
	 	$stmt->bind_param ( "sssi", $objBook->ISBN, $objBook->Types, $objBook->Others, $objBook->ID );
	 	/* Execute the statement */
	 	if ($stmt->execute ()) {
	 	} else {
	 		$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
	 	}
	 	
	 	/* close statement */
	 	$stmt->close ();
	} else {
	 	$sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
	}
	
	/* Deletion on names */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookname WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $objBook->ID );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
        }
	}
	/* Insert on names */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookname (`BOOKID`, `NAMEID`, `LANG`, `NAME`) VALUES (?, ?, ?, ?);";	
		foreach ( $objBook->NameArray as $objname ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiss", $objBook->ID, $objname->NameID, $objname->Lang, $objname->Name );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
			}
		}
	}

	/* Deletion on languages */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_booklang WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $objBook->ID );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}
	/* Insert on languages */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_booklang (`BOOKID`, `LANG`) VALUES (?, ?);";	
		foreach ( $objBook->LangArray as $objlang ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "is", $objBook->ID, $objlang->Language );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Deletion on authors */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookauthor WHERE `BOOKID` = ?;";
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $objBook->ID );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}
	/* Insert on authors */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookauthor (`BOOKID`, `PERSONID`, `TRANFLAG`) VALUES (?, ?, ?);";	
		foreach ( $objBook->AuthorArray as $objauthor ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iii", $objBook->ID, $objauthor->AuthorID, $objauthor->TranFlag );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Deletion on presses */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookpress WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $objBook->ID );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}
	/* Insert on presses */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookpress (`BOOKID`, `PRESSID`) VALUES (?, ?);";	
		foreach ( $objBook->PressArray as $objpress ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "ii", $objBook->ID, $objpress->PressID );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	/* Deletion on locations */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookloc WHERE `BOOKID` = ?;";
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $objBook->ID );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}
	/* Insert on locations */
	if (empty ( $sError )) {
		$query = "INSERT INTO t_lib_bookloc (`BOOKID`, `LOCID`, `MEDIA`, `COMMENT`) VALUES (?, ?, ?, ?);";
		foreach ( $objBook->LocationArray as $objloc ) {
			if ($newstmt = $mysqli->prepare ( $query )) {
				$newstmt->bind_param ( "iiss", $objBook->ID, $objloc->LocID, $objloc->Media, $objloc->Comment );
				
				/* Execute the statement */
				if ($newstmt->execute ()) {
				} else {
					$sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
					break;
				}

				/* close statement */
				$newstmt->close ();
			} else {
				$sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
			}
		}
	}

	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}
function lib_book_delete($bookid) {
	$mysqli = new mysqli ( MySqlHost, MySqlUser, MySqlPwd, MySqlDB );
	
	/* check connection */
	if (mysqli_connect_errno ()) {
		return array (
			"Connect failed: %s\n" . mysqli_connect_error (),
			null 
		);
	}
	
	// Set language
	$mysqli->query("SET NAMES 'UTF8'");
	$mysqli->query("SET CHARACTER SET UTF8");
	$mysqli->query("SET CHARACTER_SET_RESULTS=UTF8'");
	
    // Checks on usage 
	$sError = "";
    $nUsedCount = 0;
    $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
    
	$query = "SELECT count(*) FROM t_lib_bookgroup_cont WHERE BOOKID = ". $bookid;
	
	if ($result = $mysqli->query ( $query )) {
		/* fetch associative array */
		while ( $row = $result->fetch_row () ) {
            $nUsedCount = $row[0];
		}
		
		/* free result set */
		$result->close ();
	} else {
		$sError = "Failed to execute query: " .$query. " ; Error: " . mysqli_error($link);
	}
	
    if ($nUsedCount > 0) {
        $sError = "Book ". $perid. " still in use, cannot delete!";
    }
	
	/* Deletion on names */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookname WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $bookid );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. " ; Error: " . $mysqli->error;
        }
	}

	/* Deletion on languages */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_booklang WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $bookid );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}

	/* Deletion on authors */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookauthor WHERE `BOOKID` = ?;";
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $bookid );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}

	/* Deletion on presses */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookpress WHERE `BOOKID` = ?;";	
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $bookid );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}

	/* Deletion on locations */
	if (empty ( $sError )) {
		$query = "DELETE FROM t_lib_bookloc WHERE `BOOKID` = ?;";
        if ($newstmt = $mysqli->prepare ( $query )) {
            $newstmt->bind_param ( "i", $bookid );
            
            /* Execute the statement */
            if ($newstmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. "; Error: " . $mysqli->error;
                break;
            }

            /* close statement */
            $newstmt->close ();
        } else {
            $sError = "Failed to prepare statement: " . $query. "; Error: " . $mysqli->error;
        }
	}

    if (empty($sError)) {
        /* Prepare an deletion statement */
        $query = "DELETE FROM t_lib_book WHERE ID = ?;";
        
        if ($stmt = $mysqli->prepare ( $query )) {
            $stmt->bind_param ( "i", $bookid );
            /* Execute the statement */
            if ($stmt->execute ()) {
            } else {
                $sError = "Failed to execute query: " . $query. " ; Error: " . $mysqli->error;
            }
            
            /* close statement */
            $stmt->close ();
        } else {
            $sError = "Failed to parpare statement: " . $query. " ; Error: " . $mysqli->error;
        }
    }
	
	if (empty ( $sError )) {
		if (! $mysqli->errno) {
			$mysqli->commit ();
		} else {
			$mysqli->rollback ();
			$sError = $mysqli->error;
		}
	} else {
		$mysqli->rollback ();		
	}
	
	/* close connection */
	$mysqli->close ();
	
	return array (
		$sError,
		null 
	);
}

/* Following function For testing purpose only */
function getExchangeRt($from_Currency, $to_Currency) {
	
	// $amount = urlencode($amount);
	$from_Currency = urlencode ( $from_Currency );
	$to_Currency = urlencode ( $to_Currency );
	
	$url = "download.finance.yahoo.com/d/quotes.html?s=" . $from_Currency . $to_Currency . "=X&f=sl1d1t1ba&e=.html";
	$ch = curl_init ();
	$timeout = 0;
	curl_setopt ( $ch, CURLOPT_URL, $url );
	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt ( $ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)" );
	curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
	$rawdata = curl_exec ( $ch );
	curl_close ( $ch );
	$data = explode ( ',', $rawdata );
	return $data [1];
}

/* Service function */
function HIHSrv_Function( $func_name ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ();
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}		
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}	
} 

function HIHSrv_Function_AfterProc( $func_name, $func_name2 ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ();
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				$arAftProc = $func_name2 ( $arRst [1] );
				echo json_encode ( $arAftProc );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}		
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}	
} 

function HIHSrv_Function_1Param( $func_name, $func_para ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ( $func_para );
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}		
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}		
}

function HIHSrv_Function_2Param( $func_name, $func_para1, $func_para2 ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ( $func_para1, $func_para2 );
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}		
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}
}

function HIHSrv_Function_3Param( $func_name, $func_para1, $func_para2, $func_para3 ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ( $func_para1, $func_para2, $func_para3 );
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}		
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}
}

function HIHSrv_Function_4Param( $func_name, $func_para1, $func_para2, $func_para3, $func_para4 ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ( $func_para1, $func_para2, $func_para3, $func_para4 );
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}
}

function HIHSrv_Function_5Param( $func_name, $func_para1, $func_para2, $func_para3, $func_para4, $func_para5 ) {
	if (isset ( $_SESSION ['HIH_CurrentUser'] )) {
		if (function_exists($func_name))
		{
			$arRst = $func_name ( $func_para1, $func_para2, $func_para3, $func_para4, $func_para5 );
			
			if (! IsNullOrEmptyString ( $arRst [0] )) {
				export_error ( $arRst [0] );
			} else {
				echo json_encode ( $arRst [1] );
			}
		} else {
			$sErrors = "Function does not available: ". $func_name;
			export_error ( sErrors );				
		}
	} else {
		$sErrors = "User not login yet";
		export_error ( sErrors );
	}
}

?>
