import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';

import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  HomeScreen,
  DetailsScreen,
  ProfileScreen,
  ExploreScreen
} from './MainTabs'
import { View } from 'react-native-animatable';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'md-notifications' : 'md-notifications-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'face' : 'face-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        style: {
          backgroundColor: '#08457e',
       },
       headerShown: false
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Публикации'
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Уведомления'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль'
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Что-то'
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
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
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title:'Публикации',
        headerLeft: () => (
          <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
        ),
        // headerRight: () => (
        //   <MaterialCommunityIcons.Button name="plus-circle" size={25} backgroundColor="#2787f5" onPress={() => navigation.navigate('AddPostScreen')}></MaterialCommunityIcons.Button>
        // )
      }}
    />
  </HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
<DetailsStack.Navigator
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
  <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
  headerLeft: () => (
      <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
  )
  }} />
</DetailsStack.Navigator>
);