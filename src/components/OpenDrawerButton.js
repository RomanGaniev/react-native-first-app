import React, {useContext} from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AuthStateContext } from '../states/auth'

export const OpenDrawerButton = ({ onPress }) => {

  const { user } = useContext(AuthStateContext)

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{paddingHorizontal: 10}}
    >
      <View style={styles.avatar}>
        <Image
          source={{uri: user.info.avatar}}
          style={styles.avatar}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 33,
    height: 33,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1e1e1'
  },
})