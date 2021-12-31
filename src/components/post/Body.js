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
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => goToPost && goToPost(post.id, post, false, imgHeight)}
      >
        { post.data.text && <Text style={styles.textBody}>{post.data.text}</Text> }
      </TouchableOpacity>
      
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleModalImageViewerVisible}
      >
        { post.data.image &&
          <View style={{width: screenWidth, height: imgHeight, backgroundColor: '#e1e1e1'}}>
            <Image source={{uri: post.data.image}} style={{width: screenWidth, height: imgHeight}} />
          </View>
        }
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  textBody: {
    fontSize: 15,
    paddingHorizontal: 14,
    paddingBottom: 10
  }
})