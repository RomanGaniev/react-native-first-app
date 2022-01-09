import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'

import { Octicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper'
import { CustomActivityIndicator } from '../../CustomActivityIndicator'
import * as ImagePicker from 'expo-image-picker'

export const AddingAvatar = ({
  avatar,
  setAvatar,
  registrationCompleted,
  isLoadingRegistration,
  register
}) => {

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

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, paddingHorizontal: 25}}>
        <View style={{flex: 1}}>
          <Text style={styles.textHeader}>Добавьте фото профиля</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={pickImage}
            style={styles.pickImageButton}
            disabled={isLoadingRegistration}
          >
            { avatar ?
                <Avatar.Image 
                  source={{uri: avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={200}
                />
              :
                <View style={styles.placeholderAvatar}>
                  <Octicons
                    name="octoface"
                    color="#b8b8b8"
                    size={70}
                  />
                </View>
            }
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!avatar || registrationCompleted}
            style={[
              avatar ?
                  styles.nextButtonActive
                :
                  styles.nextButtonInactive,
              registrationCompleted &&
                {backgroundColor: 'green'}
            ]}
            onPress={register}
          >
            { isLoadingRegistration || registrationCompleted ?
                <CustomActivityIndicator size='small' color='white' />
              :
                <Text style={styles.textButton}>
                  Завершить регистрацию
                </Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    height: 45,
    borderColor: '#b8b8b8',
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#ededed',
    marginBottom: 20
  },
  nextButtonActive: {
    flexDirection: 'row',
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginBottom: 20
  },
  nextButtonInactive: {
    flexDirection: 'row',
    backgroundColor: '#98b6db',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginBottom: 20
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    textAlignVertical: 'center',
    justifyContent: 'center'
  },
  textNextButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20
  },
  placeholderAvatar: {
    width: 200,
    height: 200,
    backgroundColor: '#ededed',
    borderRadius: 100,
    borderColor: '#b8b8b8',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickImageButton: {
    alignItems: 'center',
    marginBottom: 25
  }
})