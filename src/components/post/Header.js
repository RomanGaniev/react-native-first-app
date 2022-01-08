import React, {useContext} from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CustomActivityIndicator } from '../CustomActivityIndicator'

import { PostContext } from '../../states/post/postContext'

export const Header = ({ optionsButtonVisible, showOptions }) => {
  
  const post = useContext(PostContext)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={post.is_loading}
        activeOpacity={0.7}
        style={styles.author}
      >
        <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
          <Image source={{uri: post.author.avatar}} style={styles.avatar} />
        </View>
        <View>
          <Text style={styles.authorName}>
            {`${post.author.first_name} ${post.author.last_name} ${post.id}`}
          </Text>
          <Text style={styles.postCreated}>{post.created_at}</Text>
        </View>
      </TouchableOpacity>
      { post.is_loading ?
          <CustomActivityIndicator size='small' color='grey' backgroundStyle={styles.options} />
        :
          optionsButtonVisible && 
            <TouchableOpacity onPress={showOptions} style={styles.options}>
              <Ionicons name="ellipsis-horizontal-sharp" size={23} color="grey" />
            </TouchableOpacity>
          
      }
      
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1
  },
  author: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  options: {
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
    fontWeight: '500',
    paddingBottom: 2
  },
  postCreated: {
    fontSize: 12,
    color: 'grey'
  }
})