import React, { useEffect, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import { Dimensions } from 'react-native';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash';

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Axios, Pusher } from '../../services/boot';
import PostItem from './PostItem';

const PostsList = (props) => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    getToken()
    setScreenWidth(Dimensions.get('window').width)
    // _.orderBy(props.posts, 'created_at', 'asc')
    // console.log('DESC: ', props.posts)
  }, [])

  const getToken = async () => {
    let tokenStorage = ""
    if (Device.brand) {
      tokenStorage = await SecureStore.getItemAsync('access_token');
    } else {
      tokenStorage = localStorage.getItem('access_token');
    }
  
    console.log('tokenStorage: ', tokenStorage)

    const ast = await Pusher(tokenStorage)
    ast.channel(`post-channel`)
      .listen('PostChanged', (e) => {
        props.showOnePost(e.post_id)
      });
  }

  const handleLike = (post_id) => {
    props.likePost(post_id)
  }

  return (
    props.posts.map((item, index) => (
      <View style={{backgroundColor: '#e1e1e1'}} key={'post-' + index}>
        <PostItem
          post={item}
          screenWidth={screenWidth}
          handleLike={(post_id) => handleLike(post_id)} />
        {
          index !== props.posts.length - 1
          ? <View style={styles.separator} />
          : null
        }
      </View>
    ))
  )
}

export default PostsList;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#e1e1e1',
    height: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  }
});