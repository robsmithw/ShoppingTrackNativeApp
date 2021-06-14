import React, { useEffect, useState } from 'react';

import { FloatingLabelInput } from 'react-native-floating-label-input';

import { Text, TextInput, SafeAreaView, View, FlatList, StyleSheet, Switch, TouchableWithoutFeedback, Button, Modal, TouchableHighlight, Image } from 'react-native';

import IItem, {getDefaultItem, ISelectItem, IStoreSelectItems} from '../models/item.model';
import { ItemsScreenNavigationProp, ItemsScreenRouteProp, redirectToItemAdd, redirectToItemDetails } from '../models/navigation.model';
import IStore from '../models/store.model';

import { Picker } from '@react-native-picker/picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

import CheckBox from '@react-native-community/checkbox';

import { convertPriceStringToNumber, createErrorAlert, getStoreIdByName, getStoreNameById, isUndefinedOrNull } from '../utilities/utils';
import { getAllStores, getItemsForUser, getItemsForUserByStore, updateItem } from '../utilities/api';
import { FilterListModal } from './filter_list_modal';
import { UpdatePriceModal } from './update_price_modal';

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
        borderBottomColor: '#000',
        borderBottomWidth: 2
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
        paddingRight: 10
    },
    filterImg: {
        marginLeft: 'auto',
        flexDirection: 'row'
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
    const [allItems, setAllItems] = useState<IItem[]>([]);
    const [purchasedItems, setpurchasedItems] = useState<IItem[]>([]);
    const [searchedItems, setsearchedItems] = useState<IItem[]>([]);
    const [itemsDisplayed, setItemsDisplayed] = useState<IItem[]>([]); //controls what items are shown (purchased or shoppingItems)
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

    const filterItemsDisplayed = (items: IItem[]) => {
        if(!togglePurchased){
            //If filter to show purchased items is not checked, only show not purchased items
            items = items.filter((item: IItem) => !item.purchased)
            setItemsDisplayed(items);
        }
        //Include all items in our items displayed (includes purchased items)
        setItemsDisplayed(items);
    }

    const getItems = (user_id: number, store_id: number | undefined) => {
        // specific store selected
        if (store_id != undefined) {
            getItemsForUserByStore(user_id, store_id)
            .then((json: IItem[]) => {
                setAllItems(json);
                filterItemsDisplayed(json);
            })
            .catch((error) => {
                console.error(error);
                createErrorAlert(error.message);
            })
            .finally(() => setIsLoading(false));
        }
        else{
            getItemsForUser(user_id)
            .then((json: IItem[]) => {
                setAllItems(json);
                filterItemsDisplayed(json);
            })
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
            setItemsDisplayed(allItems);
        }

        if (searchText != '') {
            allItems.forEach(
                (element: IItem) => {
                    if(element.name.toLowerCase().includes(searchText.toLowerCase())){
                        searchedItemsList.push(element);
                    }
                }
            );
            setItemsDisplayed(searchedItemsList);
        }
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
              data={itemsDisplayed}
              renderItem={({item}) =>  <Item item={item}></Item>}
              keyExtractor={(item: IItem, index: number) => item.itemId.toString()}
            />
            }
            <UpdatePriceModal 
                isModalVisible={modalVisible}
                onModalRequestClose={() => setModalVisible(!modalVisible)}
                pricePaid={pricePaid}
                onPricePaidChanged={(val: string) => setPricePaid(val)}
                onUpdatePriceClicked={() => {
                    setModalVisible(!modalVisible);
                    updatePreviousPrice();
                }}
                stores={stores}
                selectedStore={selectedStore}
                onStoreChanged={(itemValue: ItemValue, itemIndex: number) => {
                    setSelectedStore(itemValue.toString());
                }}
            />
            <FilterListModal 
                isChecked={togglePurchased}
                isModalVisible={filterModalVisible}
                onCheckBoxChanged={(isChecked: boolean) => setTogglePurchased(isChecked)}
                onModalRequestClose={() => setFilterModalVisible(!filterModalVisible)}
                onApplyClicked={() => {
                    filterItemsDisplayed(allItems);
                    setFilterModalVisible(!filterModalVisible);
                }}
            />
        </SafeAreaView>
    );

};

export default ItemsComponent;