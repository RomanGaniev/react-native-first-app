import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActionSheetIOS
} from 'react-native'

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import GestureRecognizer from 'react-native-swipe-gestures'
import * as ImagePicker from 'expo-image-picker'
import { CustomActivityIndicator } from '../CustomActivityIndicator'

import {
  Avatar,
  Title
} from 'react-native-paper'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Separator } from '../Separator'

import { useMessengerState } from '../../states/messenger/messengerContext'
import { useMessengerDispatch } from '../../states/messenger/messengerContext'

const ModalEditChat = ({ chat, navigation, updateChat }) => {

  const {modalEditChatVisible} = useMessengerState()
  const {toggleModalEditChatVisible} = useMessengerDispatch()

  const [avatar, setAvatar] = useState(chat.avatar)
  const [chatName, setChatName] = useState(chat.name)
  const [friends, setFriends] = useState([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(true)
  const [isLoadingFriendsAddedToChat, setIsLoadingFriendsAddedToChat] = useState(true)
  const [isLoadingEditing, setIsLoadingEditing] = useState(false)
  const [isLoadingDeleting, setIsLoadingDeleting] = useState(false)
  const [friendsAddedToChat, setFriendsAddedToChat] = useState([])

  useEffect(() => {
      showFriends()
      showFriendsAddedToChat()
  }, [])

  useEffect(() => {
    console.log('friendsAddedToChat changed to: ', friendsAddedToChat)
  }, [friendsAddedToChat])

  const showFriends = () => {
    api.call('getFriends')
      .then(({ data }) => {
        setFriends(data.data)
      })
      .finally(() => {
        setIsLoadingFriends(false)
      })
  }

  const showFriendsAddedToChat = () => {
    api.call('getChatParticipants', {
      chat_id: chat.id
    })
      .then(({ data }) => {
        setFriendsAddedToChat(data)
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
    toggleModalEditChatVisible()
      clearAll()
  }

  const clearAll = () => {
    setChatName(chat.name)
    showFriendsAddedToChat()
    setAvatar(chat.avatar)
  }

  const editChat = () => {
    setIsLoadingEditing(true)

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('chatName', chatName)
    _.each(friendsAddedToChat, (val) => {
      formData.append('friends[]', val)
    })
    if(avatar !== chat.avatar) {
      let uriAvatar = avatar
      let fileType = uriAvatar.substring(uriAvatar.lastIndexOf(".") + 1)
    
      formData.append('avatar', {
        uri: uriAvatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`
      })
    }

    api.call('editChat', {
      chat_id: chat.id,
      formData
    })
      .then(({data}) => {
        console.log('DATA', data.data)
        updateChat(data.data)
        toggleModalEditChatVisible()
      })
      .finally(() => {
        setIsLoadingEditing(false)
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
        setIsLoadingDeleting(true)
        api.call('deleteChat', {
          chat_id: chat.id
        })
          .then(({ data }) => {
            toggleModalEditChatVisible()
            navigation.goBack()
            setIsLoadingDeleting(false)
          })
      }
    })
  }

  const toggleAddFriendToNewChat = (friendId) => {
    if(friendsAddedToChat.includes(friendId)) {
      setFriendsAddedToChat(
        friendsAddedToChat.filter((friend_id) => friend_id !== friendId)
      )
    } else {
      setFriendsAddedToChat([
        ...friendsAddedToChat,
        friendId
      ])
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
              <TouchableOpacity
                style={styles.button}
                onPress={closeModal}
                disabled={isLoadingEditing}
              >
                <View style={styles.iconClose}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={28}
                    color="#c9c9c9"
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Редактирование</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={editChat}
                disabled={!chatName || isLoadingEditing}
              >
                <View style={styles.iconSave}>
                  { isLoadingEditing || isLoadingDeleting ?
                      <CustomActivityIndicator
                        size={'small'}
                        color={'grey'}
                      />
                    :
                      <Ionicons
                        name="save"
                        size={30}
                        color={chatName ? '#2887f5' : 'grey'}
                      />
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <ScrollView keyboardShouldPersistTaps='never'>
              <Separator
                height={1}
                color='#ececec'
                marginHorizontal={15}
              />
              <View style={styles.body}>
                <View style={styles.avatarAndInputContainer}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={pickImage}
                    style={{alignItems: 'center'}}
                    disabled={isLoadingEditing}
                  >
                    { avatar ?
                        <Avatar.Image 
                          source={{uri: avatar}}
                          style={{backgroundColor: '#e1e1e1'}}
                          size={70}
                        />
                      :
                        <View style={styles.placeholderAvatar}>
                          <Ionicons
                            name="camera-outline"
                            color="#2887f5"
                            size={33}
                          />
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
                    editable={!isLoadingEditing}
                  />
                </View>
                { isLoadingFriends && isLoadingFriendsAddedToChat ?
                    <CustomActivityIndicator size='small' color='grey' />
                  : 
                    friends.map((friend, index) => (
                      <View
                        key={'friend-' + index}
                        style={styles.friendContainer}>
                        <View style={styles.friend}>
                          <Avatar.Image 
                            source={{uri: friend.avatar}}
                            style={{backgroundColor: '#e1e1e1'}}
                            size={45}
                          />
                          <Title style={styles.title}>
                            {`${friend.first_name} ${friend.last_name}`}
                          </Title>
                        </View>
                        <TouchableOpacity
                          disabled={isLoadingEditing}
                          activeOpacity={0.5}
                          style={{padding: 4}}
                          onPress={() => toggleAddFriendToNewChat(friend.id)}
                        >
                          { friendsAddedToChat.includes(friend.id) ?
                              <Ionicons
                                name="remove-circle-outline"
                                size={34}
                                color={'#ff2e2e'}
                              />
                            :
                              <Ionicons
                                name="add-circle-outline"
                                size={34}
                                color={'#2887f5'}
                              />
                          }
                        </TouchableOpacity>
                      </View>
                    ))
                }
                { friendsAddedToChat.length > 0 &&
                  <Text style={{textAlign: 'center'}}>
                    Добавлено участников: {friendsAddedToChat.length}
                  </Text>
                }
                <TouchableOpacity
                  disabled={isLoadingEditing || isLoadingDeleting}
                  activeOpacity={0.5}
                  onPress={deleteChat}
                  style={styles.deleteButton}
                >
                  <Text style={{color: '#ff2e2e', fontSize: 17, fontWeight: '500'}}>
                    { isLoadingDeleting ?
                        'Удаление...'
                      :
                        'Удалить чат'
                    }
                  </Text>
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
  iconClose: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 2,
    width: 40
  },
  iconSave: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 2,
    width: 40,
    alignItems: 'flex-end'
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center'
  },
  placeholderAvatar: {
    width: 70,
    height: 70,
    backgroundColor: '#ededed',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 20
  },
  avatarAndInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  friendContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  friend: {
    flexDirection:'row',
    alignItems: 'center'
  },
  deleteButton: {
    borderRadius: 12,
    backgroundColor: '#ffd3db',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  }
})