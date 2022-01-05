import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons, Fontisto } from '@expo/vector-icons';

import FriendshipStackScreen from './Friends/FriendshipStackScreen'
import HomeStackScreen from './Home/HomeStackScreen'
import MessengerStackScreen from './Messenger/MessengerStackScreen'

import { AuthStateContext } from '../../states/auth'
import { MessengerProvider } from '../../states/messenger/messengerContext';

const Tab = createBottomTabNavigator()

const MainTabScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)

  return (
    <MessengerProvider>
      <Tab.Navigator
        initialRouteName="Friends"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconSize;

            if (route.name === 'Home') {
              iconName = 'home-outline'
              iconSize = 26
            } else if (route.name === 'Notifications') {
              iconName = 'notifications-outline'
              iconSize = 28
            } else if (route.name === 'Messenger') {
              iconName = 'comment'
              iconSize = 24
              return <Fontisto name={iconName} size={iconSize} color={color} />
              // return <Feather name={iconName} size={28} color={color} />;
            } else if (route.name === 'Friends') {
              iconName = 'people-outline'
              iconSize = 28
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
          tabBarActiveTintColor: '#2887f5',
          tabBarInactiveTintColor: 'grey',
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600'
          },
          tabBarStyle: {
            height: 50,
            paddingBottom: 2
          }
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
            tabBarLabel: 'Мессенджер',
            tabBarStyle: ((route) => {
              let routeName = getFocusedRouteNameFromRoute(route) ?? ""

              if (routeName === "ChatScreen") {
                return {
                  display: 'none',
                  height: 50,
                  paddingBottom: 2
                }
              } else {
                return {
                  height: 50,
                  paddingBottom: 2
                }
              }
            })(route)
          })}
        />
        <Tab.Screen
          name="Friends"
          component={FriendshipStackScreen}
          options={({ route }) => ({
            tabBarLabel: 'Друзья',
            tabBarStyle: ((route) => {
              let routeName = getFocusedRouteNameFromRoute(route) ?? ""

              if (routeName === "ChatScreen") {
                return {
                  display: 'none',
                  height: 50,
                  paddingBottom: 2
                }
              } else {
                return {
                  height: 50,
                  paddingBottom: 2
                }
              }
            })(route)
          })}
        />
      </Tab.Navigator>
    </MessengerProvider>
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