import { AxiosResponse } from "axios";
import { useMemo } from "react";
import { IPrice } from "../models/price.model";
import { ApiService } from "./apiService";

export class PriceService {

    constructor(private readonly bearer: string) {}


    private apiService = useMemo(() => new ApiService(this.bearer), [this.bearer]);
    private http = this.apiService.getAxiosInstance();

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