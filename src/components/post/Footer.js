import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';

export const Footer = ({ post, goToPost, like, toShare, imgHeight, comments }) => (
  <View style={styles.actionsContainer}>
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity style={post.liked ? styles.actionLike : styles.actionNoLike} onPress={() => like(post.id)}>
        <Ionicons style={{paddingTop: 1}}  name="md-heart-outline" size={23} color={post.liked ? "red" : "grey"} />
        { post.likes_count !== 0 && <Text style={styles.actionTextLike}>{post.likes_count}</Text> }
      </TouchableOpacity>
      { comments &&
        <TouchableOpacity
          style={styles.actionComment}
          onPress={() => goToPost(post.id, post, true, imgHeight)}
        >
          <Ionicons style={{paddingTop: 3}} name="md-chatbox-outline" size={23} color="grey" />
          { post.comments_count !== 0 ? <Text style={styles.actionTextComment}>{post.comments_count}</Text> : null }          
        </TouchableOpacity>
      }
      <TouchableOpacity style={styles.actionShare} onPress={() => toShare(post)}>
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
)

const styles = StyleSheet.create({
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
})