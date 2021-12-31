import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { CustomActivityIndicator } from './CustomActivityIndicator'

export const EmptyChat = ({ isLoading, icon, label }) => {

  if(isLoading) {
    return (
      <CustomActivityIndicator
        backgroundStyle={styles.loader}
        size='small'
        color='grey'
      />
    )
  }

  return (
    <View style={styles.containerNotFound}>
      <Ionicons
        name={icon}
        size={65}
        color="#cdcdcd"
      />
      <Text style={styles.textNotFound}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    transform: [
      { rotateX: "180deg" }
    ],
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerNotFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { rotateX: "180deg" }
    ]
  },
  textNotFound: {
    fontSize: 17,
    fontWeight: '500',
    color: '#cdcdcd'
  }
})