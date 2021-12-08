import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Fontisto, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

import Api from '../../services/api';
const api = new Api('User');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot';

const Comment = ({ comment }) => {

  return (
    <View style={styles.headerPost}>
      <TouchableOpacity style={styles.headerAuthor}>
        <Image source={{uri: comment.commentator.avatar}} style={styles.avatar} width={40} height={40} />
        <View>
          <Text style={styles.authorName}>{comment.commentator.first_name + ' ' + comment.commentator.last_name}</Text>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.textBody}>{comment.title}</Text>
          </View>
          
          <Text style={styles.postCreated}>{comment.created_at}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Comment

const styles = StyleSheet.create({
  headerPost: {
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'stretch',
    // flex: 1,
    // backgroundColor: 'red',
    marginBottom: 7,
  },
  headerAuthor: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1
  },
  avatar: {
    marginRight: 11,
    borderRadius: 50
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    // backgroundColor: 'green'
  },
  postCreated: {
    fontSize: 12,
    color: 'grey'
    // backgroundColor: 'blue'
  },
  textBody: {
    fontSize: 14,
    // textAlign: 'right',
    // backgroundColor: 'orange',
    // paddingHorizontal: 14,
    marginBottom: 4,
    marginRight: 46, // СДЕЛАТЬ ЧТО-ТО С ЭТИМ, ТАК НЕ ДОЛЖНО БЫТЬ
    flex: 1
    // width: 150
  },
});