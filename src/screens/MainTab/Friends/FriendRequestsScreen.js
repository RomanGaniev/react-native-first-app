import React, {useState, useEffect, useCallback} from 'react'
import { View, Text, RefreshControl, StyleSheet, SafeAreaView, TouchableHighlight, ScrollView, TouchableOpacity } from 'react-native'

import Api from '../../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper';

export const FriendRequestsScreen = ({ route }) => {

  const [requests, setRequests] = useState(route.params.friendRequests)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    showRequests()
  }, [])

  const showRequests = () => {
    api.call('showFriendRequests')
      .then(({ data }) => {
        setRequests(data.data)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }

  const acceptFriendRequest = (user_id) => {
    api.call('acceptFriendRequest', {otherUserId: user_id})
      .then(({ data }) => {
        console.log(data)
      })
  }

  const rejectOrCancelFriendRequest = (user_id) => {
    api.call('rejectOrCancelFriendRequest', {otherUserId: user_id})
      .then(({ data }) => {
        console.log(data)
      })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showRequests()
  }, [])


  if (isLoading) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
        { requests.map((request, index) => (
            <View key={'friend-' + index}>
              <View style={styles.userContainer}>
                <Avatar.Image 
                  source={{uri: request.user.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={70}
                />
                <View style={styles.user}>
                  <Title style={styles.title}>
                    {`${request.user.first_name} ${request.user.last_name}`}
                  </Title>
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      style={styles.button}
                      onPress={() => acceptFriendRequest(request.user.id)}
                    >
                      <Text style={styles.acceptTextButton}>Добавить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => rejectOrCancelFriendRequest(request.user.id)}
                      style={[styles.button, {marginLeft: 10, backgroundColor: '#ececec'}]}
                    >
                      <Text style={styles.rejectTextButton}>Отклонить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    fontWeight: '500',
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
  button: {
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  userContainer: {
    flexDirection:'row',
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  user: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1
  },
  acceptTextButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14
  },
  rejectTextButton: {
    color: '#2887f5',
    fontWeight: '500',
    fontSize: 14
  }
})