import React, {
  useEffect,
  useState,
  useContext
} from 'react'

import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Button
} from 'react-native'

import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { CustomActivityIndicator } from '../../components/CustomActivityIndicator'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { AuthStateContext } from '../../states/auth/authStateContext'
import { SectionInDevelopment } from '../../components/SectionInDevelopment';

const SearchScreen = ({ navigation }) => {

  const sectionInDevelopment = true

  const { user } = useContext(AuthStateContext)
  const [ users, setUsers ] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    showUsers()
  }, [])

  const showUsers = () => {
    api.call('showUsers')
      .then(({data}) => {
        setUsers(data.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const addToFriends = (otherUser) => {
    if (!otherUser.friendship) {
      sendFriendRequest(otherUser.id)
    } else {
      if (otherUser.friendship.status === 'pending' &&
      otherUser.friendship.acted_user !== user.info.id) {
        acceptFriendRequest(otherUser.id)
      }
    }
  }

  const sendFriendRequest = (otherUserId) => {
    api.call('sendFriendRequest', {otherUserId})
      .then(({ data }) => {
        console.log(data)
      })
  }

  const acceptFriendRequest = (otherUserId) => {
    api.call('acceptFriendRequest', {otherUserId})
      .then(({ data }) => {
        console.log(data)
      })
  }

  const goToUserProfile = (user) => {
    navigation.navigate("UserProfileScreen", {
      userParam: user,
    })
  }

  if (sectionInDevelopment) {
    return (
      <SectionInDevelopment
        navigation={navigation}
        title='Поиск'
      />
    )
  }

  if (isLoading) {
    return <CustomActivityIndicator size='small' color='grey' />
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
        {
          users.map((user, index) => (
            <TouchableHighlight
              onPress={() => goToUserProfile(user)}
              underlayColor="#e1e1e1" key={'user-' + index}
            >
              <View style={styles.userRow}>
                <Avatar.Image 
                  source={{uri: user.avatar}}
                  style={{backgroundColor: '#e1e1e1'}}
                  size={55}
                />
                <View style={styles.userInfo}>
                  <Title style={styles.title}>
                    {`${user.first_name} ${user.last_name}`}
                  </Title>
                  <Caption
                    numberOfLines={1}
                    style={styles.caption}
                  >
                    Уфа
                  </Caption>
                </View>
                { (!user.friendship || user.friendship.status === 'pending') &&
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.addToFriendsButton}
                    onPress={() => addToFriends(user)}
                  >
                    <MaterialIcons name="person-add" size={30} color="#2887f5" />
                  </TouchableOpacity>
                }
              </View>
            </TouchableHighlight>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen

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
  },
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
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey',
    fontSize: 15,
    lineHeight: 15
  },
  captionTime: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey'
  },
  userRow: {
    flexDirection:'row',
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  userInfo: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1
  },
  addToFriendsButton: {
    justifyContent: 'center',
    padding: 10
  }
})