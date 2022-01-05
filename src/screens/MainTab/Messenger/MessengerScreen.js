import React, { useState, useContext, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableHighlight, Text, TouchableOpacity, Button } from 'react-native'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'
import { Entypo } from '@expo/vector-icons'

import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import moment from 'moment'
import 'moment/locale/ru'

import { AuthStateContext } from '../../../states/auth'
import ModalCreateChat from '../../../components/ModalCreateChat'

export const MessengerScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)
  const [chats, setChats] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    showChats()
  }, [])



  const showChats = () => {
    api.call('showChats')
      .then(({ data }) => {
        let chats = data.data
        chats = _.orderBy(chats, 'latest_message.created_at', 'desc')
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
            let createdAt = moment(chat.latest_message.created_at)
            
            let prepDate = createdAt.clone().add(1, 'month')

            if(prepDate.isBefore(nowDatetime)) {
              chat.latest_message.created_at = moment(chat.latest_message.created_at).format('DD MMM').toString()
            } else {
              chat.latest_message.created_at = moment(chat.latest_message.created_at).fromNow().toString()
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
      })
  }

  // TODO: Updating the chat list when a message is received!

  // const loadOneChat = () => {
  //   api.call('showOneChat', { id: chat_id })
  //     .then(({ data }) => {
  //       const chat_id = data.id
  //       const new_chats = chats.map((chat) => {
  //         if (chat.id === chat_id) {
  //           return {...data} //return new data of new chat
  //         } else {
  //           return {...chat} //return old chat
  //         }
  //       })
  //       setChats(new_chats)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  //     .finally(() => {
  //       //
  //     })
  // }

  const goToChat = (chat) => {
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

  if (isLoading) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  // if (!chats.length) {
  //   return (
  //     <>
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
  //         <Text style={{fontSize: 18, color: 'grey', marginBottom: 10}}>Ничего не найдено</Text>
  //         <View style={{flexDirection: 'row'}}>
  //           <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
  //             <Text style={{fontSize: 18, color: '#2887f5', }}>создай чат</Text>
  //           </TouchableOpacity>
  //           <Text style={{fontSize: 18, color: 'grey'}}> или </Text>
  //           <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
  //             <Text style={{fontSize: 18, color: '#2887f5', }}>напиши другу</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       <ModalCreateChat navigation={navigation} />
  //     </>
  //   )  
  // }

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
                <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent'}}>
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
                    
                  {/* { chat.is_private ?
                    <Avatar.Image 
                      source={{uri: chat.interlocutor.avatar}}
                      style={{backgroundColor: '#e1e1e1'}}
                      size={55}
                    />
                    : chat.avatar ?
                        <Avatar.Image 
                          source={{uri: chat.avatar}}
                          style={{backgroundColor: '#e1e1e1'}}
                          size={55}
                        />
                      :
                        <View style={[styles.avatar, {backgroundColor: '#2887f5'}]}>
                          <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>{chat.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                  } */}
                  
                  <View style={{marginLeft: 12, flexDirection: 'column', flex: 1}}>
                    <Title style={styles.title}>{chat.is_private ? `${chat.interlocutor.first_name} ${chat.interlocutor.last_name}` : chat.name}</Title>
                    <View style={{flexDirection:'row', marginRight: 60}}>
                      
                      { chat.latest_message ?
                          <>
                            { chat.latest_message.user_id === user.info.id &&
                              <Caption numberOfLines={1} style={[styles.caption, {color: '#bebebe'}]}>Вы: </Caption>
                            }
                            <Caption numberOfLines={1} style={[styles.caption, {fontSize: 15, lineHeight: 15}]}>{chat.latest_message.text}</Caption>
                            <Entypo name="dot-single" style={{paddingTop: 3}} size={11} color="grey" />
                            <Caption style={styles.captionTime}>{chat.latest_message.created_at}</Caption>
                          </>
                        :
                          <Caption style={styles.caption}>Нет сообщений...</Caption>
                      }

                      {/* // { chat.latest_message.created_at ?  */}
                      {/* //   <>
                      //     <Entypo name="dot-single" style={{paddingTop: 3}} size={11} color="grey" />
                      //     <Caption style={styles.captionTime}>{chat.latest_message.created_at}</Caption>
                      //   </>
                      //   : null
                      // } */}

                      {/* <Caption numberOfLines={1} style={[styles.caption, {fontSize: 15, lineHeight: 15}]}>{chat.latest_message ? chat.latest_message.text : 'нет сообщений...'}</Caption>
                      { chat.latest_message.created_at ? 
                        <>
                          <Entypo name="dot-single" style={{paddingTop: 3}} size={11} color="grey" />
                          <Caption style={styles.captionTime}>{chat.latest_message.created_at}</Caption>
                        </>
                        : null
                      } */}
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            ))}
          </ScrollView>
        </SafeAreaView>
      }
          
      <ModalCreateChat navigation={navigation} />
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
