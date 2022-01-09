import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthorizationScreen } from './AuthorizationScreen'

const RootStack = createStackNavigator()

const RootStackScreen = () => (
    <RootStack.Navigator screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="AuthorizationScreen"  component={AuthorizationScreen} />
    </RootStack.Navigator>
)

export default RootStackScreen