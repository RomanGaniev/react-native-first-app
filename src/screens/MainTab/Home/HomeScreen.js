import React, { useState, useEffect, useCallback, useContext } from 'react'
import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import ModalAddPost from '../../../components/ModalAddPost'
import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/ru'

import Post from '../../../components/post/Post'
import { Dimensions } from 'react-native'
import { Axios, Echo } from '../../../../services/boot'

import { useToggle } from '../../../../services/helpers/useToggle'

import ModalImageViewer from '../../../components/ModalImageViewer'
import { Separator } from '../../../components/Separator'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'
import { AddPostPanel } from '../../../components/AddPostPanel'

import { PostContext } from '../../../states/post/postContext'
import { AuthStateContext } from '../../../states/auth'

export const HomeScreen = ({navigation}) => {

  const { user } = useContext(AuthStateContext)

  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [modalAddPostVisible, toggleModalAddPostVisible] = useToggle(false)

  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    showPosts()
    setScreenWidth(Dimensions.get('window').width)
  }, [])

  useEffect(() => {
    let echo = new Echo(user.token)

    if (!isLoading) {
      let pusher = echo
        .channel(`post-channel`).listen('PostChanged', (e) => {
          loadOnePost(e.post_id)
        })
        .error((error) => {
          console.error(error)
        })
      pusher.on('pusher:subscription_succeeded', function() {
        Axios.updateSocketId(echo.socketId())
      })
    }
    return () => {
      echo.leaveChannel('post-channel')
    }
  }, [isLoading])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showPosts()
  }, [])

  const goToPost = (postId, postParam, toComments, imgHeight) => {
    navigation.navigate("PostScreen", {
      postId: postId,
      postParam: postParam,
      toComments: toComments,
      imgHeight: imgHeight,
      screenWidth: screenWidth
    })
  }

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
        setPosts(new_posts)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onLike = (post_id) => {
    const new_posts = posts.map((post) => {
      if (post.id === post_id) {
        const updated_post = {
          ...post,
          liked: !post.liked,
          likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1
        }
        return updated_post // return new data of new post
      } else {
        return {...post} // return old post
      }
    })
    setPosts(new_posts)
  }

  return (
    <>
      <SafeAreaView style={{borderStartColor: '#e1e1e1'}}>
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
                    <Separator height={8} color='#ececec' />
                    { posts.map((post, index) => (
                        <View style={{backgroundColor: '#e1e1e1'}} key={'post-' + index}>
                          <PostContext.Provider value={post}>
                            <Post
                              screenWidth={screenWidth}
                              scrollToComments={goToPost}
                              onLike={onLike}
                              loadOnePost={loadOnePost}
                              optionsButtonVisible={true}
                              commentsButtonVisible={true}
                            />
                          </PostContext.Provider>
                          
                          
                        { index !== posts.length - 1 ?
                          <Separator height={8} color='#ececec' />
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
      {/* <ModalImageViewer
        modalImageViewerVisible={modalImageViewerVisible}
        toggleModalImageViewerVisible={toggleModalImageViewerVisible}
        post={currentPost}
        screenWidth={screenWidth}
        goToComments={goToPost}
        handleLike={handleLike}
        showOptions={showOptions}
        imgHeight={imageHeightCurrentPost}
      /> */}
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
    // backgroundColor: '#e1e1e1'
  }
})