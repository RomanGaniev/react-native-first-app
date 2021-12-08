import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';

import {
  Ionicons,
  Fontisto,
  Feather,
  MaterialCommunityIcons
} from '@expo/vector-icons';

import {
  HomeScreen,
  DetailsScreen,
  ProfileScreen,
  ExploreScreen
} from './MainTabs'

import {
  PostScreen
} from './MainTabs/Home/PostScreen'
import { View } from 'react-native-animatable';

const HomeStack = createStackNavigator();
// const PostStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline'
          } else if (route.name === 'Notifications') {
            iconName = 'notifications-outline'
          } else if (route.name === 'Profile') {
            iconName = 'comment'
            return <Fontisto name={iconName} size={25} color={color} />
            // return <Feather name={iconName} size={28} color={color} />;
          } else if (route.name === 'Explore') {
            iconName = 'people-outline'
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#2887f5',
        tabBarInactiveTintColor: 'grey',
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
          tabBarLabel: 'Главная'
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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Мессенджер'
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Друзья'
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
        title:'Главная',
        headerShadowVisible: false,
        headerLeft: () => (
          <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
        ),
        // headerRight: () => (
        //   <MaterialCommunityIcons.Button name="plus-circle" size={25} backgroundColor="#2787f5" onPress={() => navigation.navigate('AddPostScreen')}></MaterialCommunityIcons.Button>
        // )
      }}
    />
    <HomeStack.Screen
      name="PostScreen"
      component={PostScreen}
      options={{
        title:'Запись',
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTintColor: '#2887f5',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 21,
          color: 'black'
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('options')} style={{justifyContent: 'center', flex: 1, paddingHorizontal: 10}}>
            <Ionicons name="ellipsis-horizontal-sharp" size={23} color="#2887f5" />
          </TouchableOpacity>
        )
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
  <DetailsStack.Screen
    name="Details"
    component={DetailsScreen}
    options={{
      headerLeft: () => (
        <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
      )
    }} />
</DetailsStack.Navigator>
);

const styles = StyleSheet.create({
  // headerBackTitle: {
  //   color: 'red',
  //   backgroundColor: 'green'
  // },
});