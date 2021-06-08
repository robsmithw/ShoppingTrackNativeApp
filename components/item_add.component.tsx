import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Button } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { ItemAddScreenNavigationProp, ItemAddScreenRouteProp, redirectToHome } from '../models/navigation.model';
import { addItem, getAllStores, getItemsForUser } from '../utilities/api';
import IStore from '../models/store.model';
import IItem, { getDefaultItem } from '../models/item.model';
import { createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utilities/utils';
import { StorePickList } from './store_pick_list.component';

type Props = {
    navigation: ItemAddScreenNavigationProp,
    route: ItemAddScreenRouteProp
}

const ItemAddComponent = ({ route, navigation }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [items, setItems] = useState<IItem[]>([]);
    const [itemName, setItemName] = useState<string>('');
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [selectedStoreId, setSelectedStoreId] = useState<number>(0);

    let errorMessage: string = '';

    // const StorePicklist = (): JSX.Element => {
    //     return (
    //         <Picker
    //             selectedValue={selectedStore}
    //             style={{height: 50, width: 150}}
    //             onValueChange={(itemValue, itemIndex) => {
    //                 setSelectedStore(itemValue.toString());
    //                 setSelectedStoreId(getStoreIdByName(stores, itemValue.toString()));
    //             }}
    //         >
    //             <Picker.Item label='None' value='none' />
    //             {stores.map((prop: IStore, key: number) => {
    //                 return (
    //                     <Picker.Item label={prop.name} value={prop.name} key={key} />
    //                 );
    //             })}
    //         </Picker>
    //     );
    // }

    const renderStoresAndSetDefault = (store_id: number | undefined) => {
        getAllStores()
        .then((json: IStore[]) => {
            setStores(json);
            if(!isUndefinedOrNull(store_id)){
                setSelectedStoreId(Number(store_id));
                setSelectedStore(getStoreNameById(json, Number(store_id)));
            }
        })
        .catch((error) => {
            console.error(error);
            createErrorAlert(error);
        });
    }

    const addItemAndRedirect = () => {
        let itemToAdd: IItem = getDefaultItem();
        itemToAdd.name = itemName;
        if(itemToAdd.name != ""){
            if(!itemAlreadyExist(itemToAdd.name)){
                itemToAdd.user_Id = currentUserId;
                itemToAdd.currentStoreId = selectedStoreId;
                addItem(itemToAdd)
                .then((json: IItem) => {
                    redirectToHome(navigation, currentUserId, currentStoreId);
                })
                .catch((error) => {
                    console.error(error);
                    createErrorAlert(error);
                });
            }
            else{
                errorMessage = "Item already exist.";
                createErrorAlert(errorMessage);
            }
        }
    }

    const renderAllItems = (user_id: number) => {
        getItemsForUser(user_id)
        .then((json: IItem[]) => setItems(json))
        .catch((error) => {
            console.error(error);
            createErrorAlert(error);
        });
    }

    const itemAlreadyExist = (item_name: string): boolean => {
        let exist: boolean = false;
        items.forEach(
            (item: IItem) => {
                if(item.name == item_name){
                    exist = true;
                    return;
                }
            }
        )
        return exist;
    }

    useEffect( () => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        renderStoresAndSetDefault(route.params.store_id);
        renderAllItems(route.params.user_id);
    }, []);

    return (
        <View>
            <FloatingLabelInput
                label={'Item Name'}
                value={itemName}
                onChangeText={(val: string) => setItemName(val)}
            />

            <FloatingLabelInput
                label={'Store with Price'}
                value={selectedStore}
                editable={false}
            />
            <StorePickList 
                stores={stores}
                selectedStore={selectedStore}
                onStoreChanged={(itemValue, itemIndex) => {
                    setSelectedStore(itemValue.toString());
                    setSelectedStoreId(getStoreIdByName(stores, itemValue.toString()));
                }}
            />
            <Button title='Add Item' onPress={ () => addItemAndRedirect()} />
        </View>
    );

};

export default ItemAddComponent;