import React, { useEffect, useState, useContext } from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'

import {
  Avatar,
  Title,
  Caption,
  Drawer
} from 'react-native-paper'

import { MaterialIcons } from '@expo/vector-icons';

import { CustomActivityIndicator } from '../components/CustomActivityIndicator'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { AuthStateContext } from '../states/auth/authStateContext'

const SearchScreen = ({ navigation }) => {

  const { user } = useContext(AuthStateContext)

  const [ users, setUsers ] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    showUsers()
  }, [])

  const showUsers = () => {
    api.call('showUsers')
      .then(({data}) => {
        setUsers(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const addToFriends = (otherUser) => {
    if(!otherUser.friendship) {
      sendFriendRequest(otherUser.id)
    } else if(otherUser.friendship.status === 'pending' && otherUser.friendship.acted_user !== user.info.id) {
      acceptFriendRequest(otherUser.id)
    }
  }

  const sendFriendRequest = (otherUserId) => {
    api.call('sendFriendRequest', {otherUserId})
      .then(({ data }) => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  const acceptFriendRequest = (otherUserId) => {
    api.call('acceptFriendRequest', {otherUserId})
      .then(({ data }) => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  const goToUserProfile = (user) => {
    navigation.navigate("UserProfileScreen", {
      userParam: user,
    })
  }

  if (isLoading) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
        { 
        
          users.map((item, index) => (
            <TouchableHighlight onPress={() => goToUserProfile(item)} underlayColor="#e1e1e1" key={'user-' + index}>
              <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent'}}>
                <Avatar.Image 
                  source={{uri: item.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={55}
                />
                
                <View style={{marginLeft: 12, flexDirection: 'column', flex: 1}}>
                  <Title style={styles.title}>{`${item.first_name} ${item.last_name}`}</Title>
                  <View style={{flexDirection:'row', marginRight: 60, justifyContent: 'space-between'}}>
                    <Caption numberOfLines={1} style={[styles.caption, {fontSize: 15, lineHeight: 15}]}>Уфа</Caption>
                  </View>
                  
                  
                </View>
                { (!item.friendship || item.friendship.status === 'pending') &&
                  <TouchableOpacity onPress={() => addToFriends(item)} activeOpacity={0.5} style={{justifyContent: 'center', padding: 10}}>
                    <MaterialIcons name="person-add" size={30} color="#2887f5" />
                  </TouchableOpacity>
                }
              </View>
            </TouchableHighlight>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
    color: 'black'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey'
  },
  captionTime: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey'
  },
})