import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ScrollView
} from 'react-native'

import ModalAddPost from '../../../components/posts/ModalAddPost'
import Api from '../../../../services/api'
const api = new Api('User')
import { Axios, Echo } from '../../../../services/boot'
import _ from 'lodash'

import Post from '../../../components/posts/Post'
import { Separator } from '../../../components/Separator'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'
import { AddPostPanel } from '../../../components/posts/AddPostPanel'

import { Dimensions } from 'react-native'
import { useToggle } from '../../../../services/hooks/useToggle'

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
    console.log(posts[0]?.id)
  }, [])

  useEffect(() => {
    let echo = new Echo(user.token)

    if (!isLoading) {
      let pusher = echo
        .channel('post-channel')
          .listen('AddedNewPost', (e) => {
            loadAddedPost(e.post_id)
          })
          .listen('PostLiked', (e) => {
            updateOnePost(e.post_id)
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

  const goToPost = (post, toComments, imgHeight) => {
    navigation.navigate("PostScreen", {
      post: post,
      toComments: toComments,
      imgHeight: imgHeight,
      screenWidth: screenWidth
    })
  }

  const showPosts = () => {
    api.call('showPosts')
      .then(({ data }) => {
        let posts = data.data
        setPosts(posts)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }

  const updateOnePost = (post_id) => {
    api.call('showOnePost', { id: post_id })
      .then(({ data }) => {
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
  }

  const loadAddedPost = (post_id) => {
    api.call('showOnePost', { id: post_id })
      .then(({ data }) => {
        setPosts([data, ...posts])
      })
  }

  const pushPost = (post) => {
    setPosts([post, ...posts])
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
    <SafeAreaView style={{borderStartColor: '#e1e1e1'}}>
      <ScrollView
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
                            updateOnePost={updateOnePost}
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
        pushPost={pushPost}
        recentPostId={posts[0]?.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center'
  }
})