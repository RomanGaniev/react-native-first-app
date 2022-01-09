import React, {useContext} from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'

import { PostContext } from '../../states/post/postContext'

export const Body = ({
  goToPost,
  screenWidth,
  imgHeight,
  toggleModalImageViewerVisible
}) => {

  const post = useContext(PostContext)

  return (
    <View>
      <TouchableOpacity
        disabled={post.is_loading || !goToPost}
        activeOpacity={1}
        onPress={() => goToPost(post, false, imgHeight)}
      >
        { post.data.text ?
            <Text style={styles.textBody}>
              {post.data.text}
            </Text>
          :
            null
        }
      </TouchableOpacity>
      <TouchableOpacity
        disabled={post.is_loading}
        activeOpacity={1}
        onPress={toggleModalImageViewerVisible}
      >
        { post.data.image &&
          <View
            style={[
              styles.image, {width: screenWidth, height: imgHeight}
            ]}
          >
            <Image
              source={{uri: post.data.image}}
              style={{width: screenWidth, height: imgHeight}}
            />
          </View>
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  textBody: {
    fontSize: 15,
    paddingHorizontal: 14,
    paddingBottom: 10
  },
  image: {
    backgroundColor: '#e1e1e1'
  }
})