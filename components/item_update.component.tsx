import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import IItem from '../models/item.model';
import { ItemUpdateScreenNavigationProp, ItemUpdateScreenRouteProp, redirectToHome } from '../models/navigation.model';
import IStore from '../models/store.model';
import { User } from '../models/user.model';
import { getAllStores, updateItem } from '../utilities/api';
import { convertPriceStringToNumber, createErrorAlert, isUndefinedOrNull, StyledButton } from '../utilities/utils';

type Props = {
    navigation: ItemUpdateScreenNavigationProp,
    route: ItemUpdateScreenRouteProp
}

const styles = StyleSheet.create({
    btn: {
        fontSize: 18, 
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

    const getStores = () => {
        setStores([]);
        getAllStores()
        .then((json: IStore[]) => setStores(json))
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
        getStores();
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
            <StyledButton 
                styles={styles.btn}
                title={"Update Item"}
                onPress={() => constructAndUpdateItem()}
            />
        </View>
    );

};

export default ItemUpdateComponent;