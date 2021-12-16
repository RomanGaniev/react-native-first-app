import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

import {
  Ionicons
} from '@expo/vector-icons';

import {
  HomeScreen
} from './HomeScreen'

import { PostScreen } from './PostScreen'

import { View } from 'react-native-animatable';
import { AuthStateContext } from '../../../states/auth';

const HomeStack = createStackNavigator();

const HomeStackScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)

  return(
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
            <TouchableOpacity onPress={navigation.openDrawer} style={{paddingHorizontal: 10}}>
              <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
                <Image source={{uri: user.info.avatar}} style={styles.avatar} />
              </View>
            </TouchableOpacity>
            // <MaterialCommunityIcons.Button name="menu" size={25} backgroundColor="#ffffff" color="black" onPress={() => navigation.openDrawer()}></MaterialCommunityIcons.Button>
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
  )
}

export default HomeStackScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    // marginRight: 11,
    borderRadius: 20
  },
});