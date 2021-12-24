import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { ItemDetailsScreenNavigationProp, ItemDetailsScreenRouteProp, redirectToHome, redirectToItemUpdate, redirectToPriceAdd, redirectToPriceView } from '../models/navigation.model';
import { IPrice } from '../models/price.model';
import IItem, { getDefaultItem } from '../models/item.model';
import NumberFormat from 'react-number-format';
import { createErrorAlert, formatString, isUndefinedOrNull } from '../utils/utils';
import IStore from '../models/store.model';
import { StyledButton } from './styled_button';
import { getAllPrices } from '../services/price_service';
import { getAllStores } from '../services/store_service';
import { deleteItem } from '../services/item_service';
import { AxiosError } from 'axios';

type Props = {
    navigation: ItemDetailsScreenNavigationProp,
    route: ItemDetailsScreenRouteProp
}

interface IPriceProps {
    price: IPrice
}

const styles = StyleSheet.create({
    navBtn: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#85bb65', 
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5,
        marginBottom: 5
    }
});

const ItemDetailsComponent = ({ route, navigation }: Props) => {

    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [currentItem, setCurrentItem] = useState<IItem>();
    const [previousPrices, setPreviousPrices] = useState<IPrice[]>([]);
    const [nameFormatted, setNameFormatted] = useState<string>('');
    const [stores, setStores] = useState<IStore[]>([]);

    const Price = ({ price }: IPriceProps): JSX.Element => {
        return (
            //May set this to a different color to better distiguish
            <View> 
                { !isUndefinedOrNull(price.price) 
                &&  price.price !== 0 ?
                <NumberFormat 
                    value={price.price} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    renderText={value => <Text>    Price: {value}</Text>}    
                />
                :
                <Text>    Price: There was no price specified.</Text>
                }
                <Text>    {formatString('store', price.storeId, stores)}</Text>
                <Text>    {formatString('date', price.dateOfPrice)}</Text>
            </View>
        )
    }

    const getPrices = (item_id: number | undefined) => {
        let previous_prices: IPrice[] = [];
        let cnt: number = 0;
        if (!isUndefinedOrNull(item_id)){
            getAllPrices(item_id)
            .then((json: IPrice[]) => {
                json.forEach((price) => {
                    //only get first three price
                    if (cnt < 3) { 
                        previous_prices.push(price);
                    }
                    if (cnt > 3) {
                        return;
                    }
                    cnt++;
                })
                setPreviousPrices(previous_prices)
            })
            .catch((error: AxiosError) => {
                console.error(error);
                createErrorAlert(error.message);
            });
        }
        else{
            console.error("Item id recieved was null.");
        }
    }

    const setFormattedStrings = (resultToFormat: IItem | undefined) => {
        if (!isUndefinedOrNull(resultToFormat)){
            setNameFormatted('Item Name: ' + resultToFormat?.name);
        }
        else{
            console.error("Item recieved was null.");
        }
        
        // NumberFormat can do this, just need to figure out how to link this up
        // if(!this.shared.isUndefinedOrNull(resultToFormat.previous_Price)){
        //     setPriceFormatted = '' + formatCurrency(resultToFormat.previous_Price,"en","$");
        // }
        // else{
        //     setPriceFormatted = '';
        // }
    }

    const getStores = () => {
        setStores([]);
        getAllStores()
        .then((json: IStore[]) => setStores(json))
        .catch((error: AxiosError) => {
            console.error(error);
            createErrorAlert(error.message);
        });
    }
    
    const redirectToUpdateItem = () => {
        redirectToItemUpdate(navigation, currentUserId, currentStoreId, currentItem);
    }

    const redirectToAddPrice = () => {
        redirectToPriceAdd(navigation, currentUserId, currentStoreId, currentItem);
    }

    const redirectToViewPrice = () => {
        redirectToPriceView(navigation, currentUserId, currentStoreId, currentItem);
    }

    const confirmAndDeleteItem = () => {
        let item: IItem = getDefaultItem();
        if (!isUndefinedOrNull(currentItem)){
            item = currentItem != null ? currentItem : getDefaultItem();
            confirmDelete(item);
        }
    }

    const confirmDelete = (item: IItem) => {
        Alert.alert(
            "Are you sure you want to delete?",
            "Are you sure you would like to delete this item from your list?",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        deleteItem(item)
                        .then((json: IItem) => {
                            redirectToHome(navigation);
                        })
                        .catch((error: AxiosError) => {
                            console.error(error);
                            createErrorAlert(error.message);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    useEffect( () => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        setCurrentItem(route.params.item);
        getPrices(route.params.item?.itemId);
        getStores();
        setFormattedStrings(route.params.item);
    }, []);

    return (
        <View>
            <Text>Item Details</Text>
            <Text>{nameFormatted}</Text>
            { !isUndefinedOrNull(currentItem?.previous_Price) 
            &&  currentItem?.previous_Price !== 0 ?
            <NumberFormat 
                value={currentItem?.previous_Price} 
                displayType={'text'} 
                thousandSeparator={true} 
                prefix={'$'} 
                renderText={value => <Text>Previous Price: {value}</Text>}    
            />
            :
            <Text>Previous Price: There was no previous price specified.</Text>
            }
            <Text>{formatString('previous_store', currentItem?.last_Store_Id, stores)}</Text>
            <Text>{formatString('current_store', currentItem?.currentStoreId, stores)}</Text>
            { previousPrices.length > 0 ?
            <Text>Previous Prices:</Text>
            :
            <Text>No Previous Prices</Text>
            }
            <FlatList 
            data={previousPrices}
            renderItem={({item}) =>  <Price price={item}></Price>}
            keyExtractor={(price, index) => price.id.toString()}
            />
            <StyledButton styles={styles.navBtn} title='Update Item' onPress={() => redirectToUpdateItem()} />
            <StyledButton styles={styles.navBtn} title='Delete Item' onPress={ () => confirmAndDeleteItem()} />
            <StyledButton styles={styles.navBtn} title='Add Another Price' onPress={ () => redirectToAddPrice()} />
            <StyledButton styles={styles.navBtn} title='View All Price' onPress={ () => redirectToViewPrice()} disabled={previousPrices.length <= 0} />
        </View>
        
    );

};

export default ItemDetailsComponent;