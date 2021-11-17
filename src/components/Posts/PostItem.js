import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import { Axios, Pusher } from '../../services/boot';

export default class PostItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imgHeight: 0
    };
  }

  ItsHandleLike() {
    this.props.post.liked = !this.props.post.liked
    api.call('likePost', { post: this.props.post.id })
      .then(({ data }) => {
        this.props.handleLike(this.props.post.id)
      })
      .catch(error => {
        // console.log(error)
      })
      .finally(() => {
        // console.log(this.props.posts)
      })
  }

  componentDidMount() {
    if (this.props.post.data.image) {
      Image.getSize(this.props.post.data.image, (width, height) => {
        const scaleFactor = width / this.props.screenWidth
        const imageHeight = height / scaleFactor
        this.setState({imgHeight: imageHeight})
      })
    }
  }

  render() {
    const {imgHeight} = this.state

    return (
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.headerPost}>
          <TouchableOpacity style={styles.headerAuthor}>
            <Image source={{uri: this.props.post.author.avatar}}
              style={styles.avatar} />
            <View>
              <Text style={{fontSize: 15}}>{this.props.post.author.first_name + ' ' +this.props.post.author.last_name}</Text>
              <Text style={{fontSize: 12, color: 'grey'}}>{this.props.post.created_at}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-sharp" size={25} color="grey" />
          </TouchableOpacity>
        </View>
        <View>
          {this.props.post.data.text ?
            <Text style={styles.textBody}>{this.props.post.data.text}</Text>
            : null
          }
          {this.props.post.data.image ?
            <Image
              source={{uri: this.props.post.data.image}}
              style={{width: this.props.screenWidth, height: imgHeight}} />
            : null
          }
          
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={this.props.post.liked ? styles.actionLike : styles.actionNoLike}>
            <Ionicons name="md-heart-outline" size={27} color={this.props.post.liked ? "red" : "grey"} onPress={() => this.ItsHandleLike()} />
            <Text style={styles.actionTextLike}>{ this.props.post.likes_count ? this.props.post.likes_count : null}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionComment}
            // onPress={() => {
            //   this.setState({
            //     modalCommentVisible: true
            //   });
            // }}
          >
            <Fontisto name="comment" size={20} color="grey" />
            <Text style={styles.actionTextComment}>{this.props.post.comments_count ? this.props.post.comments_count : null}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionShare}>
            <MaterialCommunityIcons name="share-outline" size={29} color="grey" />
            <Text style={styles.actionTextShare}>{this.props.post.reposts?.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerPost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  headerAuthor: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 50
  },
  textBody: {
    paddingHorizontal: 14,
    // paddingVertical: 7
    paddingBottom: 10
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
  }
});