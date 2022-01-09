import React, {
  useContext,
  useState,
  useCallback
} from 'react'

import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native'

import {
  Avatar,
  Title,
  Caption,
} from 'react-native-paper'

import { Separator } from '../components/Separator'
import { AuthStateContext } from '../states/auth'

import { SectionInDevelopment } from '../components/SectionInDevelopment'

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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />
      }>
      <Separator height={1} color='#ececec' marginHorizontal={10} />
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoSection}>
          <Avatar.Image 
            source={{
              uri: user.info.avatar
            }}
            style={{backgroundColor: '#e1e1e1'}}
            size={80}
          />
          <View style={styles.userInfo}>
            <Title style={styles.title}>
              {`${user.info.first_name} ${user.info.last_name}`}
            </Title>
            <Caption style={styles.userStatus}>
              Установить статус
            </Caption>
            <Caption style={styles.userOnlineStatus}>
              online
            </Caption>
          </View>
        </View>
      </View>
      <SectionInDevelopment
        isBox={true}
      />
    </ScrollView>
  )
}

export default MyProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userInfoContainer: {
		marginHorizontal: 12,
    marginBottom: 15
	},
  userInfoSection: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center'
  },
  userInfo: {
    marginLeft: 12,
    flexDirection: 'column'
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
	userOnlineStatus: {
		fontSize: 14,
		lineHeight: 14,
    marginTop: 5
	},
  avatar: {
		width: 80,
		height: 80,
		borderRadius: 50,
    backgroundColor: '#e1e1e1'
	},
  sectionInDevelopment: {
    backgroundColor: '#e1e1e1',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 300
  },
  textSectionInDevelopment: {
    fontSize: 15,
    fontWeight: '500',
    color: 'grey'
  }
})