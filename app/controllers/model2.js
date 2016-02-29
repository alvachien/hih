var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelUtility = (function () {
    function ModelUtility() {
    }
    ModelUtility.LearnHistorySplitChar = "_";
    return ModelUtility;
}());
var BaseModel2 = (function () {
    function BaseModel2() {
        this.CreatedAt = new Date();
        this.CreatedBy = {};
    }
    Object.defineProperty(BaseModel2.prototype, "CreatedAt", {
        get: function () {
            return this._createdAt;
        },
        set: function (crted) {
            this._createdAt = crted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseModel2.prototype, "CreatedBy", {
        get: function () {
            return this._createdBy;
        },
        set: function (crtby) {
            this._createdBy = crtby;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseModel2.prototype, "Version", {
        get: function () {
            return this._versionInfo;
        },
        set: function (ver) {
            this._versionInfo = ver;
        },
        enumerable: true,
        configurable: true
    });
    return BaseModel2;
}());
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.call(this);
        this.UserID = "";
        this.DisplayAs = "";
    }
    Object.defineProperty(User.prototype, "UserID", {
        get: function () {
            return this._userID;
        },
        set: function (usrID) {
            this._userID = usrID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "DisplayAs", {
        get: function () {
            return this._displayAs;
        },
        set: function (disas) {
            this._displayAs = disas;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}(BaseModel2));
//# sourceMappingURL=model2.js.map