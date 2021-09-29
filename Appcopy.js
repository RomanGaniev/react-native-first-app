import React from "react";
import { View, Text, StyleSheet, Button} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Posts from './src/screens/Posts'
import Auth from './src/screens/Auth'
import Registration from './src/screens/Registration'
import { NavigationContainer } from "@react-navigation/native";
import { Axios } from './src/boot'

import Api from './src/services/api';
const api = new Api('Coin');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();

async function deleteToken() {
  // try {
  //   const token = await SecureStore.getItemAsync('access_token')
  // } catch (e) {
    await SecureStore.deleteItemAsync('access_token')
  // }
}

function logout() {
  api.call('logout')
    .then(({ data }) => {
      deleteToken()
      
      Axios.setToken(null);
    })
    .catch(error => {
      // alert('Произошла ошибка')
      Stack.navigation.navigate('Auth');
      // navigation.navigate('Auth');
      
    })
    .finally(() => {
      //
    })
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            title: 'Авторизация',
            headerStyle: {
              backgroundColor: '#2787f5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: 'Назад'
          }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: 'Регистрация',
            headerStyle: {
              backgroundColor: '#2787f5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: ()=> null,
          }}
        />
        <Stack.Screen
          name="Posts"
          component={Posts}
          options={{
            title: 'Новости',
            headerStyle: {
              backgroundColor: '#2787f5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: 'Назад',
            gestureEnabled: false,
            headerLeft: ()=> null,
            headerRight: () => (
              <Button
                onPress={() => logout({})}
                title="Выйти"
                color="pink"
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  }
});