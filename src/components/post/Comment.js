import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export const Comment = ({ comment }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.author}>
      <Image source={{uri: comment.commentator.avatar}} style={styles.avatar} width={40} height={40} />
      <View>
        <Text style={styles.authorName}>{comment.commentator.first_name + ' ' + comment.commentator.last_name}</Text>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.text}>{comment.title}</Text>
        </View>
        <Text style={styles.createdAt}>{comment.created_at}</Text>
      </View>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  header: {
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 7
  },
  author: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    flex: 1
  },
  avatar: {
    marginRight: 11,
    borderRadius: 50
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  createdAt: {
    fontSize: 12,
    color: 'grey'
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    marginRight: 46, // СДЕЛАТЬ ЧТО-ТО С ЭТИМ, ТАК НЕ ДОЛЖНО БЫТЬ
    flex: 1
  }
})