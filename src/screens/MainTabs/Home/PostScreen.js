import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext
} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActionSheetIOS
} from 'react-native';
import Post from '../../../components/post/Post';
import { Comment } from '../../../components/post/Comment';
import { Axios } from '../../../services/boot'
import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/ru';
import { Dimensions } from 'react-native';
import { Separator } from '../../../components/Separator';
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator';
import { CommentAddingForm } from '../../../components/CommentAddingForm';

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
    // 110px with text, 138px without text
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

  const like = () => {
    setPost({
      ...post,
      liked: !post.liked,
      likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1
    })
    api.call('likePost', { post: post.id })
      .then(({ data }) => {
        loadPost(post.id)
      })
      .catch(error => {
        //
      })
      .finally(() => {
        //
      })
  }

  const showOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Отмена', 'Сохранить в закладках', 'Уведомлять о новых записях', 'Скопировать ссылку'],
      cancelButtonIndex: 0,
      tintColor: '#2887f5',
    },
    buttonIndex => {
      if (buttonIndex === 1) {
        //
      }
    })
  }

  const toShare = () => {
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
      { isLoading ?
          <CustomActivityIndicator size='small' color='grey' />
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
                    scrollToComments={scrollToComments}
                    imgHeight={imgHeight}
                    showOptions={showOptions}
                    like={like}
                    toShare={toShare}
                  />
                </PostContext.Provider>
              { post.comments_count !== 0 ?
                <>
                  <Separator height={1} color='#e1e1e1' />
                  <Text style={styles.textCommentsCount}>{post.comments_count + ' ' + textComments}</Text>
                </>
                : null
              }
              { isLoadingComments ?
                  <CustomActivityIndicator size='small' color='grey' />
                : comments.map((item, index) => (
                  <Comment
                    key={'comment-' + index}
                    comment={item}
                  />
                ))
              }
              <CommentAddingForm
                newComment={newComment}
                setNewComment={setNewComment}
                sendNewComment={sendNewComment}
              />
            </ScrollView>
          </SafeAreaView>
      }
    </>
  )
}

const styles = StyleSheet.create({
  textCommentsCount: {
    fontSize: 14,
    color: 'grey',
    fontWeight: '600',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 10
  }
})