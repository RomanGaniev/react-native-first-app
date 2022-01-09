import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useToggle } from '../../../services/hooks/useToggle'


export const PasswordTextBox = ({ value, setValue, placeholder, style }) => {

  const [isSecureTextEntry, toggleIsSecureTextEntry] = useToggle(true)
  const [isEditing, toggleIsEditing] = useToggle(false)

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor='#7c7c7c'
        style={{flex: 1, fontSize: 16, paddingLeft: 12, paddingRight: isEditing ? 0 : 12}}
        onChangeText={val => setValue(val)}
        value={value}
        secureTextEntry={isSecureTextEntry ? true : false} 
        onFocus={toggleIsEditing}
        onBlur={toggleIsEditing}
      />
      { isEditing ? 
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={toggleIsSecureTextEntry}
          style={styles.button}
        >
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
  )
}


const styles = StyleSheet.create({
  container: {
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
  }
})