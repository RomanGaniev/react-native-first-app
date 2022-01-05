import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, Modal, TextInput, Image, ScrollView, TouchableOpacity, ActionSheetIOS } from 'react-native'
import { MaterialCommunityIcons, Ionicons, Octicons } from '@expo/vector-icons'
import GestureRecognizer from 'react-native-swipe-gestures'
import * as ImagePicker from 'expo-image-picker'
import { CustomActivityIndicator } from './CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper';

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Separator } from './Separator'

import { AuthStateContext } from '../states/auth'
import { useMessengerState } from '../states/messenger/messengerContext'
import { useMessengerDispatch } from '../states/messenger/messengerContext'

const ModalEditChat = ({ chat, navigation }) => {

  const { user } = useContext(AuthStateContext)

  const {modalEditChatVisible} = useMessengerState()
  const {toggleEdit} = useMessengerDispatch()

  const [avatar, setAvatar] = useState(chat.avatar)
  const [chatName, setChatName] = useState(chat.name)
  const [friends, setFriends] = useState([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(true)
  const [isLoadingFriendsAddedToChat, setIsLoadingFriendsAddedToChat] = useState(true)
  const [friendsAddedToChat, setFriendsAddedToChat] = useState([])

  useEffect(() => {
    loadFriends()
    loadFriendsAddedToChat()
  }, [])

  useEffect(() => {
    console.log('friendsAddedToChat changed to: ', friendsAddedToChat)
  }, [friendsAddedToChat])

  const loadFriends = () => {
    api.call('showFriends')
      .then(({ data }) => {
        setFriends(data.data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoadingFriends(false)
      })
  }

  const loadFriendsAddedToChat = () => {
    api.call('showFriendsAddedToChat', {
      chat_id: chat.id
    })
      .then(({ data }) => {
        setFriendsAddedToChat(data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoadingFriendsAddedToChat(false)
      })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      base64: false
    })

    console.log(result)

    if (!result.cancelled) {
      setAvatar(result.uri)
    }
  }

  const closeModal = () => {
      toggleEdit()
      clearAll()
  }

  const clearAll = () => {
    setChatName(chat.name)
    loadFriendsAddedToChat()
    setAvatar(chat.avatar)
  }

  const editChat = () => {
    const fd = new FormData()
    fd.append('chatId', chat.id)
    fd.append('chatName', chatName)
    _.each(friendsAddedToChat, (val) => {
      fd.append('friends[]', val)
    })
    if(avatar !== chat.avatar) {
      let uriAvatar = avatar
      let fileType = uriAvatar.substring(uriAvatar.lastIndexOf(".") + 1)
    
      fd.append('avatar', {
        uri: uriAvatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`
      })
    }

    api.call('editGeneralChat', fd)
      .then(({ data }) => {
        toggleEdit()
        // navigation.navigate('ChatScreen', {
        //   chat: data.data
        // })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
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
      if (buttonIndex === 1) {
        api.call('deleteGeneralChat', {
          chatId: chat.id
        })
          .then(({ data }) => {
            toggleEdit()
            navigation.navigate('MessengerScreen')
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            //
          })
      }
    })
  }

  const toggleAddFriendToNewChat = (friendId) => {
    if(friendsAddedToChat.includes(friendId)) {
      setFriendsAddedToChat(friendsAddedToChat.filter((friend_id) => friend_id !== friendId))
    } else {
      setFriendsAddedToChat([...friendsAddedToChat, friendId])
    }
  }

  return (
    <View>
      <GestureRecognizer
        style={{flex: 1}}
        config={{
          velocityThreshold: 0.1,
          directionalOffsetThreshold: 100,
          gestureIsClickThreshold	: 1
        }}
        onSwipeDown={closeModal}
      >
        <Modal
          animationType="slide"
          visible={modalEditChatVisible}
          presentationStyle='formSheet'
        >
          <View style={styles.header}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={{width: 62, ...styles.button}} onPress={closeModal}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="close-circle" size={28} color="#c9c9c9" />
                </View>
              </TouchableOpacity>
              <Text style={styles.username}>Редактирование</Text>
              <TouchableOpacity style={styles.button} onPress={editChat} disabled={!chatName}>
                <View style={styles.icon}>
                  <Ionicons name="add-circle-sharp" size={38} color={chatName ? '#2887f5' : 'grey'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <ScrollView keyboardShouldPersistTaps='never'>
              <Separator height={1} color='#ececec' marginHorizontal={15} />
              <View style={{flex: 1, paddingHorizontal: 15, marginTop: 20}}>
                <View style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={pickImage} style={{alignItems: 'center'}}>
                    { avatar ?
                      <Image source={{ uri: avatar }} style={{ width: 70, height: 70, borderRadius: 100 }} />
                      :
                      <View style={styles.placeholderAvatar}>
                        <Ionicons name="camera-outline" color="#2887f5" size={33} />
                      </View>
                    }
                  </TouchableOpacity>
                  <TextInput
                    placeholder='Название'
                    placeholderTextColor='#7c7c7c'
                    style={styles.input}
                    onChangeText={(val) => {
                      setChatName(val)
                    }}
                    value={chatName}
                    clearButtonMode='while-editing'
                  />
                </View>
                
                { isLoadingFriends && isLoadingFriendsAddedToChat ?
                    <CustomActivityIndicator size='small' color='grey' />
                  : 
                    friends.map((friend, index) => (
                      <View
                        key={'friend-' + index}
                        style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                          <Avatar.Image 
                            source={{uri: friend.avatar}}
                            style={{backgroundColor: '#e1e1e1'}}
                            size={45}
                          />
                          <Title style={styles.title}>{`${friend.first_name} ${friend.last_name}`}</Title>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{padding: 4}}
                          onPress={() => toggleAddFriendToNewChat(friend.id)}
                        >
                          { friendsAddedToChat.includes(friend.id) ?
                              <Ionicons name="remove-circle-outline" size={34} color={'red'} />
                            :
                              <Ionicons name="add-circle-outline" size={34} color={'#2887f5'} />
                          }
                        </TouchableOpacity>
                      </View>
                    ))
                }
                { friendsAddedToChat.length > 0 &&
                  <Text style={{textAlign: 'center'}}>Добавлено участников: {friendsAddedToChat.length}</Text>
                }
                <TouchableOpacity activeOpacity={0.5} onPress={deleteChat} style={{borderRadius: 12, backgroundColor: 'red', height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 30}}>
                  <Text style={{color: 'white', fontSize: 17, fontWeight: '500'}}>Удалить чат</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </GestureRecognizer>
    </View>
  )
}

export default ModalEditChat

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
    color: 'black'
  },
  header: {
    height: 50
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'white'
  },
  icon: {
    flex: 1,
    justifyContent: 'center'
  },
  inputAccessoryView: {
    height: 50,
    backgroundColor: 'white'
  },
  input: {
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#ededed',
    flex: 1,
    marginLeft: 15
  },
  button: {
    paddingHorizontal: 12
  },
  username: {
    fontSize: 20,
    fontWeight: '600'
  },
  placeholderAvatar: {
    width: 70,
    height: 70,
    backgroundColor: '#ededed',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
});