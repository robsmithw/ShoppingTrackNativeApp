import { AxiosInstance, AxiosResponse } from "axios";
import { useMemo } from "react";
import { ApiService } from "./apiService";
import { createRoute } from "../utils/api_const";
import IStore from "../models/store.model";

export class StoreService {
    
    private apiService: ApiService;
    private http: AxiosInstance;

    constructor(readonly bearer: string) {
        this.apiService = new ApiService(this.bearer);
        this.http = this.apiService.getAxiosInstance();
    }

    /**
     * Returns all stores.
     * 
     * @returns The result of a get request to the endpoint `Stores`
     */
    public getAllStores = (): Promise<AxiosResponse<Array<IStore>>> => {
        return this.http.get('Stores');
    }
    
    /**
     * Returns the stores with items for the specified user.
     *
     * @param user_id - The user's id
     * @returns The result of a get request to the endpoint `Stores/GetStoresWithItemsByUser?userId={user_id}`
     */
    public getStoresWithItemsByUser = (user_id: number): Promise<AxiosResponse<Array<IStore>>> => {
        const route = createRoute('Stores/GetStoresWithItemsByUser', [{paramName: 'userId', value: user_id}]);
        return this.http.get(route);
    }
}