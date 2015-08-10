/* global $ */
/* global angular */
(function() {
    "use strict";
    
    var hih = window.hih || (window.hih = {});

	/* Root Model */
	hih.Model = function() {
		this.CreatedAt = new Date();
		this.CreatedBy = {};
	};
	hih.Model.prototype.Version = "1.0";
	
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
		this.prototype.setContent = function(id, ctgyid, ctgyname, nam, cont) {
			this.ID = id;
			this.CategoryID = ctgyid;
			this.CategoryName = ctgyname;
			this.Name = nam;
			this.Content = cont;
		};
		
		// Attributes
		this.ID = 0;
		this.CategoryID = 0;
		this.CategoryName = "";
		this.Name = "";
		this.Content = "";
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
        /* */
		var OOP = function() {};
		OOP.prototype = Parent.prototype;
		
　　　　 	Child.prototype = new OOP();
		Child.prototype.constructor = Child;
		
		Child._super = Parent.prototype;
　　}

	/* Learn Category */
	hih.LearnCategory = {};
	hih.extend(hih.LearnCategory, hih.Model);
	
	/* Method 5: Using the copying all properties from superclass to childclass  */
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
		createNew: function() {
			// Inherit from Model first
			var lrnhist = new hih.Model();
			
			// Other fields
			
			return lrnhist;
		}	
	};
	
	hih.LearnAward = {
		createNew: function() {
			var lrnawd = new hih.Model();
			
			return lrnawd;
		}	
	};
}());

