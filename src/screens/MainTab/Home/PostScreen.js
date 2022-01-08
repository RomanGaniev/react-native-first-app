import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext
} from 'react'
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActionSheetIOS,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import Post from '../../../components/post/Post'
import { Comment } from '../../../components/post/Comment'
import { Axios } from '../../../../services/boot'
import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'
// import moment from 'moment'
// import 'moment/locale/ru'
import { Dimensions } from 'react-native'
import { Separator } from '../../../components/Separator'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'
import { CommentAddingForm } from '../../../components/CommentAddingForm'

import { PostContext } from '../../../states/post/postContext'
import { View } from 'react-native-animatable'
// export const PostContext = createContext()

export const PostScreen = ({route, navigation}) => {

  const { toComments, imgHeight, screenWidth } = route.params

  const [ post, setPost ] = useState(route.params.post)
  const [ comments, setComments ] = useState([])

  const [ refreshing, setRefreshing ] = useState(false)
  const [ isLoadingComments, setIsLoadingComments ] = useState(true)

  // const [ newComment, setNewComment ] = useState('')
  const [ textComments, setTextComments ] = useState('')

  const scrollRef = useRef()

  useEffect(() => {
    showComments()

    const lastDigit = post.comments_count % 10
    if (lastDigit === 1) {
      setTextComments('КОММЕНТАРИЙ')
    } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
      setTextComments('КОММЕНТАРИЯ')
    } else {
      setTextComments('КОММЕНТАРИЕВ')
    }
  },[])

  useEffect(() => {
    if(post.comments_count !== 0) {
      if (toComments) {
        scrollToComments()
      }
    }
  }, [isLoadingComments])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showPost()
    showComments()
  }, [])

  const showPost = () => {
    api.call('showOnePost', { id: post.id })
      .then(({ data }) => {
        // data.created_at = moment(data.created_at).fromNow().toString()
        setPost(data)
        setRefreshing(false)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  const showComments = () => {
    api.call('showComments', { id: post.id })
      .then(({ data }) => {
        let response = data.data
        // response = _.orderBy(response, 'created_at', 'desc')
        // moment.locale('ru')
        // _.each(response, (comment) => {
        //   comment.created_at = moment(comment.created_at).fromNow().toString()
        // })
        setComments(response)
      })
      .finally(() => {
        setIsLoadingComments(false)
      })
  }

  const pushComment = (comment) => {
    setComments([comment, ...comments])
  }

  const scrollToComments = () => {
    let scrollHeight = 110
    if (post.data.image) {
      scrollHeight = scrollHeight + imgHeight
    }
    if (post.data.text) {
      scrollHeight = scrollHeight + 28
    }
    scrollRef.current.scrollTo({y: scrollHeight, animated: false})
  }

  const onLike = () => {
    setPost({
      ...post,
      liked: !post.liked,
      likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1
    })
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }>
          <PostContext.Provider value={post}>
            <Post
              screenWidth={screenWidth}
              imgHeightParam={imgHeight}
              scrollToComments={scrollToComments}
              onLike={onLike}
              updateOnePost={showPost}
              optionsButtonVisible={false}
              commentsButtonVisible={false}
            />
            { post.comments_count !== 0 ?
                <>
                  <Separator height={1} color='#e1e1e1' />
                  <Text style={styles.textCommentsCount}>{post.comments_count + ' ' + textComments}</Text>
                </>
              : null
            }
            { isLoadingComments ?
                <CustomActivityIndicator size='small' color='grey' />
              : comments.map((comment, index) => (
                <Comment
                  key={'comment-' + index}
                  comment={comment}
                />
              ))
            }
            <CommentAddingForm
              pushComment={pushComment}
              recentCommentId={comments[0]?.id}
            />
          </PostContext.Provider>
      </ScrollView>
    </SafeAreaView>
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