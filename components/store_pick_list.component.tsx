import React, { useEffect, useState } from 'react';

import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { Picker } from '@react-native-picker/picker';

import IStore from '../models/store.model';

type Props = {
    stores: IStore[],
    selectedStore?: ItemValue | undefined,
    onStoreChanged?: ((itemValue: ItemValue, itemIndex: number) => void) | undefined
}

export const StorePickList = ({ selectedStore, onStoreChanged, stores }: Props) => {

    return (
        <Picker
            selectedValue={selectedStore}
            style={{height: 50, width: 150}}
            onValueChange={onStoreChanged}
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