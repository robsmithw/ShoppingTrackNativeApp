import { User, ILoginResponse, IUser } from "../models/user.model";
import { AxiosInstance, AxiosResponse } from "axios";
import { useMemo } from "react";
import { ApiService } from "./apiService";

export class UserService {

    private apiService: ApiService;
    private http: AxiosInstance;

    constructor() {
        this.apiService = new ApiService();
        this.http = this.apiService.getAxiosInstance();
    }



    /**
     * Makes a POST request to API to attempt to login with specified credentials
     * 
     * @param attempted_login Specified credentials to attempt to sign in with
     * @returns The login response with access token and userId
     */
    public login = (attempted_login: User): Promise<AxiosResponse<ILoginResponse>> => {
        return this.http.post('User/Login', attempted_login);
    }
    
    /**
     * Makes a POST request to API to attempt to register a user with specified credentials
     * 
     * @param register_user Specified credentials to attempt to register a user with
     * @returns The User if the request succeeds
     */
    public register = (register_user: User): Promise<AxiosResponse<IUser>> => {
        return this.http.post('User/Register', register_user);
    }
}