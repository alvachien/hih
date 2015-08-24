/* global $ */
/* global angular */
(function() {
    "use strict";
    
    var hih = window.hih || (window.hih = {});

	/* Constants */
	hih.Constants = {
		LearnHistorySplitChar: "_",
		LearnCategorySplitChar: " > ",
		IDSplitChar: ","
	};
	
	/* Root Model */
	hih.Model = function() {
		this.CreatedAt = new Date();
		this.CreatedBy = {};
	};
	hih.Model.prototype.Version = "1.0";
	hih.Model.prototype.Verify = function() {
		// Verify the data, returns the error messages!
		return [];	
	};
	
	/* Method 1: using apply(or call) in the children's constructor */
	/* User */
	hih.User = function() {
		hih.Model.apply(this, arguments);
		this._super = hih.Model.prototype;
		
		this.UserID = "";
		this.DisplayAs = "";
	};
	hih.User.prototype.setContent = function(user, dispas) {
		this.UserID = user;
		this.DisplayAs = dispas;
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
		this.CategoryName = "";
		this.Name = "";
		this.Content = "";
	};
	hih.LearnObject.prototype.setContent = function(id, ctgyid, ctgyname, nam, cont) {
		this.ID = parseInt(id);
		this.CategoryID = parseInt(ctgyid);
		this.CategoryName = ctgyname;
		this.Name = nam;
		this.Content = cont;
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
		this.Parent = {};
		this.Text = "";
		this.Comment = ""; 
		
		// Runtime information
		this.FullDisplayText = "";
	};
	hih.extend(hih.LearnCategory, hih.Model);
	hih.LearnCategory.prototype.setContent = function(id, parent, txt, cmt) {
		this.ID = parseInt(id);
		this.ParentForJsTree = parent;
		if (!parent) {
			this.ParentID = -1;
		} else {
			if (typeof parent === "string" && parent === "#") {
				this.ParentID = -1; // Root node!
			} else {
				this.ParentID = parseInt(parent);
			}			
		}
		this.Text = txt;
		this.Comment = cmt;
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
		_setContent: function(data) {
			// userid, displayas, objectid, objectname, categoryid, categoryname, learndate, objectcontent, comment
			this.UserID = data.userid;
			this.UserDisplayAs = data.displayas;
			
			this.ObjectID = parseInt(data.objectid);
			this.ObjectName = data.objectname;
			
			this.CategoryID = parseInt(data.categoryid);
			this.CategoryName = data.categoryname;
			
			this.LearnDate = data.learndate;
			this.ObjectContent = data.objectcontent;
			this.Comment = data.comment;
		},
		createNew: function() {
			// Inherit from Model first
			var lrnhist = new hih.Model();
			
			// Other fields
			lrnhist.UserID = "";
			lrnhist.UserDisplayAs = "";
			lrnhist.UserObject = {};
			lrnhist.ObjectID = -1;
			lrnhist.ObjectName = "";
			lrnhist.LearnObject = {};
			lrnhist.CategoryID = -1;
			lrnhist.CategoryName = "";
			lrnhist.LearnCategory = {};
			lrnhist.LearnDate = new Date();
			lrnhist.ObjectContent = "";
			lrnhist.Comment = "";
			
			lrnhist._super = hih.Model.prototype;
			lrnhist.setContent = hih.LearnHistory._setContent;
			
			return lrnhist;
		}	
	};
	
	/* Learn Award */
	hih.LearnAward = function() {
		// Attributes
		this.ID = -1;
		this.UserID = "";
		this.UserDisplayAs = "";
		this.UserObject = {};
		this.AwardDate = new Date();
		this.Score = 0.0;
		this.Reason = "";
	};
	// Build prototype chain
	hih.extend(hih.LearnAward, hih.Model);
	hih.LearnAward.prototype.setContent = function(obj) {
		// id, userid, displayas, adate, score, reason
		this.ID = parseInt(obj.id);
		this.UserID = obj.userid;
		this.UserDisplayAs = obj.displayas;
		this.AwardDate = obj.adate;
		this.Score = obj.score;
		this.Reason = obj.reason;
	};
	
	// Finance part
	// 1. Currency
	hih.Currency = function Currency() {
		this.Currency = "";
		this.Name = "";
		this.Symbol = "";
	};
	hih.extend(hih.Currency, hih.Model);
	hih.Currency.prototype.setContent = function(obj) {
		this.Currency = obj.curr;
		this.Name = obj.name;
		this.Symbol = obj.symbol;
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
	hih.FinanceAccount.prototype.Verify = function() {
		var errMsgs = [];
		
		// Call to the super class's verify
		errMsgs = this._super.Verify.call(this);
		if (errMsgs.length > 0)
			return errMsgs; 
		
		// Now do the verify in Frontend part
		if (this.CategoryID === -1) {
			// No category is assigned
			errMsgs.push("Message.InvalidCategory");
		}
		
		this.Name = this.Name.trim();
		if (this.Name.length <= 0) {
			errMsgs.push("Message.InvalidName");
		}
		
		return errMsgs;
	};
	// 5. Controlling Center
	// 6. Document Item
	// 7. Document
	// 8. 
}());

