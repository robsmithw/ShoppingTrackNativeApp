import React, { useEffect, useState } from 'react';

import { Text, View, Modal, TouchableHighlight, StyleSheet, GestureResponderEvent, StyleProp, NativeSyntheticEvent, NativeTouchEvent, ViewStyle } from 'react-native';

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
        // <View style={this.props.styles}>
        //     <Button title={this.props.title} onPress={this.props.onPress} disabled={this.props.disabled}/>
        // </View>
    );
}