import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { MessengerScreen } from './MessengerScreen'
import { ChatScreen } from './ChatScreen'
import { ChatHeader } from '../../../components/ChatHeader'

import { AuthStateContext } from '../../../states/auth'
import { useMessengerState } from '../../../states/messenger/messengerContext'
import { useMessengerDispatch } from '../../../states/messenger/messengerContext'

import { createStackNavigator } from '@react-navigation/stack'
const MessengerStack = createStackNavigator()

const MessengerStackScreen = ({navigation}) => {
  const { user } = useContext(AuthStateContext)
  // const modalVisible = useMessengerState()
  const {toggleCreate, toggleEdit} = useMessengerDispatch()

  return(
    <MessengerStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          height: 70
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 21
        }
      }}>

      
      <MessengerStack.Screen
        name="MessengerScreen"
        component={MessengerScreen}
        options={{
          title:'Чаты',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.openDrawer} style={{paddingHorizontal: 10, flex: 1, justifyContent: 'center'}}>
              <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
                <Image source={{uri: user.info.avatar}} style={styles.avatar} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleCreate} style={{paddingHorizontal: 10, flex: 1, justifyContent: 'center'}}>
              <Ionicons name="create-outline" size={30} color="#2887f5" />
            </TouchableOpacity>
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
          headerTitle: () => <ChatHeader chat={route.params.chat} />,
          headerTitleAlign: 'left',
          headerTitleContainerStyle: {
            marginLeft: 0
          },
          headerRight: () => {
            return (
              <TouchableOpacity activeOpacity={0.5} onPress={toggleEdit} style={{justifyContent: 'center', paddingHorizontal: 12, flex: 1}}>
                <Ionicons name="ellipsis-horizontal-sharp" size={28} color="#2887f5" />
              </TouchableOpacity>
            )
          }
        })}
      />
    </MessengerStack.Navigator>
  )
}

export default MessengerStackScreen

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})