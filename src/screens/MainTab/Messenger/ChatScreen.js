import React, { useState, useCallback, useEffect, useLayoutEffect, useContext } from 'react'
import { View, SafeAreaView, Text, StyleSheet} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'
import { AuthStateContext } from '../../../states/auth'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

export const ChatScreen = ({route, navigation}) => {

  const { chatId } = route.params
  const { user } = useContext(AuthStateContext)

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

  const showMessages = () => {
    api.call('showChatMessages', { chat_id: chatId })
      .then(({ data }) => {
        let messages = data.data
        messages = _.orderBy(messages, 'createdAt', 'desc')
        setMessages(messages)
        console.log('showChatMessages', messages)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }
 
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

  if (!messages.length) {
    return <CustomActivityIndicator size='small' color='grey' />
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: user.info.id,
        }}
        placeholder='Введите ваше сообщение'
        // renderLoading={() => (
        //   <CustomActivityIndicator size='large' color='grey' />
        // )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
})
