import React, {
  useState,
  useEffect,
  useContext
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import ImageViewer from 'react-native-image-zoom-viewer'

import {
  setStatusBarStyle,
  setStatusBarHidden
} from 'expo-status-bar'

import Api from '../../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { useToggle } from '../../../services/hooks/useToggle'
import { CustomActivityIndicator } from '../CustomActivityIndicator'

import { PostContext } from '../../states/post/postContext'

const ModalImageViewer = ({
  modalImageViewerVisible,
  toggleModalImageViewerVisible,
  like,
  toShare,
  showOptions,
  screenWidth,
  goToComments,
  imgHeight
}) => {

  const post = useContext(PostContext)
  const [headerAndFooterVisible, toggleHeaderAndFooterVisible] = useToggle(true)
  const [imageUrls, setImageUrls] = useState([
    {
      url: post.data.image,
      props: {}
    },
    {
      url: post.data.image,
      props: {}
    }
  ])

  useEffect(() => {
  }, [post])

  useEffect(() => {
    if (modalImageViewerVisible) {
      setTimeout(() => setStatusBarStyle('light'), 300)
    } else {
      setStatusBarStyle('auto')
      setStatusBarHidden(false, 'fade')
      if (!headerAndFooterVisible) {
        toggleHeaderAndFooterVisible() 
      }
    }
  }, [modalImageViewerVisible])

  useEffect(() => {
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
    <Modal
      visible={modalImageViewerVisible}
      transparent={true}
    >
      <ImageViewer
        imageUrls={imageUrls}
        onCancel={toggleModalImageViewerVisible}
        onClick={toggleHeaderAndFooterVisible}
        enableSwipeDown={true}
        // enablePreload={true}
        saveToLocalByLongPress={false}
        loadingRender={() =>
          <CustomActivityIndicator
            size='small'
            color='grey'
          />
        }
        renderHeader={() => {
          if (headerAndFooterVisible)
            return (
              <View style={styles.header}>
                <SafeAreaView style={styles.headerSafeAreaView}>
                  <View>
                    <TouchableOpacity
                      style={[styles.headerButton, {paddingRight: 14}]}
                      onPress={toggleModalImageViewerVisible}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={32}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity 
                      style={[styles.headerButton, {padding: 14}]}
                      onPress={showOptions}
                    >
                      <Ionicons
                        name="ellipsis-horizontal-sharp"
                        size={25}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            )
        }}
        renderIndicator={(currentIndex, allSize) => {
          if (headerAndFooterVisible)
            return (
              <Text style={styles.imageIndicator}>
                {`${currentIndex} из ${allSize}`}
              </Text>
            )
        }}
        renderFooter={(currentIndex) => {
          if (headerAndFooterVisible)
            return (
              <View style={[styles.footer, {width: screenWidth}]}>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => like(post.id)}
                  >
                    <Ionicons
                      style={{paddingTop: 1}}
                      name={post.liked ? 'md-heart' : 'md-heart-outline'}
                      size={23}
                      color={post.liked ? "red" : "grey"}
                    />
                    { post.likes_count !== 0 &&
                      <Text
                        style={post.liked ? styles.actionTextLike : styles.actionTextNoLike}
                      >
                        {post.likes_count}
                      </Text> }
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                      goToComments(post, true, imgHeight)
                      toggleModalImageViewerVisible()
                    }}
                  >
                    <Ionicons
                      style={{paddingTop: 4}}
                      name="md-chatbox-outline"
                      size={23}
                      color="grey"
                    />
                    { post.comments_count > 0 ?
                        <Text style={styles.actionTextComment}>
                          {post.comments_count}
                        </Text>
                      :
                        null
                    }          
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => toShare(post)}
                  >
                    <Ionicons
                      style={{paddingTop: 2}}
                      name="arrow-redo-outline"
                      size={23}
                      color="grey"
                    />
                    {/* TODO: Сделать репосты на бэкенде
                    { post.reposts_count !== 0 && <Text style={styles.actionTextShare}>{post.reposts_count}</Text> } */}
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        }
      />
    </Modal>
  )
}

export default ModalImageViewer

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2e2e2e',
    zIndex: 9999,
    position: 'absolute',
    width: '100%'
  },
  headerSafeAreaView: {
    height: 73,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageIndicator: {
    zIndex: 9999,
    position: 'absolute',
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    top: 35,
    alignSelf: 'center'
},
  footer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
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
})