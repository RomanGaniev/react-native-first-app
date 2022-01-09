import React from 'react'

import MainTabScreen from '../main-tab/MainTabScreen'
import SearchScreen from './SearchScreen'
import SettingsScreen from './SettingsScreen'
import BookmarkScreen from './BookmarkScreen'

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
