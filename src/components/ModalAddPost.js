import React, { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, StyleSheet, Modal, TextInput, Keyboard, InputAccessoryView, Button, ScrollView, TouchableOpacity, Image, ActionSheetIOS } from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import GestureRecognizer from 'react-native-swipe-gestures'
import * as ImagePicker from 'expo-image-picker'
import { Dimensions } from 'react-native'
import { Platform } from 'react-native'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store'
import * as Device from 'expo-device'
import { Axios } from '../../services/boot'
import { shadow } from 'react-native-paper'
import { Separator } from './Separator'

import { AuthStateContext } from '../states/auth'

const ModalAddPost = ({ toggleModalVisible, modalVisible }) => {

  const { user } = useContext(AuthStateContext)
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const inputRef = useRef('qwerty')
  const inputAccessoryViewID = 'uniqueID'

  const [inputAccessoryShown, setInputAccessoryShown] = useState(true);


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    setInputAccessoryShown(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Images: только изображения, Videos: только видео, All: изображения и видео
      allowsEditing: true, // Показывать ли интерфейс для редактирования изображения/видео после его выбора
      allowMultipleSelection: false, // Разрешить или запретить одновременный выбор нескольких файлов мультимедиа
      aspect: [4, 3], // Соотношение сторон, которое необходимо поддерживать, при "allowsEditing: true" (только Android,  на iOS всегда квадрат)
      quality: 1, // Качество сжатия от 0 до 1, где 1 максимальное качество
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

      api.call('createPost', fd)
        .then(({ data }) => {
          toggleModalVisible()
          setText('')
          setImage(null)
        })
        .catch(error => {
        })
        .finally(() => {
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
              <TouchableOpacity style={{width: 62, ...styles.button}} onPress={closeModal}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="close-circle" size={28} color="#c9c9c9" />
                </View>
              </TouchableOpacity>
              <Text style={styles.username}>{user.info.first_name}</Text>
              <TouchableOpacity style={styles.button} onPress={createPost} disabled={!(text || image)}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="arrow-up-circle" size={38} color={text || image ? '#2887f5' : 'grey'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <ScrollView keyboardShouldPersistTaps='always'>
              <Separator height={1} color='#ececec' marginHorizontal={15} />
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
                  }}/>
                <InputAccessoryView style={styles.inputAccessoryView} nativeID={inputAccessoryViewID}>
                    <View style={{flex: 1}}>
                      <Separator height={1} color='#ececec' marginHorizontal={15} />
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                          <View style={styles.icon}>
                            <Feather name="image" size={25} color="grey" />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={Keyboard.dismiss}>
                          <View style={styles.icon}>
                            <Feather name="chevron-down" size={30} color="grey" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                </InputAccessoryView>
                { inputAccessoryShown &&
                    <InputAccessoryView style={styles.inputAccessoryView}>
                      <View style={{flex: 1}}>
                        <Separator height={1} color='#ececec' marginHorizontal={15} />
                        <View style={styles.buttonsContainer}>
                          <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <View style={styles.icon}>
                              <Feather name="image" size={25} color="grey" />
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button} onPress={() => inputRef.current.focus()}>
                            <View style={styles.icon}>
                              <Feather name="chevron-up" size={30} color="grey" />
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
                    <Image source={{ uri: image.uri }} style={{width: imgWidth, height: imgHeight}} />
                    <Button title='delete' onPress={() => setImage(null)} />
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
  },
});