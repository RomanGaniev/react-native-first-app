import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react'

import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native'

import Post from '../../../components/posts/Post'
import { Comment } from '../../../components/posts/Comment'
import { Separator } from '../../../components/Separator'
import { CustomActivityIndicator } from '../../../components/CustomActivityIndicator'
import { CommentAddingForm } from '../../../components/posts/CommentAddingForm'

import Api from '../../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { PostContext } from '../../../states/post/postContext'

export const PostScreen = ({route, navigation}) => {

  const { toComments, imgHeight, screenWidth } = route.params

  const [ post, setPost ] = useState(route.params.post)
  const [ comments, setComments ] = useState([])

  const [ refreshing, setRefreshing ] = useState(false)
  const [ isLoadingComments, setIsLoadingComments ] = useState(true)

  const [ textComments, setTextComments ] = useState('')

  const scrollRef = useRef()

  useEffect(() => {
    showComments()
  },[])

  useEffect(() => {
    if (!isLoadingComments && comments.length > 0) {
      showTextComments()
      if (toComments) {
        scrollToComments()
      }
    }
  }, [isLoadingComments])

  useEffect(() => {
      showTextComments()
      scrollToComments()
  }, [comments.length])

  const showTextComments = () => {
    const lastDigit = comments.length % 10
      if (lastDigit === 1) {
        setTextComments('КОММЕНТАРИЙ')
      } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
        setTextComments('КОММЕНТАРИЯ')
      } else {
        setTextComments('КОММЕНТАРИЕВ')
      }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    showPost()
    showComments()
  }, [])

  const showPost = () => {
    api.call('getPost', { post_id: post.id })
      .then(({ data }) => {
        setPost(data)
        setRefreshing(false)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  const showComments = () => {
    api.call('getPostComments', { post_id: post.id })
      .then(({ data }) => {
        let response = data.data
        setComments(response)
      })
      .finally(() => {
        setIsLoadingComments(false)
      })
  }

  const pushComment = (comment) => {
    setComments([comment, ...comments])
    scrollToComments()
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
            { comments.length > 0 ?
                <>
                  <Separator height={1} color='#e1e1e1' />
                  <Text style={styles.textCommentsCount}>{comments.length + ' ' + textComments}</Text>
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