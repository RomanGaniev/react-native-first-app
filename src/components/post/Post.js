import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Image, ActionSheetIOS } from 'react-native'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import ModalImageViewer from '../ModalImageViewer'
import { useToggle } from '../../../services/helpers/useToggle'

import { Header } from './Header'
import { Body } from './Body'
import { Footer } from './Footer'

import { PostContext } from '../../states/post/postContext'

const Post = ({
  screenWidth,
  imgHeightParam,
  scrollToComments,
  onLike,
  loadOnePost,
  optionsButtonVisible,
  commentsButtonVisible
}) => {

  const post = useContext(PostContext)
  const [imgHeight, setImgHeight] = useState(imgHeightParam)
  const [modalImageViewerVisible, toggleModalImageViewerVisible] = useToggle(false)

  useEffect(() => {
    if (!imgHeight) {
      if (post.data.image) {
        Image.getSize(post.data.image, (width, height) => {
          const scaleFactor = width / screenWidth
          const imageHeight = height / scaleFactor
          setImgHeight(imageHeight)
        })
      }
    }
    
  }, [screenWidth])

  const like = () => {
    onLike(post.id)
    api.call('likePost', { post: post.id })
      .then(({ data }) => {
        loadOnePost(post.id)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const showOptions = () => {
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
    <View style={styles.container}>
      <Header
        optionsButtonVisible={optionsButtonVisible}
        showOptions={showOptions}
      />
      <Body
        screenWidth={screenWidth}
        imgHeight={imgHeight}
        toggleModalImageViewerVisible={toggleModalImageViewerVisible}
        goToPost={scrollToComments}
      />
      <Footer
        like={like}
        loadOnePost={loadOnePost}
        toShare={toShare}
        commentsButtonVisible={commentsButtonVisible}
        goToPost={scrollToComments}
        imgHeight={imgHeight}
      />
      <ModalImageViewer
        modalImageViewerVisible={modalImageViewerVisible}
        toggleModalImageViewerVisible={toggleModalImageViewerVisible}
        screenWidth={screenWidth}
        goToComments={scrollToComments}
        like={like}
        toShare={toShare}
        showOptions={showOptions}
        imgHeight={imgHeight}
      />
    </View>
  )
}

export default Post

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  }
})