import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import ImageViewer from 'react-native-image-zoom-viewer';
import { setStatusBarStyle, setStatusBarHidden } from 'expo-status-bar';

import Api from '../../services/api';
const api = new Api('User');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot';

const ModalImageViewer = ({ post, modalVisible, like, toShare, showOptions, setModalVisible, screenWidth, goToComments }) => {

  const [headerAndFooterVisible, setHeaderAndFooterVisible] = useState(true)
  const [imageUrls, setImageUrls] = useState([])
  // useEffect(() => {
  //   [
  //     {
  //       url: post.data.image,
  //       props: {}
  //     },
  //     {
  //       url: post.data.image,
  //       props: {}
  //     }
  //   ]

  //   let prev_urls = []
  //   prev_urls.push()

  //   setImageUrls()
  // }, [])
  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => setStatusBarStyle('light'), 300)
      
      console.log('light')
    } else {
      setStatusBarStyle('auto')
      setHeaderAndFooterVisible(true)
      setStatusBarHidden(false, 'fade')
      console.log('auto')
    }
  }, [modalVisible])

  const toggleHeaderAndFooterVisible = () => {
    if (headerAndFooterVisible) {
      setHeaderAndFooterVisible(false)
      setStatusBarHidden(true, 'fade')
    } else {
      setHeaderAndFooterVisible(true)
      setStatusBarHidden(false, 'fade')
    }
  }

  return (
    <Modal visible={modalVisible} transparent={true}>
      <ImageViewer
        imageUrls={imageUrls}
        onCancel= {() => setModalVisible(false)}
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
                    <TouchableOpacity style={{paddingRight: 14, flex: 1, justifyContent: 'center'}} onPress={() => setModalVisible(false)}>
                      <Ionicons name="chevron-back" size={32} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View>
                    <TouchableOpacity style={{paddingHorizontal: 14, flex: 1, justifyContent: 'center'}} onPress={showOptions}>
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
                    onPress={like}
                  >
                    <Ionicons style={{paddingTop: 1}} name={post.liked ? 'md-heart' : 'md-heart-outline'} size={23} color={post.liked ? "red" : "grey"} />
                    { post.likes_count !== 0 && <Text style={post.liked ? styles.actionTextLike : styles.actionTextNoLike}>{post.likes_count}</Text> }
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}
                    onPress={() => { goToComments(post.id); setModalVisible(false) }}
                  >
                    <Ionicons style={{paddingTop: 3}} name="md-chatbox-outline" size={23} color="grey" />
                    { post.comments_count !== 0 && <Text style={styles.actionTextComment}>{post.comments_count}</Text> }          
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}
                    onPress={toShare}
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