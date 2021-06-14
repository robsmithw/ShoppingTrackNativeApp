import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, FlatList, StyleSheet, Switch, TouchableWithoutFeedback, GestureResponderEvent, Image } from 'react-native';
import IStore from '../models/store.model'
import { redirectToHome, StoreSelectionScreenNavigationProp, StoreSelectionScreenRouteProp } from '../models/navigation.model';
import { User } from '../models/user.model';
import Toast from 'react-native-simple-toast';
import { getAllStores, getStoresWithItemsByUser } from '../utilities/api';
import { createErrorAlert } from '../utilities/utils';
import { store_images } from '../utilities/store_images';

type Props = {
    navigation: StoreSelectionScreenNavigationProp,
    route: StoreSelectionScreenRouteProp
}

interface IStoreProps {
    store: IStore
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20, 
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    switchRow: {
        fontSize: 18,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    storesRow: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    stores: {
        fontSize: 24
    }
  });

const StoreSelectionComponent = ({ route, navigation }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<IStore[]>([]);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    const Store = ({ store }: IStoreProps): JSX.Element => {
        return (
            <View style={styles.storesRow}>
                
                <TouchableWithoutFeedback onPress= {() => onStorePress(store)}>
                    <View style={styles.storesRow}>
                        <Image 
                        source={requireStorePicture(store)}
                        accessibilityLabel={store.name}
                        />
                        <Text style={styles.stores}> {store.name} </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    const requireStorePicture = (store: IStore) => {
        if (store.pictureFileName != null){
            switch(store.name){
                case "Walmart":
                    return require('../assets/walmart.png');
            }
        }
        return require('../assets/unknown.png');
    }

    const onStorePress = (store: IStore) => {
        redirectToHome(navigation, currentUserId, store.storeId);
    }

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (isEnabled) {
            renderStoresWithItems(currentUserId);
        }
        else{
            renderAllStores();
        }
    }

    const renderStoresWithItems = (user_id: number) => {
        getStoresWithItemsByUser(user_id)
            .then((json: IStore[]) => setData(json))
            .catch((error) => {
                console.error(error);
                createErrorAlert(error);
            })
            .finally(() => setIsLoading(false));
    }

    const renderAllStores = () => {
        getAllStores()
        .then((json: IStore[]) => setData(json))
        .catch((error) => {
            console.error(error);
            createErrorAlert(error);
        })
        .finally(() => setIsLoading(false));
    }

    useEffect( () => {
        Toast.show('Successfully logged in.')
        setCurrentUserId(route.params.user_id);
        renderStoresWithItems(route.params.user_id);
    }, []);

    return (
        <SafeAreaView>
            <Text style={styles.title}>Select a Store</Text>
            <View style={styles.switchRow}>
                <Text>Show all Stores?</Text>
                <Switch 
                onValueChange={toggleSwitch}
                value={isEnabled}
                />
            </View>
            {isLoading ? 
            <Text>Loading...</Text> : 
            <FlatList 
            numColumns={3}
            data={data}
            renderItem={({item}) =>  <Store store={item}></Store>}
            keyExtractor={(item, index) => item.storeId.toString()}
           />
            }
            
        </SafeAreaView>
    );

};

export default StoreSelectionComponent;