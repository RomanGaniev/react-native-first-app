import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Button
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const SectionInDevelopment = ({ navigation, title, isBox }) => {

  return (
    <View style={[
        styles.container,
        isBox && styles.borderContainer
      ]}
    >
      <SafeAreaView style={{alignItems: 'center'}}>
        { !isBox &&
          <Text style={styles.textHeader}>
            {title}
          </Text>
        }
        <View style={styles.body}>
          <Ionicons
            name="hammer-outline"
            size={50}
            color="grey"
          />
          <Text style={styles.textBody}>
            Раздел в разработке
          </Text>
          { !isBox &&
            <Button
              title='На главную'
              onPress={() => navigation.navigate('Home')}
            />
          }
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#e1e1e1', 
    alignItems: 'center'
  },
  borderContainer: {
    borderRadius: 10,
    marginHorizontal: 10
  },
  textHeader: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 10
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320
  },
  textBody: {
    fontSize: 15,
    fontWeight: '500',
    color: 'grey',
    marginBottom: 10
  },
})