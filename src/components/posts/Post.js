import React, { Component, useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ActionSheetIOS } from 'react-native'
import { Ionicons, Fontisto, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'

import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot'

import ModalImageViewer from './ModalImageViewer'
import { useToggle } from '../../helpers/useToggle'

import { PostContext } from '../../screens/MainTabs/Home/PostScreen'

const Post = ({ screenWidth, loadPost, likeProp, scrollToComments }) => {

  // const [post, setPost] = useState(postItem)
  const [imgHeight, setImgHeight] = useState(0)
  const [modalImageViewerVisible, toggleModalImageViewerVisible] = useToggle(false)

  const post = useContext(PostContext)

  // useEffect(() => {
  //   setPost(postItem)
  // }, [postItem])

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

  const like = () => {
    // setPost({...post, liked: !post.liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1})
    likeProp(post.id)
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
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Отмена', 'Сохранить в закладках', 'Уведомлять о новых записях', 'Скопировать ссылку'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        // title: 'Все изменения будут потеряны, если вы выйдете',
        tintColor: '#2887f5',
        
        // userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          // setText('')
          // setImage(null)
          // toggleModalImageViewerVisible()
        }
      }
    )
  }

  const toShare = () => {
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        message: post.data.text ? post.data.text : 'Default message',
      },
      ({error}) => {
        console.log(error)
      },
      (result, method) => {
        console.log('result: ', result)
        console.log('method: ', method)
      }
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerPost}>
        <TouchableOpacity style={styles.headerAuthor}>
          <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
            <Image source={{uri: post.author.avatar}} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.authorName}>{post.author.first_name + ' ' + post.author.last_name}</Text>
            <Text style={styles.postCreated}>{post.created_at}</Text>
          </View>
        </TouchableOpacity>
      </View>

      { post.data.text && <Text style={styles.textBody}>{post.data.text}</Text> }

      <TouchableOpacity onPress={toggleModalImageViewerVisible}>
        <>
          { post.data.image &&
            <View style={{width: screenWidth, height: imgHeight, backgroundColor: '#e1e1e1'}}>
              <Image source={{uri: post.data.image}} style={{width: screenWidth, height: imgHeight}} /> 
            </View>
          }
        </>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={post.liked ? styles.actionLike : styles.actionNoLike}>
          <Ionicons name="md-heart-outline" size={27} color={post.liked ? "red" : "grey"} onPress={like} />
          <Text style={styles.actionTextLike}>{post.likes_count ? post.likes_count : null}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionShare} onPress={toShare}>
          <MaterialCommunityIcons name="share-outline" size={29} color="grey" />
          <Text style={styles.actionTextShare}>{post.reposts?.length}</Text>
        </TouchableOpacity>
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <Octicons name="eye" size={18} color="#c0c5cc" />
          <Text style={{color: '#c0c5cc', marginLeft: 4}}>{post.views}</Text>
        </View>
        
      </View>

      {/* Modal */}
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
  },
  headerPost: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1,
    // backgroundColor: 'orange'
  },
  headerAuthor: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1
  },
  headerOptions: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    // backgroundColor: 'green'
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 11,
    borderRadius: 50
  },
  authorName: {
    fontSize: 15,
    fontWeight: '500'
  },
  postCreated: {
    fontSize: 12,
    color: 'grey'
  },
  textBody: {
    fontSize: 15,
    paddingHorizontal: 14,
    paddingBottom: 10
  },
  actionsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green'
  },
  actionNoLike: {
    borderRadius: 20,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  actionLike: {
    borderRadius: 20,
    backgroundColor: 'pink',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  actionTextLike: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2
  },
  actionShare: {
    borderRadius: 20,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7
  },
  actionTextShare: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '600'
  }
});