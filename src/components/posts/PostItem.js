import React, { useState, useEffect, createContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';

import ModalImageViewer from './ModalImageViewer';

import Api from '../../services/api';
const api = new Api('User');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot'
import { useToggle } from '../../helpers/useToggle'

export const PostItemContext = createContext()

const PostItem = ({ postItem, screenWidth, loadPost, goToPost, showImageViewer, like, toShare, showOptions }) => {

  const [imgHeight, setImgHeight] = useState(0)
  // const [modalVisible, toggleModalVisible] = useToggle(false) 

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
        {/* Header */}
        <View style={styles.headerPost}>
          <TouchableOpacity style={styles.headerAuthor}>
            <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
              <Image source={{uri: postItem.author.avatar}} style={styles.avatar} />
            </View>
            <View>
              <Text style={styles.authorName}>{postItem.author.first_name + ' ' + postItem.author.last_name}</Text>
              <Text style={styles.postCreated}>{postItem.created_at}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showOptions(postItem)} style={styles.headerOptions}>
            <Ionicons name="ellipsis-horizontal-sharp" size={23} color="grey" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <TouchableWithoutFeedback onPress={() => goToPost(postItem.id, postItem)}>
          <>
            { postItem.data.text && <Text style={styles.textBody}>{postItem.data.text}</Text> }
          </>
        </TouchableWithoutFeedback>
        
        <TouchableOpacity onPress={() => showImageViewer(postItem)}>
          <>
            { postItem.data.image &&
              <View style={{width: screenWidth, height: imgHeight, backgroundColor: '#e1e1e1'}}>
                <Image source={{uri: postItem.data.image}} style={{width: screenWidth, height: imgHeight}} />
              </View>
            }
          </>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.actionsContainer}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={postItem.liked ? styles.actionLike : styles.actionNoLike} onPress={() => like(postItem.id)}>
              <Ionicons style={{paddingTop: 1}}  name="md-heart-outline" size={23} color={postItem.liked ? "red" : "grey"} />
              { postItem.likes_count !== 0 && <Text style={styles.actionTextLike}>{postItem.likes_count}</Text> }
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionComment}
              onPress={() => goToPost(postItem.id, postItem, true, imgHeight)}
            >
              <Ionicons style={{paddingTop: 3}} name="md-chatbox-outline" size={23} color="grey" />
              { postItem.comments_count !== 0 ? <Text style={styles.actionTextComment}>{postItem.comments_count}</Text> : null }          
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionShare} onPress={() => toShare(postItem)}>
              <Ionicons style={{paddingTop: 2}} name="arrow-redo-outline" size={23} color="grey" />
              {/* TODO: Сделать репосты на бекенде
              { post.reposts_count !== 0 && <Text style={styles.actionTextShare}>{post.reposts_count}</Text> } */}
            </TouchableOpacity>
          </View>
          
          <View style={{flexDirection: 'row'}}>
            <Octicons name="eye" size={18} color="#c0c5cc" />
            <Text style={{color: '#c0c5cc', marginLeft: 4}}>{postItem.views}</Text>
          </View>
        </View>
      </View>
    </PostItemContext.Provider>
  )
}

export default PostItem

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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