export class User {
    public username: string;
    public user_Id: number;
    public email: string;
    public password: string;
    public admin: boolean;
    public validated: boolean;

    constructor(username?: string, password?: string, email?: string){
        this.username = username || "";
        this.email = email || "";
        this.password = password || "";
        this.user_Id = 0;
        this.admin = false;
        this.validated = false;
    }
}

export interface IUser {
    username: string,
    user_Id: number,
    email: string,
    password: string,
    admin: boolean,
    validated: boolean
}

export interface ILoginResponse {
    accessToken: string
    userId: number | null
}