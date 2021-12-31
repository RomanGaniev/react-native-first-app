import React from 'react';
import { View, StyleSheet, TouchableOpacity, InputAccessoryView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const CommentAddingForm = ({ newComment, setNewComment, sendNewComment }) => (
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

const styles = StyleSheet.create({
  inputAccessoryView: {
    height: 50,
    backgroundColor: 'green',
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