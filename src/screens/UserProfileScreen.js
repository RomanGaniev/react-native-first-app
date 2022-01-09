import React, {
  useContext,
  useState,
  useCallback
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Separator } from '../components/Separator'
import { SectionInDevelopment } from '../components/SectionInDevelopment'

import { AuthStateContext } from '../states/auth'

const UserProfileScreen = ({ route, navigation }) => {

  const [ otherUser, setOtherUser ] = useState(route.params.userParam)

  const { user } = useContext(AuthStateContext)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  const sendFriendRequest = () => {
    api.call('sendFriendRequest', {
      otherUserId: otherUser.id
    })
      .then(({ data }) => {
        console.log(data)
      })
  }

  const acceptFriendRequest = () => {
    api.call('acceptFriendRequest', {
      otherUserId: otherUser.id
    })
      .then(({ data }) => {
        console.log(data)
      })
  }

  const rejectOrCancelFriendRequest = () => {
    api.call('rejectOrCancelFriendRequest', {
      otherUserId: otherUser.id
    })
      .then(({ data }) => {
        console.log(data)
      })
  }

  const removeFromFriends = () => {
    api.call('removeFromFriends', {
      otherUserId: otherUser.id
    })
      .then(({ data }) => {
        console.log(data)
      })
  }

  const goToChat = () => {
    api.call('createPrivateChat', {
      interlocutorId: otherUser.id
    })
      .then(({ data }) => {
        navigation.navigate('ChatScreen', {
          chat: data.data
        })
      })
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />
      }>
      <Separator
        height={1}
        color='#ececec'
        marginHorizontal={10}
      />
      <View style={styles.userInfoSection}>
        <View style={styles.userRow}>
          <Avatar.Image 
            source={{
              uri: otherUser.avatar
            }}
            style={{backgroundColor: '#e1e1e1'}}
            size={80}
          />
          <View style={{marginLeft: 12}}>
            <Title style={styles.userName}>
              {otherUser.first_name} {otherUser.last_name}
            </Title>
            <Caption style={styles.userStatus}>Its my life! =)</Caption>
            <Caption style={styles.status}>online</Caption>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={goToChat}
          activeOpacity={0.8}
          style={[styles.button, {marginRight: 4}]}
        >
          <Text style={styles.textButton}>Сообщение</Text>
        </TouchableOpacity>
        { otherUser.friendship ?
            otherUser.friendship.status === 'pending' ?
              otherUser.friendship.acted_user === user.info.id ?
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, {marginLeft: 4}]}
                    onPress={rejectOrCancelFriendRequest}
                  >
                    <Text style={styles.textButton}>Отменить заявку</Text>
                  </TouchableOpacity>
                :
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.button, {marginLeft: 4}]}
                      onPress={acceptFriendRequest}
                    >
                      <Text style={styles.textButton}>Принять заявку</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.button, {marginLeft: 4}]}
                      onPress={rejectOrCancelFriendRequest}
                    >
                      <Text style={styles.textButton}>Отклонить заявку</Text>
                    </TouchableOpacity>
                  </>
              :
                otherUser.friendship.status === 'confirmed' ?
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, {marginLeft: 4, backgroundColor: 'red'}]}
                    onPress={removeFromFriends}
                  >
                    <Text style={styles.textButton}>Удалить из друзей</Text>
                  </TouchableOpacity> : null
          :
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, {marginLeft: 4}]}
              onPress={sendFriendRequest}
            >
              <Text style={styles.textButton}>Добавить в друзья</Text>
            </TouchableOpacity>
        }
      </View>
      <SectionInDevelopment
        isBox={true}
      />
    </ScrollView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userInfoSection: {
		margin: 12,
	},
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 15
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
	userName: {
		fontSize: 19,
		marginTop: 0,
		fontWeight: '600',
	},
  userStatus: {
		fontSize: 14,
		lineHeight: 14,
    color: 'black'
	},
	status: {
		fontSize: 14,
		lineHeight: 14,
    marginTop: 5
	},
  button: {
    backgroundColor: '#2887f5',
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textButton: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14
  }
})