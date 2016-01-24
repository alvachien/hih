<?php

class HIHConstants {
	// Abbreivation definition:
	//	1. EC: Error Code
	//  2. DT: Database table
	//  3. DV: Database view
	//  4. DP: Database procedure
	//	5. GC: Global constants
	// ...
	
	const EC_Unknown = 0; // Access it like: HIHConstants::EC_Unknown
	
	// EC Number range for Common part, 001 - 100
	const EC_InvalidName = 1;
	const EC_InvalidDesp = 2;
	const EC_InvalidValidFrom = 3;
	const EC_InvalidValidTo = 4;
	const EC_ValidToLessValidFrom = 5;
	const EC_InvalidContent = 6;
	const EC_InvalidDate = 7;
	const EC_InvalidID = 8;
	const EC_InvalidUser = 9;

	// EC Number range of DB part: 201 - 250
	const EC_ConnectionFail = 201;
	const EC_QueryExecuteFail = 202;
	const EC_ProcedureExecuteFail = 203;
	const EC_StatementPrepareFail = 204;
	
	// EC Number range for Finance part: 101 - 200
	const EC_InvalidAccount = 101;
	const EC_InvalidTranType = 102;
	const EC_InvalidAmount = 103;
	const EC_InvalidCategory = 104;
	const EC_NoCCNoOrd = 105;
	const EC_BothCCOrd = 106;
	const EC_InvalidDocDate = 107;
	const EC_InvalidDocType = 108;
	const EC_InvalidCurrency = 109;
	const EC_InvalidItems = 110;
	const EC_InvalidTotalPrecentage = 111;
	const EC_InvalidConctrolCenter = 112;
	const EC_InvalidOrder = 113;
	const EC_Delete_AccountInUse = 114;
	
	// EC Number range for Learn part: 250 - 350
	const EC_Delete_ObjectInUse = 251;
	const EC_Delete_CategoryInUse = 252;
	const EC_InvalidLearnObject = 253;
	const EC_LearnHistoryExist = 255;
	const EC_LearnHistoryNotExist = 256;
	
	// Others?
	
	// Sample way to figure the EC_Unknown out.
	public static function getECUnknown() { return self::EC_Unknown; }
	
	// Database part
	// Tables
	const DT_User = 't_user';
	const DT_UserHist = 't_user_hist';
	const DT_LearnObject = 't_learn_obj';
	const DT_LearnCategory = 't_learn_ctg';
	const DT_LearnHistory = 't_learn_hist';
	const DT_LearnPlan = 't_learn_plan';
	const DT_LearnPlanDetail = 't_learn_plandtl';
	const DT_LearnPlanParticipant = 't_learn_planpat';
	const DT_LearnAward = 't_learn_award';
	const DT_FinSetting = 't_fin_setting';
	const DT_FinDocument = 't_fin_document';
	const DT_FinDocumentItem = 't_fin_document_item';
	const DT_FinAccount = 't_fin_account';
	const DT_FinExchangeRate = 't_fin_exrate';
	const DT_FinControlCenter = 't_fin_controlcenter';
	const DT_FinTempDocDP = 't_fin_tmpdoc_dp';
	// Views
	const DV_LearnObjectList = 'v_learn_obj';
	const DV_LearnObjectHierarchy = 'v_learn_obj2';
	const DV_LearnHistoryList = 'v_learn_histlist';
	const DV_LearnHistoryHierarchy = 'v_learn_histhier';
	const DV_LearnAward = 'v_learn_award';
	const DV_FinAccount = 'v_fin_account';
	const DV_FinDocument = 'v_fin_document';
	const DV_FinReportBS = 'v_fin_report_bs4'; // changed from v_fin_report_bs3 on 2015.10.07 
	const DV_FinDocumentItem = 'v_fin_document_item1';
	const DV_FinDocumentItem3 = 'v_fin_document_item3';
	const DV_FinDPTmpDoc = 'v_fin_dpdoc';
	const DV_FinReportOrder = 'v_fin_report_io2'; // changed from v_fin_report_io1 on 2015.10.8
	// Procedures
	const DP_CreateLearnObject = 'CREATE_LEARNOBJECT';
	const DP_UpdateLearnObject = 'UPDATE_LEARNOBJECT';
	const DP_DeleteLearnObject = 'DELETE_LEARNOBJECT';
	const DP_CreateLearnHistory = 'CREATE_LEARNHISTORY';
	const DP_UpdateLearnHistory = 'UPDATE_LEARNHISTORY';
	const DP_DeleteLearnHistory = 'DELETE_LEARNHISTORY';
	const DP_CreateLearnCategory = 'CREATE_LEARNCATEGORY';
	const DP_CreateLearnPlan = 'CREATE_LEARNPLAN';
	const DP_UpdateLearnPlan = 'UPDATE_LEARNPLAN';
	const DP_DeleteLearnPlan = 'DELETE_LEARNPLAN';
	const DP_CreateLearnAward = 'CREATE_LEARNAWARD';
	const DP_CreateFinAccount = 'CREATE_FINANCEACCOUNT';
	const DP_CreateFinControlCenter = 'CREATE_FINANCECONTROLCENTER';	
	const DP_FinReportCC = 'REPORT_FIN_CC';
	const DP_FinReportTT = 'REPORT_FIN_TT';
	
	// Global variables
	const GC_InternalSplitChar = '_';
	const GC_ExternalSplitChar = ';';
	
	const GC_UserHistType_Create = 0;
	const GC_UserHistType_Login = 1;
	const GC_UserHistType_Logout = 2;
	const GC_UserHistType_ChangePassword = 3;
	const GC_UserHistType_ResetPassword = 4;
	const GC_UserHistType_Delete = 5;

	// Downpayment direction
	const GC_DownpaymentDir_Outgoing = 0;
	const GC_DownpaymentDir_Incoming = 1;

	// Downpayment account repeat type 
	const GC_DownpayRepeatType_PerMonth 	= 0;
	const GC_DownpayRepeatType_PerFortnight = 1;
	const GC_DownpayRepeatType_PerWeek 		= 2;
	const GC_DownpayRepeatType_PerDay 		= 3;
	const GC_DownpayRepeatType_PerQuarter 	= 4;
	const GC_DownPayRepeatType_PerHalfYear 	= 5;
	const GC_DownPayRepeatType_PerYear 		= 6;
	const GC_DownRayRepeatType_Manual 		= 7;
	
	// Account category asset flag 
	const GC_AccountCategoryAssetFlag_Asset 		= 1;
	const GC_AccountCategoryAssetFlag_Liability 	= 0;
	const GC_AccountCategoryAssetFlag_DownpayOut 	= 2;
	const GC_AccountCategoryAssetFlag_DownpayIn 	= 3;
	
	// Document type 
	const GC_FinDocType_DownpayOut = 5;
	const GC_FinDocType_DownpayIn = 6;
}

///
/// User
///
class HIHUser {
	public $UserID;
	public $DisplayAs;
	public $Password;
	public $Gender;
	public $Mailbox;
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid() {
		$errCodes = array();
		if (isset ( $this )) {
			$strTemp = trim($this->UserID);
			if ( !isset ( $strTemp ) ) {
				$errCodes[] = HIHConstants::EC_InvalidUser;
			}
			
			$strTemp = trim($this->Password);
			if (! isset ( $strTemp )) {
				$errCodes[] = HIHConstants::EC_InvalidPassword;
			}

			$strTemp = trim($this->DisplayAs);
			if (! isset ( $strTemp )) {
				$errCodes[] = HIHConstants::EC_InvalidAlias;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}

///
/// Learning part
///

// Learn Category
class HIHLearnCategory {
	public $ID;
	public $ParentID;
	public $Name;
	public $Comment;

	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidAccount;
			}
			
			$strTemp = trim($this->Name);
			if ($strTemp === '') {				
				$errCodes[] = HIHConstants::EC_InvalidName;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
// Learn Object
class HIHLearnObject {
	public $ID;
	public $CategoryID;
	public $Name;
	public $Content;
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidAccount;
			}
			
			if (! isset ( $this->CategoryID )) {
				$errCodes[] = HIHConstants::EC_InvalidCategory;
			}
			
			$strTemp = trim($this->Name);
			if ($strTemp === '') {				
				$errCodes[] = HIHConstants::EC_InvalidName;
			}
			$strTemp = trim($this->Content);
			if ($strTemp === '') {				
				$errCodes[] = HIHConstants::EC_InvalidContent;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
// Learn History
class HIHLearnHistory {
	public $ObjectID;
	public $UserID;
	public $LearnDate;
	public $Comment;
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			if ( !isset ( $this->ObjectID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidAccount;
			}
			if (! isset ( $this->UserID )) {
				$errCodes[] = HIHConstants::EC_InvalidUser;
			}
			if (! isset ( $this->LearnDate )) {
				$errCodes[] = HIHConstants::EC_InvalidDate;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
// Learn Award
class HIHLearnAward {
	public $ID;
	public $UserID;
	public $AwardDate;
	public $Score;
	public $Reason;
	
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidID;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		if (! isset ( $this->UserID )) {
			$errCodes[] = HIHConstants::EC_InvalidUser;
		}
		
		return $errCodes;
	}
}
// Learn Plan Detail
class HIHLearnPlanDetail {
	public $ID;
	public $ObjectID;
	public $DeferredDay;
	public $RecurType;
	public $Comment;
	
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidID;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
// Learn Plan Participant
class HIHLearnPlanParticipant {
	public $ID;
	public $UserID;
	public $StartDate;
	public $Status;
	public $Comment;
	
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidID;
			}
			if ( !isset ( $this->UserID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidUser;
			}
			if ( !isset ( $this->StartDate ) ) {
				$errCodes[] = HIHConstants::EC_InvalidDate;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
// Learn Plan
class HIHLearnPlan {
	public $ID;
	public $Name;
	public $Comment;
	// Details
	public $DetailsArray = array ();
	// Participants
	public $ParticipantsArray = array();
	
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		$this->DetailsArray = array();
		foreach ($jsonData AS $key => $value) {
			switch ($key) {
				case "ID":
				case "Name":
				case "Comment":
				$this->{$key} = $value;
				break;
				
				case "Details":
				{
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLearnPlanDetail( $value[ $i ] );
							$this->DetailsArray [$di->ObjectID] = $di;
						}
					}
				}
				break;
				
				case "Participants": {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLearnPlanParticipant( $value[ $i ] );
							$this->ParticipantsArray [] = $di;
						}
					}					
				}
				break;
				
				default:
				// Do nothing!
				break;
			}
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidID;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}

///
/// Finance part
///

// Finance Account
class HIHAccount {
	// Properties
	public $ID;
	public $CategoryID;
	public $Name;
	public $Comment;
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function fromJSON($jsonData) {
		// jsonData contains ID, CategoryID, Name, Comment
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
	
	public function CheckValid($bNonCreateCase = false) {
		$errCodes = array();
		if (isset ( $this )) {
			// The ID shall be check only in update/delete case
			if ( $bNonCreateCase && !isset ( $this->ID ) ) {
				$errCodes[] = HIHConstants::EC_InvalidAccount;
			}
			
			if (! isset ( $this->CategoryID )) {
				$errCodes[] = HIHConstants::EC_InvalidCategory;
			}
			
			$strTemp = trim($this->Name);
			if ($strTemp === '') {				
				$errCodes[] = HIHConstants::EC_InvalidName;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
}
class HIHAccountDP {
	// Properties
	public $AccountID;
	public $StartDate;
	public $EndDate;
	public $Direct;
	public $RepeatType;
	public $RefDocID;
	public $Others;
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function fromJSON($jsonData) {
		// jsonData contains ItemID, AccountID, TranTypeID, TranAmount, ControlCenterID, OrderID, Desp
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
		
		if ($this->RefDocID == -1) {
			$this->RefDocID = NULL;
		}
	}
}
class HIHDocumentItem {
	// Properties
	public $ItemID;

	public $AccountID;
	public $TranTypeID;
	public $TranAmount;
	public $Desp;
	public $ControlCenterID;
	public $OrderID;
	public $UseCurrency2;

	public $AccountName;
	public $TranTypeName;
	public $TranCurrencyName;
	public $ControlCenterName;
	public $OrderName;
	public $OrderValidfrom;
	public $OrderValidto;
	
	// Function
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }

	public function CheckValid() {
		$errCodes = array();
		if (isset ( $this )) {
			if (! isset ( $this->AccountID )) {
				$errCodes[] = HIHConstants::EC_InvalidAccount;
			}
			
			if (! isset ( $this->TranTypeID )) {
				$errCodes[] = HIHConstants::EC_InvalidTranType;
			}
			
			if (! isset ( $this->TranAmount )) {
				$errCodes[] = HIHConstants::EC_InvalidAmount;
			}
			
			if (($this->OrderID != 0) && ($this->ControlCenterID != 0)) {
				$errCodes[] = HIHConstants::EC_BothCCOrd;
			}
			
			if (($this->OrderID === 0) && ($this->ControlCenterID === 0)) {
				$errCodes[] = HIHConstants::EC_NoCCNoOrd;
			}
			
			if (!isset($this->Desp)) {
				$errCodes[] = HIHConstants::EC_InvalidDesp;
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
	public function fromJSON($jsonData) {
		// jsonData contains ItemID, AccountID, TranTypeID, TranAmount, ControlCenterID, OrderID, Desp
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
		
		if ($this->ControlCenterID == -1) {
			$this->ControlCenterID = NULL;
		}
		if ($this->OrderID === -1) {
			$this->OrderID = NULL;
		}
		if ($this->UseCurrency2 != 1) {
			$this->UseCurrency2 = NULL;
		}
	}
}
class HIHDPTempDoc{
	public $DocID;
	public $RefDocID;
	public $AccountID;
	public $TranDate;
	public $TranTypeID;
	public $Amount;
	public $ControlCenterID;
	public $OrderID;
	public $Desp;

	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
		if ($this->RefDocID == -1) {
			$this->RefDocID = NULL;
		}
		if ($this->ControlCenterID == -1) {
			$this->ControlCenterID = NULL;
		}
		if ($this->OrderID === -1) {
			$this->OrderID = NULL;
		}
	}
}
class HIHDocument {
	// Header
	public $DocID;
	public $DocDate;
	public $DocDesp;
	public $DocCurrency;
	public $DocTypeID;
	public $ExchangeRate;
	public $ProposedExchangeRate;
	public $DocCurrency2;
	public $ExchangeRate2;
	public $ProposedExchangeRate2;

	// Items
	public $ItemsArray = array ();

	// Constructors	
	public function __construct($json = false) {
        if ($json) $this->fromJSON(json_decode($json, true));
    }
	
	// Methods
	public function fromJSON($jsonData) {
		$this->ItemsArray = array();
		foreach ($jsonData as $key => $value) {
			switch ($key) {
				case "DocID":
				case "DocTypeID":
				case "ExchangeRate":
				case "ProposedExchangeRate":
				case "ExchangeRate2":
				case "ProposedExchangeRate2":
				$this->{$key} = $value;
				break;
				
				case "TranDate":
				$this->DocDate = $value;
				break;

				case "TranCurrency":
				$this->DocCurrency = $value;
				break;
				
				case "TranCurrency2":
				$this->DocCurrency2 = $value;
				break;
				
				case "Desp": 
				$this->DocDesp = $value;
				break;
				
				case "Items":
				{
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHDocumentItem( $value[ $i ] );
							$this->ItemsArray [$di->ItemID] = $di;
						}
					}
				}
				break;
				
				default:
				// Do nothing!
				break;
			}
		}
		
		if ($this->ExchangeRate == 1.0) {
			$this->ExchangeRate = NULL;
			$this->ProposedExchangeRate = NULL;
		}
		if (!isset($this->DocCurrency2)) {
			$this->DocCurrency2 = NULL;
			$this->ExchangeRate2 = NULL;
			$this->ProposedExchangeRate2 = NULL;
		} else {
			if ($this->ExchangeRate2 == 1.0) {
				$this->ExchangeRate2 = NULL;
				$this->ProposedExchangeRate2 = NULL;
			}
		}
	}
	public function CheckValid() {
		$errCodes = array();
		
		if (isset ( $this )) {
			if (!isset($this->DocDate)) {
				$errCodes[] = HIHConstants::EC_InvalidDocDate;
			}
			
			if (!isset($this->DocTypeID)) {
				$errCodes[] = HIHConstants::EC_InvalidDocType;
			}
			
			if (! isset ( $this->DocCurrency )) {
				$errCodes[] = HIHConstants::EC_InvalidCurrency;
			}
			
			if (!isset($this->DocDesp)) {
				$errCodes[] = HIHConstants::EC_InvalidDesp;
			}
			
			if (count ( $this->ItemsArray ) == 0){
				$errCodes[] = HIHConstants::EC_InvalidItems;
			} else {
				$inAmt = 0;
				$outAmt = 0;
				foreach( $this->ItemsArray as $itemVal) {
					$itemRst = $itemVal->CheckValid();
					$errCodes = array_merge($errCodes, $itemRst);
					
					// if (IsNullOrEmptyString($itemRst) ) 
					// {
						// // Internal order's validity check
						// if ($itemVal->OrderID == 0) {							
						// } else {
							// date_default_timezone_set(date_default_timezone_get());
							// $docdt = strtotime($this->DocDate);
							// $ordBg = strtotime($itemVal->OrderValidfrom);
							// $ordEd = strtotime($itemVal->OrderValidto);
							
							// if ($docdt >= $ordBg && $docdt <= $ordEd) {								
							// } else {
								// return "That order is not valid: ". $docdt. "; Bg:". $ordBg. "; End:". $ordEd;
							// }
						// }
						
						// // Success
						// if (((int)$this->DocTypeID) === HIH_FIN_DOCTYPE_Transfer ) { // Transfer
							// switch($itemVal->TranType)
							// {
								// case HIH_FIN_TranType_TransferIn: {
									// $inAmt += $itemVal->TranAmount;
								// }
								// break;
								
								// case HIH_FIN_TranType_TransferOut: {
									// $outAmt += $itemVal->TranAmount;
								// }
								// break;
								
								// default: {
									// return "Only Transfer In/Out Transaction Type are allowed to use!";										
								// }
								// break;
							// }
						// }
					// } else {
						// return $itemRst;
					// }						
				}
				
				// if (((int)$this->DocType) === HIH_FIN_DOCTYPE_Transfer ) { // Transfer
					// if ($inAmt === 0
						// || $outAmt ===0
						// || $inAmt !== $outAmt) {
							// return "For transfer document, the amount is invalid." . $inAmt . "    ". $outAmt;
						// }
				// }
			}			
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return $errCodes;
	}
	public function AddItem($item) {
		if (isset ( $this )) {
			if ($item instanceof HIHDocumentItem) {
				// Perform the check first!
				$checkrst = $item->CheckValid ();
				if ($checkrst != null) {
					return array (
							$checkrst,
							$item 
					);
				}
				
				// Workout the next item id
				$itemscount = count ( $this->ItemsArray );
				if ($itemscount === 0) {
					$item->ItemID = 1;
					$this->ItemsArray [$item->ItemID] = $item;
				} else {
					do {
						if (array_key_exists ( $itemscount, $this->ItemsArray )) {
							++ $itemscount;
						} else {
							$item->ItemID = $itemscount;
							$this->ItemsArray [$item->ItemID] = $item;
							break;
						}
					} while ( true );
				}
				
				return array (
						null,
						$item 
				);
			}
		}
		
		return array(null, null);
	}
	public function DeleteItem($itemID) {
		if (isset($this)) {
			if (array_key_exists ( $itemID, $this->ItemsArray )) {
				unset ( $this->ItemsArray [$itemID] );
			}
		}
	}
}
class HIHInternalOrderSRule {
	// Properties
	public $RuleID;
	public $ControlCenterID;
	public $Precent;
	public $Comment;
	
	public $ControlCenterName;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->ControlCenterID )) {
				return "Control Center is mandatory!";
			}
			
			if ( !isset ( $this->Precent ) || $this->Precent > 100 || $this->Precent <= 0) {
				return "Invalid Precent!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
}
class HIHInternalOrder {
	// Properties
	public $ID;
	public $Name;
	public $ValidFrom;
	public $ValidTo;
	public $Comment;
	// Items
	public $ItemsArray = array ();
	
	// Constructor
	public function __construct($json = false) {
        if ($json) $this->fromJSON(json_decode($json, true));
    }
	
	public function CheckValid() {
		$errCodes = array();
		if (isset ( $this )) {
			if (!isset($this->ValidFrom)) {
				$errCodes[] = HIHConstants::EC_InvalidValidFrom;
			}
				
			if (!isset($this->ValidTo)) {
				$errCodes[] = HIHConstants::EC_InvalidValidTo;
			}
			
			$this->Name = trim($this->Name);
			if (!isset($this->Name)) {
				$errCodes[] = HIHConstants::EC_InvalidValidName;
			}

			if (count ( $this->ItemsArray ) == 0){
				$errCodes[] = HIHConstants::EC_InvalidItems;
			}
			
			$precentcnt = 0;
			foreach($this->ItemsArray as $ruleitem) {
				$rulechk = $ruleitem->CheckValid();
				if (isset($rulechk)) {
					return $rulechk;
				}
				$precentcnt = $precentcnt + $ruleitem->Precent;
			}
			
			if ($precentcnt !== 100) {
				return "Percent must equal 100";
			}
		} else {
			$errCodes[] = HIHConstants::EC_Unknown;
		}
		
		return null;		
	}
	public function AddItem($item) {
		if (isset ( $this )) {
			if ($item instanceof HIHInternalOrderSRule) {
				// Perform the check first!
				$checkrst = $item->CheckValid ();
				if ($checkrst != null) {
					return array (
							$checkrst,
							$item 
					);
				}
				
				// Workout the next item id
				$itemscount = count ( $this->ItemsArray );
				if ($itemscount === 0) {
					$item->RuleID = 1;
					$this->ItemsArray [$item->RuleID] = $item;
				} else {
					do {
						if (array_key_exists ( $itemscount, $this->ItemsArray )) {
							++ $itemscount;
						} else {
							$item->RuleID = $itemscount;
							$this->ItemsArray [$item->RuleID] = $item;
							break;
						}
					} while ( true );
				}
				
				return array (
						null,
						$item 
				);
			}
		}
		
		return array(null, null);
	}
	public function DeleteItem($ruleID) {
		if (array_key_exists ( $ruleID, $ItemsArray )) {
			unset ( $ItemsArray [$ruleID] );
		}
	}
	public function fromJSON($jsonData) {
		// Example data:
		// "{"ID":-1,"Name":"Test 2","ValidFrom":"2015-09-04","ValidTo":"2015-09-05","Comment":"Test",
		// "SRules":[ ... ]
		// }"
		foreach ($jsonData as $key => $value) {
			switch ($key) {
				case "ID":
				case "Comment":
				case "Name":
				$this->{$key} = $value;
				break;
				
				case "ValidFrom": // ?
				$this->{$key} = $value;
				break;
				
				case "ValidTo": // ?
				$this->{$key} = $value;
				break;
				
				case "SRules":
				{
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$sr = new HIHInternalOrderSRule( $value[ $i ] );
							$this->ItemsArray [$sr->RuleID] = $sr;
						}
					}
				}
				break;
				
				default:
				// Do nothing!
				break;
			}
			
			// Following sample codes copied from http://stackoverflow.com/questions/5397758/json-decode-to-custom-class 
			//class JSONObject {
			//	public function __construct($json = false) {
			//		if ($json) $this->set(json_decode($json, true));
			//	}
			//
			//	public function set($data) {
			//		foreach ($data AS $key => $value) {
			//			if (is_array($value)) {
			//				$sub = new JSONObject;
			//				$sub->set($value);
			//				$value = $sub;
			//			}
			//			$this->{$key} = $value;
			//		}
			//	}
			//}
        }
	}
}

///
/// Libraries part
///

class HIHLibLocation {
	// Properties
	public $ID;
	public $Name;
	public $Detail;
	public $Comment;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->Name )) {
				return "Name is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
}

class HIHLibPerson {
	// Properties
	public $ID;
	public $Name;
	public $Others;
    public $Tags;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->Name )) {
				return "Name is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
}

class HIHLibOrganization {
	// Properties
	public $ID;
	public $Name;
	public $Others;
    public $Tags;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->Name )) {
				return "Name is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData AS $key => $value) {
			$this->{$key} = $value;
		}
	}
}

class HIHLibBookName {
    // Properties
    public $BookID;
    public $NameID;
    public $Lang;
    public $Name;
    
	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->Name )) {
				return "Name is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData as $key => $value) {
            $this->{$key} = $value;
        }
    }
}

class HIHLibBookLang {
	// Properties
	public $BookID;
	public $Language;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->Language )) {
				return "Lang is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData as $key => $value) {
            $this->{$key} = $value;
        }
    }
}

class HIHLibBookAuthor {
	// Properties
	public $BookID;
	public $AuthorID;
    public $TranFlag;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->AuthorID )) {
				return "Person is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData as $key => $value) {
            $this->{$key} = $value;
        }
    }
}

class HIHLibBookPress {
	// Properties
	public $BookID;
	public $PressID;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->PressID )) {
				return "Press is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData as $key => $value) {
            $this->{$key} = $value;
        }
    }
}

class HIHLibBookLocation {
	// Properties
	public $BookID;
	public $LocID;
    public $Media;
    public $Comment;

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->LocID )) {
				return "Location is mandatory!";
			}
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		foreach ($jsonData as $key => $value) {
            $this->{$key} = $value;
        }
    }
}

class HIHLibBookGroup {
	// Properties
	public $ID;
	public $Name;
    public $Others;
    public $ParentID;
    
    public $BookArray = array();

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
	
		return null;
	}
	public function fromJSON($jsonData) {        
        $this->BookArray = array();
        
		foreach ($jsonData as $key => $value) {
            switch($key) {
                case "ID":
                case "Name":
                case "Others":
                case "ParentID":
                $this->{$key} = $value;
                break;                
                
                case "Books":
                {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = intval( $value[ $i ] );
							$this->BookArray[] = $di;
						}
					}
                }
                break;
                
                default:
                break;
            }            
        }
    }
}

class HIHLibBook {
    // Properties
    public $ID;
    public $ISBN;
    public $Types; 
    public $Others;
    
    // Names 
    public $NameArray = array();
    // Langauges
    public $LangArray = array();
    // Authors
    public $AuthorArray = array();
    // Presses
    public $PressArray = array();
    // Locations
    public $LocationArray = array();

	// Function
	public function __construct($json = false) {
        if ($json) $this->fromJSON($json);
    }
	public function CheckValid() {
		if (isset ( $this )) {
		}
		
		return null;
	}
	public function fromJSON($jsonData) {
		$this->NameArray = array();
        $this->LangArray = array();
        $this->AuthorArray = array();
        $this->PressArray = array();
        $this->LocationArray = array();
		foreach ($jsonData AS $key => $value) {
            switch ($key) {
                case "ID":
                case "ISBN":
                case "Types":
                case "Others":
                $this->{$key} = $value; 
                break;
                
                case "Names":
                {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLibBookName( $value[ $i ] );
							$this->NameArray [$di->NameID] = $di;
						}
					}
                }
                break;
				
				case "Languages": {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLibBookLang( $value[ $i ] );
							$this->LangArray [$di->Language] = $di;
						}
					}
				}
				break;
                
                case "Authors": {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLibBookAuthor( $value[ $i ] );
							$this->AuthorArray [$di->PersonID] = $di;
						}
					}
                }
                break;
                
                case "Presses": {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLibBookPress( $value[ $i ] );
							$this->PressArray [$di->PressID] = $di;
						}
					}
                }
                break;
                
                case "Locations": {
					if (is_array($value)) {
						$count = count($value);
						for ($i = 0; $i < $count; $i++) {
							$di = new HIHLibBookLocation( $value[ $i ] );
							$this->LocationArray [$di->LocID] = $di;
						}
					}
                }
                break;
                
                default:
                break;
            }			
		}
	}
}

?>
