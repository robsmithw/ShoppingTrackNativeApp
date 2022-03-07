import IItem from './item.model';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type StackParamList = {
    Login: undefined;
    SignUp: undefined;
    StoreSelection: undefined;
    Items: undefined;
    ItemDetails: undefined; 
    ItemUpdate: undefined;
    ItemAdd: undefined;
    PriceAdd: undefined;
    PriceView: undefined;
  };

// Login Props
export type LoginScreenNavigationProp = StackNavigationProp<StackParamList, 'Login'>;
export type LoginScreenRouteProp = RouteProp<StackParamList, 'Login'>;

// SignUp Props
export type SignUpScreenNavigationProp = StackNavigationProp<StackParamList, 'SignUp'>;
export type SignUpScreenRouteProp = RouteProp<StackParamList, 'SignUp'>;

// Store Selection Props
export type StoreSelectionScreenNavigationProp = StackNavigationProp<StackParamList, 'StoreSelection'>;
export type StoreSelectionScreenRouteProp = RouteProp<StackParamList, 'StoreSelection'>;

// Items Props
export type ItemsScreenNavigationProp = StackNavigationProp<StackParamList, 'Items'>;
export type ItemsScreenRouteProp = RouteProp<StackParamList, 'Items'>;

//Item Details Props
export type ItemDetailsScreenNavigationProp = StackNavigationProp<StackParamList, 'ItemDetails'>;
export type ItemDetailsScreenRouteProp = RouteProp<StackParamList, 'ItemDetails'>;

//Item Update Props
export type ItemUpdateScreenNavigationProp = StackNavigationProp<StackParamList, 'ItemUpdate'>;
export type ItemUpdateScreenRouteProp = RouteProp<StackParamList, 'ItemUpdate'>;

//Item Add Props
export type ItemAddScreenNavigationProp = StackNavigationProp<StackParamList, 'ItemAdd'>;
export type ItemAddScreenRouteProp = RouteProp<StackParamList, 'ItemAdd'>;

//Price Add Props
export type PriceAddScreenNavigationProp = StackNavigationProp<StackParamList, 'PriceAdd'>;
export type PriceAddScreenRouteProp = RouteProp<StackParamList, 'PriceAdd'>;

//Price View Props
export type PriceViewScreenNavigationProp = StackNavigationProp<StackParamList, 'PriceView'>;
export type PriceViewScreenRouteProp = RouteProp<StackParamList, 'PriceView'>;

//Navigations
export const redirectToLogin = (navigation: any) => {
  navigation.navigate('Login', undefined);
}

export const redirectToSignUp = (navigation: any) => {
  navigation.navigate('SignUp', undefined);
}

export const redirectToStoreSelection = (navigation: any) => {
  navigation.navigate('StoreSelection', undefined);
}

export const redirectToHome = (navigation: any) => {
  navigation.navigate('Items', undefined);
}

export const redirectToItemDetails = (navigation: any) => {
  navigation.navigate('ItemDetails', undefined);
}

export const redirectToItemUpdate = (navigation: any) => {
  navigation.navigate('ItemUpdate', undefined);
}

export const redirectToItemAdd = (navigation: any) => {
  navigation.navigate('ItemAdd', undefined);
}

export const redirectToPriceAdd = (navigation: any) => {
  navigation.navigate('PriceAdd', undefined);
}

export const redirectToPriceView = (navigation: any) => {
  navigation.navigate('PriceView', undefined);
}
