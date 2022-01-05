import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { FriendsScreen } from './FriendsScreen'
import { FriendRequestsScreen } from './FriendRequestsScreen'
import { AuthStateContext } from '../../../states/auth'

import { ChatScreen } from '../Messenger/ChatScreen'
import { ChatHeader } from '../../../components/ChatHeader'

import { createStackNavigator } from '@react-navigation/stack'
import UserProfileScreen from '../../UserProfileScreen'
const FriendshipStack = createStackNavigator()

const FriendshipStackScreen = ({navigation}) => {
  const { user } = useContext(AuthStateContext)

  return(
    <FriendshipStack.Navigator
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
      <FriendshipStack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{
          title:'Друзья',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.openDrawer} style={{paddingHorizontal: 10, flex: 1, justifyContent: 'center'}}>
              <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
                <Image source={{uri: user.info.avatar}} style={styles.avatar} />
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <FriendshipStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={({ route })=> ({
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#2887f5',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 21,
            color: 'black'
          },
          title: route.params.userParam.email
        })}
      />
      <FriendshipStack.Screen
        name="FriendRequestsScreen"
        component={FriendRequestsScreen}
        options={({ route })=> ({
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#2887f5',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 21,
            color: 'black'
          },
          title: 'Заявки'
        })}
      />
      <FriendshipStack.Screen
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
          }
        })}
      />
    </FriendshipStack.Navigator>
  )
}

export default FriendshipStackScreen

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})