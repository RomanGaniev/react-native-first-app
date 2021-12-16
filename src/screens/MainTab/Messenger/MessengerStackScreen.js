import React, { useState, useEffect, useLayoutEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
  MessengerScreen
} from './MessengerScreen'

import { ChatScreen } from './ChatScreen'

import { View } from 'react-native-animatable';

const MessengerStack = createStackNavigator();

import { AuthStateContext } from '../../../states/auth/authStateContext';

const MessengerStackScreen = ({navigation}) => {

  return(
    <MessengerStack.Navigator
      screenOptions={{
        headerStyle: {
        backgroundColor: '#ffffff',
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
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{paddingHorizontal: 10}}>
              <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
                {/* {console.log('userInfo in messenger', userInfo)} */}
                {/* <Image source={{uri: user?.avatar}} style={styles.avatar} /> */}
              </View>
            </TouchableOpacity>
            // <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
          ),
          // headerRight: () => (
          //   <MaterialCommunityIcons.Button name="plus-circle" size={25} backgroundColor="#2787f5" onPress={() => navigation.navigate('AddPostScreen')}></MaterialCommunityIcons.Button>
          // )
        }}
      />
      <MessengerStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          // tabBarStyle: {}, // DONT WORKING
          title:'Переписка',
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
    </MessengerStack.Navigator>
  )
}

export default MessengerStackScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    // marginRight: 11,
    borderRadius: 20
  },
});