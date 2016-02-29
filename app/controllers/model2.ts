class ModelUtility {
    static LearnHistorySplitChar: string = "_";
}

interface IMaintainableObject {
    ObjectStatus: number;
}

class BaseModel2 implements IMaintainableObject {
    private _createdAt: any;
    private _createdBy: any;
    private _versionInfo: string;
    ObjectStatus: number;

    get CreatedAt(): any {
        return this._createdAt;
    }
    set CreatedAt(crted: any) {
        this._createdAt = crted;
    }
    get CreatedBy(): any {
        return this._createdBy;
    }
    set CreatedBy(crtby: any) {
        this._createdBy = crtby;
    }
    get Version(): string {
        return this._versionInfo;
    }
    set Version(ver: string) {
        this._versionInfo = ver;
    }

    constructor() {
        this.CreatedAt = new Date();
        this.CreatedBy = {};
    }
}

class User extends BaseModel2 {
    private _userID: string;
    private _displayAs: string;

    get UserID(): string {
        return this._userID;
    }
    set UserID(usrID: string) {
        this._userID = usrID;
    }
    get DisplayAs(): string {
        return this._displayAs;
    }
    set DisplayAs(disas: string) {
        this._displayAs = disas;
    }

    constructor() {
        super();

        this.UserID = "";
        this.DisplayAs = "";
    }
}


