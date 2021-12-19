import { IPrice } from "../models/price.model";
import { deleteRequest, get } from "../utils/api_const";

// Price endpoints
export const getAllPrices = (item_id: number | undefined) => {
    return get('Prices/' + item_id);
}

export const deletePrice = (price: IPrice) => {
    return deleteRequest('Prices/' + price.id);
}