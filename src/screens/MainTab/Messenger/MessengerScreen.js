import React, { useState, useContext, useEffect, useCallback } from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableHighlight, Text, TouchableOpacity, Button } from 'react-native'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

import { Axios, Echo } from '../../../../services/boot'
import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import moment from 'moment'
import 'moment/locale/ru'

import { AuthStateContext } from '../../../states/auth'
import { useMessengerState } from '../../../states/messenger/messengerContext'
import { useMessengerDispatch } from '../../../states/messenger/messengerContext'
import ModalCreateChat from '../../../components/ModalCreateChat'

export const MessengerScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)
  const { editedChat } = useMessengerState()
  const { cleanEditedChat } = useMessengerDispatch()
  const [chats, setChats] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  // const thisUserDidNotReadMessage = useCallback((latest_message) => {
  //   // если последнее сообщение есть и оно не прочитано
  //   if (latest_message && !latest_message.read) {
  //     // если это сообщение не этого пользователя
  //     if (latest_message.user_id !== user.info.id) {
  //       return true
  //     }
  //   }
  // }, [])

  // const interlocutorDidNotReadMessage = useCallback((latest_message) => {
  //   // если последнее сообщение есть и оно не прочитано
  //   if (latest_message && !latest_message.read) {
  //     // если это сообщение этого пользователя
  //     if (latest_message.user_id === user.info.id) {
  //       return true
  //     }
  //   }
  // }, [])

  const interlocutorDidNotReadMessage = useCallback((latest_message) => {
    //
    if (latest_message && !latest_message.read) {
      //
      if (latest_message.user._id === user.info.id) {
        return true
      } else {
        return false
      }
    }
  }, [])

  const thisMessageMine = (message) => {
    if (message.user._id === user.info.id) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    showChats()
  }, [])

  // useEffect(() => {
  //   if(chatWhereAddedMessage.is_loading) {
  //     loadOneChat(chatWhereAddedMessage.id)
  //   }
  // }, [chatWhereAddedMessage.is_loading])

  useEffect(() => {
    if(editedChat.is_loading) {
      // loadOneChat(editedChat.id)
      showChats()
    }
  }, [editedChat.is_loading])

  useEffect(() => {
    let echo = new Echo(user.token)

    if (!isLoading) {
      let pusher = echo
        .channel('messenger-channel')
          .listen('ChatsUpdated', () => {
            // loadOneChat(e.chat_id)
            showChats()
          })
          .error((error) => {
            console.error(error)
          })
      pusher.on('pusher:subscription_succeeded', function() {
        Axios.updateSocketId(echo.socketId())
      })
    }
    return () => {
      echo.leaveChannel('messenger-channel')
    }
  }, [isLoading])

  const showChats = () => {
    api.call('showChats')
      .then(({ data }) => {
        let chats = data.data
        // chats = _.orderBy(chats, 'latest_message.createdAt', 'desc')
        // moment.locale('ru')
        // moment.updateLocale('ru', {
        //   relativeTime: {
        //     future: '%s',
        //     past: '%s',
        //     s:  '',
        //     ss: '%ss',
        //     m:  '%dм',
        //     mm: '%dм',
        //     h:  '%dч',
        //     hh: '%dч',
        //     d:  '%dд',
        //     dd: '%dд',
        //     M:  '%dM',
        //     MM: '%dM',
        //     y:  'г',
        //     yy: '%dY'
        //   }
        // })
        moment.updateLocale('ru', {
          relativeTime: {
            future: '%s',
            past: '%s',
            s:  '',
            ss: '%ss',
            m:  '%dм',
            mm: '%dм',
            h:  '%dч',
            hh: '%dч',
            d:  '%dд',
            dd: '%dд',
            M:  '%dM',
            MM: '%dM',
            y:  'г',
            yy: '%dY'
          }
        })
        let nowDatetime = moment()
        _.each(chats, (chat) => {
          if (chat.latest_message) {
            let createdAt = moment(chat.latest_message.createdAt)
            
            let prepDate = createdAt.clone().add(1, 'month')

            if(prepDate.isBefore(nowDatetime)) {
              chat.latest_message.createdAt = moment(chat.latest_message.createdAt).format('DD MMM').toString()
            } else {
              chat.latest_message.createdAt = moment(chat.latest_message.createdAt).fromNow().toString()
            }
          }
        })
        setChats(chats)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        cleanEditedChat()
      })
  }

  // TODO: Updating the chat list when a message is received!

  const loadOneChat = (chat_id) => {
    api.call('showOneChat', { chat_id })
      .then(({ data }) => {
        let data_chat = data.data
        console.log(data_chat)
        moment.locale('ru')
        data_chat.latest_message.createdAt = moment().fromNow().toString()

        // data_chat.latest_message.text = 'DEFAULT'
        const chatId = data_chat.id
        let new_chats = chats.map((chat) => {
          if (chat.id === chatId) {
            return {...data_chat} //return new data of new chat
          } else {
            return {...chat} //return old chat
          }
        })
        
        setChats(new_chats)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        // cleanChatWhereAddedMessage()
        // cleanEditedChat()
      })
  }

  const goToChat = (chat) => {
    if(chat.latest_message && chat.latest_message.user._id !== user.info.id) {
      chat.latest_message.read = true
    }
    
    const new_chats = chats.map((item) => {
      if (item.id === chat.id) {
        return {...chat} //return new data of new chat
      } else {
        return {...item} //return old chat
      }
    })
    setChats(new_chats)
    navigation.navigate("ChatScreen", {
      chat: chat
    })
  }
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
    return `#${randomColor}`
  }

  const pushChat = (chat) => {
    setChats([chat, ...chats])
  }

  if (isLoading) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  return (
    <>
      { chats.length === 0 ?
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
          <Text style={{fontSize: 18, color: 'grey', marginBottom: 10}}>Ничего не найдено</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
              <Text style={{fontSize: 18, color: '#2887f5', }}>создай чат</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 18, color: 'grey'}}> или </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
              <Text style={{fontSize: 18, color: '#2887f5', }}>напиши другу</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            { chats.map((chat, index) => (
              <TouchableHighlight onPress={() => goToChat(chat)} underlayColor="#e1e1e1" key={'chat-' + index}>
                <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent', alignItems: 'center'}}>
                  { chat.is_private || chat.avatar ?
                      <Avatar.Image 
                        source={{uri: chat.is_private ? chat.interlocutor.avatar : chat.avatar}}
                        style={{backgroundColor: '#e1e1e1'}}
                        size={55}
                      />
                    :
                      <View style={[styles.avatar, {backgroundColor: '#2887f5'}]}>
                        <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>{chat.name?.charAt(0).toUpperCase()}</Text>
                      </View>
                  }
                  <View style={{marginLeft: 12, flexDirection: 'column', flex: 1}}>
                    <Title style={styles.title}>{chat.is_private ? `${chat.interlocutor.first_name} ${chat.interlocutor.last_name}` : chat.name}</Title>
                    <View style={{flexDirection:'row', marginRight: 60}}>
                      
                      { chat.latest_message ?
                          <>
                            { chat.latest_message.user._id === user.info.id && !chat.latest_message.system &&
                              <Caption numberOfLines={1} style={[styles.caption, {color: '#bebebe'}]}>Вы: </Caption>
                            }
                            <Caption numberOfLines={1} style={[styles.caption, {fontSize: 15, lineHeight: 15}]}>{chat.latest_message.text}</Caption>
                            { chat.latest_message.read &&
                                chat.latest_message.createdAt !== '' ?
                                  <>
                                    <Entypo name="dot-single" style={{paddingTop: 3}} size={11} color="grey" />
                                    <Caption style={styles.captionTime}>{chat.latest_message.createdAt}</Caption>
                                  </>
                                  : null
                              
                            }
                          </>
                        :
                          <Caption style={styles.caption}>Нет сообщений...</Caption>
                      }
                    </View>
                    
                  </View>
                  { !chat.latest_message.read ?

                          thisMessageMine(chat.latest_message) ?
                              !chat.latest_message.system &&

                              <MaterialCommunityIcons name="checkbox-blank-circle" size={10} color="#2887f5" />
                                  
                            :

                              <View style={{backgroundColor: '#2887f5', height: 27, width: 27, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: 'white', fontWeight: '600'}}>{chat.count_unread_messages}</Text>
                              </View>

                    :

                      null

                  }
                  {/* { interlocutorDidNotReadMessage(chat.latest_message) ?
                      <MaterialCommunityIcons name="checkbox-blank-circle" size={10} color="#2887f5" />
                      : chat.count_unread_messages && chat.latest_message.system && chat.latest_message.user_id !== user.info.id ?
                        <View style={{backgroundColor: '#2887f5', height: 27, width: 27, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                          <Text style={{color: 'white', fontWeight: '600'}}>{chat.count_unread_messages}</Text>
                        </View>
                        : null
                  } */}
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
        </SafeAreaView>
      }
          
      <ModalCreateChat navigation={navigation} pushChat={pushChat} />
    </>
  )
}

const styles = StyleSheet.create({
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
});
