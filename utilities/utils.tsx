import React from "react";

import { StyleProp, View, ViewStyle, Button, NativeSyntheticEvent, NativeTouchEvent, Alert, TouchableHighlight, Text } from "react-native";

import IStore from "../models/store.model";


export function isUndefinedOrNull(value: any): boolean {
    if(value == null){
        return true;
    }

    if(value === null){
        return true;
    }

    if(typeof value === 'undefined'){
        return true;
    }

    return false;
}

export const getStoreNameById = (stores: IStore[], store_id: number): string => {
    //default in case of null, undefined, or no match
    let store_name: string = "none";

    if(!isUndefinedOrNull(stores)){
        stores.forEach(
            (store: IStore) => {
                if (store.storeId == store_id){
                    store_name = store.name;
                }
            }
        )
    }

    return store_name;
}

export const getStoreIdByName = (stores: IStore[], store_name: string): number => {
    let store_id: number = 0;

    if(!isUndefinedOrNull(stores)){
        stores.forEach(
            (store: IStore) => {
                if (store.name == store_name){
                    store_id = store.storeId;
                }
            }
        )
    }

    return store_id;
}

export const createErrorAlert = (message: string) => {
    Alert.alert(
        "Error occured",
        message,
        [
          { text: "OK" }
        ],
        { cancelable: false }
    );
}

export const formatString = (type: string, toFormat: any, stores?: IStore[]): string => {
    let stringToDisplay: string = "";
    
    if(type == 'store'){
        if(isUndefinedOrNull(toFormat) || Number(toFormat) == 0){
            stringToDisplay = `Store: No store specified.`;
        }
        else{
            if (stores != undefined){
                stringToDisplay = `Store: ${getStoreNameById(stores, Number(toFormat))}`;
            }
            else{
                stringToDisplay = `Store: Error displaying store.`;
            }
        }
    }
    if(type == 'previous_store' || type == 'current_store'){
        let store_type: string = "Previous Store";
        if (type == 'current_store'){
            store_type = "Current Store";
        }
        if(isUndefinedOrNull(toFormat) || Number(toFormat) == 0){
            stringToDisplay = `${store_type}: No store specified.`;
        }
        else{
            if (stores != undefined){
                stringToDisplay = `${store_type}: ${getStoreNameById(stores, Number(toFormat))}`;
            }
            else{
                stringToDisplay = `${store_type}: Error displaying store.`;
            }
        }
    }
    if(type == 'date'){
        stringToDisplay = "Date of Price: " + new Date(toFormat.toString());
    }
    
    return stringToDisplay;
}

export const convertPriceStringToNumber = (price_string: string): number => {
    return Number(price_string.replace(',', ''));
}

export interface IStorePickListProps {
    value: string,
    stores: IStore[]
}