import React from 'react'
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const BookmarkScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{alignItems: 'center'}}>
        <Text style={styles.textHeader}>Закладки</Text>
        <View style={styles.body}>
          <Ionicons name="hammer-outline" size={50} color="grey" />
          <Text style={styles.textBody}>Раздел в разработке</Text>
          <Button title='На главную' onPress={() => navigation.navigate('Home')} />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default BookmarkScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#e1e1e1', 
    alignItems: 'center'
  },
  textHeader: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 10
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 300
  },
  textBody: {
    fontSize: 15,
    fontWeight: '500',
    color: 'grey',
    marginBottom: 10
  }
})