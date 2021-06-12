import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { PriceAddScreenNavigationProp, PriceAddScreenRouteProp } from '../models/navigation.model';
import { User } from '../models/user.model';
import { createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull, StyledButton } from '../utilities/utils';
import IStore from '../models/store.model';
import { getAllStores } from '../utilities/api';
import IItem from '../models/item.model';

type Props = {
    navigation: PriceAddScreenNavigationProp,
    route: PriceAddScreenRouteProp
}

const styles = StyleSheet.create({
    navBtn: {
        fontSize: 18, 
        margin: 5,
        marginBottom: 5
    }
});

const PriceAddComponent = ({ route, navigation }: Props) => {

    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [currentItem, setCurrentItem] = useState<IItem>();
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [selectedStoreId, setSelectedStoreId] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<string>('');
    const [dateOfPrice, setDateOfPrice] = useState<Date>(new Date);

    const StorePicklist = (): JSX.Element => {
        return (
            <Picker
                selectedValue={selectedStore}
                style={{height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedStore(itemValue.toString());
                    setSelectedStoreId(getStoreIdByName(stores, itemValue.toString()));
                }}
            >
                <Picker.Item label='None' value='none' />
                {stores.map((prop: IStore, key: number) => {
                    return (
                        <Picker.Item label={prop.name} value={prop.name} key={key} />
                    );
                })}
            </Picker>
        );
    }

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

    //Number(newPrice.replace(',', ''))

    useEffect( () => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        setCurrentItem(route.params.item);
        renderStoresAndSetDefault(route.params.store_id);
    }, []);

    return (
        <View>
            {/* Store
            Store Name
            Price
            Date of price
            Most recent price?
            */}
            <FloatingLabelInput
                label={'Store with Price'}
                value={selectedStore}
                editable={false}
            />
            <StorePicklist />
            <FloatingLabelInput
                label={'Price'}
                value={newPrice}
                maskType="currency"
                currencyDivider="," 
                keyboardType="numeric"
                onChangeText={(val: string) => setNewPrice(val)}
            />
            <DatePicker
            date={dateOfPrice}
            onDateChange={setDateOfPrice} />

            <StyledButton styles={styles.navBtn} title='Add Price' onPress={ () => console.log("sumin")} />
            <StyledButton styles={styles.navBtn} title='Cancel' onPress={ () => console.log("sumin")} />
        </View>
    );

};

export default PriceAddComponent;