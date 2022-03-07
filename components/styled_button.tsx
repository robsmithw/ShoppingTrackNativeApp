import React from 'react';

import { Text, TouchableHighlight, StyleProp, NativeSyntheticEvent, NativeTouchEvent, ViewStyle } from 'react-native';

export interface IStyledButtonProps {
    styles: StyleProp<ViewStyle>,
    title: string,
    onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void,
    disabled?: boolean | undefined
}

export const StyledButton = (props: IStyledButtonProps): JSX.Element => {
    return (
        <TouchableHighlight 
            style={props.styles}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            <Text style={{color: '#000', textAlign: 'center', fontSize: 20}}>{props.title}</Text>
        </TouchableHighlight>
    );
}
