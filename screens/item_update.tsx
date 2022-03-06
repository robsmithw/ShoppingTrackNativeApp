import { AxiosError } from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import IItem from '../models/item.model';
import { ItemUpdateScreenNavigationProp, ItemUpdateScreenRouteProp, redirectToHome } from '../models/navigation.model';
import IStore from '../models/store.model';
import { ItemService } from '../services/item_service';
import { StoreService } from '../services/store_service';
import { UserContext } from '../contexts/user_context';
import { PropContext } from '../contexts/prop_context';
import { convertPriceStringToNumber, createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utils/utils';
import { StorePickList } from '../components/store_pick_list';
import { StyledButton } from '../components/styled_button';
import { NIL as emptyGuid } from "uuid";

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

const ItemUpdateComponent = ({ navigation }: Props) => {

    const [currentItem, setCurrentItem] = useState<IItem>();
    const [stores, setStores] = useState<IStore[]>([]);
    const [newItemName, setNewItemName] = useState<string>('');
    const [newPreviousPrice, setNewPreviousPrice] = useState<string>('');
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [selectedStoreId, setSelectedStoreId] = useState<string>(emptyGuid);

    const userContext = useContext(UserContext);
    const propContext = useContext(PropContext);

    const storeService = useMemo(() => new StoreService(userContext.accessToken), [userContext.accessToken]);
    const itemService = useMemo(() => new ItemService(userContext.accessToken), [userContext.accessToken]);

    const getStores = (store_id: string) => {
        setStores([]);
        storeService.getAllStores()
        .then((response) => {
            const json = response.data;
            setStores(json);
            if(!isUndefinedOrNull(store_id)){
                setSelectedStoreId(store_id);
                setSelectedStore(getStoreNameById(json, store_id));
            }    
        })
        .catch((error: AxiosError) => {
            console.error(error);
            createErrorAlert(error.message);
        });
    }

    const constructAndUpdateItem = () => {
        let item: IItem | undefined = currentItem;
        if (!isUndefinedOrNull(item) && item != undefined){
            item.name = newItemName;
            item.previousPrice = convertPriceStringToNumber(newPreviousPrice);
            item.currentStoreId = selectedStoreId;
            itemService.updateItem(item)
            .then((response) => {
                setCurrentItem(response.data);
                redirectToHome(navigation);
            })
            .catch((error: AxiosError) => {
                console.error(error);
                createErrorAlert(error.message);
            });
        }
    }
    

    useEffect(() => {
        if (propContext.storeId !== null
            && propContext.item !== null
            && userContext.userId !== null)
        {
            setCurrentItem(propContext.item);
            setNewItemName(propContext.item.name);
            setNewPreviousPrice(propContext.item.previousPrice.toString());
            getStores(propContext.storeId);
        }
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
                onStoreChanged={(itemValue, _) => {
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
