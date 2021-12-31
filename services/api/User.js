import React, { Component } from 'react';
import axios from 'axios'

class User {

  createPost = (data) => axios.post('api/v1/user/post/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  showPosts = () => axios.get('api/v1/user/posts')
  showOnePost = (data) => axios.get(`api/v1/user/posts/${data.id}`, data)
  likePost = (data) => axios.post(`api/v1/user/posts/${data.post}/like`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  sendImage = (data) => axios.post('api/v1/user/send_image', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  getImage = () => axios.get('api/v1/user/get_image')

  showComments = (data) => axios.get(`api/v1/user/posts/${data.id}/comments`, data)
  sendNewComment = (data) => axios.post('api/v1/user/posts/add_comment', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  showChats = () => axios.get('api/v1/user/chats')
  showChatMessages = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/messages`, data)
  sendMessage = (data) => axios.post('api/v1/user/chats/send_message', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  showOneChatMessage = (data) => axios.get(`api/v1/user/chats/${data.chat_message_id}`, data)

  showFriends = () => axios.get('api/v1/user/friendship')
  sendFriendRequest = (data) => axios.post(`api/v1/user/friendship/${data.otherUserId}/send_request`, data)
  acceptFriendRequest = (data) => axios.post(`api/v1/user/friendship/${data.otherUserId}/accept_request`, data)

  showUsers = () => axios.get('api/v1/user/search/users')
}

export default User
