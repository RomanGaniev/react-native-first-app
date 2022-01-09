import React from 'react'
import { StyleSheet } from 'react-native'

import { MessengerScreen } from './MessengerScreen'
import { ChatScreen } from './ChatScreen'
import { ChatHeader } from '../../../components/messenger/ChatHeader'
import { OpenDrawerButton } from '../../../components/OpenDrawerButton'
import { HeaderRightButton } from '../../../components/HeaderRightButton'

import { useMessengerDispatch } from '../../../states/messenger/messengerContext'

import { createStackNavigator } from '@react-navigation/stack'
const MessengerStack = createStackNavigator()

const MessengerStackScreen = ({navigation}) => {
  
  const {
    toggleModalCreateChatVisible,
    toggleModalEditChatVisible
  } = useMessengerDispatch()

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
    <MessengerStack.Navigator
      screenOptions={screenOptions}
    >
      <MessengerStack.Screen
        name="MessengerScreen"
        component={MessengerScreen}
        options={{
          title:'Чаты',
          headerShadowVisible: false,
          headerLeft: () => (
            <OpenDrawerButton
              onPress={navigation.openDrawer}
            />
          ),
          headerRight: () => (
            <HeaderRightButton
              onPress={toggleModalCreateChatVisible}
              icon='create-outline'
              size={30}
            />
          )
        }}
      />
      <MessengerStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route })=> ({
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#2887f5',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0
          },
          headerTitle: () => (
            <ChatHeader chat={route.params.chat} />
          ),
          headerTitleAlign: 'left',
          headerTitleContainerStyle: {
            marginLeft: 0
          },
          headerRight: () => (
            <HeaderRightButton
              onPress={toggleModalEditChatVisible}
              icon='ellipsis-horizontal-sharp'
              size={28}
            />
          )
        })}
      />
    </MessengerStack.Navigator>
  )
}

export default MessengerStackScreen

const styles = StyleSheet.create({
  //
})