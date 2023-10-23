import React, { useEffect } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { CustomActivityIndicator } from './src/components/CustomActivityIndicator'

import MainDrawerScreen from './src/screens/drawer/MainDrawerScreen'
import RootStackScreen from './src/screens/root/RootStackScreen'

import { Axios, Echo } from './services/boot'
import Api from './services/api'
const api = new Api('Auth')
// import _ from 'lodash'

import * as Device from 'expo-device'
import * as SecureStore from 'expo-secure-store'

import { AuthDispatchContext, AuthStateContext, authReducer } from './src/states/auth'
//
export default function App() {

  const initialAuthState = {
    isLoading: true,
    user: {
      token: null,
      info: null
    }
  }

  const [authState, dispatch] = React.useReducer(authReducer, initialAuthState)

  const authDispatch = React.useMemo(() => ({
    signIn: async(access_token) => {
      let userInfoData = null
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
          userInfoData = data.data
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {

        })
      dispatch({ type: 'LOGIN', token: access_token, info: userInfoData })
    },
    signOut: async() => {
      try {
        if (Device.brand) {
          await SecureStore.deleteItemAsync('access_token')
        } else {
          localStorage.removeItem('access_token')
        }
      } catch(e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })
    }
  }), [])

  useEffect(() => {
    (async () => {
      async function retrieve () {
        let userToken = null
        let userInfoData = null
        try {
          if (Device.brand) {
            userToken = await SecureStore.getItemAsync('access_token')
          } else {
            userToken = localStorage.getItem('access_token')
          }

          Axios.setToken(userToken)

          api.call('me')
            .then(({ data }) => {
              console.log('me: ', data)
              if (data.data.email) {
                userInfoData = data.data
              }


            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              dispatch({ type: 'RETRIEVE_USER', token: userToken, info: userInfoData })
            })

        } catch(e) {
          console.log('me catch: ', e)
        }
      }
      await retrieve()
    })()
  }, [])

  if (authState.isLoading) return <CustomActivityIndicator size='large' color='#2887f5' />

  return (
    <AuthDispatchContext.Provider value={authDispatch}>
      <AuthStateContext.Provider value={authState}>
        <NavigationContainer>
          { authState.user.token !== null && authState.user.info !== null ?
            <MainDrawerScreen />
          :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}



// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default function App() {
//   return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <StatusBar style="auto" />
//       </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });