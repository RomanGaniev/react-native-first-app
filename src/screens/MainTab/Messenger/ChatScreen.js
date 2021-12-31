import React, { useState, useCallback, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'

import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'
import { Axios, Echo } from '../../../../services/boot'
import { AuthStateContext } from '../../../states/auth'

import { ChatHeader } from '../../../components/ChatHeader'
import { EmptyChat } from '../../../components/EmptyChat'

const dayjs = require('dayjs');
import ru from 'dayjs/locale/ru'

let echo

export const ChatScreen = ({route, navigation}) => {

  const { chat } = route.params
  const { user } = useContext(AuthStateContext)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [typingUser, setTypingUser] = useState(null)
  // const [typingTimer, setTypingTimer] = useState(null)
  
  let typingTimer

  useEffect(() => {
    showMessages()

    echo = new Echo(user.token)
    let pusher = echo.join(`chat.${chat.id}`)
      .listen('ChatMessageSent', (e) => {
        loadOneMessage(e.chat_message_id)
      })
      .listenForWhisper('typing', user => {
        showTypingSubtitle(user)
      })
      .error((error) => {
        console.error(error)
      })
    
    pusher.on('pusher:subscription_succeeded', function() {
      Axios.updateSocketId(echo.socketId())
    })
    return () => {
      echo.leaveChannel(`chat.${chat.id}`)
    }
  }, [])

  const showMessages = () => {
    api.call('showChatMessages', { chat_id: chat.id })
      .then(({ data }) => {
        let messages = data.data
        messages = _.orderBy(messages, 'createdAt', 'desc')
        setMessages(messages)
        // console.log('showChatMessages', messages)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const loadOneMessage = (chat_message_id) => {
    api.call('showOneChatMessage', { chat_message_id: chat_message_id })
      .then(({ data }) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, data.data))
      })
      .catch(error => {
        console.log(error)
      })
  }
 
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    console.log('newMessages: ', newMessages)
    setTimeout(() => console.log(messages), 2500)

    const fd = new FormData()
    fd.append('chat_id', chat.id)
    fd.append('text', newMessages[0].text)
    api.call('sendMessage', fd)
      .then(({ data }) => {
        // console.log('data message: ', data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const sendTypingEvent = () => {
    echo.join(`chat.${chat.id}`)
        .whisper('typing', user.info.first_name)
  }

  const showTypingSubtitle = (user) => {
    setTypingUser(user)
    navigation.setOptions({headerTitle: () => <ChatHeader chat={chat} typingUser={user} />})
    if(typingTimer) {
      clearTimeout(typingTimer)
    }
    typingTimer = setTimeout(() => {
      setTypingUser(null)
      navigation.setOptions({headerTitle: () => <ChatHeader chat={chat} typingUser={null} />})
    }, 3000)
  }

  // if (isLoading) {
  //   return <CustomActivityIndicator size='small' color='grey' />
  // }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: user.info.id,
        }}
        placeholder='Введите ваше сообщение'
        textInputProps={{
          onKeyPress: sendTypingEvent
        }}
        renderChatEmpty={() => 
          <EmptyChat
            isLoading={isLoading}
            icon='chatbubbles-outline'
            label='Нет сообщений'
          />
        }
        locale='ru'
        // timeFormat=''
        dateFormat='LL'
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  
})
