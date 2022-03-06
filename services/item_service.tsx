import { AxiosInstance, AxiosResponse } from "axios";
import IItem, { Item } from "../models/item.model";
import { createRoute } from "../utils/api_const";
import { ApiService } from "./apiService";

export class ItemService {

    private apiService: ApiService;
    private http: AxiosInstance;

    constructor(readonly bearer: string) {
        this.apiService = new ApiService(this.bearer);
        this.http = this.apiService.getAxiosInstance();
    }

    /**
     * Makes a GET request to API to get items for a specified user
     * 
     * @param user_id The specified user's id
     * @returns An array of items for the specified user
     */
    public getItemsForUser = (user_id: string): Promise<AxiosResponse<Array<IItem>>> => {
        const route = createRoute('Items', [{paramName: 'userId', value: user_id}]);
        return this.http.get(route);
    }
    
    /**
     * Makes a GET request to the API to get items for a specified user & a specified store
     * 
     * @param store_id The specified store's id
     * @param user_id The specified user's id
     * @returns An array of items for the specified user & specified store
     */
    public getItemsForUserByStore = (store_id: string, user_id: string): Promise<AxiosResponse<Array<IItem>>> => {
        const route = createRoute('Items/GetItemsByStoreId', [{paramName: 'storeId', value: store_id}, {paramName: 'userId', value: user_id}]);
        return this.http.get(route);
    }

    /**
     * Makes a POST request to the APi to add a new item
     * 
     * @param item The item to add
     * @returns The created item from the API
     */
    public addItem = (item: Item): Promise<AxiosResponse<IItem>> => {
        return this.http.post('Items', item);
    }

    /**
     * Makes a PUT request to the API to update the item
     * 
     * @param item The item to update
     * @returns The updated item from the API
     */
    public updateItem = (item: Item): Promise<AxiosResponse<IItem>> => {
        return this.http.put(`Items/${item.id}`, item);
    }

    /**
     * Makes a DELETE request to the API to delete the item
     * 
     * @param item The item to delete
     * @returns AxiosResponse from the request
     */
    public deleteItem = (item: Item): Promise<AxiosResponse> => {
        return this.http.delete(`Items/${item.id}`);
    }
}
