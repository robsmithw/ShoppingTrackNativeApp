import { isUndefinedOrNull } from './utils';

import { API_BASE } from '@env'

const _bearerTokenPrefix = 'Bearer';

// Helper functions
export const get = async (endpoint: string, bearer: string | null, params?: IGetParams[] | undefined): Promise<any> => {
    let data: RequestInit = {
        method: 'GET',
        headers: createHeaders(bearer)
    }
    
    let fullEndpointPath: string = constructEndpoint(endpoint, params);
    
    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

export const post = async (endpoint: string, body: any, bearer: string | null): Promise<any> => {
    let data: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: createHeaders(bearer)
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

export const put = async (endpoint: string, body: any, bearer: string | null): Promise<any> => {
    let data: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: createHeaders(bearer)
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

export const deleteRequest = async (endpoint: string, bearer: string | null): Promise<any> => {
    let data: RequestInit = {
        method: 'DELETE',
        headers: createHeaders(bearer)
    }
    let fullEndpointPath: string = constructEndpoint(endpoint, undefined);

    const response = await fetch(fullEndpointPath, data);
    return await response.json();
}

const createHeaders = (bearer: string | null): HeadersInit => {
    let headers: HeadersInit = {};
    if (bearer !== null){
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `${_bearerTokenPrefix} ${bearer}`
        }
    }
    else {
        headers = {
            'Content-Type': 'application/json'
        }
    }
    return headers;
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

export const createRoute = (route: string, params: Array<IGetParams>): string => {
    let completeRoute: string = route;
    if (!isUndefinedOrNull(params)){
        let cnt: number = 0;
        params?.forEach(
            (param: IGetParams) => {
                if (cnt == 0){
                    completeRoute += '?' + param.paramName + '=' + param.value;
                }
                else{
                    completeRoute += "&" + param.paramName + '=' + param.value;
                }
                cnt++;
            }
        );
        return completeRoute;
    }
    
    return completeRoute;
}

interface IGetParams {
    paramName: string,
    value: any
}