import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';

import ModalImageViewer from './ModalImageViewer';

import Api from '../../services/api';
const api = new Api('User');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot';

const PostItem = ({ post, screenWidth, loadPost, goToPost }) => {

  const [imgHeight, setImgHeight] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (post.data.image) {
      Image.getSize(post.data.image, (width, height) => {
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        setImgHeight(imageHeight)
      })
    }
  }, [screenWidth])

  const like = () => {
    post.liked = !post.liked
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
    console.log(post.comments_count)
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Отмена', 'Сохранить в закладках', 'Уведомлять о новых записях', 'Скопировать ссылку'],
        cancelButtonIndex: 0,
        tintColor: '#2887f5'
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          // setText('')
          // setImage(null)
          // toggleModalVisible()
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
      {/* Header */}
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
        <TouchableOpacity onPress={showOptions} style={styles.headerOptions}>
          <Ionicons name="ellipsis-horizontal-sharp" size={23} color="grey" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <TouchableOpacity onPress={() => goToPost(post.id)}>
        <>
          { post.data.text && <Text style={styles.textBody}>{post.data.text}</Text> }
        </>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <>
          { post.data.image &&
            <View style={{width: screenWidth, height: imgHeight, backgroundColor: '#e1e1e1'}}>
              <Image source={{uri: post.data.image}} style={{width: screenWidth, height: imgHeight}} />
            </View>
          }
        </>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.actionsContainer}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={post.liked ? styles.actionLike : styles.actionNoLike} onPress={like}>
            <Ionicons style={{paddingTop: 1}}  name="md-heart-outline" size={23} color={post.liked ? "red" : "grey"} />
            { post.likes_count !== 0 && <Text style={styles.actionTextLike}>{post.likes_count}</Text> }
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionComment}
            onPress={() => goToPost(post.id, true, imgHeight)}
          >
            <Ionicons style={{paddingTop: 3}} name="md-chatbox-outline" size={23} color="grey" />
            { post.comments_count !== 0 && <Text style={styles.actionTextComment}>{post.comments_count}</Text> }          
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionShare} onPress={toShare}>
            <Ionicons style={{paddingTop: 2}} name="arrow-redo-outline" size={23} color="grey" />
            {/* TODO: Сделать репосты на бекенде
            { post.reposts_count !== 0 && <Text style={styles.actionTextShare}>{post.reposts_count}</Text> } */}
          </TouchableOpacity>
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <Octicons name="eye" size={18} color="#c0c5cc" />
          <Text style={{color: '#c0c5cc', marginLeft: 4}}>{post.views}</Text>
        </View>
      </View>

      {/* Modal */}
      <ModalImageViewer
        post={post}
        modalVisible={modalVisible}
        like={like}
        toShare={toShare}
        showOptions={showOptions}
        setModalVisible={setModalVisible}
        screenWidth={screenWidth}
        goToComments={goToPost}
      />
    </View>
  )
}

export default PostItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  headerPost: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1
  },
  headerAuthor: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerOptions: {
    justifyContent: 'center',
    paddingHorizontal: 14
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
    justifyContent: 'space-between'
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
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2
  },
  actionComment: {
    borderRadius: 20,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    marginLeft: 4
  },
  actionTextComment: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 3
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
    fontSize: 14,
    fontWeight: '600'
  }
});