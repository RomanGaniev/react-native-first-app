import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export const AddPostPanel = ({ toggleModalAddPostVisible }) => {
  return (
    <View style={styles.panel}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleModalAddPostVisible}
      >
        <MaterialCommunityIcons
          name="plus-box"
          size={25}
          color="#2887f5"
        />
        <Text style={styles.addButtonText}>
          Создать запись
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 14
  },
  addButton: {
    borderRadius: 9,
    backgroundColor: '#ececec',
    paddingHorizontal: 22,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: '#2887f5',
    fontWeight: '600'
  }
})