import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, InputAccessoryView, TextInput, Keyboard } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// import moment from 'moment'
// import 'moment/locale/ru'
import Api from '../../services/api'
const api = new Api('User')
import _ from 'lodash'

import { AuthStateContext } from '../states/auth'
import { PostContext } from '../states/post/postContext'

export const CommentAddingForm = ({ pushComment, recentCommentId}) => {

  const { user } = useContext(AuthStateContext)
  const post = useContext(PostContext)
  const [ newComment, setNewComment ] = useState('')

  const sendNewComment = () => {
    // moment.locale('ru')
    let commentForQuiklyPush = {
      id: recentCommentId + 1,
      title: newComment,
      commentator: {
        avatar: user.info.avatar,
        first_name: user.info.first_name,
        last_name: user.info.last_name
      },
      created_at: 'только что'
    }

    pushComment(commentForQuiklyPush)
    Keyboard.dismiss()
    setNewComment('')

    let fd = new FormData()
    fd.append('postId', post.id)
    fd.append('comment', newComment)

    api.call('sendNewComment', fd)
      .then(({ data }) => {
        //
      })
  }

  return (
    <InputAccessoryView style={styles.inputAccessoryView}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="plus-circle-outline" size={28} color="#2887f5" />
          </View>
        </TouchableOpacity>
        <TextInput
          multiline
          placeholder='Ваш комментарий'
          placeholderTextColor='grey'
          style={styles.input}
          value={newComment}
          onChangeText={(val) => setNewComment(val)} />
        <TouchableOpacity style={styles.button} onPress={sendNewComment} disabled={!newComment}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="arrow-up-circle" size={38} color={newComment ? '#2887f5' : 'grey' } />
          </View>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  )
}

const styles = StyleSheet.create({
  inputAccessoryView: {
    height: 50
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    paddingHorizontal: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    lineHeight: 20,
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: '#dfdfdf',
    borderRadius: 20
  },
  icon: {
    flex: 1,
    justifyContent: 'center'
  }
})