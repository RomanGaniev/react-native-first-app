import React, {
  useState,
  useEffect,
  useCallback
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableHighlight,
  ScrollView,
  RefreshControl
} from 'react-native'

import Api from '../../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper';

export const FriendsScreen = ({navigation}) => {

  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(true)
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    showFriends()
    showRequests()
  }, [])

  const showFriends = () => {
    api.call('getFriends')
      .then(({ data }) => {
        setFriends(data.data)
      })
      .finally(() => {
        setIsLoadingFriends(false)
        setRefreshing(false)
      })
  }

  const showRequests = () => {
    api.call('getFriendRequests')
      .then(({ data }) => {
        setRequests(data.data)
      })
      .finally(() => {
        setIsLoadingRequests(false)
      })
  }

  const goToUserProfile = (user) => {
    navigation.navigate("UserProfileScreen", {
      userParam: user,
    })
  }

  const goToRequests = () => {
    navigation.navigate("FriendRequestsScreen", {
      requests
    })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showFriends()
    showRequests()
  }, [])

  if (isLoadingFriends || isLoadingRequests) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
      { requests.length > 0 &&
        <TouchableHighlight
          onPress={goToRequests}
          underlayColor="#e1e1e1"
        >
          <View style={styles.requestsContainer}>
            <View style={styles.requestsBox}>
              <Text>Заявки в друзья</Text>
              <Text>{requests.length}</Text>
            </View>
          </View>
        </TouchableHighlight>
      }
        { friends.map((friend, index) => (
            <TouchableHighlight
              onPress={() => goToUserProfile(friend)}
              underlayColor="#e1e1e1"
              key={'friend-' + index}
            >
              <View style={styles.user}>
                <Avatar.Image 
                  source={{uri: friend.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={55}
                />
                
                <View style={styles.userName}>
                  <Title style={styles.title}>
                    {`${friend.first_name} ${friend.last_name}`}
                  </Title>
                </View>
              </View>
            </TouchableHighlight>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
    color: 'black'
  },
  user: {
    flexDirection:'row',
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  userName: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center'
  },
  requestsContainer: {
    flexDirection:'row',
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  requestsBox: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 12,
    justifyContent: 'space-between'
  }
})