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

const ModalCreateChat = ({ navigation, pushChat }) => {

  const {modalCreateChatVisible} = useMessengerState()
  const {toggleModalCreateChatVisible} = useMessengerDispatch()

  const [avatar, setAvatar] = useState(null)
  const [chatName, setChatName] = useState('')
  const [friends, setFriends] = useState([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(true)
  const [isLoadingCreating, setIsLoadingCreating] = useState(false)
  const [friendsAddedToChat, setFriendsAddedToChat] = useState([])

  useEffect(() => {
    showFriends()
  }, [])

  const showFriends = () => {
    api.call('showFriends')
      .then(({ data }) => {
        setFriends(data.data)
      })
      .finally(() => {
        setIsLoadingFriends(false)
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

    if (!result.cancelled) {
      setAvatar(result.uri)
    }
  }

  const closeModal = () => {
    if (chatName || friendsAddedToChat.length || avatar) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Отмена', 'Удалить'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: 'Все изменения будут потеряны, если вы выйдете',
        tintColor: '#2887f5'
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          toggleModalCreateChatVisible()
          clearAll()
        }
      })
    } else {
      toggleModalCreateChatVisible()
      clearAll()
    }
  }

  const clearAll = () => {
    setChatName('')
    setFriendsAddedToChat([])
    setAvatar(null)
  }

  const createChat = () => {
    setIsLoadingCreating(true)
    const fd = new FormData()
    fd.append('chatName', chatName)
    _.each(friendsAddedToChat, (val) => {
      fd.append('friends[]', val)
    })
    if(avatar) {
      let uriAvatar = avatar
      let fileType = uriAvatar.substring(uriAvatar.lastIndexOf(".") + 1)
    
      fd.append('avatar', {
        uri: uriAvatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`
      })
    }

    api.call('createGeneralChat', fd)
      .then(({ data }) => {
        pushChat(data.data)
        toggleModalCreateChatVisible()
        clearAll()
        navigation.navigate('ChatScreen', {
          chat: data.data
        })
      })
      .finally(() => {
        setIsLoadingCreating(false)
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
          visible={modalCreateChatVisible}
          presentationStyle='formSheet'
        >
          <View style={styles.header}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={{width: 62, ...styles.button}}
                onPress={closeModal}
                disabled={isLoadingCreating}
              >
                <View style={styles.iconClose}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={28}
                    color="#c9c9c9" 
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Новая беседа</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={createChat}
                disabled={!chatName || isLoadingCreating}
              >
                <View style={styles.iconCreate}>
                  { isLoadingCreating ?
                      <CustomActivityIndicator
                        size={'small'}
                        color={'grey'}
                      />
                    :
                      <Ionicons
                        name="add-circle-sharp"
                        size={38}
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
                    disabled={isLoadingCreating}
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
                    editable={!isLoadingCreating}
                  />
                </View>
                { isLoadingFriends ?
                    <CustomActivityIndicator
                      size='small'
                      color='grey'
                    />
                  : 
                    friends.map((friend, index) => (
                      <View
                        key={'friend-' + index}
                        style={styles.friendContainer}
                      >
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
                          disabled={isLoadingCreating}
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
              </View>
            </ScrollView>
          </View>
        </Modal>
      </GestureRecognizer>
    </View>
  )
}

export default ModalCreateChat

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
  iconCreate: {
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
    fontWeight: '600'
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
  }
})