import React, {useState, useEffect} from 'react'
import { View, Text, Button, StyleSheet, SafeAreaView, TouchableHighlight, ScrollView } from 'react-native'

import Api from '../../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper';

export const FriendsScreen = ({navigation}) => {

  const [friends, setFriends] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    showFriends()
  }, [])

  const showFriends = () => {
    api.call('showFriends')
      .then(({ data }) => {
        // let friends = data
        console.log(data.data)
        setFriends(data.data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
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
      <ScrollView contentContainerStyle={{backgroundColor: 'white', flex: 1}}>
        { 
        
          friends.map((friend, index) => (
            <TouchableHighlight onPress={() => goToUserProfile(friend)} underlayColor="#e1e1e1" key={'friend-' + index}>
              <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent'}}>
                <Avatar.Image 
                  source={{uri: friend.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={55}
                />
                
                <View style={{marginLeft: 12, flexDirection: 'column', flex: 1}}>
                  <Title style={styles.title}>{`${friend.first_name} ${friend.last_name}`}</Title>
                  <View style={{flexDirection:'row', marginRight: 60}}>
                    
                    <Caption numberOfLines={1} style={[styles.caption, {fontSize: 15, lineHeight: 15}]}>Уфа</Caption>
                    
                  </View>
                  
                </View>
              </View>
            </TouchableHighlight>
          ))

        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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