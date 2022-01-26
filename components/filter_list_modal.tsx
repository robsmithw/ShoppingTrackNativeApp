import React from 'react';

import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';

import CheckBox from '@react-native-community/checkbox';

type Props = {
    isChecked: boolean,
    onCheckBoxChanged?: ((isChecked: boolean) => void) | undefined
    isModalVisible: boolean,
    onModalRequestClose: (() => void) | undefined
    onApplyClicked: (() => void) | undefined
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

export const FilterListModal = ({isChecked, onCheckBoxChanged, isModalVisible, onModalRequestClose, onApplyClicked}: Props): JSX.Element => {
  return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onModalRequestClose}
      >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>

                  <Text>Filter Shopping List</Text>

                  <View style={styles.checkListRow}>
                      {/* TODO : doing this rather than state avoids the constant refresh, but cannot change more than once */}
                      <CheckBox
                          value={isChecked}
                          onValueChange={onCheckBoxChanged}
                      />
                      <Text>Show Purchased Items</Text>
                  </View>

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#85bb65' }}
                    onPress={onApplyClicked}
                  >
                      <Text style={styles.textStyle}>Apply</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#808080' }}
                    onPress={onModalRequestClose}
                  >
                      <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>
              </View>
          </View>
      </Modal>
  )
}
