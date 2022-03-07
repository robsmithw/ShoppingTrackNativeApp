import { AxiosInstance, AxiosResponse } from "axios";
import { IPrice } from "../models/price.model";
import { ApiService } from "./apiService";

export class PriceService {

    private apiService: ApiService;
    private http: AxiosInstance;

    constructor(readonly bearer: string) {
        this.apiService = new ApiService(this.bearer);
        this.http = this.apiService.getAxiosInstance();
    }

    /**
     * Makes a GET request to the API to get prices for a specified item
     * @param item_id The specified item's id
     * @returns An array of prices for the specified item
     */
    public getAllPrices = (item_id: string): Promise<AxiosResponse<Array<IPrice>>> => {
        return this.http.get(`Prices/${item_id}`);
    }
    
    /**
     * Makes a DELETE request to the API to delete price for a specified price
     * @param price_id The specified price id
     * @returns An axios response
     */
    public deletePrice = (price_id: string): Promise<AxiosResponse> => {
        return this.http.delete(`Prices/${price_id}`);
    }
}
