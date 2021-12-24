import { AxiosInstance, AxiosResponse } from "axios";
import { useMemo } from "react";
import IItem from "../models/item.model";
import { createRoute } from "../utils/api_const";
import { ApiService } from "./apiService";

export class ItemService {

    private apiService: ApiService;
    private http: AxiosInstance;

    constructor(readonly bearer: string) {
        this.apiService = useMemo(() => new ApiService(this.bearer), [this.bearer]);
        this.http = this.apiService.getAxiosInstance();
    }

    /**
     * Makes a GET request to API to get items for a specified user
     * @param user_id The specified user's id
     * @returns An array of items for the specified user
     */
    public getItemsForUser = (user_id: number): Promise<AxiosResponse<Array<IItem>>> => {
        const route = createRoute('Items', [{paramName: 'user_id', value: user_id}]);
        return this.http.get(route);
    }
    
    /**
     * Makes a GET request to the API to get items for a specified user & a specified store
     * @param store_id The specified store's id
     * @param user_id The specified user's id
     * @returns An array of items for the specified user & specified store
     */
    public getItemsForUserByStore = (store_id: number, user_id: number): Promise<AxiosResponse<Array<IItem>>> => {
        const route = createRoute('Items/GetItemsByStoreId?storeId', [{paramName: 'storeId', value: store_id}, {paramName: 'userId', value: user_id}]);
        return this.http.get(route);
    }

    /**
     * Makes a POST request to the APi to add a new item
     * @param item The item to add
     * @returns The created item from the API
     */
    public addItem = (item: IItem): Promise<AxiosResponse<IItem>> => {
        return this.http.post('Items', item);
    }

    /**
     * Makes a PUT request to the API to update the item
     * @param item The item to update
     * @returns The updated item from the API
     */
    public updateItem = (item: IItem): Promise<AxiosResponse<IItem>> => {
        return this.http.put(`Items/${item.itemId}`, item);
    }

    /**
     * Makes a DELETE request to the API to delete the item
     * @param item The item to delete
     * @returns AxiosResponse from the request
     */
    public deleteItem = (item: IItem): Promise<AxiosResponse> => {
        return this.http.delete(`Items/${item.itemId}`);
    }
}

// Item endpoints
// export const getItemsForUser = (user_id: number, bearer: string | null): Promise<any> => {
//     return get('Items', bearer, [{paramName: 'user_id', value: user_id}]);
// }

// export const getItemsForUserByStore = (user_id: number, store_id: number): Promise<any> => {
//     return get('Items/GetItemsByStoreId', [{paramName: 'storeId', value: store_id}, {paramName: 'userId', value: user_id}])
// }

// export const addItem = (item: IItem) => {
//     return post('Items', item);
// }

// export const updateItem = (item: IItem) => {
//     return put('Items/' + item.itemId, item);
// }

// export const deleteItem = (item: IItem) => {
//     return deleteRequest('Items/' + item.itemId);
// }