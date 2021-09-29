import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Posts from './src/screens/Posts';
import Auth from './src/screens/Auth';
import Registration from './src/screens/Registration';
import { NavigationContainer } from "@react-navigation/native";
import { Axios } from './src/boot';

import { AuthContext } from './src/components/context';

import Api from './src/services/api';
const api = new Api('Coin');
import _ from 'lodash';

import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

// async function deleteToken() {
//   // try {
//   //   const token = await SecureStore.getItemAsync('access_token')
//   // } catch (e) {
//     await SecureStore.deleteItemAsync('access_token')
//   // }
// }
// deleteToken();

async function getToken() {
  const tokenStorage = await SecureStore.getItemAsync('access_token')
  console.log('ТОКЕН ХРАНИЛИЩА: ', tokenStorage)

  const tokenAxios = Axios.getToken()
  console.log('ТОКЕН AXIOS: ', tokenAxios)
}

getToken();

// function logout() {
//   api.call('logout')
//     .then(({ data }) => {
//       deleteToken()
      
//       Axios.setToken(null);
//     })
//     .catch(error => {
//       deleteToken()
      
//       Axios.setToken(null);
//       // alert('Произошла ошибка')
//       // Stack.navigation.navigate('Auth');
//       // navigation.navigate('Auth');
      
//     })
//     .finally(() => {
//       //
//     })
// }

export default function App({ navigation }) {
  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(access_token) => {

      try {
        await SecureStore.setItemAsync('access_token', access_token);
        Axios.setToken(access_token);
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', token: access_token });
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await SecureStore.deleteItemAsync('access_token');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await SecureStore.getItemAsync('access_token');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        { loginState.userToken !== null ? (
          <Stack.Navigator>
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
                // headerRight: () => (
                //   <Button
                //     onPress={() => logout({})}
                //     title="Выйти"
                //     color="pink"
                //   />
                // ),
              }}
            />
          </Stack.Navigator>
        ) :
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
        </Stack.Navigator>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}