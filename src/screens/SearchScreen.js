import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableHighlight } from 'react-native'

import {
  Avatar,
  Title,
  Caption,
  Drawer
} from 'react-native-paper'

import { CustomActivityIndicator } from '../components/CustomActivityIndicator'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

const SearchScreen = ({ navigation }) => {

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
        
          users.map((user, index) => (
            <TouchableHighlight onPress={() => goToUserProfile(user)} underlayColor="#e1e1e1" key={'user-' + index}>
              <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent'}}>
                <Avatar.Image 
                  source={{uri: user.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={55}
                />
                
                <View style={{marginLeft: 12, flexDirection: 'column', flex: 1}}>
                  <Title style={styles.title}>{`${user.first_name} ${user.last_name}`}</Title>
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