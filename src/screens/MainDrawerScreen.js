import React, { useState, useEffect, useLayoutEffect } from 'react'

import MainTabScreen from './MainTab/MainTabScreen'
import SearchScreen from '../screens/SearchScreen'
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
      <Drawer.Screen name="SearchScreen" component={SearchScreen} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
    </Drawer.Navigator>
  )
}

export default MainDrawerScreen
