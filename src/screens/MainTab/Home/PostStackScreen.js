import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet, TouchableOpacity } from 'react-native'

import {
  Ionicons
} from '@expo/vector-icons'

import { PostScreen } from './PostScreen'

import { AuthStateContext } from '../../../states/auth'

const PostStack = createStackNavigator();

const PostStackScreen = (props) => {

  const { user } = useContext(AuthStateContext)

  return(
    <PostStack.Navigator initialRouteName='PostScreen'
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
      <PostStack.Screen
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
            <TouchableOpacity onPress={() => console.log('options')} style={{justifyContent: 'center', flex: 1, paddingHorizontal: 10}}>
              <Ionicons name="ellipsis-horizontal-sharp" size={23} color="#2887f5" />
            </TouchableOpacity>
          )
        }}
      />
    </PostStack.Navigator>
  )
}

export default PostStackScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    // marginRight: 11,
    borderRadius: 20
  },
});