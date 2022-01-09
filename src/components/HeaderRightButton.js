import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const HeaderRightButton = ({ onPress, icon, size }) => {

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.button}
    >
      <Ionicons
        name={icon}
        size={size}
        color="#2887f5" 
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  }
})