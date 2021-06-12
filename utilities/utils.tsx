import React from "react";

import { StyleProp, View, ViewStyle, Button, NativeSyntheticEvent, NativeTouchEvent, Alert } from "react-native";

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

export class StyledButton extends React.Component<IStyledButtonProps> {
    constructor(props: IStyledButtonProps){
        super(props)
    }

    render(): JSX.Element {
        return (
            <View style={this.props.styles}>
                <Button color="#85bb65" title={this.props.title} onPress={this.props.onPress} disabled={this.props.disabled}/>
            </View>
        )
    }
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

// export class StorePickList extends React.Component<IStorePickListProps> {
//     constructor(props: IStorePickListProps){
//         super(props)
//     }

//     render(): JSX.Element {
//         return (
//             <Picker
//                 selectedValue={this.props.value}
//                 style={{height: 50, width: 150}}
//                 onValueChange={(itemValue, itemIndex) => {
//                     this.props.value = itemValue.toString();
//                 }}
//             >
//                 <Picker.Item label='None' value='none' />
//                 {this.props.stores.map((prop: IStore, key: number) => {
//                     return (
//                         <Picker.Item label={prop.name} value={prop.name} key={key} />
//                     );
//                 })}
//             </Picker>
//         )
//     }
// }

// // const StorePicklist = (): JSX.Element => {
// //     return (
//         <Picker
//             selectedValue={selectedStore}
//             style={{height: 50, width: 150}}
//             onValueChange={(itemValue, itemIndex) => {
//                 setSelectedStore(itemValue.toString());
//             }}
//         >
//             <Picker.Item label='None' value='none' />
//             {stores.map((prop: IStore, key: number) => {
//                 return (
//                     <Picker.Item label={prop.name} value={prop.name} key={key} />
//                 );
//             })}
//         </Picker>
// //     );
// // }

export interface IStyledButtonProps {
    styles: StyleProp<ViewStyle>,
    title: string,
    onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void,
    disabled?: boolean | undefined
}

export interface IStorePickListProps {
    value: string,
    stores: IStore[]
}