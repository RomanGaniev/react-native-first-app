import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, SafeAreaView, ScrollView, Button } from 'react-native';
import PostsList from '../components/PostsList';
import { Axios } from '../boot'
import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';

export class Posts extends Component {

  constructor(props) {
    super(props);
    this.state = { posts: [], refreshing: false };
    // this.navigationOptions = ({navigation}) => ({
    //   swipeEnabled: false
    // });
  }

  // this.props.navigate

  wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  async onRefresh () {
    this.setState({
      refreshing: true
    });
    await this.showPosts();
    this.setState({
      refreshing: false
    });
    // this.wait(2000).then(() => this.setState({
    //   refreshing: true
    // }));
    // setTimeout(() => {
    //   this.setState({
    //     refreshing: true
    //   });
    // }, 2000)
  }

  showPosts() {
    api.call('showPosts')
      .then(({ data }) => {
        this.setState(() => ({
          posts: data.data
        }));
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  async componentDidMount() {
    api.call('showPosts')
      .then(({ data }) => {
        this.setState(() => ({
          posts: data.data
        }));
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.containerScrollView}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={()=> this.onRefresh()}
            />
          }
        >
          <>
            {/* <Button title="Выйти из аккаунта" onPress={() => this.logout()} /> */}
            <View style={styles.container}>
            {
              this.state.posts.length > 0
              ? <PostsList posts={this.state.posts} />
              : <Text>No posts</Text>
            }
            </View>
          </>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: '',
    backgroundColor: '#e1e1e1'
  },
  containerScrollView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    // alignItems: 'center',
    // justifyContent: 'center',
  }
})