import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { Ionicons, Fontisto } from '@expo/vector-icons'

import FriendshipStackScreen from './friends/FriendshipStackScreen'
import HomeStackScreen from './home/HomeStackScreen'
import MessengerStackScreen from './messenger/MessengerStackScreen'

import { MessengerProvider } from '../../states/messenger/messengerContext'

const Tab = createBottomTabNavigator()

const MainTabScreen = ({navigation}) => {

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName
      let iconSize

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
  })
  
  return (
    <MessengerProvider>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarLabel: 'Главная',
          }}
        />
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

export default MainTabScreen

const styles = StyleSheet.create({
  //
})