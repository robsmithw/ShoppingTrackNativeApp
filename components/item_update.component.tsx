import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import IItem from '../models/item.model';
import { ItemUpdateScreenNavigationProp, ItemUpdateScreenRouteProp, redirectToHome } from '../models/navigation.model';
import IStore from '../models/store.model';
import { User } from '../models/user.model';
import { getAllStores, updateItem } from '../utilities/api';
import { convertPriceStringToNumber, createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utilities/utils';
import { StorePickList } from './store_pick_list.component';
import { StyledButton } from './styled_button';

type Props = {
    navigation: ItemUpdateScreenNavigationProp,
    route: ItemUpdateScreenRouteProp
}

const styles = StyleSheet.create({
    btn: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#85bb65', 
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
        marginBottom: 5
    }
});

const ItemUpdateComponent = ({ route, navigation }: Props) => {

    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [currentItem, setCurrentItem] = useState<IItem>();
    const [stores, setStores] = useState<IStore[]>([]);
    const [newItemName, setNewItemName] = useState<string>('');
    const [newPreviousPrice, setNewPreviousPrice] = useState<string>('');
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [selectedStoreId, setSelectedStoreId] = useState<number>(0);

    const getStores = (store_id: number | undefined) => {
        setStores([]);
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

    const constructAndUpdateItem = () => {
        let item: IItem | undefined = currentItem;
        if (!isUndefinedOrNull(item) && item != undefined){
            item.name = newItemName;
            item.previous_Price = convertPriceStringToNumber(newPreviousPrice);
            item.currentStoreId = selectedStoreId;
            updateItem(item)
            .then((json: IItem) => {
                setCurrentItem(json);
                redirectToHome(navigation, currentUserId, Number(currentStoreId));
            })
            .catch((error) => {
                console.error(error);
                createErrorAlert(error);
            });
        }
    }
    

    useEffect(() => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        setCurrentItem(route.params.item);
        setNewItemName(route.params.item != null ? route.params.item.name : '');
        setNewPreviousPrice(route.params.item != null ? route.params.item.previous_Price.toString() : '');
        getStores(route.params.store_id);
    }, []);

    return (
        <View>
            <FloatingLabelInput 
               label={'Item Name'}
               value={newItemName}
               onChangeText={(val: string) => setNewItemName(val)} 
            />
            <FloatingLabelInput
                label={'Price Paid'}
                value={newPreviousPrice}
                maskType="currency"
                currencyDivider="," 
                keyboardType="numeric"
                onChangeText={(val: string) => setNewPreviousPrice(val)}
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
            <StyledButton 
                styles={styles.btn}
                title={"Update Item"}
                onPress={() => constructAndUpdateItem()}
            />
        </View>
    );

};

export default ItemUpdateComponent;