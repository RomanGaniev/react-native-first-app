import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SectionInDevelopment } from '../../components/SectionInDevelopment'

const BookmarkScreen = ({navigation}) => {
  const sectionInDevelopment = true

  if (sectionInDevelopment) {
    return (
      <SectionInDevelopment
        navigation={navigation}
        title='Закладки'
      />
    )
  }

  return (
    <View style={styles.container} />
  )
}

export default BookmarkScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#e1e1e1', 
    alignItems: 'center'
  }
})