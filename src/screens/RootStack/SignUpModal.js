import React, { useState, useRef, useContext, useEffect } from 'react'
import { View, StyleSheet, Modal, SafeAreaView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import PagerView from 'react-native-pager-view'

import Api from '../../../services/api'
const api = new Api('Auth')
import _ from 'lodash'

import { EmailEntry } from '../../components/registration/steps/EmailEntry'
import { PasswordEntry } from '../../components/registration/steps/PasswordEntry'
import { FirstNameAndLastNameEntry } from '../../components/registration/steps/FirstNameAndLastNameEntry'
import { AddingAvatar } from '../../components/registration/steps/AddingAvatar'

import { AuthDispatchContext } from '../../states/auth/authDispatchContext'
import { useToggle } from '../../../services/helpers/useToggle'

export const SignUpModal = ({ navigation, visible, toggleVisible }) => {

  const { signIn } = useContext(AuthDispatchContext)
  const pagerViewRef = useRef()
  const [isLoadingRegistration, toggleIsLoadingRegistration] = useToggle(false)
  const [registrationCompleted, setRegistrationCompleted] = useState(false)

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    if (!visible) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setFirstName('')
      setLastName('')
      setAvatar(null)
      setRegistrationCompleted(false)
    }
  }, [visible])

  const register = () => {
    toggleIsLoadingRegistration()

    let uriAvatar = avatar
    let fileType = uriAvatar.substring(uriAvatar.lastIndexOf(".") + 1)

    const fd = new FormData()
    fd.append('first_name', firstName)
    fd.append('last_name', lastName)
    fd.append('email', email)
    fd.append('password', password)
    fd.append('avatar', {
      uri: uriAvatar,
      name: `avatar.${fileType}`,
      type: `image/${fileType}`
    })

    api.call('registration', fd)
      .then(({ data }) => {
        setRegistrationCompleted(true)
        automaticLogin()
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        toggleIsLoadingRegistration()
      })
  }

  const automaticLogin = () => {
    const fd = new FormData()
    fd.append('email', email)
    fd.append('password', password)

    api.call('login', fd)
      .then(({ data }) => {
        signIn(data.access_token)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle='overFullScreen'
    >
      <SafeAreaView style={{flex: 1}}>

        <View style={styles.header}>
          <View style={{}}>
            <TouchableOpacity onPress={toggleVisible}>
              <Ionicons name="close" size={28} color="#2887f5" />
            </TouchableOpacity>
          </View>
        </View>

        <PagerView scrollEnabled={false} ref={pagerViewRef} style={{flex: 1}} initialPage={0}>

          <View key="1">
            <EmailEntry
              email={email}
              setEmail={setEmail}
              goTo={() => pagerViewRef.current.setPage(1)}
            />
          </View>

          <View key="2">
            <PasswordEntry
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              goTo={() => pagerViewRef.current.setPage(2)}
            />
          </View>

          <View key="3">
            <FirstNameAndLastNameEntry
              firstName={firstName}
              lastName={lastName}
              setFirstName={setFirstName}
              setLastName={setLastName}
              goTo={() => pagerViewRef.current.setPage(3)}
            />
          </View>

          <View key="4">
            <AddingAvatar
              avatar={avatar}
              setAvatar={setAvatar}
              registrationCompleted={registrationCompleted}
              isLoadingRegistration={isLoadingRegistration}
              register={register}
            />
          </View>
        </PagerView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 5
  }
})