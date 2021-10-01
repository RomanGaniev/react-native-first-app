import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash'

export default class PostsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalCommentVisible: false
    };
  }
  // static propTypes = {
  //     posts: PropTypes.array.isRequired,
  //     modalCommentVisible: false
  // };

  setModalCommentVisible() {
    
  }
  like(post_id) {
    api.call('likePost', { post: post_id })
      .then(({ data }) => {
        this.setState({
          posts: data.data
        });
        console.log(data);
      })
      .catch(error => {
        // console.log(error)
      })
      .finally(() => {
        // console.log(this.state.posts)
      })
  }

  // useEffect(() => {
  //   this.abc++;
  // });

  render() {
    console.log(this.props.posts)
    return (
      <FlatList
        data={this.props.posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => {
          return(
            <View style={{backgroundColor: '#e1e1e1'}}>
              
              {/* {
                index === 0
                ? <View style={styles.separator} />
                : null
              } */}
              <View style={{backgroundColor: 'white'}}>
                <View style={styles.headerPost}>
                  <TouchableOpacity style={styles.headerAuthor}>
                    <Image source={{uri: 'https://sun1-97.userapi.com/s/v1/ig2/brhuyA2Z_pbBwHHkl50y8kXn8522aHoYD5LPvIRbUbl3IcrKuOIpje2Sro_3Hh8q0_bJhNSQAPHkBeOqmLE9JWpb.jpg?size=200x200&quality=96&crop=0,86,551,551&ava=1'}}
                      style={styles.avatar} />
                    <View>
                      <Text style={{fontSize: 15}}>{item.author.first_name + ' ' +item.author.last_name}</Text>
                      <Text style={{fontSize: 12, color: 'grey'}}>{item.created_at}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal-sharp" size={25} color="grey" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.textBody}>{item.data.text}</Text>
                  <Image source={{uri: item.data.image}}
                    style={{width: 375, height: 300}} />
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={item.liked ? styles.actionLike : styles.actionNoLike}>
                    <Ionicons name="md-heart-outline" size={27} color={item.liked ? "red" : "grey"} onPress={() => this.like(item.id)} />
                    <Text style={styles.actionTextLike}>{item.likes?.length}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionComment} onPress={() => {
                    this.setState({
                      modalCommentVisible: true
                    });
                  } }>
                    <Fontisto name="comment" size={20} color="grey" />
                    <Text style={styles.actionTextComment}>{item.comments?.length}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionShare}>
                    <MaterialCommunityIcons name="share-outline" size={29} color="grey" />
                    <Text style={styles.actionTextShare}>{item.reposts?.length}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {
                index !== this.props.posts.length - 1
                ? <View style={styles.separator} />
                : null
              }

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalCommentVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Hello World!</Text>

                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                      onPress={() => {
                        this.setState({
                          modalCommentVisible: !this.state.modalCommentVisible
                        });
                      }}>
                      <Text style={styles.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
            </View>
        )}}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerPost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5
  },
  headerAuthor: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 50
  },
  textBody: {
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  actionsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionNoLike: {
    borderRadius: 13,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  actionLike: {
    borderRadius: 13,
    backgroundColor: 'pink',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  actionTextLike: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2
  },
  actionComment: {
    borderRadius: 13,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    marginLeft: 4
  },
  actionTextComment: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 3
  },
  actionShare: {
    borderRadius: 13,
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7
  },
  actionTextShare: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '600'
  },
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