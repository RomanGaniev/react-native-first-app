import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, Button } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
// import PostsList from '../../components/posts/PostsList';
import ModalAddPost from '../../../components/posts/ModalAddPost';
import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/ru';

import PostItem from '../../../components/posts/PostItem';
import { Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Pusher } from '../../../services/boot';

export const HomeScreen = ({navigation}) => {

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    showPosts()
    setScreenWidth(Dimensions.get('window').width)

    // return function cleanup () {
    //   ast.channel(`post-channel`) 
    //     .stopListening('PostChanged')
    //   console.log('STOP')
    // }
  }, [])

  const getToken = async () => {
    let tokenStorage = ""
    if (Device.brand) {
      tokenStorage = await SecureStore.getItemAsync('access_token')
    } else {
      tokenStorage = localStorage.getItem('access_token')
    }

    const ast = await Pusher(tokenStorage)
    ast.channel(`post-channel`) 
      .listen('PostChanged', (e) => {
        loadOnePostPusher(e.post_id)
        console.log('post_id_from_pusher: ', e.post_id)
      })
    console.log('START')
  }

  // const stopLinten = async () => {
  //   let tokenStorage = ""
  //   if (Device.brand) {
  //     tokenStorage = await SecureStore.getItemAsync('access_token');
  //   } else {
  //     tokenStorage = localStorage.getItem('access_token');
  //   }
  
  //   console.log('tokenStorage: ', tokenStorage)

  //   const ast = await Pusher(tokenStorage)
  //   ast.channel(`post-channel`) 
  //     .stopListening('PostChanged');
  // }

  const goToPost = (postId, toComments, imgHeight) => {
    navigation.navigate("PostScreen", {
      postId: postId,
      toComments: toComments,
      imgHeight: imgHeight
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    showPosts()
  }

  const showPosts = () => {
    api.call('showPosts')
      .then(({ data }) => {
        let ppp = data.data
        ppp = _.orderBy(ppp, 'created_at', 'desc')
        moment.locale('ru')
        _.each(ppp, (post) => {
          post.created_at = moment(post.created_at).fromNow().toString()
        })
        setPosts(ppp)
        console.log('showPosts: ', ppp)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }

  const loadOnePostPusher = (post_id) => {
    loadOnePost(post_id)
  }

  const loadOnePost = (post_id) => {
    api.call('showOnePost', { id: post_id })
      .then(({ data }) => {
        data.created_at = moment(data.created_at).fromNow().toString()
        const post_id = data.id
        const new_posts = posts.map((post) => {
          if (post.id === post_id) {
            return {...data} //return new data of new post
          } else {
            return {...post} //return old post
          }
        })
        console.log('new_posts: ', new_posts)
        setPosts(new_posts)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
      })
  }

  const toggleModalVisible = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=> onRefresh()}
          />
        }
      >
        <View style={styles.panel}>
          <TouchableOpacity style={styles.addButton} onPress={() => toggleModalVisible()}>
            <MaterialCommunityIcons name="plus-box" size={25} color="#2887f5" />
            <Text style={styles.addButtonText}>Создать запись</Text>
          </TouchableOpacity>
        </View>
  {
    isLoading ?
        <View style={styles.spinner}>
          <ActivityIndicator size="small" color='grey'/>
        </View>
      : 
      (
        posts.length > 0 ?
            <>
              <View style={styles.separator} />
              
            { posts.map((item, index) => (
                <View style={{backgroundColor: '#e1e1e1'}} key={'post-' + index}>
                  <PostItem
                    post={item}
                    screenWidth={screenWidth}
                    loadPost={loadOnePost}
                    goToPost={goToPost}
                  />
                  {
                    index !== posts.length - 1
                    ? <View style={styles.separator} />
                    : null
                  }
                </View>
              ))
            }
              {/* <PostsList
                posts={posts}
                loadOnePost={loadOnePost}
                likePost={likePost}
                showPost={showPost}
              /> */}
            </>
          :
          <View style={styles.notFound}>
            <Text>No posts.</Text>
          </View>
      )
  }
      </ScrollView>
      <ModalAddPost toggleModalVisible={toggleModalVisible} modalVisible={modalVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerScrollView: {
    flex: 1,
  },
  separator: {
    backgroundColor: '#e1e1e1',
    height: 8
  },
  spinner: {
    paddingTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  notFound: {
    // backgroundColor: 'green',
    // textAlign: 'center',
    // alignSelf: 'center',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
  },
  panel: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 14
  },
  addButton: {
    borderRadius: 9,
    backgroundColor: '#ececec',
    paddingHorizontal: 22,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: '#2887f5',
    fontWeight: '600'
  }
})