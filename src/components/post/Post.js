import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Image } from 'react-native'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot'

import ModalImageViewer from '../ModalImageViewer'
import { useToggle } from '../../helpers/useToggle'

import { PostContext } from '../../screens/MainTabs/Home/PostScreen'
import { Header } from './Header'
import { Body } from './Body'
import { Footer } from './Footer'

const Post = ({ screenWidth, scrollToComments, showOptions, like, toShare }) => {

  const post = useContext(PostContext)
  const [imgHeight, setImgHeight] = useState(0)
  const [modalImageViewerVisible, toggleModalImageViewerVisible] = useToggle(false)

  useEffect(() => {
    if (post.data.image) {
      Image.getSize(post.data.image, (width, height) => {
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        setImgHeight(imageHeight)
        console.log(imageHeight)
      })
    }
  }, [screenWidth])

  return (
    <View style={styles.container}>
      <Header post={post} options={false} />
      <Body post={post} screenWidth={screenWidth} imgHeight={imgHeight} toggleModalImageViewerVisible={toggleModalImageViewerVisible} />
      <Footer post={post} like={like} toShare={toShare} comments={false} />
      <ModalImageViewer
        modalImageViewerVisible={modalImageViewerVisible}
        toggleModalImageViewerVisible={toggleModalImageViewerVisible}
        post={post}
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
});