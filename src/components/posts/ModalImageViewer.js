import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'

import ImageViewer from 'react-native-image-zoom-viewer'
import { setStatusBarStyle, setStatusBarHidden } from 'expo-status-bar'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot'

import { useToggle } from '../../helpers/useToggle'

const ModalImageViewer = ({ modalImageViewerVisible, toggleModalImageViewerVisible, post, like, toShare, showOptions, screenWidth, goToComments, imgHeight }) => {

  const [headerAndFooterVisible, toggleHeaderAndFooterVisible] = useToggle(true)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    console.log('useEffect(post)')
    if (post) {
      let prev_urls = [
        {
          url: post.data.image,
          props: {}
        },
        {
          url: post.data.image,
          props: {}
        }
      ]
      setImageUrls(prev_urls)
    }
  }, [post])

  useEffect(() => {
    console.log('useEffect(modalImageViewerVisible)')
    if (modalImageViewerVisible) {
      setTimeout(() => setStatusBarStyle('light'), 300)
      // if (post) {
        let prev_urls = [
          {
            url: post.data.image,
            props: {}
          },
          {
            url: post.data.image,
            props: {}
          }
        ]
        setImageUrls(prev_urls)
      // }
    } else {
      setStatusBarStyle('auto')
      setStatusBarHidden(false, 'fade')
      if (!headerAndFooterVisible) {
        toggleHeaderAndFooterVisible() 
      }
    }
  }, [modalImageViewerVisible])

  useEffect(() => {
    console.log('useEffect(headerAndFooterVisible)')
    if (headerAndFooterVisible) {
      setStatusBarHidden(false, 'fade')
    } else {
      setStatusBarHidden(true, 'fade')
    }
  }, [headerAndFooterVisible])

  if (!post && !modalImageViewerVisible) {
    return null
  }
  return (
    <Modal visible={modalImageViewerVisible} transparent={true}>
      <ImageViewer
        imageUrls={imageUrls}
        onCancel={toggleModalImageViewerVisible}
        enableSwipeDown={true}
        enablePreload={true}
        saveToLocalByLongPress={false}
        loadingRender={() =>
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="grey" />
          </View>
        }
        renderHeader={() => {
          if (headerAndFooterVisible)
            return (
              <View style={{backgroundColor: '#2e2e2e', zIndex: 9999, position: 'absolute', width: '100%'}}>
                <SafeAreaView style={{height: 73, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <View>
                    <TouchableOpacity style={{paddingRight: 14, flex: 1, justifyContent: 'center'}} onPress={toggleModalImageViewerVisible}>
                      <Ionicons name="chevron-back" size={32} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View>
                    <TouchableOpacity style={{paddingHorizontal: 14, flex: 1, justifyContent: 'center'}} onPress={() => showOptions(post)}>
                      <Ionicons name="ellipsis-horizontal-sharp" size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            )
        }}
        renderIndicator={(currentIndex, allSize) => {
          if (headerAndFooterVisible)
            return (
              <Text style={{zIndex: 9999, position: 'absolute', color: 'white', fontSize: 17, fontWeight: '600', textAlign: 'center', top: 35, alignSelf: 'center'}}>{currentIndex + ' из ' + allSize}</Text>
            )
        }}
        renderFooter={(currentIndex) => {
          if (headerAndFooterVisible)
            return (
              <View style={{height: 40, width: screenWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}
                    onPress={() => like(post.id)}
                  >
                    <Ionicons style={{paddingTop: 1}} name={post.liked ? 'md-heart' : 'md-heart-outline'} size={23} color={post.liked ? "red" : "grey"} />
                    { post.likes_count !== 0 && <Text style={post.liked ? styles.actionTextLike : styles.actionTextNoLike}>{post.likes_count}</Text> }
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}
                    onPress={() => { goToComments(post.id, post, true, imgHeight); toggleModalImageViewerVisible() }}
                  >
                    <Ionicons style={{paddingTop: 3}} name="md-chatbox-outline" size={23} color="grey" />
                    { post.comments_count !== 0 ? <Text style={styles.actionTextComment}>{post.comments_count}</Text> : null }          
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}
                    onPress={() => toShare(post)}
                  >
                    <Ionicons style={{paddingTop: 2}} name="arrow-redo-outline" size={23} color="grey" />
                    {/* TODO: Сделать репосты на бекенде
                    { post.reposts_count !== 0 && <Text style={styles.actionTextShare}>{post.reposts_count}</Text> } */}
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        }
        onClick={toggleHeaderAndFooterVisible}
      />
    </Modal>
  )
}

export default ModalImageViewer

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionTextLike: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2
  },
  actionTextNoLike: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2
  },
  actionTextComment: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 3
  },
  actionTextShare: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '600'
  }
});