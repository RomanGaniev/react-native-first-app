import React, { useEffect } from "react"

import { NavigationContainer } from '@react-navigation/native'
import { CustomActivityIndicator } from './src/components/CustomActivityIndicator'

import MainDrawerScreen from './src/screens/MainDrawerScreen'
import RootStackScreen from './src/screens/RootStack/RootStackScreen'

import { Axios, Echo } from './services/boot'
// import echo from './services/boot/pusherTest'
import Api from './services/api'
const api = new Api('Auth')
import _ from 'lodash'

import * as Device from 'expo-device'
import * as SecureStore from 'expo-secure-store'

import { AuthDispatchContext, AuthStateContext, authReducer } from './src/states/auth'

const App = () => {
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
              userInfoData = data.data
              
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              dispatch({ type: 'RETRIEVE_USER', token: userToken, info: userInfoData })
            })          
  
        } catch(e) {
          console.log(e)
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
  )
}

export default App