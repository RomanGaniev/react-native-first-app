import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import PostsList from '../../components/Posts/PostsList';
import ModalAddPost from '../../components/Posts/ModalAddPost';
import { Axios } from '../../services/boot'
import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'
import moment from 'moment';
import 'moment/locale/ru';

export const HomeScreen = () => {

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true)
    await showPosts()
    // setTimeout(() => {
    //   setRefreshing(false)
    // }, 700)
  }

  const showPosts = () => {
    api.call('showPosts')
      .then(({ data }) => {
        let ppp = data.data
        ppp = _.orderBy(ppp, 'created_at', 'desc')
        moment.locale('ru')
        _.each(ppp, (post) => {
          post.created_at = moment(post.created_at).fromNow().toString()
        })
        setPosts(ppp)
        console.log('showPosts: ', ppp)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }

  const showOnePost = (post_id) => {
    api.call('showOnePost', { id: post_id })
      .then(({ data }) => {
        data.created_at = moment(data.created_at).fromNow().toString()
        const post_id = data.id
        const new_posts = posts.map((post) => {
          if (post.id === post_id) {
            return {...data} //return new data of new post
          } else {
            return {...post} //return old post
          }
        })
        console.log('new_posts: ', new_posts)
        setPosts(new_posts)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
      })
  }

  useEffect(() => {
    
    showPosts()
    // setTimeout(() => {
    //   const new_postss = posts.map((post) => {
    //     return {...post}
    //   })
    //   _.orderBy(new_postss, 'created_at', 'desc')
    //   setPosts(new_postss)
    //   console.log('posts::::::: ', posts)
    // }, 2000)
    
    
    // const new_postss = posts.map((post) => {
    //   return {...post}
    // })
    // // _.orderBy(new_posts, 'created_at', 'desc')
    // console.log('new_postssWWWWWWWWWW: ', new_postss)
    // setPosts(new_postss)
  }, [])

  const likePost = (post_id) => {
    showOnePost(post_id)
  }

  const toggleModalVisible = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <SafeAreaView style={styles.containerScrollView}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=> onRefresh()}
          />
        }
      >
          {
            isLoading 
            ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
              </View>
            : (posts.length > 0
              ? <>
                  <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', height: 55, paddingHorizontal: 14,}}>
                    <TouchableOpacity style={styles.addButton} onPress={() => toggleModalVisible()}>
                      <MaterialCommunityIcons name="plus-box" size={25} color="#2887f5" />
                      <Text style={{color: '#2887f5', fontWeight: '600'}}>Создать запись</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.separator} />
                  
                  <PostsList
                    posts={posts}
                    showOnePost={(post_id) => showOnePost(post_id)}
                    likePost={(post_id) => likePost(post_id)}
                  />
                </>
              : <Text>No posts.</Text>)
              
          }
      </ScrollView>
      <ModalAddPost toggleModalVisible={() => toggleModalVisible()} modalVisible={modalVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerScrollView: {
    flex: 1,
  },
  separator: {
    backgroundColor: '#e1e1e1',
    height: 8
  },
  scrollView: {
    backgroundColor: 'pink'
  },
  addButton: {
    borderRadius: 9,
    backgroundColor: '#ececec',
    paddingHorizontal: 22,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})