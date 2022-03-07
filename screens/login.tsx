import { AxiosError } from 'axios';
import React, { useState, useRef, useContext, useMemo } from 'react';

import { View, Text, StyleSheet } from "react-native";

import { FloatingLabelInput } from 'react-native-floating-label-input';
import { UserContext } from '../contexts/user_context';

import { LoginScreenNavigationProp, LoginScreenRouteProp, redirectToSignUp, redirectToStoreSelection } from '../models/navigation.model';
import { ILoginResponse, User } from '../models/user.model';
import { UserService } from '../services/user_service';


import { createErrorAlert } from '../utils/utils';
import { StyledButton } from '../components/styled_button';

type Props = {
    navigation: LoginScreenNavigationProp,
    route: LoginScreenRouteProp
}

const styles = StyleSheet.create({
    labelInputs: {
        paddingLeft: 15,
        paddingRight: 15,
        bottom: '20%'
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    signUpText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    loginBtn: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#85bb65', 
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    loginTitles: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        bottom: '65%',
        color: '#85bb65'
    }
});

const LoginComponent = ({ route, navigation }: Props) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const passwordInput = useRef<HTMLInputElement | null>(null);

    const userContext = useContext(UserContext);

    const userService = useMemo(() => new UserService(), []);

    const onSigninButtonPress = () => {
        if(username == "" || password == ""){
            if(username == ""){
                createErrorAlert("Please enter username.");
                return;
            }
            if(password == ""){
                createErrorAlert("Please enter password.");
                return;
            }
        }
        let attemptedLogin: User = new User(username, password);

        userService.login(attemptedLogin)
        .then((response) => {
            if (userContext.setAccessToken !== null){
                userContext.setAccessToken(response.data.accessToken);
            }
            if (userContext.setUserId !== null){
                userContext.setUserId(response.data.userId);
            }
            redirectToStoreSelect(response.data)
        })
        .catch((error: AxiosError) => {console.error(error); setPassword(''); });
    }

    const onSignupTextPress = () => {
        redirectToSignUp(navigation);
    }

    const redirectToStoreSelect = (loginResponse: ILoginResponse) => {
        if (loginResponse != undefined){
            redirectToStoreSelection(navigation);
        }
    }

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitles}>Login Page</Text>
            <View style={styles.labelInputs}>
                <FloatingLabelInput
                    label={'Username'}
                    value={username}
                    isPassword={false}
                    onChangeText={(val: string) => setUsername(val)}
                    onSubmitEditing={() => {
                        if (passwordInput.current !== null){
                            passwordInput.current.focus();
                        }
                    }}
                    blurOnSubmit={false}
                />
                <FloatingLabelInput
                    ref={passwordInput}
                    label={'Password'}
                    value={password}
                    isPassword={true}
                    onChangeText={(val: string) => setPassword(val)}
                    customShowPasswordComponent={<Text>Show</Text>}
                    customHidePasswordComponent={<Text>Hide</Text>}
                />
                <StyledButton
                    styles={styles.loginBtn}
                    title="Log in"
                    onPress={() => onSigninButtonPress()  } 
                />
            </View>
            <Text style={styles.signUpText} onPress={() => onSignupTextPress() }>Don’t have an account? Sign up here.</Text>
        </View> 
    );

};

export default LoginComponent;
