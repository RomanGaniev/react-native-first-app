import React, { useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native'
import { PasswordTextBox } from '../../PasswordTextBox'

export const PasswordEntry = ({ password, confirmPassword, setPassword, setConfirmPassword, goTo }) => {

  const passwordsEnteredAndEqual = password && confirmPassword && password === confirmPassword

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, paddingHorizontal: 25}}>
        <View style={{flex: 1}}>
          <Text style={styles.textHeader}>Придумайте пароль</Text>
          <PasswordTextBox
            value={password}
            setValue={setPassword}
            // value={password}
            // onChange={password => setPassword(password)}
            placeholder='Пароль'
            style={styles.input}
          />
          <PasswordTextBox
            value={confirmPassword}
            setValue={setConfirmPassword}
            // value={confirmPassword}
            // onChange={confirmPassword => setConfirmPassword(confirmPassword)}
            placeholder='Подтверждение пароля'
            style={styles.input}
          />
          <TouchableOpacity
            disabled={!passwordsEnteredAndEqual}
            style={passwordsEnteredAndEqual ? styles.nextButtonActive : styles.nextButtonInactive}
            onPress={goTo}
          >
            <Text style={styles.textNextButton}>Далее</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 10,
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
  }
})