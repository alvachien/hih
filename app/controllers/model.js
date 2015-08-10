/* global $ */
/* global angular */
(function() {
    "use strict";

	/* Root Model */
	function HIHModel() {
		this.CreatedAt = new Date();
		this.CreatedBy = {};
	};
	HIHModel.prototype.Version = "1.0";
	
	/* Method 1: using apply(or call) in the children's constructor */
	/* User */
	function HIHUser() {
		HIHModel.apply(this, arguments);
		this._super = HIHModel.prototype;
		
		this.UserID = "";
	};
	
	/* Method 2: changing the prototype */
	/* Learn Object */
	function HIHLearnObject() {
		this.prototype = new HIHModel();
		this.prototype.constructor = HIHLearnObject;
		
	};
	
	/* Method 3: using the prototype of superclass directly in children class */
	/* 	Risk: any changes on the children class's prototype will impact the super class!!! */
	
	/* Method 4: using the prototype of superclass but assign it to an empty instance */
    /** Utility methods 
     * @Child: instance of child class;
     * @Parent: instance of parent class;
     */
    function extend(Child, Parent) {
        /* */
		var OOP = function() {};
		OOP.prototype = Parent.prototype;
		
　　　　 Child.prototype = new OOP();
		Child.prototype.constructor = Child;
		
		Child._super = Parent.prototype;
　　}

	/* Learn Category */
	var HIHLearnCategory = {};
	extend(HIHLearnCategory, HIHModel);
	
	/* Method 5: Using the copying all properties from superclass to childclass  */
	function extend_copy(Child, Parent) {
		var p = Parent.prototype;
		var c = Child.prototype;
		
		for(var i in p) {
			c[i] = p[i];
		}
		c._super = p;
	};
	function extend_deepcopy(Child, Parent) {
		var p = Parent.prototype;
		var c = Child.prototype;
		for(var i in p) {
			if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array)? [] : {};
				extend_deepcopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		c._super = p;
	};
	
	/* Method 6: Minimalist approach from Gabor de Mooij */
	/* Learn History */
	var HIHLearnHistory = {
		createNew: function() {
			// Inherit from HIHModel first
			var lrnhist = new HIHModel();
			
			// Other fields
			
			return lrnhist;
		}	
	};
}());
