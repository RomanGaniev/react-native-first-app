import React, {
  useEffect,
  useState,
  useRef,
  useContext
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Keyboard,
  InputAccessoryView,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import GestureRecognizer from 'react-native-swipe-gestures'
import * as ImagePicker from 'expo-image-picker'
import { Dimensions } from 'react-native'
import { Platform } from 'react-native'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Separator } from '../Separator'

import { AuthStateContext } from '../../states/auth'

const ModalAddPost = ({ toggleModalVisible, modalVisible, pushPost, recentPostId }) => {

  const { user } = useContext(AuthStateContext)
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)

  const inputRef = useRef('qwerty')
  const inputAccessoryViewID = 'uniqueID'

  const [inputAccessoryShown, setInputAccessoryShown] = useState(true)


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
    console.log('recentPostId ', ++recentPostId)
  }, [])

  const pickImage = async () => {
    setInputAccessoryShown(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
      base64: false
    })

    if (!result.cancelled) {
      setImage({uri: result.uri})
      Image.getSize(result.uri, (width, height) => {
        const screenWidth = Dimensions.get('window').width
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        setImgWidth(screenWidth)
        setImgHeight(imageHeight)
      })
    }
  }

  const createPost = () => {
    if (text || image) {
      let fd = new FormData()
      fd.append('text', text)
      if (image) {
        let uri = image.uri
        let fileType = uri.substring(uri.lastIndexOf(".") + 1)
        fd.append('image', {
          uri: uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        })
      }

      let postForQuiklyPush = {
        id: ++recentPostId,
        data: {
          image: image?.uri,
          text: text
        },
        author: {
          avatar: user.info.avatar,
          first_name: user.info.first_name,
          last_name: user.info.last_name
        },
        created_at: 'только что',
        is_loading: true
      }

      pushPost(postForQuiklyPush)

      toggleModalVisible()
      setText('')
      setImage(null)

      api.call('createPost', fd)
        .then(({ data }) => {
          data.is_loading = false
          pushPost(data)
        })
    }
  }

  const closeModal = () => {
    if (text || image) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Отмена', 'Удалить'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: 'Все изменения будут потеряны, если вы выйдете',
        tintColor: '#2887f5'
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          setText('')
          setImage(null)
          toggleModalVisible()
        }
      })
    } else {
      toggleModalVisible()
      setText('')
      setImage(null)
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
          visible={modalVisible}
          presentationStyle='formSheet'
        >
          <View style={styles.header}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, {width: 62}]}
                onPress={closeModal}
              >
                <View style={styles.icon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={28}
                    color="#c9c9c9"
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.username}>
                {user.info.first_name}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={createPost}
                disabled={!(text || image)}
              >
                <View style={styles.icon}>
                  <MaterialCommunityIcons
                    name="arrow-up-circle"
                    size={38}
                    color={text || image ? '#2887f5' : 'grey'}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <ScrollView keyboardShouldPersistTaps='always'>
              <Separator
                height={1}
                color='#ececec'
                marginHorizontal={15}
              />
              <View>
                <TextInput
                  ref={inputRef}
                  multiline
                  inputAccessoryViewID={inputAccessoryViewID}
                  placeholder='Что у вас нового?'
                  placeholderTextColor='grey'
                  autoFocus={true}
                  style={styles.input}
                  value={text}
                  onChangeText={(val) => setText(val)}
                  onFocus={() => {
                    setInputAccessoryShown(false)
                  }}
                  onBlur={() => {
                    setInputAccessoryShown(true)
                  }}
                />
                <InputAccessoryView
                  style={styles.inputAccessoryView}
                  nativeID={inputAccessoryViewID}
                >
                  <View style={{flex: 1}}>
                    <Separator
                      height={1}
                      color='#ececec'
                      marginHorizontal={15}
                    />
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={pickImage}
                      >
                        <View style={styles.icon}>
                          <Feather
                            name="image"
                            size={25}
                            color="grey"
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={Keyboard.dismiss}
                      >
                        <View style={styles.icon}>
                          <Feather
                            name="chevron-down"
                            size={30}
                            color="grey"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </InputAccessoryView>
                { inputAccessoryShown &&
                  <InputAccessoryView
                    style={styles.inputAccessoryView}
                  >
                    <View style={{flex: 1}}>
                      <Separator
                        height={1} 
                        color='#ececec'
                        marginHorizontal={15}
                      />
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={pickImage}
                        >
                          <View style={styles.icon}>
                            <Feather
                              name="image"
                              size={25}
                              color="grey"
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => inputRef.current.focus()}
                        >
                          <View style={styles.icon}>
                            <Feather
                              name="chevron-up"
                              size={30}
                              color="grey" 
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </InputAccessoryView>
                }
              </View>
              
            </ScrollView>
              {
                image &&
                  <>
                    <Image
                      source={{ uri: image.uri }}
                      style={{width: imgWidth, height: imgHeight}}
                    />
                    <Button
                      title='delete'
                      onPress={() => setImage(null)}
                    />
                  </>
              }
              </View>
        </Modal>
      </GestureRecognizer>
    </View>
  )
}

export default ModalAddPost

const styles = StyleSheet.create({
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
    fontSize: 22,
    fontWeight: '300',
    marginHorizontal: 14,
    marginTop: 7
  },
  button: {
    paddingHorizontal: 12
  },
  username: {
    fontSize: 20,
    fontWeight: '600'
  }
})