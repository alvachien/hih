/* global $ */
/* global angular */
(function() {
    "use strict";
    
    var hih = window.hih || (window.hih = {});

	// =========================================================
	// Constants
	// =========================================================
	hih.Constants = {
		LearnHistorySplitChar: "_",
		LearnCategorySplitChar: " > ",
		IDSplitChar: ",",
		DateSplitChar: '-',
		FinanceTranTypeSplitChar: " > ",
		
		FinSetting_LocalCurrency: "LocalCurrency",
		FinSetting_CurrencyExchangeToilence: "CurryExgToilence",
		
		// UI modes
		UIMode_Create: 1,
		UIMode_Change: 2,
		UIMode_Display: 3,
		
		UI_DateFormat: "yyyy.MM.dd",
		
		// Learn plan recurr. type
		LearnPlanRecurType_OneTime: 1,
		LearnPlanRecurType_HEbbinghaus: 2, // [0, 1, 2, 4, 7, 15]
		
		// Learn plan part. status
		LearnPlanPatStatus_NotStart:  1,
		LearnPlanPatStatus_InProcess: 2,
		LearnPlanPatStatus_Completed: 3,
		LearnPlanPatStatus_Aborted: 4,
		
		// Fin document type
		FinDocType_Normal: 1,
		FinDocType_Transfer: 2,
		FinDocType_CurrExchange: 3,
		FinDocType_Installment: 4,
		FinDocType_DownpayOut: 5,
		FinDocType_DownpayIn: 6,
		
		FinTranType_TransferIn: 37,
		FinTranType_TransferOut: 60,
		
		// Login/Registration
		Login_UserMinLength: 6,
		Login_UserMaxLength: 25,
		Login_PasswordMinLength: 6,
		Login_PasswordMaxLength: 25,
		Login_PwdStrgth_VeryWeek: 0,
		Login_PwdStrgth_Week: 1,
		Login_PwdStrgth_Normal: 2,
		Login_PwdStrgth_Strong: 3,
		Login_PwdStrgth_VeryStrong: 4,
		
		UserHistType_Create: 0,
		UserHistType_Login: 1,
		UserHistType_Logout: 2,
		UserHistType_ChangePassword: 3,
		UserHistType_ResetPassword: 4,
		UserHistType_Delete: 5,
		
		// Downpayment direction
		DownpaymentDir_Outgoing: 0,
		DownpaymentDir_Incoming: 1,
		
		// Downpay repeat type
		DownpayRepeatType_PerMonth: 0,
		DownpayRepeatType_PerFortnight: 1,
		DownpayRepeatType_PerWeek: 2,
		DownpayRepeatType_PerDay: 3,
		DownpayRepeatType_PerQuarter: 4,
		DownPayRepeatType_PerHalfYear: 5,
		DownPayRepeatType_PerYear: 6,
		DownRayRepeatType_Manual: 7,
		
		// Account Category Asset
		AccountCategoryAssetFlag_Asset: 1,
		AccountCategoryAssetFlag_Liability : 0,
		AccountCategoryAssetFlag_DownpayOut: 2, // Outgoing downpayment
		AccountCategoryAssetFlag_DownpayIn: 3 	// Incoming downpayment
	};
	
	// =========================================================
	// Model Utility
	// =========================================================
	hih.ModelUtility = {
	};
	hih.ModelUtility.DateFormatter = function(dateinf) {
		if ("object" === typeof dateinf) {
			var y = dateinf.getFullYear();
			var m = dateinf.getMonth() + 1;
			var d = dateinf.getDate();
			return y.toString() + hih.Constants.DateSplitChar + (m < 10 ? ('0' + m) : m).toString() + hih.Constants.DateSplitChar + (d < 10 ? ('0' + d) : d).toString();		
		}
		
		return dateinf;
	};
	hih.ModelUtility.DatabaseDateFormatter = function(dateinf) {
		if ("object" === typeof dateinf) {
			var y = dateinf.getFullYear();
			var m = dateinf.getMonth() + 1;
			var d = dateinf.getDate();
			return y.toString() + (m < 10 ? ('0' + m) : m).toString() + (d < 10 ? ('0' + d) : d).toString();		
		}
		
		return dateinf;
	};
	hih.ModelUtility.DateParser = function(s) {
		if (!s)
			return new Date();
		var ss = (s.split(hih.Constants.DateSplitChar));
		var y = parseInt(ss[0], 10);
		var m = parseInt(ss[1], 10);
		var d = parseInt(ss[2], 10);
		if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
			return new Date(y, m - 1, d);
		} else {
			return new Date();
		}
	};
	hih.ModelUtility.DaysBetween = function(first, second) {

	    // Copy date parts of the timestamps, discarding the time parts.
    	var one = new Date(first.getYear(), first.getMonth(), first.getDate());
    	var two = new Date(second.getYear(), second.getMonth(), second.getDate());

    	// Do the math.
    	var millisecondsPerDay = 1000 * 60 * 60 * 24;
    	var millisBetween = two.getTime() - one.getTime();
    	var days = millisBetween / millisecondsPerDay;

    	// Round down.
    	return Math.floor(days);
	};
	// hih.ModelUtility.FinanceAssetFlagCell = function finAssetflag(val) {
	// 	if (val === '1') {
	// 		return '<span style="color:green; font-weight: bold;">资产</span>';
	// 	} else if (val === '0') {
	// 		return '<span style="color:red; font-weight: bold;">负债</span>';
	// 	} else {
	// 		return '<span style="color:red;">Unknown</span>';
	// 	}	
	// };
	// hih.ModelUtility.FinanceExpenseFlagCell = function finExpenseFlag(val) {
	// 	if (val === '1' || val === 1) {
	// 		return '<span style="color:red; font-weight: bold;">开支</span>';
	// 	} else if (val === '0' || val === 0) {
	// 		return '<span style="color:green; font-weight: bold;">收入</span>';
	// 	} else {
	// 		return '<span style="color:red;">Unknown</span>';
	// 	}
	// };
	hih.ModelUtility.Round2Two = function (num) {
		//return +(Math.round(num + "e+2")  + "e-2");
		return Math.round(num * 100) / 100;
	};
	hih.ModelUtility.CheckMail = function(strMail) {
		var isValid = false;
		
		if (strMail.indexOf('@') >= 1) {
			var m_valid_dom = strMail.substr(strMail.indexOf('@')+1);
			if (m_valid_dom.indexOf('@') === -1) {
				if (m_valid_dom.indexOf('.') >= 1) {
					var m_valid_dom_e = m_valid_dom.substr(m_valid_dom.indexOf('.')+1);
					if (m_valid_dom_e.length >= 1) {
						isValid = true;
					}
				}
			}
		}

		return isValid;
	};
	hih.ModelUtility.CheckStringLength = function (strField, minlength, maxLength) {
    	var length_df = strField.length;
    	var bResult = false;
    
    	if (length_df >= minlength && length_df <= maxLength) {
        	bResult = true;
    	}
		
    	return bResult;
	};
	hih.ModelUtility.CheckPasswordStrength = function (strField) {
    	var pass_level = 0;
    
		if (strField.match(/[a-z]/g)) {
			pass_level++;
		}
		if (strField.match(/[A-Z]/g)) {
			pass_level++;
		}
		if (strField.match(/[0-9]/g)) {
			pass_level++;
		}
		if (strField.length < 5) {
			if(pass_level >= 1) pass_level--;
		} else if (strField.length >= 20) {
			pass_level++;
		}

	    return pass_level;
	};








	// =========================================================
	// Root model
	// =========================================================
	/* Root Model */
	hih.Model = function() {
		this.CreatedAt = new Date();
		this.CreatedBy = {};
	};
	hih.Model.prototype.Version = "1.1";
	hih.Model.prototype.Verify = function() {
		// Verify the data, returns the error messages!
		return [];	
	};








	// =========================================================
	// Learn part and OO concept adopt in JavaScript
	// =========================================================
	
	/* Method 1: using apply(or call) in the children's constructor */
	/* User */
	hih.User = function() {
		hih.Model.apply(this, arguments);
		this._super = hih.Model.prototype;
		
		this.UserID = "";
		this.DisplayAs = "";
	};
	hih.User.prototype.setContent = function(obj) {
		this.UserID = obj.id;
		this.DisplayAs = obj.text;
	};
	hih.UserLog = function() {
		this.UserID = "";
		this.LogType = 0;
		this.LogTypeString = "";
		this.TimePoint = new Date();
		this.Others = "";
		this.SeqNo = 0;
	};
	hih.UserLog.prototype.setContent = function(obj) {
		this.UserID = obj.userid;
		this.LogType = parseInt(obj.histtype);
		
		if (this.LogType === hih.Constants.UserHistType_Login) {
			this.LogTypeString = "Login.Login";
		} else if (this.LogType === hih.Constants.UserHistType_Logout) {
			this.LogTypeString = "Login.Logout";
		} else if (this.LogType === hih.Constants.UserHistType_Delete) {
			this.LogTypeString = "Common.Delete";
		} else if (this.LogType === hih.Constants.UserHistType_Create) {
			this.LogTypeString = "Login.Register";
		} else if (this.LogType === hih.Constants.UserHistType_ChangePassword) {
			this.LogTypeString = "Change Password"; // TODO
		} else if (this.LogType === hih.Constants.UserHistType_ResetPassword) {
			this.LogTypeString = "Reset Password"; // TODO
		}
		this.TimePoint = new Date(obj.timepoint);
		this.Others = obj.others;
		this.SeqNo = parseInt(obj.seqno);
	};
	hih.UserRegistration = function() {
		hih.Model.apply(this, arguments);
		this._super = hih.Model.prototype;
		
		this.UserID = "";
		this.DisplayAs = "";
		this.Password = "";
		this.ConfirmedPassword = "";
		this.Mailbox = "";
		this.Gender = 0;
	};
	hih.UserRegistration.prototype.Verify = function() {
		var errMsgs = [];
		
		// User ID
		if (hih.ModelUtility.CheckStringLength(this.UserID, hih.Constants.Login_UserMinLength, hih.Constants.Login_UserMaxLength)) {			
		} else {
			errMsgs.push("Message.InvalidUser");
		}
		// Password
		if (hih.ModelUtility.CheckStringLength(this.Password, hih.Constants.Login_PasswordMinLength, hih.Constants.Login_PasswordMaxLength)) {			
		} else {
			errMsgs.push("Message.InvalidPassword");
		}
		// Password
		if (this.Password === this.ConfirmedPassword) {			
		} else {
			errMsgs.push("Message.InvalidConfirmedPassword");
		}
		// Mailbox
		if (hih.ModelUtility.CheckMail(this.Mailbox)) {			
		} else {
			errMsgs.push("Message.InvalidMailbox");
		}
		
		return errMsgs;
	};
	hih.UserRegistration.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" ) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};
	hih.UserRegistration.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};	
	
	/* Method 2: changing the prototype */
	/* Learn Object */
	hih.LearnObject = function() {
		this.prototype = new hih.Model();
		this.prototype.constructor = hih.LearnObject;
		this._super = hih.Model.prototype;
		
		// Attributes
		this.ID = 0;
		this.CategoryID = 0;
		//this.CategoryName = "";
		this.Name = "";
		this.Content = "";
		
		// Runtime information
		this.CategoryObject = {};
	};
	hih.LearnObject.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.CategoryID = parseInt(obj.categoryid);
		//this.CategoryName = ctgyname;
		this.Name = obj.name;
		this.Content = obj.content;
	};
	hih.LearnObject.prototype.buildRelationship = function(arLearnCategory) {
		var that = this;
		if ($.isArray(arLearnCategory) && arLearnCategory.length > 0) {
			$.each(arLearnCategory, function(idx, obj) {
				if (obj.ID === that.CategoryID) {
					that.CategoryObject = obj;
					return false;
				}
			});
		}
	};
	hih.LearnObject.prototype.Verify = function() {
		var errMsgs = [];
		
		// Call to the super class's verify
		errMsgs = this._super.Verify.call(this);		
		if (errMsgs.length > 0)
			return errMsgs; 
		 
		if (isNaN(this.ID)) {
			errMsgs.push("Message.InvalidID");
		}
		if (isNaN(this.CategoryID)) {
			errMsgs.push("Message.InvalidCategory");
		}
		if (this.Name && typeof this.Name === "string" && this.Name.length > 0) {
		} else {
			errMsgs.push("Message.InvalidName");
		}
		if (this.Content && typeof this.Content === "string" && this.Content.length > 0) {
			var realcontent = this.Content.replace("<p><br data-mce-bogus=\"1\"></p>", "");
			realcontent = realcontent.replace("<p><br /></p>", "");
			if (realcontent.length <= 0) {
				 errMsgs.push("Message.InvalidContent");
			}
		} else {
			errMsgs.push("Message.InvalidContent");
		}
		 
		return errMsgs;
	};
	hih.LearnObject.prototype.toJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" || i === "CategoryObject" ) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};
	hih.LearnObject.prototype.toJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};	
	
	/* Method 3: using the prototype of superclass directly in children class */
	/* 	Risk: any changes on the children class's prototype will impact the super class!!! */
	
	/* Method 4: using the prototype of superclass but assign it to an empty instance */
    /** Utility methods 
     * @description create the Child extends Parent
     * @param {object} Child, instance of child class.
     * @param {object} Parent, instance of parent class.
     * @returns {null} No returns.
     */
    hih.extend = function(Child, Parent) {
        var OOP = function() {};
        OOP.prototype = Parent.prototype;
		
        Child.prototype = new OOP();
        Child.prototype.constructor = Child;
		
        Child._super = Parent.prototype;
    }

	/* Learn Category */
	hih.LearnCategory = function()	{
		// Attributes
		this.ID = -1;
		this.ParentID = -1;
		this.Text = "";
		this.Comment = ""; 
		
		// Runtime information
		this.ParentForJsTree = -1; 
		this.Parent = {};
		this.FullDisplayText = "";
	};
	hih.extend(hih.LearnCategory, hih.Model);
	hih.LearnCategory.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.ParentForJsTree = obj.parent;
		if (!obj.parent) {
			this.ParentID = -1;
		} else {
			if (typeof obj.parent === "string" && obj.parent === "#") {
				this.ParentID = -1; // Root node!
			} else {
				this.ParentID = parseInt(obj.parent);
			}			
		}
		this.Text = obj.text;
		this.Comment = obj.comment;
	};
	hih.LearnCategory.prototype.buildParentConnection = function(arCategories) {
		if (this.ParentID === -1) {
			this.Parent = null;
		} else {
			if ($.isArray(arCategories) && arCategories.length > 0) {
				var that = this;
				$.each(arCategories, function(idx, obj){
					if (that.ParentID === obj.ID) {
						that.Parent = arCategories[idx];
						return false;
					}
				});
			}			
		}
	};
	hih.LearnCategory.prototype.buildFullText = function() {
		if (this.ParentID === -1) {
			// Root category
			this.FullDisplayText = this.Text;
		} else {
			if (this.Parent) {
				this.FullDisplayText = this.Parent.buildFullText().concat(hih.Constants.LearnCategorySplitChar, this.Text);				 
			}
		}
		return this.FullDisplayText;
	};
	hih.LearnCategory.prototype.getJsTreeNode = function() {
		var treenode = {};
		treenode.id = this.ID.toString();
		if (this.ParentID === -1)
			treenode.parent = "#";
		else 
			treenode.parent = this.ParentID.toString();
		treenode.text = this.Text;
		treenode.state = {
			opened: true
		};
		return treenode;
	};
	hih.LearnCategory.prototype.Verify = function() {
		
	};
	
	/* Method 5: Using the copying all properties from superclass to childclass  */
	/* Just two methods provided. */
	hih.extend_copy = function(Child, Parent) {
		var p = Parent.prototype;
		var c = Child.prototype;
		
		for(var i in p) {
			c[i] = p[i];
		}
		c._super = p;
	};
	hih.extend_deepcopy = function(Child, Parent) {
		var p = Parent.prototype;
		var c = Child.prototype;
		for(var i in p) {
			if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array)? [] : {};
				hih.extend_deepcopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		c._super = p;
	};
	
	/* Method 6: Minimalist approach from Gabor de Mooij */
	/* Learn History */
	hih.LearnHistory = {
		_buildRelationship : function(arUser, arLearnObject) {
			var that = this;
			
			if($.isArray(arUser) && arUser.length > 0) {
				that.UserObject = {};
				$.each(arUser, function(idx, obj) {
					if (obj.UserID === that.UserID) {
						that.UserObject = obj;
						return false;
					}
				});
			}
			
			if($.isArray(arLearnObject) && arLearnObject.length > 0) {
				that.LearnObject = {};
				$.each(arLearnObject, function(idx, obj) {
					if (obj.ID === that.ObjectID) {
						that.LearnObject = obj;
						return false;
					}
				});
			}
		},
		_setContent: function(data) {
			this.UserID = data.userid;
			this.ObjectID = parseInt(data.objectid);
			this.LearnDate = new Date(data.learndate);
			this.Comment = data.comment;
		},
		_getLogicKey: function() {
			return this.logicKey;
		},
		_toJSONObject: function() {
			var forJSON = {};
			for(var i in this) {
				if (!this.hasOwnProperty(i) || i === "_super" || i === "LearnObject" || i === "toJSON" || i === "toJSONObject"
					|| i === "LearnDate") 
					continue;
				
				forJSON[i] = this[i];	
			}
			forJSON.LearnDate = hih.ModelUtility.DatabaseDateFormatter(this.LearnDate);
			return forJSON;
		},
		_toJSON: function() {
			var forJSON = this.toJSONObject();
			if (forJSON) {
				return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
			}
			return JSON && JSON.stringify(this) || $.toJSON(this);
		},
		_Verify: function() {
			var errMsgs = [];
			
			if (isNaN(this.ObjectID)) {
				errMsgs.push("Message.InvalidLearnObject");
			}
			if (this.UserID && typeof this.UserID === "string" && this.UserID.length > 0) {
			} else {
				errMsgs.push("Message.InvalidUser");
			}
			
			return errMsgs;
		},
		_Transfer: function() {
			// Logic key
			var arList = [this.ObjectID, this.UserID, hih.ModelUtility.DateFormatter(this.LearnDate)]; 
			this.logicKey = arList.reduce(function(previousValue, currentValue, index, arra) {
				var pv = previousValue.toString();
				var cv = currentValue.toString();
				return pv.concat('_', cv);
			});
			// ID from string to integer!
			if (typeof this.ObjectID === 'string' || this.ObjectID instanceof String) {
				this.ObjectID = parseInt(this.ObjectID);
			}
		},
		createNew: function() {
			// Inherit from Model first
			var lrnhist = new hih.Model();
			
			// Attributes
			lrnhist.UserID = "";
			lrnhist.ObjectID = -1;
			lrnhist.LearnDate = new Date();
			lrnhist.Comment = "";
			
			// Runtime information
			lrnhist.LearnObject = {};
			lrnhist.UserObject = {};
			lrnhist.logicKey = "";
			
			// OO Concept
			lrnhist._super = hih.Model.prototype;
			lrnhist.setContent = hih.LearnHistory._setContent;
			lrnhist.buildRelationship = hih.LearnHistory._buildRelationship;
			lrnhist.getLogicKey = hih.LearnHistory._getLogicKey;
			lrnhist.toJSONObject = hih.LearnHistory._toJSONObject;
			lrnhist.toJSON = hih.LearnHistory._toJSON;
			lrnhist.Transfer = hih.LearnHistory._Transfer;
			
			return lrnhist;
		}
	};
	
	/* Learn Award */
	hih.LearnAward = function() {
		// Attributes
		this.ID = -1;
		this.UserID = "";
		this.AwardDate = new Date();
		this.Score = 0.0;
		this.Reason = "";
		
		this.UserObject = {};
	};
	// Build prototype chain
	hih.extend(hih.LearnAward, hih.Model);
	hih.LearnAward.prototype.setContent = function(obj) {
		// id, userid, displayas, adate, score, reason
		this.ID = parseInt(obj.id);
		this.UserID = obj.userid;
		this.AwardDate = new Date(obj.adate);
		this.Score = obj.score;
		this.Reason = obj.reason;
	};
	hih.LearnAward.prototype.buildRelationship = function(arUser) {
		var that = this;
		
		if($.isArray(arUser) && arUser.length > 0) {
			that.UserObject = {};
			$.each(arUser, function(idx, obj) {
				if (obj.UserID === that.UserID) {
					that.UserObject = obj;
					return false;
				}
			});
		}
	};
	hih.LearnAward.prototype.Verify = function() {
		var errMsgs = [];

		if (this.UserID && typeof this.UserID === "string" && this.UserID.length > 0) {
		} else {
			errMsgs.push("Message.InvalidUser");
		}
		if (isNaN(this.Score) || typeof this.Score !== "number" ) {
			errMsgs.push("Message.InvalidScore");
		} else {
			if (this.Score > 100 || this.Score < 0) {
				errMsgs.push("Message.InvalidScore");
			}
		}
		
		return errMsgs;
	};	
	hih.LearnAward.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" || i === "UserObject" || i === "AwardDate" ) 
				continue;
			
			forJSON[i] = this[i];
		}
		
		forJSON["AwardDate"] = hih.ModelUtility.DatabaseDateFormatter(this.AwardDate); 
		return forJSON;
	};	
	hih.LearnAward.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	
	/* Learn Plan Detail */
	hih.LearnPlanDetail = function() {
		// Attributes
		this.ID = -1;
		this.ObjectID = -1;
		this.DeferredDay = 0;
		this.RecurType = hih.Constants.LearnPlanRecurType_OneTime;
		this.Comment = "";
		
		// Runtime information
		this.LearnObjectObject = {};
		this.RecurTypeDisplay = "";
	};
	hih.extend(hih.LearnPlanDetail, hih.Model);
	hih.LearnPlanDetail.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.ObjectID = parseInt(obj.objectid);
		this.DeferredDay = parseInt(obj.deferredday);
		this.RecurType = parseInt(obj.recurtype);
		this.Comment = obj.comment;
	};
	hih.LearnPlanDetail.prototype.buildRelationship = function(arLearnObject) {
		var that = this;
		if ($.isArray(arLearnObject) && arLearnObject.length > 0) {
			$.each(arLearnObject, function(idx, obj) {
				if (that.ObjectID === obj.ID) {
					that.LearnObjectObject = obj;
					return false;
				}
			});
		}
		
		// Recur Type Display
		if (this.RecurType === hih.Constants.LearnPlanRecurType_HEbbinghaus) {
			this.RecurTypeDisplay = "Learn.HEbbinghaus";
		} else {
			this.RecurTypeDisplay = "Learn.OneTime";
		}
	};
	hih.LearnPlanDetail.prototype.Verify = function($translate) {
		var errMsgs = [];

		if (isNaN(this.ObjectID) || this.ObjectID === -1)	{
			errMsgs.push($translate("Message.InvalidLearnObject"));
		}
		
		return errMsgs;
	};	
	hih.LearnPlanDetail.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" || i === "LearnObjectObject" || i === "RecurTypeDisplay" ) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};	
	hih.LearnPlanDetail.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	
	/* Learn Plan Participant */
	hih.LearnPlanParticipant = function() {
		// Attributes
		this.ID = -1;
		this.UserID = "";
		this.StartDate = new Date();
		this.Status = hih.Constants.LearnPlanPatStatus_NotStart;
		this.Comment = "";
		
		// Runtime information
		this.UserObject = null;
		this.StatusDisplay = "Common.NotStart";
	};
	hih.extend(hih.LearnPlanParticipant, hih.Model);
	hih.LearnPlanParticipant.prototype.buildUIDisplay = function() {
		// Status
		if (this.Status === hih.Constants.LearnPlanPatStatus_NotStart) {
			this.StatusDisplay = "Common.NotStart";
		} else if (this.Status === hih.Constants.LearnPlanPatStatus_InProcess) {
			this.StatusDisplay = "Common.InProcess";
		}  else if (this.Status === hih.Constants.LearnPlanPatStatus_Completed) {
			this.StatusDisplay = "Common.Completed";
		}  else if (this.Status === hih.Constants.LearnPlanPatStatus_Aborted) {
			this.StatusDisplay = "Common.Aborted";
		}		
	};
	hih.LearnPlanParticipant.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.UserID = obj.userid;
		this.StartDate = new Date(obj.startdate);
		this.Status = parseInt(obj.status);
		this.comment = obj.comment;
		
		// UI Display
		this.buildUIDisplay();
	};
	hih.LearnPlanParticipant.prototype.buildRelationship = function(arUser) {
		var that = this;
		
		$.each(arUser, function(idx, obj) {
			if (obj.UserID.localeCompare(that.UserID) === 0) {
				that.UserObject = obj;
				return false;
			}
		});
	};
	hih.LearnPlanParticipant.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		if (this.UserID && typeof this.UserID === "string" && this.UserID.length > 0) {
		} else {
			errMsgs.push($translate("Message.InvalidUser"));
		}
		
		return errMsgs;
	};	
	hih.LearnPlanParticipant.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" || i === "UserObject" || i === "StatusDisplay" || i === "StartDate") 
				continue;
			
			forJSON[i] = this[i];
		}
		forJSON["StartDate"] = hih.ModelUtility.DatabaseDateFormatter(this.StartDate);
		return forJSON;
	};	
	hih.LearnPlanParticipant.prototype.ToJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	
	/* Learn Plan Header */
	hih.LearnPlan = function() {
		// Attributes
		this.ID = -1;
		this.Name = "";
		this.Comment = "";
		
		this.Details = [];
		this.Participants = [];
	};	
	hih.extend(hih.LearnPlan, hih.Model);
	hih.LearnPlan.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.Comment = obj.comment;
	};
	hih.LearnPlan.prototype.buildRelationship = function(arObjs) {
		var that = this;
		$.each(that.Details, function(idx, obj) {
			obj.buildRelationship(arObjs);
		});
	};
	hih.LearnPlan.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		if (this.Name.trim().length <= 0) {
			if ($translate)
				errMsgs.push($translate("Message.InvalidName"));
			else
				errMsgs.push("Message.InvalidName");
		}
		
		for(var i = 0; i < this.Details.length; i ++) {
			var msg2 = this.Details[i].Verify($translate);
			if (msg2.length > 0) {
				Array.prototype.push.apply(errMsgs, msg2);
			}
		}
		
		// Check the duplicate on details
				
		for(var i = 0; i < this.Participants.length; i ++) {
			var msg3 = this.Participants[i].Verify($translate);
			if (msg3.length > 0) {
				Array.prototype.push.apply(errMsgs, msg3);
			}
		}
		
		return errMsgs;
	};	
	hih.LearnPlan.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "_super" || i === "Details" || i === "Participants" ) 
				continue;
			
			forJSON[i] = this[i];	
		}
		for(var j = 0 ; j < this.Details.length; ++j) {
			if (!$.isArray(forJSON.Details)) forJSON.Details = [];
			var jsonItem = this.Details[j].ToJSONObject();
			forJSON.Details.push(jsonItem);
		}
		for(var j = 0 ; j < this.Participants.length; ++j) {
			if (!$.isArray(forJSON.Participants)) forJSON.Participants = [];
			
			var jsonItem2 = this.Participants[j].ToJSONObject();
			forJSON.Participants.push(jsonItem2);
		}
		return forJSON;
	};
	hih.LearnPlan.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};	






	// =========================================================
	// Finance part
	// =========================================================
	// 0.1 Setting
	hih.FinanceSetting = function() {
		this.LocalCurrency = "";
		this.LocalCurrencyComment = "";
		this.CurrencyExchangeToilence = 0;
		this.CurrencyExchangeToilenceComment = "";
	};
	hih.extend(hih.FinanceSetting, hih.Model);
	hih.FinanceSetting.prototype.setContent = function(arData) {
		var that = this;
		if (arData && $.isArray(arData) && arData.length > 0) {
			$.each(arData, function(idx, obj) {
				if (obj.setid === hih.Constants.FinSetting_LocalCurrency) {												
					that.LocalCurrency = obj.setvalue;
					that.LocalCurrencyComment = obj.comment;
				} else if (obj.setid === hih.Constants.FinSetting_CurrencyExchangeToilence) {
					that.CurrencyExchangeToilence = parseFloat(obj.setvalue);
					that.CurrencyExchangeToilenceComment = obj.comment;
				}
			});
		}
	};
	// 0.2 Exchange rate
	hih.FinanceExchangeRate = function() {
		this.TranDate = new Date();
		this.ForeignCurrency = "";
		this.Rate = 0.0;
		this.RefDocumentID = -1;
		
		this.RefDocumentObject = {};
	};
	hih.extend(hih.FinanceExchangeRate, hih.Model);
	hih.FinanceExchangeRate.prototype.setContent = function(obj) {
		this.TranDate = obj.trandate;
		this.ForeignCurrency = obj.forgcurr;
		this.Rate = parseFloat(obj.exgrate);
		this.RefDocumentID = parseInt(obj.refdocid);
	};
	// 1. Currency
	hih.Currency = function Currency() {
		this.Currency = "";
		this.Name = "";
		this.Symbol = "";
		this.IsLocalCurrency = false;
	};
	hih.extend(hih.Currency, hih.Model);
	hih.Currency.prototype.setContent = function(obj, objFinSetting) {
		this.Currency = obj.curr;
		this.Name = obj.name;
		this.Symbol = obj.symbol;
		
		if (objFinSetting) {
			if (this.Currency === objFinSetting.LocalCurrency) {
				this.IsLocalCurrency = true;
			} else {
				this.IsLocalCurrency = false;
			}
		}
	};
	// 2. Account category
	hih.FinanceAccountCategory = function FinanceAccountCategory() {
		this.ID = -1;
		this.Name = "";
		this.AssetFlag = 0;
		this.Comment = "";
	};
	hih.extend(hih.FinanceAccountCategory, hih.Model);
	hih.FinanceAccountCategory.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.AssetFlag = parseInt(obj.assetflag);
		this.Comment = obj.comment;
	};
	// 3. Document type
	hih.FinanceDocumentType = function FinanceDocumentType() {
		this.ID = -1;
		this.Name = "";
		this.Comment = "";
	};
	hih.extend(hih.FinanceDocumentType, hih.Model);
	hih.FinanceDocumentType.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.Comment = obj.comment;
	};	
	// 4. Account
	hih.FinanceAccount = function FinanceAccount() {
		this.ID = -1; 
		this.CategoryID = -1;
		this.Name = "";
		this.Comment = "";
		
		// Runtime information
		this.CategoryObject = {};
	};
	hih.extend(hih.FinanceAccount, hih.Model);
	hih.FinanceAccount.prototype.setContent = function(obj) {
		// {"id":"4","ctgyid":"1","name":"aaa","comment":"aaa","ctgyname":"aaa","assetflag":"1"}
		this.ID = parseInt(obj.id);
		this.CategoryID = parseInt(obj.ctgyid);
		//var ctgyname = obj.ctgyname;
		//var assetflg = obj.assetflag;
		this.Name = obj.name;
		this.Comment = obj.comment;
	};
	hih.FinanceAccount.prototype.buildCategory = function(arAcntCtgy) {
		var that = this;
		if($.isArray(arAcntCtgy) && arAcntCtgy.length > 0) {
			that.CategoryObject = {};
			$.each(arAcntCtgy, function(idx, obj) {
				if (obj.ID === that.CategoryID) {
					that.CategoryObject = obj;
					return false;
				}
			});
		}
	};
	hih.FinanceAccount.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		// Call to the super class's verify
		if (this._super) {
			errMsgs = this._super.Verify.call(this);
		}
		
		// Now do the verify in Frontend part
		if (this.CategoryID === -1) {
			// No category is assigned
			errMsgs.push($translate("Message.InvalidCategory"));
		}
		
		// Name is must
		this.Name = this.Name.trim();
		if (this.Name.length <= 0) {
			errMsgs.push($translate("Message.InvalidName"));
		}
		
		return errMsgs;
	};
	hih.FinanceAccount.prototype.toJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "CategoryObject" )
				continue;
			
			forJSON[i] = this[i];
		}
		return forJSON;
	};
	hih.FinanceAccount.prototype.toJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);		
	};
	// 4a. Account additional data for down payment
	hih.FinanceAccountDownpayment = function() {
		this.AccountID = -1;
		this.Direct = "";
		this.StartDate = new Date();
		this.EndDate = new Date();
    	this.EndDate.setDate(this.EndDate.getDate() + 30);		
		this.RepeatType = 1;
		this.RefDocID = -1;
		this.Others = "";
	};
	hih.extend(hih.FinanceAccountDownpayment, hih.FinanceAccount);
	hih.FinanceAccountDownpayment.prototype.setContent = function(obj) {
		this.AccountID = parseInt(obj.accountid);
		this.Direct = parseInt(obj.direct);
		this.StartDate = new Date(obj.startdate);
		this.EndDate = new Date(obj.enddate);
		this.RepeatType = parseInt(obj.rpttype);
		this.RefDocID = parseInt(obj.refdocid);
		this.Others = obj.comment;
	};
	hih.FinanceAccountDownpayment.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		// Call to the super class's verify
		//if (this._super) {
		//	errMsgs = this._super.Verify.call(this);
		//}
		
		return errMsgs;
	};
	hih.FinanceAccountDownpayment.prototype.ToJSONObject = function() {
		var forJSON = {};
		
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "StartDate" || i === "EndDate")
				continue;
			
			forJSON[i] = this[i];
		}
		forJSON.StartDate = hih.ModelUtility.DateFormatter(this.StartDate);
		forJSON.EndDate = hih.ModelUtility.DateFormatter(this.EndDate);
		
		return forJSON;
	};
	hih.FinanceAccountDownpayment.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);		
	};
	// 5. Controlling Center
	hih.FinanceControlCenter = function FinanceControlCenter() {
		this.ID = -1;
		this.Name = "";
		this.ParentID = -1;
		this.Comment = "";
		
		// Runtime object
		this.ParentObject = {}; 
	};
	hih.extend(hih.FinanceControlCenter, hih.Model);
	hih.FinanceControlCenter.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		if (obj.parent) {
			this.ParentID = parseInt(obj.parent);
		} else {
			this.ParentID = -1;
		}
		this.Comment = obj.comment;
	};
	hih.FinanceControlCenter.prototype.buildParentObject = function(arCC) {
		var that = this;
		if (that.ParentID !== -1 && $.isArray(arCC) && arCC.length > 0) {
			$.each(arCC, function(idx, obj){
				if (that.ParentID === obj.ID) {
					that.ParentObject = obj;
					return false;
				}
			});
		}
	};
	hih.FinanceControlCenter.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		if (this.Name.trim().length <= 0) {
			if ($translate)
				errMsgs.push($translate("Message.InvalidName"));
			else
				errMsgs.push("Message.InvalidName");
		}

		return errMsgs;
	};
	// 5a. Settlement Rule
	hih.FinanceOrderSettlementRule = function FinanceOrderSettlementRule() {
		this.OrderID = -1;
		this.OrderName = "";
		//this.ValidFrom = new Date();
		//this.ValidTo = new Date();
		this.RuleID = -1;
		this.ControlCenterID = -1;
		//this.ControlCenterName = "";
		this.Precentage = 0.0;
		this.Comment = "";
		
		// Runtime information
		this.OrderObject = {};
		this.ControlCenterObject = {};		
	};
	hih.extend(hih.FinanceOrderSettlementRule, hih.Model);
	hih.FinanceOrderSettlementRule.prototype.setContent = function(obj) {
		this.OrderID = parseInt(obj.intordid);
		this.OrderName = obj.intordname;
		//var ordvalidfrom = obj.intordvalidfrom;
		//var ordvalidto = obj.intordvalidto;
		
		this.RuleID = parseInt(obj.ruleid);
		this.ControlCenterID = parseInt(obj.controlcenterid);
		//var ccname = obj.controlcentername;
		this.Precentage = parseFloat(obj.precent);
		this.Comment = obj.comment;
	};
	hih.FinanceOrderSettlementRule.prototype.buildRelationship = function(arCC, arOrders) {
		var that = this;
		if (arCC && $.isArray(arCC) && arCC.length > 0) {
			$.each(arCC, function(idx, obj){
				if (obj.ID === that.ControlCenterID) {
					that.ControlCenterObject = obj;
					return false;
				}
			});
		}
		if (arOrders && $.isArray(arOrders) && arOrders.length > 0) {
			$.each(arOrders, function(idx, obj){
				if (obj.ID === that.OrderID) {
					that.OrderObject = obj;
					return false;
				}
			});
		}
	};
	hih.FinanceOrderSettlementRule.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		if (isNaN(this.ControlCenterID) || this.ControlCenterID === -1)	{
			errMsgs.push($translate("Message.InvalidControlCenter"));
		}
		if (isNaN(this.Precentage) || this.Precentage <= 0.0 || this.Precentage > 1000.0 ) {
			errMsgs.push($translate("Message.InvalidPrecentage"));
		}
		return errMsgs;
	};
	hih.FinanceOrderSettlementRule.prototype.toJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "OrderID" || i === "OrderName" || i === "OrderObject" || i === "ControlCenterObject")
				continue;
			
			if (i !== "Precentage")
				forJSON[i] = this[i];
			else 
				forJSON["Precent"] = this[i];
		}
		return forJSON;
	};
	hih.FinanceOrderSettlementRule.prototype.toJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	// 5b. Internal Order
	hih.FinanceOrder = function FinanceOrder() {
		this.ID = -1;
		this.Name = "";
		this.ValidFrom = new Date();
		this.ValidTo = new Date();
		this.Comment = "";
		
		this.SRules = [];
	};
	hih.extend(hih.FinanceOrder, hih.Model);
	hih.FinanceOrder.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.ValidFrom = obj.valid_from;
		this.ValidTo = obj.valid_to;
		this.Comment = obj.comment;
	};
	hih.FinanceOrder.prototype.Verify = function($translate) {
		var errMsgs = [];
		if (this.Name.trim().length <= 0) {
			errMsgs.push($translate("Message.InvalidName"));
		}
		if (this.ValidTo <= this.ValidFrom) {
			errMsgs.push($translate("Message.InvalidValidDate"));
		}
		if (this.SRules.length <= 0) {
			errMsgs.push($translate("Message.MissingSettlementRules"));
		}
		
		// Check the total precentage equals 100
		//	and, no duplicated control center assigned.
		var nTotalPrecent = 0.0;
		var uniqueIDs = [];
		for(var i = 0; i < this.SRules.length; i ++) {
			var msg2 = this.SRules[i].Verify($translate);
			if (msg2.length > 0) {
				Array.prototype.push.apply(errMsgs, msg2);
			}
			nTotalPrecent += parseFloat(this.SRules[i].Precentage);
			
			if($.inArray(this.SRules[i].ControlCenterID, uniqueIDs) === -1) {
				uniqueIDs.push(this.SRules[i].ControlCenterID);
			} else {
				errMsgs.push($translate("Message.DuplicateControlCenterInSRule", 
					{ ccid: this.SRules[i].ControlCenterID,
						ccname: this.SRules[i].ControlCenterObject.Name }));
			}
		}
		if (Number(nTotalPrecent.toFixed(2)) !== 100.00) {
			errMsgs.push($translate("Message.InvalidTotalPrecentage"));
		}
		
		return errMsgs;
	};
	hih.FinanceOrder.prototype.toJSON = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "ValidFrom" || i === "ValidTo" || i === "SRules") 
				continue;
			
			forJSON[i] = this[i];
		}
		// Valid from and Valid to
		forJSON.ValidFrom = hih.ModelUtility.DateFormatter(this.ValidFrom);
		forJSON.ValidTo = hih.ModelUtility.DateFormatter(this.ValidTo);
		for(var j = 0 ; j < this.SRules.length; ++j) {
			if (!$.isArray(forJSON.SRules)) forJSON.SRules = [];
			forJSON.SRules.push(this.SRules[j].toJSONObject());
		}
		
		return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
	};
	// 6. Transaction type
	hih.FinanceTransactionType = function FinanceTransactionType() {
		this.ID = -1;
		this.ParentID = -1;
		this.Name = "";
		this.ExpenseFlag = false;
		this.Comment = "";
		
		// Runtime information
		this.FullDisplayName = "";
		this.Parent = {};
	};
	hih.extend(hih.FinanceTransactionType, hih.Model);
	hih.FinanceTransactionType.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		if (obj.parent) {
			this.ParentID = parseInt(obj.parent);
		} else {
			this.ParentID = -1;
		}		
		this.Name = obj.name;
		this.Comment = obj.comment;
		var expense = parseInt(obj.expense);
		if (expense === 1) {
			this.ExpenseFlag = true;
		} else {
			this.ExpenseFlag = false;
		}
	};
	hih.FinanceTransactionType.prototype.buildParentInfo = function(arTranTypes) {
		if (this.ParentID === -1) {
			this.Parent = null;
		} else {
			if ($.isArray(arTranTypes) && arTranTypes.length > 0) {
				var that = this;
				$.each(arTranTypes, function(idx, obj){
					if (that.ParentID === obj.ID) {
						that.Parent = arTranTypes[idx];
						return false;
					}
				});
			}			
		}
	};
	hih.FinanceTransactionType.prototype.buildFullName = function() {
		if (this.ParentID === -1) {
			// Root type
			this.FullDisplayName = this.Name;
		} else {
			if (this.Parent) {
				this.FullDisplayName = this.Parent.buildFullName().concat(hih.Constants.FinanceTranTypeSplitChar, this.Name);				 
			}
		}
		return this.FullDisplayName;
	};
	// 7. Document Item
	hih.FinanceDocumentItem = function FinanceDocumentItem() {
		this.DocID = -1;
		this.ItemID = -1;
		this.AccountID = -1;
		this.TranTypeID = -1;
		this.TranAmount_Org = 0.0;
		this.TranAmount = 0.0;
		this.ControlCenterID = -1;
		this.OrderID = -1;
		this.Desp = "";
		this.UseCurrency2 = false;
		
		// Runtime information
		this.TranAmountInLC = 0.0;
		this.ControlCenterObject = {};
		this.OrderObject = {};
		this.AccountObject = {};
		this.TranTypeObject = {};
	};
	hih.extend(hih.FinanceDocumentItem, hih.Model);
	hih.FinanceDocumentItem.prototype.setContent = function(obj) {
		this.DocID = parseInt(obj.docid);
		this.ItemID = parseInt(obj.itemid);
		this.AccountID = parseInt(obj.accountid);
		this.TranTypeID = parseInt(obj.trantype);
		if (!isNaN(obj.controlcenterid)) {
			this.ControlCenterID = parseInt(obj.controlcenterid);
		} else {
			this.ControlCenterID = -1;
		} 
		if (!isNaN(obj.orderid)) {
			this.OrderID = parseInt(obj.orderid);
		} else {
			this.OrderID = -1;
		}
		var usecurr2 = parseInt(obj.usecurr2);
		if (usecurr2 === 1) {
			this.UseCurrency2 = true;
		} else {
			this.UseCurrency2 = false;
		}
		this.TranAmount_Org = parseFloat(obj.tranamount_org).toFixed(2);
		this.TranAmount = parseFloat(obj.tranamount).toFixed(2);
		this.TranAmountInLC = parseFloat(obj.tranamount_lc).toFixed(2);
		this.Desp = obj.desp;
	};
	hih.FinanceDocumentItem.prototype.buildRelationship = function(arAccount, arCC, arOrder, arTranType) {
		var that = this;
		if (arAccount && $.isArray(arAccount) && arAccount.length > 0) {
			$.each(arAccount, function(idx, obj){
				if (obj.ID === that.AccountID) {
					that.AccountObject = obj;
					return false;
				}
			});
		}
		if (this.ControlCenterID !== -1 && arCC && $.isArray(arCC) && arCC.length > 0) {
			$.each(arCC, function(idx, obj){
				if (obj.ID === that.ControlCenterID) {
					that.ControlCenterObject = obj;
					return false;
				}
			});
		}
		if (this.OrderID !== -1 && arOrder && $.isArray(arOrder) && arOrder.length > 0) {
			$.each(arOrder, function(idx, obj){
				if (obj.ID === that.OrderID) {
					that.OrderObject = obj;
					return false;
				}
			});
		}
		if (arTranType && $.isArray(arTranType) && arTranType.length > 0) {
			$.each(arTranType, function(idx, obj){
				if (obj.ID === that.TranTypeID) {
					that.TranTypeObject = obj;
					return false;
				}
			});
		}
	};
	hih.FinanceDocumentItem.prototype.Verify = function($translate) {
		var errMsgs = [];
		
		// 1. Account
		if (isNaN(this.AccountID) || this.AccountID === -1) {
			errMsgs.push($translate("Message.InvalidAccount"));
		}
		// 2. Transaction type
		if (isNaN(this.TranTypeID) || this.TranTypeID === -1) {
			errMsgs.push($translate("Message.InvalidTransactionType"));
		}
		// 3. Amount
		if (isNaN(this.TranAmount_Org) || this.TranAmount_Org === 0) {
			errMsgs.push($translate("Message.InvalidAmount"));
		}
		// 4. Control Center ID OR Order ID
		if ((isNaN(this.ControlCenterID) || this.ControlCenterID === -1)
			&& (isNaN(this.OrderID) || this.OrderID === -1)) {
			errMsgs.push($translate("Message.MissingControlCenterOrOrder"));	
		}
		if ((!isNaN(this.ControlCenterID) && this.ControlCenterID !== -1)
			&& (!isNaN(this.OrderID) && this.OrderID !== -1)) {
			errMsgs.push($translate("Message.EitherControlCenterOrOrder"));
		}
		// 5. Desp
		if (this.Desp.trim().length <= 0) {
			errMsgs.push($translate("Message.InvalidDescription"));
		}
		
		return errMsgs;
	};
	hih.FinanceDocumentItem.prototype.toJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "DocID" || i === "ControlCenterObject" || i === "OrderObject"
				|| i === "AccountObject" || i === "TranTypeObject" || i === "TranAmountInLC" || i === "TranAmount") 
				continue;
			
			if (i === "TranAmount_Org") {
				forJSON["TranAmount"] = parseFloat(this[i]);
			} else if(i === "UseCurrency2") {
				if (this[i]) forJSON[i] = 1;
				else forJSON[i] = 0;				
			} else {
				forJSON[i] = this[i];
			}			
		}
		
		return forJSON;
	};
	hih.FinanceDocumentItem.prototype.toJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	// 7a. Document Item for Display
	hih.FinanceDocumentItemForDisp = function FinanceDocumentItemForDisp () {
		this.DocID = -1;
		this.ItemID = -1;
		this.AccountID = -1;
		this.TranTypeID = -1;
		this.TranAmount_Org = 0.0;
		this.TranAmount = 0.0;
		this.ControlCenterID = -1;
		this.OrderID = -1;
		this.Desp = "";
		this.UseCurrency2 = false;
		
		// Runtime information
		this.TranDate = new Date();
		this.TranAmountInLC = 0.0;
		this.ControlCenterObject = {};
		this.OrderObject = {};
		this.AccountObject = {};
		this.TranTypeObject = {};
	};
	hih.extend(hih.FinanceDocumentItemForDisp, hih.Model);
	hih.FinanceDocumentItemForDisp.prototype.setContent = function(obj) {
		this.TranDate = new Date(obj.trandate);
		this.DocID = parseInt(obj.docid);
		this.ItemID = parseInt(obj.itemid);
		this.AccountID = parseInt(obj.accountid);
		this.TranTypeID = parseInt(obj.trantype);
		if (!isNaN(obj.controlcenterid)) {
			this.ControlCenterID = parseInt(obj.controlcenterid);
		} else {
			this.ControlCenterID = -1;
		} 
		if (!isNaN(obj.orderid)) {
			this.OrderID = parseInt(obj.orderid);
		} else {
			this.OrderID = -1;
		}
		var usecurr2 = parseInt(obj.usecurr2);
		if (usecurr2 === 1) {
			this.UseCurrency2 = true;
		} else {
			this.UseCurrency2 = false;
		}
		this.TranAmount_Org = parseFloat(obj.tranamount_org).toFixed(2);
		this.TranAmount = parseFloat(obj.tranamount).toFixed(2);
		this.TranAmountInLC = parseFloat(obj.tranamount_lc).toFixed(2);
		this.Desp = obj.desp;
	};
	hih.FinanceDocumentItemForDisp.prototype.buildRelationship = function(arAccount, arCC, arOrder, arTranType) {
		var that = this;
		if (arAccount && $.isArray(arAccount) && arAccount.length > 0) {
			$.each(arAccount, function(idx, obj){
				if (obj.ID === that.AccountID) {
					that.AccountObject = obj;
					return false;
				}
			});
		}
		if (this.ControlCenterID !== -1 && arCC && $.isArray(arCC) && arCC.length > 0) {
			$.each(arCC, function(idx, obj){
				if (obj.ID === that.ControlCenterID) {
					that.ControlCenterObject = obj;
					return false;
				}
			});
		}
		if (this.OrderID !== -1 && arOrder && $.isArray(arOrder) && arOrder.length > 0) {
			$.each(arOrder, function(idx, obj){
				if (obj.ID === that.OrderID) {
					that.OrderObject = obj;
					return false;
				}
			});
		}
		if (arTranType && $.isArray(arTranType) && arTranType.length > 0) {
			$.each(arTranType, function(idx, obj){
				if (obj.ID === that.TranTypeID) {
					that.TranTypeObject = obj;
					return false;
				}
			});
		}
	};
	// 8. Document
	hih.FinanceDocument = function FinanceDocument() {
		this.DocID = -1;		 
		this.DocTypeID = -1;
		this.TranDate = new Date();	
		this.TranCurrency = "";
		this.Desp = "";
		this.TranAmount = 0.0;
		this.ExchangeRate = 1.0;
		this.ProposedExchangeRate = false;
		this.TranCurrency2 = "";
		this.ExchangeRate2 = 1.0;
		this.ProposedExchangeRate2 = false;
		this.Items = [];
		
		this.DocTypeObject = {};
		this.TranCurrencyObject = {};
		this.TranCurrency2Object = {};
	};
	hih.extend(hih.FinanceDocument, hih.Model);
	hih.FinanceDocument.prototype.setContent = function(obj) {
		this.DocID = parseInt(obj.docid);
		this.DocTypeID = parseInt(obj.doctype);
		this.TranDate = new Date(obj.trandate);
		this.TranCurrency = obj.trancurr;
		this.Desp = obj.desp;
		this.TranAmount = parseFloat(obj.tranamount).toFixed(2);
		if (obj.exgrate && !isNaN(obj.exgrate)) {
			this.ExchangeRate = parseFloat(obj.exgrate);
		}
		if (obj.exgrate_plan && !isNaN(obj.exgrate_plan)) {
			var ep = parseInt(obj.exgrate_plan);
			
			if (ep === 1) this.ProposedExchangeRate = true;
			else this.ProposedExchangeRate = false;
		}
		if (obj.trancurr2 && obj.trancurr2.length > 0) {
			this.TranCurrency2 = obj.trancurr2;
		}
		if (obj.exgrate2 && !isNaN(obj.exgrate2)) {
			this.ExchangeRate2 = parseFloat(obj.exgrate2);
		}
		if (obj.exgrate_plan2 && !isNaN(obj.exgrate_plan2)) {
			var ep2 = parseInt(obj.exgrate_plan2);
			
			if (ep2 === 1) this.ProposedExchangeRate2 = true;
			else this.ProposedExchangeRate2 = false;
		}
	};
	hih.FinanceDocument.prototype.buildRelationship = function(arDocType, arCurrency) {
		var that = this;
		if (arDocType && $.isArray(arDocType) && arDocType.length > 0) {
			$.each(arDocType, function(idx, obj){
				if (obj.ID === that.DocTypeID) {
					that.DocTypeObject = obj;
					return false;
				}
			});
		}
		if (arCurrency && $.isArray(arCurrency) && arCurrency.length > 0) {
			$.each(arCurrency, function(idx, obj){
				if (obj.Currency === that.TranCurrency) {
					that.TranCurrencyObject = obj;
				}
				if (that.TranCurrency2 && obj.Currency === that.TranCurrency2) {
					that.TranCurrency2Object = obj;
				}
			});
		}
	};
	hih.FinanceDocument.prototype.Verify = function($translate, locCurr, exgtoil) {
		var errMsgs = [];
		
		// Document type
		if (isNaN(this.DocTypeID) || this.DocTypeID === -1) {
			errMsgs.push($translate("Message.InvalidDocType"));
		}
		// Tran. date?
		// Maybe not necessary
		// Tran. currency
		this.TranCurrency = this.TranCurrency.trim();
		if (this.TranCurrency.length <= 0) {
			errMsgs.push($translate("Message.InvalidCurrency"));
		} else if (locCurr) {
			// Check for Foreign currency
			if( this.TranCurrency !== locCurr ) {
				if (isNaN(this.ExchangeRate) || this.ExchangeRate === 0.0 || this.ExchangeRate === 1.0) {
					errMsgs.push($translate("Message.InvalidExchangeRate"));
				}
			}
		}		
		// Amount
		// It's a runtime information, Maybe not necessary for checking
		// Desp.
		if (this.Desp.trim().length <= 0) {
			errMsgs.push($translate("Message.InvalidDescription"));
		}
		// Currency excahgne document.		
		if (this.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
			this.TranCurrency2 = this.TranCurrency2.trim();
			if (this.TranCurrency2.length <= 0) {
				errMsgs.push($translate("Message.InvalidCurrency"));
			} else if (locCurr) {
				// Check for Foreign currency
				if( this.TranCurrency2 !== locCurr ) {
					if (isNaN(this.ExchangeRate2) || this.ExchangeRate2 === 0.0 || this.ExchangeRate2 === 1.0) {
						errMsgs.push($translate("Message.InvalidExchangeRate"));
					}
				}
			}
		} else {
		}
		
		// Items
		this.TranAmount = 0.0;
		var uniqueIDs = [];
		for(var i = 0; i < this.Items.length; i ++) {
			var msg2 = this.Items[i].Verify($translate);
			if (msg2.length > 0) {
				Array.prototype.push.apply(errMsgs, msg2);
			}
			
			if (this.Items[i].TranTypeObject.ExpenseFlag) {
				if (this.Items[i].UseCurrency2 ) {
					if( this.TranCurrency2 !== locCurr ) {
						this.TranAmount -= parseFloat(this.Items[i].TranAmount_Org) / this.ExchangeRate2;
					} else {
						this.TranAmount -= parseFloat(this.Items[i].TranAmount_Org);
					}
				} else {
					if( this.TranCurrency !== locCurr ) {
						this.TranAmount -= parseFloat(this.Items[i].TranAmount_Org) / this.ExchangeRate;
					} else {
						this.TranAmount -= parseFloat(this.Items[i].TranAmount_Org);
					}					
				}				
			} else {
				if (this.Items[i].UseCurrency2 ) {
					if( this.TranCurrency2 !== locCurr ) {
						this.TranAmount += parseFloat(this.Items[i].TranAmount_Org) / this.ExchangeRate2;
					} else {
						this.TranAmount += parseFloat(this.Items[i].TranAmount_Org);
					}
				} else {
					if( this.TranCurrency !== locCurr ) {
						this.TranAmount += parseFloat(this.Items[i].TranAmount_Org) / this.ExchangeRate;
					} else {
						this.TranAmount += parseFloat(this.Items[i].TranAmount_Org);	
					}					
				}
			}

			if (this.DocTypeID === hih.Constants.FinDocType_Transfer) {				
				if($.inArray(this.Items[i].AccountID, uniqueIDs) === -1) {
					uniqueIDs.push(this.Items[i].AccountID);
				} else {
					errMsgs.push($translate("Message.DuplicateAccountsInTransferDoc"));
				}
			} else if (this.DocTypeID === hih.Constants.FinDocType_CurrExchange) {				
			}
		}
		if (this.DocTypeID === hih.Constants.FinDocType_Transfer) {
			this.TranAmount = hih.ModelUtility.Round2Two(this.TranAmount); 
			if (this.TranAmount !== 0.0) {
				// Transfer document shall be zero balance!
				errMsgs.push($translate("Message.InvalidTransferAmount"));
			}
		} else if(this.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
			this.TranAmount = hih.ModelUtility.Round2Two(this.TranAmount); 
			if (this.TranAmount > exgtoil) {
				// Transfer document shall be zero balance!
				errMsgs.push($translate("Message.InvalidTransferAmount"));
			}
		}
		
		return errMsgs;
	};
	hih.FinanceDocument.prototype.toJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "DocTypeObject" || i === "Items" || i === "TranCurrencyObject"
				|| i === "TranDate" || i === "TranAmount" || i === "TranCurrency2Object") 
				continue;
			
			if (i === "ProposedExchangeRate" || i === "ProposedExchangeRate2") {
				if (this[i]) forJSON[i] = 1;
				else forJSON[i] = 0;
			} else {
				forJSON[i] = this[i];	
			}			
		}
		// Tran Date
		forJSON.TranDate = hih.ModelUtility.DatabaseDateFormatter(this.TranDate);
		
		// Currency exchange document
		if (this.DocTypeID !== hih.Constants.FinDocType_CurrExchange) {
			delete forJSON.TranCurrency2;
			delete forJSON.ExchangeRate2;
			delete forJSON.ProposedExchangeRate2;
		}
		
		for(var j = 0 ; j < this.Items.length; ++j) {
			if (!$.isArray(forJSON.Items)) forJSON.Items = [];
			var jsonItem = this.Items[j].toJSONObject();
			if (jsonItem.ControlCenterID === -1) {
				delete jsonItem.ControlCenterID;
			}
			if (jsonItem.OrderID === -1) {
				delete jsonItem.OrderID;
			}
			if (this.DocTypeID === hih.Constants.FinDocType_CurrExchange) {
			}
			forJSON.Items.push(jsonItem);
		}
		
		return forJSON;
	};
	hih.FinanceDocument.prototype.toJSON = function() {
		var forJSON = this.toJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	// 8a. Finance temp document for downpayment
	hih.FinanceDPTempDoc = function FinanceDPTempDoc() {
		this.DocID = -1;
		this.RefDocID = -1;
		this.AccountID = -1;
		this.TranDate = new Date();
		this.TranTypeID = -1;
		this.Amount = 0.0; 
		this.ControlCenterID = -1;
		this.OrderID = -1;
		this.Desp = "";
		
		// Runtime object
		this.AccountObject = {};
		this.RefDocObject = {};
		this.TranTypeObject = {};
		this.ControlCenterObject = {};
		this.OrderObject = {};
	};
	hih.extend(hih.FinanceDPTempDoc, hih.Model);
	hih.FinanceDPTempDoc.prototype.setContent = function(obj) {
		this.DocID = parseInt(obj.docid);
        if (obj.refdocid) {
            this.RefDocID = parseInt(obj.refdocid);
        } else {
            this.RefDocID = -1;
        }		
		this.AccountID = parseInt(obj.accountid);
		this.TranDate = new Date(obj.trandate);
		this.TranTypeID = parseInt(obj.trantype);
		this.Amount = parseFloat(obj.tranamount);
        if (obj.ccid) {
            this.ControlCenterID = parseInt(obj.ccid);    
        } else {
            this.ControlCenterID = -1;
        }
		if (obj.orderid) {
            this.OrderID = parseInt(obj.orderid);
        } else {
            this.OrderID = -1;
        }		
	};
	hih.FinanceDPTempDoc.prototype.buildRelationship = function(arAccount, arTranType, arCC, arOrd) {
		
	};
	hih.FinanceDPTempDoc.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "AccountObject" || i === "RefDocObject" || i === "TranTypeObject"
				|| i === "TranDate" || i === "ControlCenterObject" || i === "OrderObject") 
				continue;
			
			forJSON[i] = this[i];	
		}
		// Tran Date
		forJSON.TranDate = hih.ModelUtility.DatabaseDateFormatter(this.TranDate);
		
		return forJSON;
	};
	hih.FinanceDPTempDoc.prototype.toJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
	// 9. Balance sheet report
	hih.FinanceReportBalanceSheet = function FinanceReportBalanceSheet() {
		this.AccountID = -1;
		this.DebitBalance = 0.0;
		this.CreditBalance = 0.0;
		this.Balance = 0.0;
		
		this.AccountObject = {};
	};
	hih.extend(hih.FinanceReportBalanceSheet, hih.Model);
	hih.FinanceReportBalanceSheet.prototype.setContent = function(obj) {
		this.AccountID = parseInt(obj.accountid);
		this.DebitBalance = parseFloat(obj.debitbalance).toFixed(2);
		this.CreditBalance = parseFloat(obj.creditbalance).toFixed(2);
		this.Balance = parseFloat(obj.balance).toFixed(2);
	};
	hih.FinanceReportBalanceSheet.prototype.buildRelationship = function(arAccount) {
		var that = this;
		if (arAccount && $.isArray(arAccount) && arAccount.length > 0) {
			$.each(arAccount, function(idx, obj){
				if (obj.ID === that.AccountID) {
					that.AccountObject = obj;
					return false;
				}
			});
		}
	};
	// 11. Report on CC
	hih.FinanceReportControlCenter = function FinanceReportControlCenter() {
		this.ControlCenterID = -1;
		this.TranDebitAmount = 0.0;
		this.TranCreditAmount = 0.0;
		this.TranAmount = 0.0;
		
		// Runtime information
		this.ControlCenterObject = {};
	};
	hih.extend(hih.FinanceReportControlCenter, hih.Model);
	hih.FinanceReportControlCenter.prototype.setContent = function(obj) {
		this.ControlCenterID = parseInt(obj.ccid);
		this.TranDebitAmount = parseFloat(obj.debitamt);
		this.TranCreditAmount = parseFloat(obj.creditamt);
		this.TranAmount = parseFloat(obj.tranamt);
		if (isNaN(this.TranAmount)) {
			this.TranAmount = 0.0;
		}
	};
	hih.FinanceReportControlCenter.prototype.buildRelationship = function(arCC) {
		var that = this;
		if (arCC && $.isArray(arCC) && arCC.length > 0) {
			$.each(arCC, function(idx, obj){
				if (obj.ID === that.ControlCenterID) {
					that.ControlCenterObject = obj;
					return false;
				}
			});
		}
	};
	// 12. Report on Order
	hih.FinanceReportOrder = function FinanceReportOrder() {
		this.OrderID = -1;
		this.DebitAmount = 0.0;
		this.CreditAmount = 0.0;
		this.Balance = 0.0;
		
		this.OrderObject = {};
	};
	hih.extend(hih.FinanceReportOrder, hih.Model);
	hih.FinanceReportOrder.prototype.setContent = function(obj) {
		this.OrderID = parseInt(obj.ordid);
		this.DebitAmount = parseFloat(obj.debitamt).toFixed(2);
		this.CreditAmount = parseFloat(obj.creditamt).toFixed(2);
		this.Balance = parseFloat(obj.balance).toFixed(2);
	};
	hih.FinanceReportOrder.prototype.buildRelationship = function(arOrder) {
		var that = this;
		if (arOrder && $.isArray(arOrder) && arOrder.length > 0) {
			$.each(arOrder, function(idx, obj){
				if (obj.ID === that.OrderID) {
					that.OrderObject = obj;
					return false;
				}
			});
		}
	};
	// 13. Report on tran type.
	hih.FinanceReportTranType = function FinanceReportTranType() {
		this.TranTypeID = -1;
		this.TranAmount = 0.0;
		
		// Runtime information
		this.TranTypeObject = {};
	};
	hih.extend(hih.FinanceReportTranType, hih.Model);
	hih.FinanceReportTranType.prototype.setContent = function(obj) {
		this.TranTypeID = parseInt(obj.id);
		this.TranAmount = parseFloat(obj.tranamt);
	};
	hih.FinanceReportTranType.prototype.buildRelationship = function(arTT) {
		var that = this;
		if (arTT && $.isArray(arTT) && arTT.length > 0) {
			$.each(arTT, function(idx, obj){
				if (obj.ID === that.TranTypeID) {
					that.TranTypeObject = obj;
					return false;
				}
			});
		}
	};	
	// 14. What's the Next?







    

	// =========================================================
	// Library part
	// =========================================================
    // 1. Lib Language
    hih.LibLanguage = function LibLanguage () {
        this.Language = "";
        this.Name = "";
        this.NativeName = "";
    };
    hih.extend(hih.LibLanguage, hih.Model);
    hih.LibLanguage.prototype.setContent = function(obj) {        
        this.Language = obj.lang;
        this.Name = obj.name;
        this.NativeName = obj.navname;
    };
    hih.LibLanguage.prototype.ToJSONObject = function() {
        var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i)) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
    };
	hih.LibLanguage.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
    // 2. Lib Person
    hih.LibPerson = function LibPerson() {
		this.ID = -1;
		this.Name = "";
		this.Others = "";
    };
    hih.extend(hih.LibPerson, hih.Model);
    hih.LibPerson.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.Others = obj.others;
	};
	hih.LibPerson.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i)) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};
	hih.LibPerson.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
    // 3. Lib Organization
    hih.LibOrganization = function LibOrganization() {
		this.ID = -1;
		this.Name = "";
		this.Others = "";
    };
    hih.extend(hih.LibOrganization, hih.Model);
    hih.LibOrganization.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.Others = obj.others;
	};
	hih.LibOrganization.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i)) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};
	hih.LibOrganization.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
    // 4. Lib Location
	hih.LibLocation = function LibLocation() {
		this.ID = -1;
		this.Name = "";
		this.Detail = "";
		this.Comment = "";
	};
	hih.extend(hih.LibLocation, hih.Model);
    hih.LibLocation.prototype.setContent = function(obj) {
		this.ID = parseInt(obj.id);
		this.Name = obj.name;
		this.Detail = obj.details;
		this.Comment = obj.comment;
	};
	hih.LibLocation.prototype.ToJSONObject = function() {
		var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i)) 
				continue;
			
			forJSON[i] = this[i];	
		}
		return forJSON;
	};
	hih.LibLocation.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
	};
    // 11. Lib Books
    // 11a. Name
    hih.LibBookName = function() {
        this.BookID = -1;
        this.NameID = -1;
        this.Lang = "";
        this.Name = "";
        
        // Runtime info
        this.LangName = "";
    };
    hih.extend(hih.LibBookName, hih.Model);
    hih.LibBookName.prototype.setContent = function(obj) {
        this.BookID = parseInt(obj.bookid);
        this.NameID = parseInt(obj.nameid);
        this.Lang = obj.lang;
        this.Name = obj.name;
        
        // Runtime info
        this.LangName = obj.langname;
    };
    hih.LibBookName.prototype.ToJSONObject = function() {
        var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "LangName" ) 
				continue;
			
			forJSON[i] = this[i];	
		}
        return forJSON;
    };
    hih.LibBookName.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
    // 11b. Languages
    hih.LibBookLang = function() {
        this.BookID = -1;
    };
    hih.extend(hih.LibBookLang, hih.LibLanguage);
    hih.LibBookLang.prototype.setContent = function(obj) {
        hih.LibLanguage.prototype.setContent.call(this, obj);
        
        this.Name = obj.langname;
        this.BookID = parseInt(obj.bookid);
    };
    hih.LibBookLang.prototype.ToJSONObject = function() {
        var forJSON = hih.LibLanguage.prototype.ToJSONObject.call(this);
        
		for(var i in this) {
			if (!this.hasOwnProperty(i)) 
				continue;
			
			forJSON[i] = this[i];	
		}
        return forJSON;        
    };
    hih.LibBookLang.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
    // 11c. Authors
    hih.LibBookAuthor = function() {
        this.BookID = -1;
        this.TranslatorFlag = false;
    };
    hih.extend(hih.LibBookAuthor, hih.LibPerson);
    hih.LibBookAuthor.prototype.setContent = function(obj) {
        hih.LibPerson.prototype.setContent.call(this, obj);
        
        this.TranslatorFlag = obj.tranflag;
        this.BookID = parseInt(obj.bookid);
    };
    hih.LibBookAuthor.prototype.ToJSONObject = function() {
        var forJSON = hih.LibPerson.prototype.ToJSONObject.call(this);
        forJSON.BookID = this.BookID;
        forJSON.AuthorID = this.ID;
        
        return forJSON;        
    };
    hih.LibBookAuthor.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
    // 11d. Presses
    hih.LibBookPress = function() {
        this.BookID = -1;
    };
    hih.extend(hih.LibBookPress, hih.LibOrganization);
    hih.LibBookPress.prototype.setContent = function(obj) {
        hih.LibOrganization.prototype.setContent.call(this, obj);
        
        this.BookID = parseInt(obj.bookid);
    };
    hih.LibBookPress.prototype.ToJSONObject = function() {
        var forJSON = hih.LibOrganization.prototype.ToJSONObject.call(this);
        forJSON.BookID = this.BookID;
        forJSON.PressID = this.ID;
        //delete forJSON.ID;
        
        return forJSON;          
    };
    hih.LibBookPress.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
    // 11e. Location
    hih.LibBookLocation = function() {
        this.BookID = -1;
    };
    hih.extend(hih.LibBookLocation, hih.LibLocation);
    hih.LibBookLocation.prototype.setContent = function(obj) {
        hih.LibLocation.prototype.setContent.call(this, obj);
        
        this.BookID = parseInt(obj.bookid);
    };
    hih.LibBookLocation.prototype.ToJSONObject = function() {
        var forJSON = hih.LibLocation.prototype.ToJSONObject.call(this);
        forJSON.BookID = this.BookID;
        forJSON.LocID = this.ID;
        //delete forJSON.ID;
        
        return forJSON;        
    };
    hih.LibBookLocation.prototype.ToJSON = function() {
		var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
    // 11f. Books
    hih.LibBook = function() {
        this.ID = -1;
        this.ISBN = "";
        this.Others = "";
        
        this.Authors = []; // Authors
        this.Languages = []; // Languages
        this.Presses = []; // Presses
        this.Names = []; // Names
        this.Locations = []; // Locations
    };
    hih.extend(hih.LibBook, hih.Model);
    hih.LibBook.prototype.setContent = function(obj) {
        this.ID = parseInt(obj.id);
        this.ISBN = obj.isbn;
        this.Others = obj.others;
    };
    hih.LibBook.prototype.Verify = function() {
        
    };
    hih.LibBook.prototype.ToJSONObject = function() {
        var forJSON = {};
		for(var i in this) {
			if (!this.hasOwnProperty(i) || i === "Authors" || i === "Languages"
				|| i === "Presses" || i === "Names" || i === "Locations") 
				continue;
			
			forJSON[i] = this[i];	
		}
		
		// Names
		for(var j = 0 ; j < this.Names.length; ++j) {
			if (!$.isArray(forJSON.Names)) forJSON.Names = [];
			var jsonName = this.Names[j].ToJSONObject();
			forJSON.Names.push(jsonName);
		}
		// Languages
		for(var j = 0 ; j < this.Languages.length; ++j) {
			if (!$.isArray(forJSON.Languages)) forJSON.Languages = [];
			var jsonLang = this.Languages[j].ToJSONObject();
			forJSON.Languages.push(jsonLang);
		}
		
		// Authors
		for(var j = 0 ; j < this.Authors.length; ++j) {
			if (!$.isArray(forJSON.Authors)) forJSON.Authors = [];
			var jsonAuthor = this.Authors[j].ToJSONObject();
			forJSON.Authors.push(jsonAuthor);
		}
		// Presses
		for(var j = 0 ; j < this.Presses.length; ++j) {
			if (!$.isArray(forJSON.Presses)) forJSON.Presses = [];
			var jsonPress = this.Presses[j].ToJSONObject();
			forJSON.Presses.push(jsonPress);
		}
		// Locations
		for(var j = 0 ; j < this.Locations.length; ++j) {
			if (!$.isArray(forJSON.Locations)) forJSON.Locations = [];
			var jsonLoc = this.Locations[j].ToJSONObject();
			forJSON.Locations.push(jsonLoc);
		}
		
        return forJSON;
    };
    hih.LibBook.prototype.ToJSON = function() {
        var forJSON = this.ToJSONObject();
		if (forJSON) {
			return JSON && JSON.stringify(forJSON) || $.toJSON(forJSON);
		}
		return JSON && JSON.stringify(this) || $.toJSON(this);
    };
}());

