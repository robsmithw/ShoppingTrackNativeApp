import { get } from "../utils/api_const";

// Store endpoints
/**
 * Returns all stores.
 * 
 * @param bearer The bearer token of authorized user
 * @returns The result of a get request to the endpoint `Stores`
 */
export const getAllStores = (bearer: string | null): Promise<any> => {
    return get('Stores', bearer, undefined);
}

/**
   * Returns the stores with items for the specified user.
   *
   *
   * @param user_id - The user's id
   * @param bearer - The bearer token of authorized user
   * @returns The result of a get request to the endpoint `Stores/GetStoresWithItemsByUser?userId={user_id}`
   */
export const getStoresWithItemsByUser = (user_id: number | null, bearer: string | null): Promise<any> => {
    return get('Stores/GetStoresWithItemsByUser', bearer, [{paramName: 'userId', value: user_id}]);
}