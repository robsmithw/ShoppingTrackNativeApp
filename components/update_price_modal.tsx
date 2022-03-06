import React from 'react';

import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';

import { FloatingLabelInput } from 'react-native-floating-label-input';

import { ItemValue } from '@react-native-picker/picker/typings/Picker';

import { StorePickList } from './store_pick_list';
import IStore from '../models/store.model';

type Props = {
    isModalVisible: boolean,
    onModalRequestClose: (() => void) | undefined
    pricePaid: string,
    onPricePaidChanged: ((newValue: string) => void) | undefined
    onUpdatePriceClicked: (() => void) | undefined
    
    // These three are required in order to pass to the StorePickList
    stores: IStore[],
    selectedStore?: ItemValue | undefined,
    onStoreChanged?: ((itemValue: ItemValue, itemIndex: number) => void) | undefined
}

const styles = StyleSheet.create({
  checkListRow: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 18,
      flexDirection: 'row'
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
  modalText: {
      marginBottom: 15,
      textAlign: 'center'
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
});

export const UpdatePriceModal = ({ isModalVisible,
    onModalRequestClose,
    pricePaid,
    onPricePaidChanged, 
    selectedStore, 
    onStoreChanged, 
    stores, 
    onUpdatePriceClicked }: Props): JSX.Element => {
    return(
        <Modal
          animationType='slide'
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => onModalRequestClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <FloatingLabelInput
                      label={'Price Paid'}
                      value={pricePaid}
                      maskType='currency'
                      currencyDivider=',' 
                      keyboardType='numeric'
                      onChangeText={onPricePaidChanged}
                    />

                    <FloatingLabelInput
                      label={'Store with Price'}
                      value={selectedStore?.toString()}
                      editable={false}
                    />
                    <StorePickList 
                        onStoreChanged={onStoreChanged} 
                        selectedStore={selectedStore} 
                        stores={stores}
                    />

                    <Text>Would you like to update the price paid for this item?</Text>

                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                      onPress={onUpdatePriceClicked}
                    >
                    <Text style={styles.textStyle}>Yes</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                      onPress={onModalRequestClose}
                    >
                    <Text style={styles.textStyle}>No</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}
