import React from 'react';
import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {StackParamList} from './models/navigation.model';
import ItemsComponent from './screens/items';
import LoginComponent from './screens/login';
import StoreSelectionComponent from './screens/store_selection';
import ItemDetailsComponent from './screens/item_details';
import ItemUpdateComponent from './screens/item_update';
import ItemAddComponent from './screens/item_add';
import PriceAddComponent from './screens/price_add';
import PriceViewComponent from './screens/price_view';
import SignUpComponent from './screens/sign_up';
import {UserProvider} from './contexts/user_context';
import {PropProvider} from './contexts/prop_context';

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <UserProvider>
          <PropProvider>
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
                options={{title: 'Shopping List'}}
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
              <Stack.Screen
                name="PriceView"
                component={PriceViewComponent}
                options={{title: 'View all Prices'}}
              />
            </Stack.Navigator>
          </PropProvider>
        </UserProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 18,
  },
});
