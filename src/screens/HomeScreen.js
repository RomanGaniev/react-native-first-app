import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, SafeAreaView, ScrollView, Button, ActivityIndicator } from 'react-native';
import PostsList from '../components/PostsList';
import { Axios } from '../boot'
import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash'
export class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { posts: [], refreshing: false, isLoading: true };
  }


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
        this.setState({
          isLoading: false
        });
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
            <View style={styles.container}>
            {
              this.state.isLoading 
              ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <ActivityIndicator size="large"/>
                </View>
              : (this.state.posts.length > 0
                ? <PostsList posts={this.state.posts} />
                : <Text>No posts.</Text>)
                
            }
            </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e1e1'
  },
  containerScrollView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink'
  }
})