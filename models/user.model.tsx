import { v4 as uuid, NIL as emptyGuid } from "uuid";

export class User implements IUser {
    public id: string = uuid();
    public createdDate: Date = new Date();
    public modifiedDate?: Date | undefined;
    public isDeleted: boolean = false;
    public username: string;
    public email: string;
    public password: string;
    public admin: boolean;
    public validated: boolean;

    constructor(username?: string, password?: string, email?: string){
        this.username = username || "";
        this.email = email || "";
        this.password = password || "";
        this.admin = false;
        this.validated = false;
    }
}

export interface IUser extends IEntity {
    username: string,
    email: string,
    password: string,
    admin: boolean,
    validated: boolean
}

export interface ILoginResponse {
    accessToken: string
    userId: string | null
}