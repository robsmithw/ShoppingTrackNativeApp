import React, { useContext, useEffect, useState } from 'react';
import { Text, SafeAreaView, View, FlatList, StyleSheet, Switch, TouchableWithoutFeedback, GestureResponderEvent, Image } from 'react-native';
import IStore from '../models/store.model'
import { redirectToHome, StoreSelectionScreenNavigationProp, StoreSelectionScreenRouteProp } from '../models/navigation.model';
import { User } from '../models/user.model';
import Toast from 'react-native-simple-toast';
import { createErrorAlert } from '../utils/utils';
import { store_images } from '../utils/store_images';
import { getAllStores, getStoresWithItemsByUser } from '../services/store_service';
import { UserContext } from '../contexts/user_context';
import { PropContext } from '../contexts/prop_context';

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
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'column',
        alignItems: 'center',
        width: 125,
    },
    stores: {
        fontSize: 24,
        textAlign: 'center',
    },
  });

const StoreSelectionComponent = ({ navigation }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<IStore[]>([]);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const userContext = useContext(UserContext);
    const propContext = useContext(PropContext);

    const Store = ({ store }: IStoreProps): JSX.Element => {
        return (
            <View style={styles.storesRow}>
                
                <TouchableWithoutFeedback onPress= {() => onStorePress(store)}>
                    <View style={styles.storesRow}>
                        <Image 
                        source={requireStorePicture(store)}
                        accessibilityLabel={store.name}
                        />
                        {/* {store.name.indexOf(' ') > -1 ?} */}
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
        if (propContext.setStoreId !== null){
            propContext.setStoreId(store.storeId);
        }
        redirectToHome(navigation);
    }

    const toggleSwitch = () => {
        renderStoreList(!isEnabled);
        setIsEnabled(previousState => !previousState);
    }

    const renderStoreList = (withItems: boolean) => {
        if (withItems) {
            renderStoresWithItems();
        }
        else{
            renderAllStores();
        }
    }

    const renderStoresWithItems = () => {
        getStoresWithItemsByUser(currentUserId, userContext.accessToken)
            .then((json: IStore[]) => setData(json))
            .catch((error) => {
                console.error(error);
                createErrorAlert(error);
            })
            .finally(() => setIsLoading(false));
    }

    const renderAllStores = () => {
        getAllStores(userContext.accessToken)
        .then((json: IStore[]) => setData(json))
        .catch((error) => {
            console.error(error);
            createErrorAlert(error);
        })
        .finally(() => setIsLoading(false));
    }

    useEffect( () => {
        Toast.show('Successfully logged in.')
        setCurrentUserId(userContext.userId);
        renderStoreList(!isEnabled);
    }, []);

    return (
        <SafeAreaView style={{flex:1}}>
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