import React, { useContext, useState, useCallback } from 'react'
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'

import {
  Avatar,
  Title,
  Caption,
  Drawer
} from 'react-native-paper'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Separator } from '../components/Separator'

import { AuthStateContext } from '../states/auth'

const UserProfileScreen = ({ route, navigation }) => {

  const { userParam } = route.params
  const [ otherUser, setOtherUser ] = useState(userParam)

  const { user } = useContext(AuthStateContext)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  const sendFriendRequest = () => {
    api.call('sendFriendRequest', {otherUserId: otherUser.id})
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

  const acceptFriendRequest = () => {
    api.call('acceptFriendRequest', {otherUserId: otherUser.id})
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

  const rejectOrCancelFriendRequest = () => {
    api.call('rejectOrCancelFriendRequest', {otherUserId: otherUser.id})
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

  const removeFromFriends = () => {
    api.call('removeFromFriends', {otherUserId: otherUser.id})
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

  const goToChat = () => {
    api.call('createPrivateChat', {interlocutorId: otherUser.id})
      .then(({ data }) => {
        
          navigation.navigate('ChatScreen', {
            chat: data.data
          })
        // navigation.navigate("ChatScreen", {
        //   chat: chat
        // })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  // const goToChat = () => {
  //   navigation.navigate('Messenger',
  //     {
  //       screen: 'ChatScreen',
  //       params: {
  //         otherUser: otherUser
  //       }
  //     }
  //   )
  // }

  // const goToChat = () => {
  //   navigation.navigate('ChatScreen', {
  //     otherUser: otherUser
  //   })
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
        <Separator height={1} color='#ececec' marginHorizontal={10} />
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
              <Avatar.Image 
                source={{
                  uri: otherUser.avatar
                }}
                style={{backgroundColor: '#e1e1e1'}}
                size={80}
              />
            </View>
            <View style={{marginLeft: 12, flexDirection: 'column'}}>
              <Title style={styles.title}>{otherUser.first_name + ' ' + otherUser.last_name}</Title>
              <Caption style={styles.userStatus}>Its my life! =)</Caption>
              <Caption style={styles.status}>online</Caption>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 12}}>

          <TouchableOpacity onPress={goToChat} activeOpacity={0.8} style={[styles.button, {marginRight: 4}]}>
            <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Сообщение</Text>
          </TouchableOpacity>
          
          { otherUser.friendship ?
              otherUser.friendship.status === 'pending' ?
                otherUser.friendship.acted_user === user.info.id ?
                    <TouchableOpacity activeOpacity={0.8} style={[styles.button, {marginLeft: 4}]} onPress={rejectOrCancelFriendRequest}>
                      <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Отменить заявку</Text>
                    </TouchableOpacity>
                  :
                    <>
                      <TouchableOpacity activeOpacity={0.8} style={[styles.button, {marginLeft: 4}]} onPress={acceptFriendRequest}>
                        <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Принять заявку</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.8} style={[styles.button, {marginLeft: 4}]} onPress={rejectOrCancelFriendRequest}>
                        <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Отклонить заявку</Text>
                      </TouchableOpacity>
                    </>
                    
                :
                  otherUser.friendship.status === 'confirmed' ?
                    <TouchableOpacity activeOpacity={0.8} style={[styles.button, {marginLeft: 4, backgroundColor: 'red'}]} onPress={removeFromFriends}>
                      <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Удалить из друзей</Text>
                    </TouchableOpacity> : null
            :
              <TouchableOpacity activeOpacity={0.8} style={[styles.button, {marginLeft: 4}]} onPress={sendFriendRequest}>
                <Text style={{color: 'white', fontWeight: '500', fontSize: 14}}>Добавить в друзья</Text>
              </TouchableOpacity>
          }
          

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
  userInfoSection: {
		margin: 12,
	},
	title: {
		fontSize: 19,
		marginTop: 0,
		fontWeight: '600',
	},
  userStatus: {
		fontSize: 14,
		lineHeight: 14,
    color: 'black'
	},
	status: {
		fontSize: 14,
		lineHeight: 14,
    marginTop: 5
	},
  avatar: {
		width: 80,
		height: 80,
		// marginRight: 11,
		borderRadius: 50
	},
  button: {
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
})