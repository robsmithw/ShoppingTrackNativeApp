import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { redirectToLogin, SignUpScreenNavigationProp, SignUpScreenRouteProp } from '../models/navigation.model';
import { IUser, User } from '../models/user.model';
import { login, register } from '../utilities/api';
import Toast from 'react-native-simple-toast';
import { createErrorAlert, StyledButton } from '../utilities/utils';
import { TouchableHighlight } from 'react-native-gesture-handler';

type Props = {
    navigation: SignUpScreenNavigationProp,
    route: SignUpScreenRouteProp
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
    signUpBtn: {
        height: 50,
        borderRadius: 20,
        //this background color for some reason makes it not square anymore
        backgroundColor: '#85bb65', 
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    signUpText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    loginTitles: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        bottom: '50%',
        color: '#85bb65'
    }
});

const SignUpComponent = ({ route, navigation }: Props) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const onSignupButtonPress = () => {

        if(email == "" || username == "" || password == "" || confirmPassword == ""){
            if(email == ""){
                createErrorAlert("Email is required.");
                return;
            }
            if(username == ""){
                createErrorAlert("Username is required.");
                return;
            }
            if(password == ""){
                createErrorAlert("Password is required.");
                return;
            }
            if(confirmPassword == ""){
                createErrorAlert("Please confirm password.");
                setPassword("");
                return;
            }
        }

        if(password != confirmPassword){
            createErrorAlert("Passwords do not match.");
            setPassword("");
            setConfirmPassword("");
            return;
        }

        let attemptedRegister: User = new User(username, password, email);
        
        register(attemptedRegister)
        .then((json: IUser) => redirectToLogin(navigation))
        .catch(error => {
            setPassword('');
            createErrorAlert(error.message)
        });
    }

    const onSigninTextPress = () => {
        redirectToLogin(navigation);
    }

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitles}>Sign Up Page</Text>
            <View style={styles.labelInputs}>
                <FloatingLabelInput
                    label={'Email'}
                    value={email}
                    isPassword={false}
                    keyboardType={"email-address"}
                    onChangeText={(val: string) => setEmail(val)}
                />
                <FloatingLabelInput
                    label={'Username'}
                    value={username}
                    isPassword={false}
                    onChangeText={(val: string) => setUsername(val)}
                />
                <FloatingLabelInput
                    label={'Password'}
                    value={password}
                    isPassword={true}
                    onChangeText={(val: string) => setPassword(val)}
                    customShowPasswordComponent={<Text>Show</Text>}
                    customHidePasswordComponent={<Text>Hide</Text>}
                />
                <FloatingLabelInput
                    label={'Confirm Password'}
                    value={confirmPassword}
                    isPassword={true}
                    onChangeText={(val: string) => setConfirmPassword(val)}
                    customShowPasswordComponent={<Text>Show</Text>}
                    customHidePasswordComponent={<Text>Hide</Text>}
                />
                <StyledButton
                    styles={styles.signUpBtn}
                    title="Sign up"
                    onPress={() => onSignupButtonPress()}
                />
            </View>
            <Text style={styles.signUpText} onPress={() => onSigninTextPress() }>Back to sign in page.</Text>
        </View>
    );

};

export default SignUpComponent;