import React, { useState, useEffect, useLayoutEffect } from 'react'

import MainTabScreen from './MainTab/MainTabScreen'
import SupportScreen from '../screens/SupportScreen'
import SettingsScreen from '../screens/SettingsScreen'
import BookmarkScreen from '../screens/BookmarkScreen'

import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContent } from './DrawerContent'

const Drawer = createDrawerNavigator()

const MainDrawerScreen = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false
      }}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
      {/* <Drawer.Screen name="ChatScreen" component={ChatScreen} /> */}
      <Drawer.Screen name="SupportScreen" component={SupportScreen} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
    </Drawer.Navigator>
  )
}

export default MainDrawerScreen
