import React, { useEffect, useState, useRef, useCallback, createContext } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TextInput, InputAccessoryView, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Post from '../../../components/posts/Post';
import Comment from '../../../components/posts/Comment';

import { Axios } from '../../../services/boot'
import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/ru';

import { Dimensions } from 'react-native';

export const PostContext = createContext()

export const PostScreen = ({route, navigation}) => {

  const { postId, toComments, imgHeight, postParam } = route.params

  const [ post, setPost ] = useState(postParam);
  const [ comments, setComments ] = useState([]);

  const [ screenWidth, setScreenWidth ] = useState(0);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingComments, setIsLoadingComments ] = useState(true);

  const [ newComment, setNewComment ] = useState('');
  const [ textComments, setTextComments ] = useState('');

  const scrollRef = useRef();

  useEffect(() => {
    // showPost()
    showComments()
    setScreenWidth(Dimensions.get('window').width)
    console.log('post: ', post)
    setIsLoading(false)
  },[])

  useEffect(() => {
    if (!isLoading) {
      const lastDigit = post.comments_count % 10
      
      if (lastDigit === 1) {
        setTextComments('КОММЕНТАРИЙ')
      } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
        setTextComments('КОММЕНТАРИЯ')
      } else {
        setTextComments('КОММЕНТАРИЕВ')
      }
    }
    
  },[isLoading])

  useEffect(() => {
    if(!isLoading && !isLoadingComments && post.comments_count !== 0) {
      if (toComments) {
        scrollToComments()
      }
    }
  },[isLoading, isLoadingComments])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showPost()
    showComments()
  }, [])

  const showPost = () => {
    api.call('showOnePost', { id: postId })
      .then(({ data }) => {
        // console.log('data: ', data)
        data.created_at = moment(data.created_at).fromNow().toString()
        setPost(data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }

  const showComments = () => {
    api.call('showComments', { id: postId })
      .then(({ data }) => {
        let response = data.data
        response = _.orderBy(response, 'created_at', 'desc')
        moment.locale('ru')
        _.each(response, (comment) => {
          comment.created_at = moment(comment.created_at).fromNow().toString()
        })
        setComments(response)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoadingComments(false)
      })
  }

  const sendNewComment = () => {
    if (newComment) {
      let fd = new FormData()
      fd.append('postId', postId)
      fd.append('comment', newComment)

      api.call('sendNewComment', fd)
        .then(({ data }) => {
          setNewComment('')
        })
        .catch(error => {
        })
        .finally(() => {
        })
    }
  }

  const scrollToComments = () => {
    // 110 без текста
    // 138 с текстом
    console.log('imgHeight', imgHeight)
    let a = imgHeight + 110
    if (post.data.text) {
      a = a + 28
    }
    setTimeout(() => {
      scrollRef.current?.scrollTo({y: a, animated: true})
      console.log('scrollingggg: ', a)
    }, 900)
    
  }

  const handleLike = (post_id) => {
    // // setPost({...postItem, liked: !postItem.liked, likes_count: postItem.liked ? postItem.likes_count - 1 : postItem.likes_count + 1})
    // const new_posts = posts.map((post) => {
    //   if (post.id === post_id) {
    //     return {...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1} //return new data of new post
    //   } else {
    //     return {...post} //return old post
    //   }
    // })
    // setPosts(new_posts)
  }

  return (
    <>
      { isLoading ?
          <View style={styles.spinner}>
            <ActivityIndicator size="small" color="grey" />
          </View>
        :
          <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView
              ref={scrollRef}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh} />
              }>
                <PostContext.Provider value={post}>
                  <Post
                    screenWidth={screenWidth}
                    loadPost={showPost}
                    likeProp={handleLike}
                    scrollToComments={scrollToComments}
                    imgHeight={imgHeight}
                  />
                </PostContext.Provider>
              { post.comments_count !== 0 ?
                <>
                  <View style={styles.separator} />
                  <Text style={{fontSize: 14, color: 'grey', fontWeight: '600', paddingLeft: 10, paddingTop: 5, paddingBottom: 10}}>{post.comments_count + ' ' + textComments}</Text>
                </>
                : null
              }
              { isLoadingComments ?
                  <View style={styles.spinner}>
                    <ActivityIndicator size="small" color="grey" />
                  </View>
                : comments.map((item, index) => (
                  <Comment
                    key={'comment-' + index}
                    comment={item}
                  />
                ))
              }
              <InputAccessoryView style={styles.inputAccessoryView}>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={{...styles.button}}>
                    <View style={styles.icon}>
                      <MaterialCommunityIcons name="plus-circle-outline" size={28} color="#2887f5" />
                    </View>
                  </TouchableOpacity>
                  <TextInput
                    multiline
                    placeholder='Ваш комментарий'
                    placeholderTextColor='grey'
                    style={styles.input}
                    value={newComment}
                    onChangeText={(val) => setNewComment(val)} />
                  <TouchableOpacity style={{...styles.button}} onPress={() => sendNewComment()} disabled={!newComment}>
                    <View style={styles.icon}>
                      <MaterialCommunityIcons name="arrow-up-circle" size={38} color={newComment ? '#2887f5' : 'grey' } />
                    </View>
                  </TouchableOpacity>
                </View>
              </InputAccessoryView>
            </ScrollView>
          </SafeAreaView>
      }
    </>
  )
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    backgroundColor: '#e1e1e1',
    height: 1
  },
  input: {
    fontSize: 16,
    // textAlignVertical: 'center',
    // textAlign: 'justify',
    paddingHorizontal: 10,
    paddingVertical: 7,
    lineHeight: 20,
    backgroundColor: '#efefef',
    // fontWeight: '300',
    // marginHorizontal: 14,
    // marginTop: 7
    borderWidth: 1,
    borderColor: '#dfdfdf',
    borderRadius: 20,
    flex: 1
  },
  icon: {
    flex: 1,
    justifyContent: 'center'
  },
  button: {
    paddingHorizontal: 8
  },
  inputAccessoryView: {
    height: 50,
    backgroundColor: 'white',
    // marginBottom: 50
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'white'
  }
})