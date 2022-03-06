import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { ItemAddScreenNavigationProp, ItemAddScreenRouteProp, redirectToHome } from '../models/navigation.model';
import IStore from '../models/store.model';
import IItem, { getDefaultItem, Item } from '../models/item.model';
import { createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utils/utils';
import { StorePickList } from '../components/store_pick_list';
import { StyledButton } from '../components/styled_button';
import { StoreService } from '../services/store_service';
import { ItemService } from '../services/item_service';
import { UserContext } from '../contexts/user_context';
import { PropContext } from '../contexts/prop_context';
import { AxiosError } from 'axios';
import { NIL as emptyGuid } from "uuid";

const styles = StyleSheet.create({
    btn: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#85bb65', 
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

type Props = {
    navigation: ItemAddScreenNavigationProp,
    route: ItemAddScreenRouteProp
}

const ItemAddComponent = ({ navigation }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentUserId, setCurrentUserId] = useState<string>(emptyGuid);
    const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(emptyGuid);
    const [items, setItems] = useState<IItem[]>([]);
    const [itemName, setItemName] = useState<string>('');
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [selectedStoreId, setSelectedStoreId] = useState<string>(emptyGuid);
    
    const userContext = useContext(UserContext);
    const propContext = useContext(PropContext);

    const storeService = useMemo(() => new StoreService(userContext.accessToken), [userContext.accessToken]);
    const itemService = useMemo(() => new ItemService(userContext.accessToken), [userContext.accessToken]);

    let errorMessage: string = '';

    const renderStoresAndSetDefault = (store_id: string | undefined) => {
        storeService.getAllStores()
            .then((response) => {
                setStores(response.data);
                if(store_id !== undefined){
                    setSelectedStoreId(store_id);
                    setSelectedStore(getStoreNameById(response.data, store_id));
                }
            })
            .catch((error: AxiosError) => {
                console.error(error);
                createErrorAlert(error.message);
            });
    }

    const addItemAndRedirect = () => {
        let itemToAdd: Item = getDefaultItem();
        itemToAdd.name = itemName;
        if(itemToAdd.name != ""){
            if(!itemAlreadyExist(itemToAdd.name)){
                itemToAdd.userId = currentUserId;
                itemToAdd.currentStoreId = selectedStoreId;
                itemService.addItem(itemToAdd)
                    .then((response) => {
                        redirectToHome(navigation);
                    })
                    .catch((error: AxiosError) => {
                        console.error(error);
                        createErrorAlert(error.message);
                    });
            }
            else{
                errorMessage = "Item already exist.";
                createErrorAlert(errorMessage);
            }
        }
    }

    const renderAllItems = (user_id: string) => {
        itemService.getItemsForUser(user_id)
            .then((response) => setItems(response.data))
            .catch((error: AxiosError) => {
                console.error(error);
                createErrorAlert(error.message);
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
        if (propContext.storeId !== null && userContext.userId !== null){
            setCurrentStoreId(propContext.storeId);
            setCurrentUserId(userContext.userId);
            renderStoresAndSetDefault(propContext.storeId);
            renderAllItems(userContext.userId);
        }
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
                onStoreChanged={(itemValue, _) => {
                    setSelectedStore(itemValue.toString());
                    setSelectedStoreId(getStoreIdByName(stores, itemValue.toString()));
                }}
            />
            <StyledButton 
                styles={styles.btn}
                title="Add Item"
                onPress={() => addItemAndRedirect()  } 
            />
        </View>
    );

};

export default ItemAddComponent;
