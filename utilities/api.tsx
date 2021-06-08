import IItem from '../models/item.model';
import { IPrice } from '../models/price.model';
import { User } from '../models/user.model';

import { isUndefinedOrNull } from './utils';

import { API_BASE } from '@env'


// Store endpoints
export const getAllStores = (): Promise<any> => {
    return get('Stores', undefined);
}

export const getStoresWithItemsByUser = (user_id: number): Promise<any> => {
    return get('Stores/GetStoresWithItemsByUser', [{paramName: 'userId', value: user_id}]);
}

// User endpoints
export const login = (attemptedLogin: User): Promise<any> => {
    return post('User/Login', attemptedLogin);
}

export const register = (registerUser: User): Promise<any> => {
    return post('User/Register', registerUser);
}

// Item endpoints
export const getItemsForUser = (user_id: number): Promise<any> => {
    return get('Items', [{paramName: 'user_id', value: user_id}]);
}

export const getItemsForUserByStore = (user_id: number, store_id: number): Promise<any> => {
    return get('Items/GetItemsByStoreId', [{paramName: 'storeId', value: store_id}, {paramName: 'userId', value: user_id}])
}

export const addItem = (item: IItem) => {
    return post('Items', item);
}

export const updateItem = (item: IItem) => {
    return put('Items/' + item.itemId, item);
}

export const deleteItem = (item: IItem) => {
    return deleteRequest('Items/' + item.itemId);
}

// Price endpoints
export const getAllPrices = (item_id: number | undefined) => {
    return get('Prices/' + item_id);
}

export const deletePrice = (price: IPrice) => {
    return deleteRequest('Prices/' + price.id);
}

// Helper functions
const get = async (endpoint: string, params?: IGetParams[] | undefined): Promise<any> => {
    let fullEndpointPath: string = constructEndpoint(endpoint, params);
    
    const response = await fetch(fullEndpointPath);
    return await response.json();
}

const post = async (endpoint: string, body: any): Promise<any> => {
    let data: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

const put = async (endpoint: string, body: any): Promise<any> => {
    let data: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

const deleteRequest = async (endpoint: string): Promise<any> => {
    let data: RequestInit = {
        method: 'DELETE'
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

const constructEndpoint = (endpointPath: string, params: IGetParams[] | undefined): string => {
    let endpoint: string = API_BASE + endpointPath;
    if (!isUndefinedOrNull(params)){
        let cnt: number = 0;
        params?.forEach(
            (param: IGetParams) => {
                if (cnt == 0){
                    endpoint += '?' + param.paramName + '=' + param.value;
                }
                else{
                    endpoint += "&" + param.paramName + '=' + param.value;
                }
                cnt++;
            }
        );
        return endpoint;
    }
    
    return endpoint;
}

interface IGetParams {
    paramName: string,
    value: any
}