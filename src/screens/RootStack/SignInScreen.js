import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, SafeAreaView, Keyboard, TouchableOpacity, Image, TouchableWithoutFeedback, Platform } from 'react-native'
import { setStatusBarStyle } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import * as Device from 'expo-device'
import { Axios } from '../../../services/boot'
import Api from '../../../services/api'
const api = new Api('Auth')
import _ from 'lodash'

import * as Animatable from 'react-native-animatable'

import { AuthDispatchContext } from '../../states/auth/authDispatchContext'

import { useToggle } from '../../../services/helpers/useToggle'
import { SignUpModal } from './SignUpModal'
// import { PasswordTextBox } from '../../components/PasswordTextBox'

export const SignInScreen = ({navigation}) => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [signUpModalVisible, toggleSignUpModalVisible] = useToggle(false)

  const [isSecureTextEntry, toggleIsSecureTextEntry] = useToggle(true)
  const [isEditing, toggleIsEditing] = useToggle(false)

  const { signIn } = useContext(AuthDispatchContext)
  useEffect(() => {
    setStatusBarStyle('dark')
    console.log('SignInScreen is rendered')
  }, [])

  // const emailAndPasswordEntered = email && password
  // const emailAndPasswordEntered = useCallback(() => {
  //   if (email && password) {
  //     console.log('true')
  //     return true
  //   } else {
  //     console.log('false')
  //     return false
  //   }
  // }, [email, password])

  let login = () => {
    const fd = new FormData()
    fd.append('email', email)
    fd.append('password', password)
    api.call('login', fd)
      .then(({ data }) => {
        signIn(data.access_token)
      })
      .catch(error => {
        alert('Неверный email или пароль')
      })
      .finally(() => {
        //
      })
  }

  return (
    <>
      <SafeAreaView style={styles.containerscrollView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Image
                source={require('../../../assets/adaptive-icon.png')}
                style={{width: 80, height: 80, marginBottom: 45, alignSelf: 'center'}}
              />
              <TextInput
                placeholder='Email'
                placeholderTextColor='#7c7c7c'
                style={styles.inputEmail}
                onChangeText={(text) => {setEmail(text)}}
                value={email}
                keyboardType='email-address'
                autoCapitalize="none"
                clearButtonMode='while-editing'
              />
              <View style={[styles.containerPassword, styles.inputPassword]}>
                <TextInput
                  placeholder='Пароль'
                  placeholderTextColor='#7c7c7c'
                  style={{flex: 1, fontSize: 16, paddingLeft: 12, paddingRight: isEditing ? 0 : 12}}
                  onChangeText={val => setPassword(val)}
                  value={password}
                  secureTextEntry={isSecureTextEntry}
                  onFocus={toggleIsEditing}
                  onBlur={toggleIsEditing}
                />
                { isEditing ? 
                  <TouchableOpacity activeOpacity={0.5} onPress={toggleIsSecureTextEntry} style={styles.button}>
                    <Ionicons
                      name={isSecureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                      size={25}
                      color="grey"
                      style={{ alignSelf: 'stretch'}}
                    />
                  </TouchableOpacity>
                  : null
                }
              </View>
              {/* <PasswordTextBox
                // value={password}
                value={password}
                setValue={setPassword}
                placeholder='Пароль'
                style={styles.inputPassword}
              /> */}
              
              <TouchableOpacity disabled={!email || !password} style={ email && password ? styles.loginButtonActive : styles.loginButtonInactive} onPress={login}>
                <Text style={{color: 'white', fontWeight: '500', fontSize: 18}}>Войти</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <View>
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <TouchableOpacity style={{padding: 10}} onPress={toggleSignUpModalVisible}>
              <Text style={{color: '#2887f5', fontWeight: '500', fontSize: 15}}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SignUpModal
          visible={signUpModalVisible}
          toggleVisible={toggleSignUpModalVisible}
        />
      </SafeAreaView>

      
    </>
  );

}

const styles = StyleSheet.create({
  containerPassword: {
    borderColor: '#b8b8b8',
    backgroundColor: '#ededed',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 5
  },
  containerscrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20
  },
  inputEmail: {
    paddingHorizontal: 12,
    height: 45,
    borderColor: '#b8b8b8',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.25,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    fontSize: 16,
    backgroundColor: '#ededed'
  },
  inputPassword: {
    height: 45,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    marginBottom: 15
  },
  loginButtonActive: {
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButtonInactive: {
    backgroundColor: '#98b6db',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  }
})