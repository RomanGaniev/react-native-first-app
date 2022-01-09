import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SectionInDevelopment } from '../../components/SectionInDevelopment'

const SettingsScreen = ({navigation}) => {

  const sectionInDevelopment = true

  if (sectionInDevelopment) {
    return (
      <SectionInDevelopment
        navigation={navigation}
        title='Настройки'
      />
    )
  }

  return (
    <View style={styles.container} />
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#e1e1e1', 
    alignItems: 'center'
  }
})