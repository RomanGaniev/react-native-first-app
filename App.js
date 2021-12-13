import React, { useEffect } from "react"
import { View } from "react-native"
import * as Device from 'expo-device'

import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ActivityIndicator } from 'react-native-paper'
import { DrawerContent } from './src/screens/DrawerContent'

import MainTabScreen from './src/screens/MainTabScreen'
import SupportScreen from './src/screens/SupportScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import BookmarkScreen from './src/screens/BookmarkScreen'

import RootStackScreen from './src/screens/RootStackScreen'

import { Axios, Pusher } from './src/services/boot'
import Api from './src/services/api'
const api = new Api('Auth')
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store'

import { AuthContext, authReducer } from './src/states/auth'

const Drawer = createDrawerNavigator()

const App = () => {
  const initialAuthState = {
    isLoading: true,
    user: {
      token: null,
      info: null
    }
  }

  const [authState, dispatch] = React.useReducer(authReducer, initialAuthState)

  const authContext = React.useMemo(() => ({
    signIn: async(access_token) => {
      try {
        if (Device.brand) {
          await SecureStore.setItemAsync('access_token', access_token)
        } else {
          localStorage.setItem('access_token', access_token)
        }
        Axios.setToken(access_token)
      } catch(e) {
        console.log(e)
      }
      await api.call('me')
        .then(({ data }) => {
          setUserInfo(data.data)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          //
        })

      dispatch({ type: 'LOGIN', token: access_token })
    },
    signOut: async() => {
      try {
        if (Device.brand) {
          await SecureStore.deleteItemAsync('access_token')
          await SecureStore.deleteItemAsync('user_info')
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_info')
        }
      } catch(e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })
    },
    signUp: () => {
      //
    },
    userInfo: authState.user.info
  }), [])

  useEffect(() => {
    (async () => {
      async function retrieve () {
        // setIsLoading(false);
        let userToken = null
        let userInfoData = null
        try {
          if (Device.brand) {
            userToken = await SecureStore.getItemAsync('access_token')
          } else {
            userToken = localStorage.getItem('access_token')
          }
  
          Axios.setToken(userToken)
  
          await api.call('me')
            .then(({ data }) => {
              userInfoData = data.data
              console.log('userInfoData', userInfoData)
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              //            
            })
  
        } catch(e) {
          console.log(e)
        }
        
        dispatch({ type: 'RETRIEVE_USER', token: userToken, info: userInfoData })
      }
      await retrieve()
    })()
  }, [])

  if( authState.isLoading ) {
    return(
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="grey"/>
      </View>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        { (authState.user.token !== null) && (authState.user.info !== null) ? (
          <Drawer.Navigator screenOptions={{
            headerShown: false
          }} drawerContent={props => <DrawerContent {...props} />}>
            {console.log('LOG authState.user.info: ', authState.user.info)}
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
            {/* <Drawer.Screen name="ChatScreen" component={ChatScreen} /> */}
            <Drawer.Screen name="SupportScreen" component={SupportScreen} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
            <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
          </Drawer.Navigator>
        ) :
        <RootStackScreen/>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default App