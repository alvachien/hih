<?php

class HIHUser {
	public $ID;
	public $DisplayAs;
	public $CreatedOn;
	public $Gender;
}
class HIHLearnCategory {
	public $ID;
	public $ParentID;
	public $Name;
	public $Comment;
}
class HIHLearnObject {
	public $ID;
	public $CategoryID;
	public $CategoryName;
	public $Content;
}
class HIHDocumentItem {
	// Properties
	public $AccountID;
	public $ItemID;
	public $TranType;
	public $TranAmount;
	public $TranDesp;
	public $TranControlCenter;
	public $AccountName;
	public $TranTypeName;
	public $TranCurrencyName;
	public $TranControlCenterName;
	public $ControlCenterID;
	public $ControlCenterName;
	public $OrderID;
	public $OrderName;
	public $OrderValidfrom;
	public $OrderValidto;
	
	// Function
	public function CheckValid() {
		if (isset ( $this )) {
			if (! isset ( $this->AccountID )) {
				return "Account ID is mandatory!";
			}
			
			if (! isset ( $this->TranType )) {
				return "Transaction Type is mandatory!";
			}
			
			if (! isset ( $this->TranAmount )) {
				return "Amount is mandatory!";
			}
			
			if (($this->OrderID != 0) && ($this->ControlCenterID != 0)) {
				return "Cannot set Control Center and Order both!";
			}
			
			if (($this->OrderID === 0) && ($this->ControlCenterID === 0)) {
				return "Need either Control Center or Order.";
			}
		}
		
		return null;
	}
}
class HIHDocument {
	// Header
	public $DocDate;
	public $DocDesp;
	public $DocCurrency;
	public $DocType;
	
	// Items
	public $ItemsArray = array ();
	
	// Methods
	public function CheckValid() {
		if (isset ( $this )) {
			if (!isset($this->DocDate)) {
				return "Document Date is manadatory!";
			}
			
			if (!isset($this->DocType)) {
				return "Document Type is manadatory!";
			}
			
			if (! isset ( $this->DocCurrency )) {
				return "Currency is mandatory!";
			}
			
			if (!isset($this->DocDesp)) {
				return "Document Description is manadatory!";
			}
			
			if (count ( $this->ItemsArray ) == 0){
				return "Items is manadatory!";
			} else {
				$inAmt = 0;
				$outAmt = 0;
				foreach( $this->ItemsArray as $itemVal) {
					$itemRst = $itemVal->CheckValid();
					
					if (IsNullOrEmptyString($itemRst) ) 
					{
						// Internal order's validity check
						if ($itemVal->OrderID == 0) {							
						} else {
							date_default_timezone_set(date_default_timezone_get());
							$docdt = strtotime($this->DocDate);
							$ordBg = strtotime($itemVal->OrderValidfrom);
							$ordEd = strtotime($itemVal->OrderValidto);
							
							if ($docdt >= $ordBg && $docdt <= $ordEd) {								
							} else {
								return "That order is not valid";
							}
						}
						
						// Success
						if (((int)$this->DocType) === HIH_FIN_DOCTYPE_Transfer ) { // Transfer
							switch($itemVal->TranType)
							{
								case HIH_FIN_TranType_TransferIn: {
									$inAmt += $itemVal->TranAmount;
								}
								break;
								
								case HIH_FIN_TranType_TransferOut: {
									$outAmt += $itemVal->TranAmount;
								}
								break;
								
								default: {
									return "Only Transfer In/Out Transaction Type are allowed to use!";										
								}
								break;
							}
						}
					} else {
						return $itemRst;
					}						
				}
				
				if (((int)$this->DocType) === HIH_FIN_DOCTYPE_Transfer ) { // Transfer
					if ($inAmt === 0
						|| $outAmt ===0
						|| $inAmt !== $outAmt) {
							return "For transfer document, the amount is invalid." . $inAmt . "    ". $outAmt;
						}
				}				
			}			
		}
		
		return null;
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
}
class HIHInternalOrder {
	// Properties
	public $IntOrdName;
	public $ValidFrom;
	public $ValidTo;
	public $Comment;
	// Items
	public $ItemsArray = array ();
	
	// Function
	public function CheckValid() {
		if (isset ( $this )) {
			if (!isset($this->ValidFrom)) {
				return "Valid from is manadatory!";
			}
				
			if (!isset($this->ValidTo)) {
				return "Valid to is manadatory!";
			}
			
			if (!isset($this->IntOrdName)) {
				return "Name is manadatory!";
			}

			if (count ( $this->ItemsArray ) == 0){
				return "S. Rule is manadatory!";
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
				return "Precent must equal 100";
			}
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
}

?>
