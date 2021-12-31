import React, { useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native'

export const FirstNameAndLastNameEntry = ({ firstName, lastName, setFirstName, setLastName, goTo }) => {

  const firstNameAndLastNameEntered = firstName && lastName

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, paddingHorizontal: 25}}>
        <View style={{flex: 1}}>
          <Text style={styles.textHeader}>Введите имя и фамилию</Text>
          <TextInput
            placeholder='Имя'
            placeholderTextColor='#7c7c7c'
            style={styles.input}
            onChangeText={(val) => {
              setFirstName(val)
            }}
            value={firstName}
            clearButtonMode='while-editing'
          />
          <TextInput
            placeholder='Фамилия'
            placeholderTextColor='#7c7c7c'
            style={styles.input}
            onChangeText={(val) => {
              setLastName(val)
            }}
            value={lastName}
            clearButtonMode='while-editing'
          />
          <TouchableOpacity
            disabled={!firstNameAndLastNameEntered}
            style={ firstNameAndLastNameEntered ? styles.nextButtonActive : styles.nextButtonInactive}
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
    paddingHorizontal: 12,
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