import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

export const ProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Images: только изображения, Videos: только видео, All: изображения и видео
      allowsEditing: true, // Показывать ли интерфейс для редактирования изображения/видео после его выбора
      allowMultipleSelection: false, // Разрешить или запретить одновременный выбор нескольких файлов мультимедиа
      aspect: [4, 3], // Соотношение сторон, которое необходимо поддерживать, при "allowsEditing: true" (только Android,  на iOS всегда квадрат)
      quality: 1, // Качество сжатия от 0 до 1, где 1 максимальное качество
      base64: false
    });

    console.log(result);

    if (!result.cancelled) {
      // result.base64 = base
      setImage({uri: result.uri});
    }
  };

  const sendImage = () => {
    let uri = image.uri
    let fileType = uri.substring(uri.lastIndexOf(".") + 1)
    let fd = new FormData()
    fd.append('image', {
      uri: uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    })

    api.call('sendImage', fd)
      .then(({ data }) => {
        console.log(data)
      })
      .catch(error => {
      })
      .finally(() => {
      })
  };

  const getImage = () => {
    api.call('getImage')
      .then(({ data }) => {
        setOldImage(data)
        console.log('getImage: ', data)
      })
      .catch(error => {
        // console.log(error)
      })
      .finally(() => {
        //
      })
  }

  getImage()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {oldImage && <Image source={{ uri: oldImage }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
      <Button title="Send this image" onPress={sendImage} />
    </View>
  );

    // return (
    //   <View style={styles.container}>
    //     <Text>Profile Screen</Text>
    //     <Button
    //       title="Click Here"
    //       onPress={() => alert('Button Clicked!')}
    //     />
    //   </View>
    // );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center'
//   },
// });