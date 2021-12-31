import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { FriendsScreen } from './FriendsScreen'
import { AuthStateContext } from '../../../states/auth'

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
          // headerTitle: () => <ChatHeader chat={route.params.chat} />,
          // headerTitleAlign: 'left',
          // headerTitleContainerStyle: {
          //   marginLeft: 0
          // }
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