import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  SplashScreen,
  SignInScreen,
  SignUpScreen,
  ExploreScreen
} from './RootStack'

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;