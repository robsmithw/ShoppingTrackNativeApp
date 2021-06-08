import React from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ItemsComponent from './components/items.component';
import LoginComponent from './components/login.component';
import StoreSelectionComponent from './components/store_selection.component';
import { StackParamList } from './models/navigation.model';
import ItemDetailsComponent from './components/item_details.component';
import ItemUpdateComponent from './components/item_update.component';
import ItemAddComponent from './components/item_add.component';
import PriceAddComponent from './components/price_add.component';
import PriceViewComponent from './components/price_view.component';
import SignUpComponent from './components/sign_up.component';

const Stack = createStackNavigator<StackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login"
            component={LoginComponent}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpComponent}
            options={{title: 'Sign Up'}}
          />
          <Stack.Screen 
            name="StoreSelection"
            component={StoreSelectionComponent}
            options={{title: 'Store Selection'}}
          />
          <Stack.Screen
            name="Items"
            component={ItemsComponent}
            options={{title:'Shopping List'}} 
          />
          <Stack.Screen 
            name="ItemDetails"
            component={ItemDetailsComponent}
            options={{title: 'Item Details'}}
          />
          <Stack.Screen 
            name="ItemUpdate"
            component={ItemUpdateComponent}
            options={{title: 'Item Update'}}
          />
          <Stack.Screen 
            name="ItemAdd"
            component={ItemAddComponent}
            options={{title: 'Add an Item'}}
          />
          <Stack.Screen
            name="PriceAdd"
            component={PriceAddComponent}
            options={{title: 'Add a Price'}}
          />
          {/*Expo currently not supporting this: https://expo.canny.io/feature-requests/p/support-react-native-date-picker */}
          <Stack.Screen 
            name="PriceView"
            component={PriceViewComponent}
            options={{title: 'View all Prices'}}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 20 : 18
  },
});
