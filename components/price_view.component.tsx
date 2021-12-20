import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, Image, Alert } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import NumberFormat from 'react-number-format';
import { PropContext } from '../contexts/prop_context';
import { UserContext } from '../contexts/user_context';
import IItem from '../models/item.model';
import { PriceViewScreenNavigationProp, PriceViewScreenRouteProp } from '../models/navigation.model';
import { IPrice } from '../models/price.model';
import IStore from '../models/store.model';
import { User } from '../models/user.model';
import { PriceService } from '../services/price_service';
import { StoreService } from '../services/store_service';
import { createErrorAlert, formatString, isUndefinedOrNull } from '../utils/utils';

type Props = {
    navigation: PriceViewScreenNavigationProp,
    route: PriceViewScreenRouteProp
}

interface IPriceProps {
    price: IPrice
}

const styles = StyleSheet.create({
    navBtn: {
        fontSize: 18, 
        margin: 5,
        marginBottom: 5
    },
    deleteImg: {
        marginLeft: 'auto'
    },
    middleRow: {
        flexDirection: 'row'
    },
    priceSection: {
        padding: 5,
        borderColor: 'black',
        borderBottomWidth: 1
    }
});

const PriceViewComponent = ({ route, navigation }: Props) => {

    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [currentItem, setCurrentItem] = useState<IItem>();
    const [data, setData] = useState<IPrice[]>([]);
    const [stores, setStores] = useState<IStore[]>([]);

    const userContext = useContext(UserContext);
    const propContext = useContext(PropContext);

    const storeService = useMemo(() => new StoreService(userContext.accessToken), [userContext.accessToken]);
    const priceService = useMemo(() => new PriceService(userContext.accessToken), [userContext.accessToken]);

    const Price = ({ price }: IPriceProps): JSX.Element => {
        return (
            <View style={styles.priceSection}>
                { !isUndefinedOrNull(price.price) 
                &&  price.price !== 0 ?
                <NumberFormat 
                    value={price.price} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    renderText={value => <Text>Price: {value}</Text>}    
                />
                :
                <Text>Price: There was no price specified.</Text>
                }
                <View style={styles.middleRow}>
                    <Text>{formatString('store', price.storeId, stores)}</Text>
                    <TouchableWithoutFeedback onPress={() => promptDelete(price)}>
                        <Image 
                        source={require('../assets/delete.png')} 
                        style={styles.deleteImg}
                        accessibilityLabel={'Delete Price'}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <Text>{formatString('date', price.dateOfPrice)}</Text>
            </View>
        )
    }

    const promptDelete = (price: IPrice) => {
        Alert.alert(
            "Are you sure you want to delete?",
            "Are you sure you would like to delete this price from the associated item?",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        priceService.deletePrice(price.id)
                        .then((response) => {
                            // TODO: Currently this isn't working
                            // Details also needs to be updated (not working)
                            setData(data.filter(priceData => priceData.id != price.id));
                        })
                        .catch((error) => {
                            console.error(error);
                            createErrorAlert(error);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const renderAllPrices = (item_id: number | undefined) => {
        if (item_id !== undefined){
            priceService.getAllPrices(item_id)
            .then((response) => {setData(response.data)})
            .catch((error) => {
                console.error(error);
                createErrorAlert(error);
            });
        }
        else{
            console.error("Item id recieved was null.");
        }
    }

    const getStores = () => {
        setStores([]);
        storeService.getAllStores()
        .then((response) => setStores(response.data))
        .catch((error) => {
            console.error(error);
            createErrorAlert(error);
        });
    }

    useEffect( () => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        setCurrentItem(route.params.item);
        getStores();
        renderAllPrices(route.params.item?.itemId);
    }, []);

    return (
        <View>
            <FlatList 
              data={data}
              renderItem={({item}) =>  <Price price={item}></Price>}
              keyExtractor={(item, index) => item.id.toString()}
            />
        </View>
    );

};

export default PriceViewComponent;