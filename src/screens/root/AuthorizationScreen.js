import React, {
  useState,
  useEffect,
  useContext
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Platform
} from 'react-native'

import { setStatusBarStyle } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { useToggle } from '../../../services/hooks/useToggle'

import Api from '../../../services/api'
const api = new Api('Auth')
import _ from 'lodash'

import { AuthDispatchContext } from '../../states/auth/authDispatchContext'

import { SignUpModal } from '../../components/registration/SignUpModal'
import { CustomActivityIndicator } from '../../components/CustomActivityIndicator'
import { PasswordTextBox } from '../../components/registration/PasswordTextBox'

export const AuthorizationScreen = ({navigation}) => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [signUpModalVisible, toggleSignUpModalVisible] = useToggle(false)

  const [isLoadingLogin, setIsLoadingLogin] = useState(false)
  const [loginCompleted, setLoginCompleted] = useState(false)

  const emailIsValid = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  const loginButtonDisabled = !email || !password || isLoadingLogin || loginCompleted || !emailIsValid

  const { signIn } = useContext(AuthDispatchContext)

  useEffect(() => {
    setStatusBarStyle('dark')
    console.log('AuthorizationScreen is rendered')
  }, [])

  useEffect(() => {
    console.log('isLoadingLogin', isLoadingLogin)
  }, [isLoadingLogin])

  const login = () => {
    setIsLoadingLogin(true)

    const fd = new FormData()
    fd.append('email', email)
    fd.append('password', password)

    api.call('login', fd)
      .then(({ data }) => {
        setLoginCompleted(true)
        signIn(data.access_token)
      })
      .catch(error => {
        alert('Неверный email или пароль')
      })
      .finally(() => {
        setIsLoadingLogin(false)
      })
  }

  return (
    <SafeAreaView style={styles.containerscrollView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Image
              source={require('../../../assets/adaptive-icon.png')}
              style={styles.logo}
            />
            <TextInput
              placeholder='Email'
              placeholderTextColor='#7c7c7c'
              style={styles.inputEmail}
              onChangeText={val => setEmail(val)}
              value={email}
              keyboardType='email-address'
              autoCapitalize="none"
              clearButtonMode='while-editing'
              editable={!isLoadingLogin}
            />
            <PasswordTextBox
              value={password}
              setValue={setPassword}
              placeholder='Пароль'
              style={styles.inputPassword}
            />
            <TouchableOpacity
              disabled={loginButtonDisabled}
              style={[
                loginButtonDisabled ?
                  styles.loginButtonInactive
                :
                  styles.loginButtonActive,
                loginCompleted &&
                  {backgroundColor: 'green'}
              ]}
              onPress={login}
            >
              { isLoadingLogin || loginCompleted ?
                  <CustomActivityIndicator
                    size='small'
                    color='white'
                  />
                :
                  <Text style={styles.textLoginButton}>
                    Войти
                  </Text>
              }
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={toggleSignUpModalVisible}
      >
        <Text style={styles.textSignUpButton}>
          Зарегистрироваться
        </Text>
      </TouchableOpacity>
      
      <SignUpModal
        visible={signUpModalVisible}
        toggleVisible={toggleSignUpModalVisible}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 45,
    alignSelf: 'center'
  },
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
  },
  textLoginButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18
  },
  textSignUpButton: {
    color: '#2887f5',
    fontWeight: '500',
    fontSize: 15
  },
  registerButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20
  }
})