import React, {useContext} from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Ionicons, Octicons } from '@expo/vector-icons'

import { PostContext } from '../../states/post/postContext'

export const Footer = ({
  goToPost,
  like,
  toShare,
  imgHeight,
  commentsButtonVisible
}) => {

  const post = useContext(PostContext)

  if(post.is_loading) {
    return (
      <View style={{height: 10}} />
    )
  }

  return(
    <View style={styles.actionsContainer}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={post.liked ? styles.actionLike : styles.actionNoLike}
          onPress={() => like(post.id)}
        >
          <Ionicons
            style={{paddingTop: 1}}
            name="md-heart-outline"
            size={23}
            color={post.liked ? "red" : "grey"}
          />
          { post.likes_count !== 0 && <Text style={styles.actionTextLike}>{post.likes_count}</Text> }
        </TouchableOpacity>
        { commentsButtonVisible &&
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionComment}
            onPress={() => goToPost(post, true, imgHeight)}
          >
            <Ionicons
              style={{paddingTop: 3}}
              name="md-chatbox-outline"
              size={23} color="grey"
            />
            { post.comments_count !== 0 &&
                <Text style={styles.actionTextComment}>{post.comments_count}</Text>
            }          
          </TouchableOpacity>
        }
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.actionShare}
          onPress={toShare}
        >
          <Ionicons
            style={{paddingTop: 2}}
            name="arrow-redo-outline"
            size={23}
            color="grey"
          />
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
}

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
    backgroundColor: '#eeeeee',
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
    backgroundColor: '#eeeeee',
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
    backgroundColor: '#eeeeee',
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