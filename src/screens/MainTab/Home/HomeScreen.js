import React, { useState, useEffect, useCallback, createContext } from 'react';
import { View, Image, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, ActionSheetIOS } from 'react-native';
import ModalAddPost from '../../../components/ModalAddPost';
import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/ru';

import PostItem from '../../../components/post/PostItem';
import { Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Pusher } from '../../../services/boot';

import { useToggle } from '../../../helpers/useToggle'

import ModalImageViewer from '../../../components/ModalImageViewer';
import { Separator } from '../../../components/Separator';
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator';
import { AddPostPanel } from '../../../components/AddPostPanel';

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
        let posts = data.data
        posts = _.orderBy(posts, 'created_at', 'desc')
        moment.locale('ru')
        _.each(posts, (post) => {
          post.created_at = moment(post.created_at).fromNow().toString()
        })
        setPosts(posts)
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
    const new_posts = posts.map((post) => {
      if (post.id === post_id) {
        const updated_post = {
          ...post,
          liked: !post.liked,
          likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1
        }
        setCurrentPost(updated_post) // update current post for ModalImageViewer
        return updated_post // return new data of new post
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
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Отмена', 'Сохранить в закладках', 'Уведомлять о новых записях', 'Скопировать ссылку'],
      cancelButtonIndex: 0,
      tintColor: '#2887f5'
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        //
      }
    })
  }

  const toShare = (post) => {
    ActionSheetIOS.showShareActionSheetWithOptions({
      message: post.data.text ? post.data.text : 'Default message',
    },
    ({error}) => {
      console.log(error)
    },
    (result, method) => {
      console.log('result: ', result)
      console.log('method: ', method)
    })
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />
          }>
          <AddPostPanel toggleModalAddPostVisible={toggleModalAddPostVisible} />
          { isLoading ?
              <CustomActivityIndicator size='small' color='grey' />
            : 
              ( posts.length > 0 ?
                  <>
                    <Separator height={8} color='#e1e1e1' />
                    { posts.map((item, index) => (
                        <View style={{backgroundColor: '#e1e1e1'}} key={'post-' + index}>
                          <PostItem
                            postItem={item}
                            screenWidth={screenWidth}
                            loadPost={loadOnePost}
                            goToPost={goToPost}
                            showImageViewer={showImageViewer}
                            showOptions={showOptions}
                            like={like}
                            toShare={toShare}
                          />
                          { index !== posts.length - 1 ?
                            <Separator height={8} color='#e1e1e1' />
                            : null }
                        </View>
                      ))
                    }
                  </>
                :
                  <View style={styles.notFound}>
                    <Text>Sorry, didn't find anything =(</Text>
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
    flex: 1
  },
  notFound: {
    flex: 1,
    alignItems: 'center'
  },
  scrollView: {
  }
})