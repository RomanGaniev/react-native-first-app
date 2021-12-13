import React, { useState, useEffect, useCallback, createContext } from 'react';
import { View, Image, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, ActionSheetIOS } from 'react-native';
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

import { useToggle } from '../../../helpers/useToggle'

import ModalImageViewer from '../../../components/posts/ModalImageViewer';

export const HomeScreen = ({navigation}) => {

  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [imageHeightCurrentPost, setImageHeightCurrentPost] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [modalAddPostVisible, toggleModalAddPostVisible] = useToggle(false)
  const [modalImageViewerVisible, toggleModalImageViewerVisible] = useToggle(false)

  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    if (currentPost) {
      if (currentPost.data.image) {
        Image.getSize(currentPost.data.image, (width, height) => {
          const scaleFactor = width / screenWidth
          const imageHeight = height / scaleFactor
          setImageHeightCurrentPost(imageHeight)
        })
      }
    }
   
  }, [screenWidth, currentPost])

  useEffect(() => {
    // getToken()
    showPosts()
    setScreenWidth(Dimensions.get('window').width)
  }, [])

  // useEffect(() => {
  //   if (currentPost) {
  //     if (!modalImageViewerVisible) {
  //       toggleModalImageViewerVisible()
  //     }
  //   }
  // }, [currentPost])

  // useEffect(() => {
  //   console.log('Значение modalImageViewerVisible поменялось на ', modalImageViewerVisible)
  // }, [modalImageViewerVisible])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showPosts()
  }, [])

  // const getToken = async () => {
  //   let tokenStorage = ""
  //   if (Device.brand) {
  //     tokenStorage = await SecureStore.getItemAsync('access_token')
  //   } else {
  //     tokenStorage = localStorage.getItem('access_token')
  //   }

  //   const ast = await Pusher(tokenStorage)
  //   ast.channel(`post-channel`) 
  //     .listen('PostChanged', (e) => {
  //       loadOnePostPusher(e.post_id)
  //       console.log('post_id_from_pusher: ', e.post_id)
  //     })
  //   console.log('START')
  // }

  // const loadOnePostPusher = (post_id) => {
  //   loadOnePost(post_id)
  // }

  const goToPost = (postId, postParam, toComments, imgHeight) => {
    navigation.navigate("PostScreen", {
      postId: postId,
      postParam: postParam,
      toComments: toComments,
      imgHeight: imgHeight,
    })
  }

  // const stopListen = async () => {
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

  const showPosts = () => {
    // setIsLoading(false)
    api.call('showPosts')
      .then(({ data }) => {
        let ppp = data.data
        ppp = _.orderBy(ppp, 'created_at', 'desc')
        moment.locale('ru')
        _.each(ppp, (post) => {
          post.created_at = moment(post.created_at).fromNow().toString()
        })
        setPosts(ppp)
        // console.log('showPosts: ', ppp)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
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
        console.log('posts: ', posts);
      })
  }

  const showImageViewer = async (post) => {
    await setCurrentPost(post)
    if (!modalImageViewerVisible) {
      toggleModalImageViewerVisible()
    }
  }

  const like = (post_id) => {
    // setPost({...postItem, liked: !postItem.liked, likes_count: postItem.liked ? postItem.likes_count - 1 : postItem.likes_count + 1})
    const new_posts = posts.map((post) => {
      if (post.id === post_id) {
        setCurrentPost({...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1}) // change current post for ModalImageViewer
        return {...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1} // return new data of new post
      } else {
        return {...post} // return old post
      }
    })
    setPosts(new_posts)

    api.call('likePost', { post: post_id })
      .then(({ data }) => {
        loadPost(post_id)
      })
      .catch(error => {
        //
      })
      .finally(() => {
        //
      })
  }

  const showOptions = (post) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Отмена', 'Сохранить в закладках', 'Уведомлять о новых записях', 'Скопировать ссылку'],
        cancelButtonIndex: 0,
        tintColor: '#2887f5'
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          // setText('')
          // setImage(null)
          // toggleModalVisible()
        }
      }
    )
  }

  const toShare = (post) => {
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        message: post.data.text ? post.data.text : 'Default message',
      },
      ({error}) => {
        console.log(error)
      },
      (result, method) => {
        console.log('result: ', result)
        console.log('method: ', method)
      }
    )
  }

  return (
    <>
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            
          />
        }
      >
        <View style={styles.panel}>
          <TouchableOpacity style={styles.addButton} onPress={toggleModalAddPostVisible}>
            <MaterialCommunityIcons name="plus-box" size={25} color="#2887f5" />
            <Text style={styles.addButtonText}>Создать запись</Text>
          </TouchableOpacity>
        </View>
        { isLoading ?
          <View style={styles.spinner}>
            <ActivityIndicator size="small" color='grey'/>
          </View>
          : 
          ( posts.length > 0 ?
            <>
              <View style={styles.separator} />
              { posts.map((item, index) => (
                  <View style={{backgroundColor: '#e1e1e1'}} key={'post-' + index}>
                    <PostItem
                      postItem={item}
                      screenWidth={screenWidth}
                      loadPost={loadOnePost}
                      goToPost={goToPost}
                      showImageViewer={showImageViewer}
                      like={like}
                      toShare={toShare}
                      showOptions={showOptions}
                    />
                    { index !== posts.length - 1 ? <View style={styles.separator} /> : null }
                  </View>
                ))
              }
            </>
          :
            <View style={styles.notFound}>
              <Text>No posts.</Text>
            </View>
          )
        }


      </ScrollView>

      <ModalAddPost
        toggleModalVisible={toggleModalAddPostVisible}
        modalVisible={modalAddPostVisible}
      />

      
      
    </SafeAreaView>
      <ModalImageViewer
        modalImageViewerVisible={modalImageViewerVisible}
        toggleModalImageViewerVisible={toggleModalImageViewerVisible}
        post={currentPost}
        screenWidth={screenWidth}
        goToComments={goToPost}
        like={like}
        toShare={toShare}
        showOptions={showOptions}
        imgHeight={imageHeightCurrentPost}
      />
    
    </>
  )
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