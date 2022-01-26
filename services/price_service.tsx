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
     * 
     * 
     * @param item_id 
     * @returns 
     */
    public getAllPrices = (item_id: number): Promise<AxiosResponse<Array<IPrice>>> => {
        return this.http.get(`Prices/${item_id}`);
    }
    
    /**
     * 
     * 
     * @param price_id 
     * @returns 
     */
    public deletePrice = (price_id: number): Promise<AxiosResponse> => {
        return this.http.delete(`Prices/${price_id}`);
    }
}
