import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { View, SafeAreaView, Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'


import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

export const ChatScreen = ({route, navigation}) => {

  const { chatId } = route.params
  const [ userInfo, setUserInfo ] = useState(null)
  const [ isLoadingUserInfo, setIsLoadingUserInfo ] = useState(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: false,
    })
  }, [navigation])

  useEffect(() => {
    async function getUserInfo() {
      let info
      if (Device.brand) {
        info = await SecureStore.getItemAsync('user_info')
        info = JSON.parse(info)
        setUserInfo(info)
      } else {
        info = localStorage.getItem('user_info')
        info = JSON.parse(info)
        setUserInfo(info)
      }
      setIsLoadingUserInfo(false)
      // console.log('User info from storage: ', userInfo)
    }
    getUserInfo()
  }, [])

  const [messages, setMessages] = useState([]);
  
  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ])
  //   // console.log('chatId: ', chatId)
  // }, [])

  useEffect(() => {
    showMessages()
  }, [])

  const showMessages = useCallback(() => {
    api.call('showChatMessages', { chat_id: chatId })
      .then(({ data }) => {
        let ppp = data.data
        ppp = _.orderBy(ppp, 'createdAt', 'desc')
        setMessages(ppp)
        console.log('showChatMessages', ppp)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => {
          console.log('finally messages:', messages);
        }, 1000)
      })
    }, [])
 
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    console.log('newMessages: ', newMessages)

    const fd = new FormData()
    fd.append('chat_id', chatId)
    fd.append('text', newMessages[0].text)
    api.call('sendMessage', fd)
      .then(({ data }) => {
        console.log('data message: ', data)
      })
      .catch(error => {
        //
      })
      .finally(() => {
        //
      })
  }, [])

  return (
    <>
      { isLoadingUserInfo ?
        <View style={{backgroundColor: 'green', height: 100}}></View>
      :
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <GiftedChat
            messages={messages}
            onSend={newMessages => onSend(newMessages)}
            user={{
              _id: userInfo.id,
            }}
          />
        </SafeAreaView>
        
      }
    </>
  )
};
