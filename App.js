import React, { useEffect } from "react";
import { View } from "react-native";
import * as Device from 'expo-device';

import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  ActivityIndicator
} from 'react-native-paper';

import { DrawerContent } from './src/screens/DrawerContent';

import MainTabScreen from './src/screens/MainTabScreen';
import SupportScreen from './src/screens/SupportScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';

import RootStackScreen from './src/screens/RootStackScreen';

import { Axios, Pusher } from './src/services/boot';
import Api from './src/services/api';
const api = new Api('Coin');
import _ from 'lodash';

import * as SecureStore from 'expo-secure-store';

import { AuthContext, authReducer } from './src/states/auth'

async function getToken() {
  let tokenStorage = ""
  if (Device.brand) {
    tokenStorage = await SecureStore.getItemAsync('access_token');
  } else {
    tokenStorage = localStorage.getItem('access_token');
  }
  console.log('ТОКЕН ХРАНИЛИЩА: ', tokenStorage)
}

getToken();

const Drawer = createDrawerNavigator();

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const initialAuthState = {
    isLoading: true,
    userToken: null,
  };

  const [authState, dispatch] = React.useReducer(authReducer, initialAuthState);

  const authContext = React.useMemo(() => ({
    signIn: async(access_token) => {

      try {
        if (Device.brand) {
          await SecureStore.setItemAsync('access_token', access_token);
        } else {
          localStorage.setItem('access_token', access_token);
        }
        Axios.setToken(access_token);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', token: access_token });
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        if (Device.brand) {
          await SecureStore.deleteItemAsync('access_token');
        } else {
          localStorage.removeItem('access_token');
        }
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
        if (Device.brand) {
          userToken = await SecureStore.getItemAsync('access_token');
        } else {
          userToken = localStorage.getItem('access_token');
        }
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( authState.isLoading ) {
    return(
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="grey"/>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          { authState.userToken !== null ? (
            <Drawer.Navigator screenOptions={{
              headerShown: false
            }} drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen name="SupportScreen" component={SupportScreen} />
              <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
              <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
            </Drawer.Navigator>
          ) :
          <RootStackScreen/>
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;