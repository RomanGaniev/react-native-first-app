import React, {
  useState,
  useContext,
  useEffect
} from 'react'

import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Text,
  TouchableOpacity
} from 'react-native'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'

import {
  Entypo,
  MaterialCommunityIcons
} from '@expo/vector-icons'

import ModalCreateChat from '../../../components/messenger/ModalCreateChat'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'
import { Axios, Echo } from '../../../../services/boot'

import moment from 'moment'
import 'moment/locale/ru'

import { AuthStateContext } from '../../../states/auth'

export const MessengerScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)
  const [chats, setChats] = useState([])

  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    let echo = new Echo(user.token)

    if (!isLoading) {
      let pusher = echo
        .channel('messenger-channel')
          .listen('ChatsUpdated', () => {
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
      .finally(() => {
        setIsLoading(false)
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
        <View style={styles.chatsNotFoundContainer}>
          <Text style={styles.notFoundText}>Ничего не найдено</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
              <Text style={styles.button}>создай чат</Text>
            </TouchableOpacity>
            <Text style={styles.orText}> или </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
              <Text style={styles.button}>напиши другу</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <SafeAreaView style={styles.container}>
          <ScrollView>
            { chats.map((chat, index) => (
              <TouchableHighlight
                onPress={() => goToChat(chat)}
                underlayColor="#e1e1e1"
                key={'chat-' + index}
              >
                <View style={styles.chatRow}>
                  { chat.is_private || chat.avatar ?
                      <Avatar.Image 
                        source={{
                          uri: chat.is_private ? chat.interlocutor.avatar : chat.avatar
                        }}
                        style={{backgroundColor: '#e1e1e1'}}
                        size={55}
                      />
                    :
                      <View style={[styles.avatar, {backgroundColor: '#2887f5'}]}>
                        <Text style={styles.chatInitial}>
                          {chat.name?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                  }
                  <View style={styles.chatName}>
                    <Title style={styles.title}>
                      { chat.is_private ?
                            `${chat.interlocutor.first_name} ${chat.interlocutor.last_name}`
                          :
                            chat.name
                      }
                    </Title>
                    <View style={styles.latestMessage}>
                      { chat.latest_message ?
                          <>
                            { thisMessageMine(chat.latest_message) && !chat.latest_message.system &&
                              <Caption
                                numberOfLines={1}
                                style={[styles.caption, {color: '#bebebe'}]}
                              >
                                {'Вы: '}
                              </Caption>
                            }
                            <Caption
                              numberOfLines={1}
                              style={[styles.caption, {fontSize: 15, lineHeight: 15}]}
                            >
                              {chat.latest_message.text}
                            </Caption>
                            { chat.latest_message.read && chat.latest_message.createdAt !== '' &&
                              <>
                                <Entypo
                                  name="dot-single"
                                  style={{paddingTop: 3}}
                                  size={11}
                                  color="grey"
                                />
                                <Caption style={styles.captionTime}>
                                  {chat.latest_message.createdAt}
                                </Caption>
                              </>
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
                            <MaterialCommunityIcons
                              name="checkbox-blank-circle"
                              size={10}
                              color="#2887f5"
                            />
                        :
                          <View style={styles.unreadMessagesCountContainer}>
                            <Text style={styles.unreadMessagesCountText}>
                              {chat.count_unread_messages}
                            </Text>
                          </View>
                    :
                      null
                  }
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
        </SafeAreaView>
      }
      <ModalCreateChat
        navigation={navigation}
        pushChat={pushChat}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  unreadMessagesCountContainer: {
    backgroundColor: '#2887f5',
    height: 27,
    width: 27,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  unreadMessagesCountText: {
    color: 'white',
    fontWeight: '600'
  },
  chatsNotFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  orText: {
    fontSize: 18,
    color: 'grey'
  },
  button: {
    fontSize: 18,
    color: '#2887f5'
  },
  notFoundText: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 10
  },
  chatRow: {
    flexDirection:'row',
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  chatInitial: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18
  },
  chatName: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1
  },
  latestMessage: {
    flexDirection:'row',
    marginRight: 60
  }
})
