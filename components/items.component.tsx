import React, { useEffect, useState } from 'react';

import { FloatingLabelInput } from 'react-native-floating-label-input';

import { Text, TextInput, SafeAreaView, View, FlatList, StyleSheet, Switch, TouchableWithoutFeedback, Button, Modal, TouchableHighlight, Image } from 'react-native';

import IItem, {getDefaultItem, ISelectItem, IStoreSelectItems} from '../models/item.model';
import { ItemsScreenNavigationProp, ItemsScreenRouteProp, redirectToItemAdd, redirectToItemDetails } from '../models/navigation.model';
import IStore from '../models/store.model';

import { Picker } from '@react-native-picker/picker';

import CheckBox from '@react-native-community/checkbox';

import { convertPriceStringToNumber, createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utilities/utils';
import { getAllStores, getItemsForUser, getItemsForUserByStore, updateItem } from '../utilities/api';

type Props = {
    navigation: ItemsScreenNavigationProp,
    route: ItemsScreenRouteProp
}

interface IItemProps {
    item: IItem
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#000000'
    },
    titleRow: {
        flexDirection: 'row'
    },
    addImg: {
        marginLeft: 'auto'
    },
    itemRow: {
        paddingTop: 8,
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    item: {
        paddingLeft: 5,
        fontSize: 18,
    },
    purchasedItem: {
        paddingLeft: 5,
        fontSize: 18,
        textDecorationLine: 'line-through'
    },
    switchRow: {
        fontSize: 18,
        flexDirection: 'row',
    },
    checkListRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 18,
        flexDirection: 'row'
    },
    filterBtn: {
        fontSize: 20, 
        fontWeight: 'bold',
    },
    filterImg: {
        marginLeft: 'auto'
    },
    changeStatusButtons: {
        height: 35,
        marginLeft: 'auto'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center'
    },
    readonlyText: {
        backgroundColor: '#808080'
    }
});

const ItemsComponent = ({ route, navigation }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [currentStoreId, setCurrentStoreId] = useState<number | undefined>(0);
    const [shoppingItems, setShoppingItems] = useState<IItem[]>([]);
    const [purchasedItems, setpurchasedItems] = useState<IItem[]>([]);
    const [searchedItems, setsearchedItems] = useState<IItem[]>([]);
    const [data, setData] = useState<IItem[]>([]); //controls what items are shown (purchased or shoppingItems)
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
    const [pricePaid, setPricePaid] = useState<string>('');
    const [stores, setStores] = useState<IStore[]>([]);
    const [storePicker, setStorePicker] = useState<IStoreSelectItems>(new IStoreSelectItems());
    const [itemToUpdate, setItemToUpdate] = useState<IItem>(getDefaultItem());
    const [selectedStore, setSelectedStore] = useState<string>('none');
    const [togglePurchased, setTogglePurchased] = useState<boolean>(false);

    const Item = ({ item }: IItemProps): JSX.Element => {
        return (
            <View style={styles.itemRow}>
                <TouchableWithoutFeedback onPress={() => onItemSelected(item)}>
                    {!item.purchased ?
                        <Text style={styles.item} numberOfLines={1}>{item.name}</Text>
                        : <Text style={styles.purchasedItem} numberOfLines={1}>{item.name}</Text>
                    }
                    
                </TouchableWithoutFeedback>
                <View style={styles.changeStatusButtons}>
                    {!item.purchased ? 
                        <Button color="#85bb65" title='Cross Out' onPress={ () => {
                            openModalWithDefaults(item, true);
                            changeItemStatus(item, true);
                        }} 
                        /> : 
                        <Button color="#85bb65" title='Move to List' onPress={ () => changeItemStatus(item, false)} />
                    }
                </View>
            </View>
        )
    }

    const openModalWithDefaults = (item: IItem, purchased: boolean) => {
        item.purchased = purchased;
        setPricePaid(item.previous_Price.toString());
        let storeName: string = getStoreNameById(stores, item.currentStoreId);
        setSelectedStore(storeName);
        setItemToUpdate(item);
        setModalVisible(true);
    }

    const onItemSelected = (item: IItem) => {
        redirectToItemDetails(navigation, currentUserId, currentStoreId, item);
    }

    const getItems = (user_id: number, store_id: number | undefined) => {
        // specific store selected
        if (store_id != undefined) {
            getItemsForUserByStore(user_id, store_id)
            .then((json: IItem[]) => setData(json))
            .catch((error) => {
                console.error(error);
                createErrorAlert(error.message);
            })
            .finally(() => setIsLoading(false));
        }
        else{
            getItemsForUser(user_id)
            .then((json: IItem[]) => setData(json))
            .catch((error) => {
                console.error(error);
                createErrorAlert(error.message);
            })
            .finally(() => setIsLoading(false));
        }
    }

    const searchItemList = (searchText: string) => {
        let searchedItemsList: IItem[] = [];

        if (searchText == '') {
            setData(shoppingItems);
        }

        if (searchText != '') {
            shoppingItems.forEach(
                (element: IItem) => {
                    if(element.name.toLowerCase().includes(searchText.toLowerCase())){
                        searchedItemsList.push(element);
                    }
                }
            );
            setData(searchedItemsList);
        }
    }

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

    const changeItemStatus = (item: IItem, purchased: boolean) => {
        item.purchased = purchased;
        setItemToUpdate(item);
        updateItem(item)
        .then((json: IItem) => /*updateList(json, purchased)*/{})
        .catch((error) => {
            console.error(error);
            createErrorAlert(error.message);
        });
    }

    const updatePreviousPrice = () => {
        let item: IItem = itemToUpdate;
        if (item != getDefaultItem()){
            item.previous_Price = convertPriceStringToNumber(pricePaid);
            item.last_Store_Id = getStoreIdByName(stores, selectedStore);
            updateItem(item)
            .then((json: IItem) => {})
            .catch((error) => {
                console.error(error);
                createErrorAlert(error.message);
            });
        }
    }

    const UpdatePriceModal = (): JSX.Element => {
        return(
            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(false)}}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <FloatingLabelInput
                          label={'Price Paid'}
                          value={pricePaid}
                          maskType='currency'
                          currencyDivider=',' 
                          keyboardType='numeric'
                          onChangeText={(val) => setPricePaid(val)}
                        />

                        <FloatingLabelInput
                          label={'Store with Price'}
                          value={selectedStore}
                          editable={false}
                        />
                        <StorePicklist />

                        <Text>Would you like to update the price paid for this item?</Text>

                        <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                            updatePreviousPrice();
                          }}
                        >
                        <Text style={styles.textStyle}>Yes</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}
                        >
                        <Text style={styles.textStyle}>No</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    const FilterListModal = (): JSX.Element => {
        let purchasedFilter: boolean = togglePurchased;
        return(
            <Modal
              transparent={true}
              visible={filterModalVisible}
              onRequestClose={() => {setFilterModalVisible(false)}}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text>Filter Shopping List</Text>

                        <View style={styles.checkListRow}>
                            {/* TODO : doing this rather than state avoids the constant refresh, but cannot change more than once */}
                            <CheckBox
                                value={purchasedFilter}
                                onValueChange={(newValue: boolean) => {purchasedFilter = newValue}}
                            />
                            <Text>Show Purchased Items</Text>
                        </View>

                        <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                          onPress={() => {
                            setFilterModalVisible(!filterModalVisible);
                          }}
                        >
                            <Text style={styles.textStyle}>Apply</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: '#808080' }}
                          onPress={() => {
                            setFilterModalVisible(!filterModalVisible);
                          }}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    const renderAllStores = () => {
        getAllStores()
        .then((json: IStore[]) => setStores(json))
        .catch((error) => {
            console.error(error);
            createErrorAlert(error.message);
        });
    }

    const navigateToAddItem = () => {
        redirectToItemAdd(navigation, currentUserId, currentStoreId);
    }

    useEffect( () => {
        setCurrentStoreId(route.params.store_id);
        setCurrentUserId(route.params.user_id);
        getItems(route.params.user_id, route.params.store_id);
        renderAllStores();
        //this is set up because navigation does not destroy the component
        //so this works as a reload when navigation.navigate to here is called
        navigation.addListener(
            'focus',
            () => {
                getItems(route.params.user_id, route.params.store_id);
            }
          );

        return function unmount() {
            navigation.removeListener('focus', () => {});
        }

    }, []);

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>Shopping List</Text>
                <TouchableWithoutFeedback onPress={() => navigateToAddItem()}>
                    <Image 
                      source={require('../assets/add.png')} 
                      style={styles.addImg}
                      accessibilityLabel={'Add Item'}
                    />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.switchRow}>
                <TextInput 
                placeholder='Type item to search for here...'
                onChangeText={(text: string) => searchItemList(text)}
                />
                <View style={styles.filterImg}>
                    <Text style={styles.filterBtn}>Filter</Text>
                    {/* //this needs to open a modal with filter settings to check and apply */}
                    <TouchableWithoutFeedback onPress={() => setFilterModalVisible(true)}> 
                        <Image 
                            source={require('../assets/dropDown.png')} 
                            style={styles.filterImg}
                            accessibilityLabel={'Filter List'}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            
            {isLoading ? 
            <Text>Loading...</Text> : 
            <FlatList 
              data={data}
              renderItem={({item}) =>  <Item item={item}></Item>}
              keyExtractor={(item, index) => item.itemId.toString()}
            />
            }
            <UpdatePriceModal />
            <FilterListModal />
        </SafeAreaView>
    );

};

export default ItemsComponent;