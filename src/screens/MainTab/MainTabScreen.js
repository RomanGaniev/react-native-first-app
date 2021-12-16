import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet} from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons, Fontisto } from '@expo/vector-icons';

import FriendsScreen from './Friends/FriendsScreen'
import HomeStackScreen from './Home/HomeStackScreen'
import MessengerStackScreen from './Messenger/MessengerStackScreen'

const Tab = createBottomTabNavigator();

import { AuthContext } from '../../states/auth/authDispatchContext';

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline'
          } else if (route.name === 'Notifications') {
            iconName = 'notifications-outline'
          } else if (route.name === 'Messenger') {
            iconName = 'comment'
            return <Fontisto name={iconName} size={25} color={color} />
            // return <Feather name={iconName} size={28} color={color} />;
          } else if (route.name === 'Friends') {
            iconName = 'people-outline'
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#2887f5',
        tabBarInactiveTintColor: 'grey',
        headerShown: false
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Главная',
        }}
      />
      {/* <Tab.Screen
        name="Notifications"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Уведомления'
        }}
      /> */}
      <Tab.Screen
        name="Messenger"
        component={MessengerStackScreen}
        options={({ route }) => ({
          tabBarLabel: 'Messenger',
          tabBarStyle: ((route) => {
            let routeName = getFocusedRouteNameFromRoute(route) ?? ""

            if (routeName === "ChatScreen") {
                return {display: 'none'}
            }

            return {}
          })(route),
        })}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Друзья'
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    // marginRight: 11,
    borderRadius: 20
  },
});