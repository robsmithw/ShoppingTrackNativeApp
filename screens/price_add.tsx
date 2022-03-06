import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { PriceAddScreenNavigationProp, PriceAddScreenRouteProp } from '../models/navigation.model';
import { createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utils/utils';
import IStore from '../models/store.model';
import { StyledButton } from '../components/styled_button';
import IItem from '../models/item.model';
import { UserContext } from '../contexts/user_context';
import { PropContext } from '../contexts/prop_context';
import { StoreService } from '../services/store_service';
import { AxiosError } from 'axios';

type Mode = 'date' | 'time' | 'datetime' | 'countdown';

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

const PriceAddComponent = ({ navigation }: Props) => {

    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [newPrice, setNewPrice] = useState<string>('');
    const [dateOfPrice, setDateOfPrice] = useState<Date>(new Date);
    const [mode, setMode] = useState<Mode>('date');
    const [show, setShow] = useState<Boolean>(false);

    const userContext = useContext(UserContext);
    const propContext = useContext(PropContext);

    const storeService = useMemo(() => new StoreService(userContext.accessToken), [userContext.accessToken]);

    const StorePicklist = (): JSX.Element => {
        return (
            <Picker
                selectedValue={selectedStore}
                style={{height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedStore(itemValue.toString());
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

    const renderStoresAndSetDefault = (store_id: string | undefined) => {
        storeService.getAllStores()
        .then((response) => {
            const json = response.data;
            setStores(json);
            if(store_id !== undefined){
                setSelectedStore(getStoreNameById(json, store_id));
            }
        })
        .catch((error: AxiosError) => {
            console.error(error);
            createErrorAlert(error.message);
        });
    }

    const onChange = (_event: Event, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateOfPrice;
        // Do I need this? setShow(Platform.OS === 'ios');
        setDateOfPrice(currentDate);
    };

    const showMode = (currentMode: Mode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    
    const showTimepicker = () => {
        showMode('time');
    };

    const calenderDisplay = (): JSX.Element => {
        return (
            <TouchableWithoutFeedback onPress={() => setShow(true)}>
                <Image 
                    source={require('../assets/add.png')}
                    accessibilityLabel={'Add Item'}
                />
            </TouchableWithoutFeedback>
        )
    }

    //Number(newPrice.replace(',', ''))

    useEffect( () => {
        if (propContext.storeId !== null 
            && userContext.userId !== null
            && propContext.item !== null)
        {
            renderStoresAndSetDefault(propContext.storeId);
        }
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
                label={'Select a store'}
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
            <FloatingLabelInput
                label={'Select the date of the price'}
                value={dateOfPrice.toDateString()}
                editable={false}
                rightComponent={calenderDisplay()}
            />
            {
                show &&
                <DateTimePicker
                    value={dateOfPrice}
                    mode={mode}
                    display="default"
                    onChange={onChange}
                />
            }

            <StyledButton styles={styles.navBtn} title='Add Price' onPress={ () => console.log("sumin")} />
            <StyledButton styles={styles.navBtn} title='Cancel' onPress={ () => console.log("sumin")} />
        </View>
    );

};

export default PriceAddComponent;
