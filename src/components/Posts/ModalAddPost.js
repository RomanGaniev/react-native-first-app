import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Keyboard, InputAccessoryView, Button, ScrollView, TouchableOpacity, Image, ActionSheetIOS } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Axios, Pusher } from '../../services/boot';
import { shadow } from 'react-native-paper';

const ModalAddPost = ({ toggleModalVisible, modalVisible }) => {
  // const [ isKeyboardShow, setKeyboardShow ] = useState(false);
  const [text, setText] = useState('');
  const [textT, setTextT] = useState('');
  const [image, setImage] = useState(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const inputAccessoryViewID = 'uniqueID';
  let keyboardDidShowListener = null, keyboardDidHideListener = null
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

  // const _keyboardDidShow = (event) => {
  //   const { duration } = event;
  //   if (!duration) {
  //     return;
  //   }
  //   setKeyboardShow(true);
  // }

  // const _keyboardDidHide = (event) => {
  //   if (!event) {
  //     return;
  //   }
  //   const { duration } = event;
  //   if (!duration) {
  //     return;
  //   }
  //   setKeyboardShow(false);
  // }

  // useEffect(() => {
  //   if (modalVisible) {
  //     keyboardDidShowListener = Keyboard.addListener(
  //       'keyboardDidShow',
  //       _keyboardDidShow,
  //     );
  //     keyboardDidHideListener = Keyboard.addListener(
  //       'keyboardDidHide',
  //       _keyboardDidHide,
  //     );
  //   } else {
  //     if (keyboardDidShowListener) 
  //     keyboardDidShowListener.remove();
  //     if (keyboardDidHideListener) 
  //     keyboardDidHideListener.remove();
  //   }
  // }, [modalVisible])

  const pickImage = async () => {
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

  const close = () => {
     if (text || image) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Отмена', 'Удалить'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: 'Все изменения будут потеряны, если вы выйдете',
          tintColor: '#2887f5'
          // userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            setText('')
            setImage(null)
            toggleModalVisible()
          }
        }
      )
     } else {
        toggleModalVisible()
        setText('')
        setImage(null)
     }
  }

  return (
    <View style={{backgroundColor: 'white'}}>
      <GestureRecognizer
        style={{flex: 1}}
        config={{
          velocityThreshold: 0.1,
          directionalOffsetThreshold: 100,
          gestureIsClickThreshold	: 1
        }}
        onSwipeDown={() => close()}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle='formSheet'>
          <View style={{paddingHorizontal: 10}}>
            <View style={{height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{width: 38}}
                onPress={() => close()}>
                <MaterialCommunityIcons name="close-circle" size={28} color="#c9c9c9" />
              </TouchableOpacity>

              <Text style={{fontSize: 18, fontWeight: '600'}}>Роман</Text>

              <TouchableOpacity onPress={() => createPost()} disabled={text !== '' && image} >
                <MaterialCommunityIcons name="arrow-up-circle" size={38} color={text || image ? '#2887f5' : 'grey' } />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <ScrollView>
              <View style={{paddingHorizontal: 14, paddingBottom: 7}}>
                <View style={{height: 1, backgroundColor: '#ececec'}}></View>
              </View>
              <View>
                <TextInput
                multiline
                placeholder='Что у вас нового?'
                placeholderTextColor='grey'
                autoFocus={true}
                style={{fontSize: 22, fontWeight: '300', marginHorizontal: 14}}
                value={text}
                onChangeText={(val) => setText(val)
                }
              />
              <InputAccessoryView style={{height: 50}}>
                <View style={{backgroundColor: 'blue', flex: 1}}>
                  <View style={{paddingHorizontal: 15}}>
                    <View style={{height: 1, backgroundColor: '#ececec'}}></View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, flex: 1}}>
                    <TouchableOpacity onPress={pickImage}>
                      <Feather name="image" size={25} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                      <Feather name="chevron-down" size={30} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              </InputAccessoryView>
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
 //
});