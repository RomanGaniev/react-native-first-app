import React, {
  useState,
  useCallback,
  useEffect,
  useContext
} from 'react'

import {
  SafeAreaView,
  StyleSheet,
  ActionSheetIOS,
  LogBox
} from 'react-native'
// LogBox.ignoreLogs(["Warning: Can't perform a React
// state update on an unmounted component. This is a no-op,
// but it indicates a memory leak in your application.
// To fix, cancel all subscriptions and asynchronous tasks
// in a useEffect cleanup function."]); // Ignore log notification by message

import {
  GiftedChat,
  InputToolbar,
  Send
} from 'react-native-gifted-chat'
import { SimpleLineIcons } from '@expo/vector-icons'

import { ChatHeader } from '../../../components/messenger/ChatHeader'
import { EmptyChat } from '../../../components/messenger/EmptyChat'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'
import ModalEditChat from '../../../components/messenger/ModalEditChat'

import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'
import { Axios, Echo } from '../../../../services/boot'

import { AuthStateContext } from '../../../states/auth'
import { useMessengerState } from '../../../states/messenger/messengerContext'
import { useMessengerDispatch } from '../../../states/messenger/messengerContext'

const dayjs = require('dayjs')
import ru from 'dayjs/locale/ru'

let echo

export const ChatScreen = ({route, navigation}) => {

  const { modalEditChatVisible } = useMessengerState()
  const { toggleModalEditChatVisible } = useMessengerDispatch()

  const { chat } = route.params
  const { user } = useContext(AuthStateContext)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [typingUser, setTypingUser] = useState(null)
  
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
      readAllMessages()
    }
  }, [])

  useEffect(() => {
    if(modalEditChatVisible && chat.is_private) {
      deleteChat()
    }
  }, [modalEditChatVisible])

  const showMessages = () => {
    api.call('showChatMessages', { chat_id: chat.id })
    .then(({ data }) => {
      let messages = data.data
      messages = _.orderBy(messages, 'createdAt', 'desc')
      setMessages(messages)
    })
    .finally(() => {
      setIsLoading(false)
    })    
  }

  const readAllMessages = () => {
    api.call('readAllMessagesWhenLeavingChat', { chat_id: chat.id })
    .then(({ data }) => {
      //
    })  
  }

  const deleteChat = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Отмена', 'Удалить чат'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      title: 'Вы действительно хотите удалить чат? Отменить это действие будет невозможно',
      tintColor: '#2887f5'
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        toggleModalEditChatVisible()
      }
      if (buttonIndex === 1) {
        api.call('deleteGeneralChat', {
          chatId: chat.id
        })
          .then(({data}) => {
            toggleModalEditChatVisible()
            navigation.navigate('MessengerScreen')
          })
      }
    })
  }

  const loadOneMessage = (chat_message_id) => {
    api.call('showOneChatMessage', { chat_message_id: chat_message_id })
      .then(({ data }) => {
        setMessages(previousMessages => 
          GiftedChat.append(previousMessages, data.data)
        )
      })
  }
 
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    )
    const fd = new FormData()
    fd.append('chat_id', chat.id)
    fd.append('text', newMessages[0].text)
    api.call('sendMessage', fd)
      .then(({ data }) => {
        //
      })
  }, [])

  const sendTypingEvent = () => {
    echo.join(`chat.${chat.id}`)
        .whisper('typing', user.info.first_name)
  }

  const showTypingSubtitle = (user) => {
    setTypingUser(user)
    navigation.setOptions({
      headerTitle: () => <ChatHeader chat={chat} typingUser={user} />
    })
    if(typingTimer) {
      clearTimeout(typingTimer)
    }
    typingTimer = setTimeout(() => {
      setTypingUser(null)
      navigation.setOptions({
        headerTitle: () => <ChatHeader chat={chat} typingUser={null} />
      })
    }, 3000)
  }

  const updateChat = (chat) => {
    navigation.setParams({
      chat
    })
  }

  if (isLoading) {
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
        dateFormat='LL'
        renderSend={(props) =>
          <Send {...props}>
            <SimpleLineIcons
              name="arrow-up-circle"
              size={38}
              color='#2887f5'
              style={styles.sendIcon}
            />
          </Send>
        }
        minInputToolbarHeight={50}
        minComposerHeight={40}
        textInputStyle={styles.textInput}
        renderInputToolbar={(props) =>
          <InputToolbar
            {...props}
            containerStyle={{borderTopWidth: 0}}
          />
        }
      />
      { !chat.is_private &&
        <ModalEditChat
          chat={chat}
          navigation={navigation}
          updateChat={updateChat}
        />
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    lineHeight: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: '#dfdfdf',
    borderRadius: 20,
    marginRight: 10
  },
  sendIcon: {
    marginRight: 10,
    marginBottom: 5
  }
})
