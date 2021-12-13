import React, { useState, useEffect, createContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import Api from '../../services/api';
const api = new Api('User');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot'
import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';

export const PostItemContext = createContext()

const PostItem = ({ postItem, screenWidth, goToPost, showImageViewer, showOptions, like, toShare }) => {

  const [imgHeight, setImgHeight] = useState(0)

  useEffect(() => {
    if (postItem.data.image) {
      Image.getSize(postItem.data.image, (width, height) => {
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        setImgHeight(imageHeight)
      })
    }
  }, [screenWidth])

  return (
    <PostItemContext.Provider value={postItem}>
      <View style={styles.container}>
        <Header post={postItem} showOptions={showOptions} options={true} />
        <Body post={postItem} goToPost={goToPost} showImageViewer={showImageViewer} screenWidth={screenWidth} imgHeight={imgHeight} />
        <Footer post={postItem} goToPost={goToPost} like={like} toShare={toShare} imgHeight={imgHeight} comments={true} />
      </View>
    </PostItemContext.Provider>
  )
}

export default PostItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  }
});