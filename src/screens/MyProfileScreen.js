import React, { useContext, useState, useCallback } from 'react'
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native'

import {
  Avatar,
  Title,
  Caption,
  Drawer
} from 'react-native-paper'
import { Separator } from '../components/Separator'

import { AuthStateContext } from '../states/auth'

const MyProfileScreen = () => {
  const { user } = useContext(AuthStateContext)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
        <Separator height={1} color='#ececec' marginHorizontal={10} />
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row',marginTop: 15, alignItems: 'center'}}>
            <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
              <Avatar.Image 
                source={{
                  uri: user.info.avatar
                }}
                style={{backgroundColor: '#e1e1e1'}}
                size={80}
              />
            </View>
            <View style={{marginLeft: 12, flexDirection: 'column'}}>
              <Title style={styles.title}>{user.info.first_name + ' ' + user.info.last_name}</Title>
              <Caption style={styles.userStatus}>Установить статус</Caption>
              <Caption style={styles.status}>online</Caption>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyProfileScreen

const styles = StyleSheet.create({
  userInfoSection: {
		marginLeft: 12,
	},
	title: {
		fontSize: 19,
		marginTop: 0,
		fontWeight: '600',
	},
  userStatus: {
		fontSize: 14,
		lineHeight: 14,
    color: '#2887f5'
	},
	status: {
		fontSize: 14,
		lineHeight: 14,
    marginTop: 5
	},
  avatar: {
		width: 80,
		height: 80,
		// marginRight: 11,
		borderRadius: 50
	}
})