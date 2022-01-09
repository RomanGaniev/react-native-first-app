import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet } from 'react-native'

import { HomeScreen } from './HomeScreen'

import { PostScreen } from './PostScreen'
import MyProfileScreen from '../../MyProfileScreen'

import { AuthStateContext } from '../../../states/auth'
import { OpenDrawerButton } from '../../../components/OpenDrawerButton'
import { HeaderRightButton } from '../../../components/HeaderRightButton'

const HomeStack = createStackNavigator()

const HomeStackScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)

  const screenOptions = {
    headerStyle: {
      backgroundColor: '#ffffff',
      height: 70
    },
    headerTintColor: 'black',
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 21
    }
  }

  return(
    <HomeStack.Navigator
      screenOptions={screenOptions}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title:'Главная',
          headerShadowVisible: false,
          headerLeft: () => (
            <OpenDrawerButton
              onPress={navigation.openDrawer}
            />
          )
        }}
      />
      <HomeStack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          title:'Запись',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#2887f5',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 21,
            color: 'black'
          },
          headerRight: () => (
            <HeaderRightButton
              icon='ellipsis-horizontal-sharp'
              size={28}
            />
          )
        }}
      />
      <HomeStack.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
        options={{
          title: user.info.email,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#2887f5',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 21,
            color: 'black'
          }
        }}
      />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen

const styles = StyleSheet.create({
  //
})