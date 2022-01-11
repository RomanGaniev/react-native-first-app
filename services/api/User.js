import React, { Component } from 'react';
import axios from 'axios'

class User {

  //======================================== Публикации ========================================//
  getPosts = () => axios.get('api/v1/user/posts')
  getPost = (data) => axios.get(`api/v1/user/posts/${data.post_id}`, data)
  createPost = (formData) => axios.post('api/v1/user/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  getPostComments = (data) => axios.get(`api/v1/user/posts/${data.post_id}/comments`, data)
  createPostComment = (data) => axios.post(`api/v1/user/posts/${data.post_id}/comments`, data)
  togglePostLike = (data) => axios.post(`api/v1/user/posts/${data.post_id}/likes`, data)

  //=========================================== Чаты ===========================================//
  getChats = () => axios.get('api/v1/user/chats')
  getChat = (data) => axios.get(`api/v1/user/chats/${data.chat_id}`, data)
  createGroupChat = (formData) => axios.post(`api/v1/user/chats`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  createPrivateChat = (data) => axios.post(`api/v1/user/chats/${data.interlocutor_id}`, data)
  editChat = (data) => axios.post(`api/v1/user/chats/${data.chat_id}`, data.formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  deleteChat = (data) => axios.delete(`api/v1/user/chats/${data.chat_id}`, data)
  getChatMessages = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/messages`, data)
  getChatMessage = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/messages/${data.chat_message_id}`, data)
  createChatMessage = (data) => axios.post(`api/v1/user/chats/${data.chat_id}/messages`, data.formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  getChatParticipants = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/participants`, data)
  // TODO: переделать
  readAllMessagesWhenLeavingChat = (data) => axios.put(`api/v1/user/chats/${data.chat_id}/messages`, data)

  //========================================== Дружба ==========================================//
  getFriends = () => axios.get('api/v1/user/friendship/friends')
  removeFromFriends = (data) => axios.delete(`api/v1/user/friendship/friends/${data.friend_id}`, data)
  
  getFriendRequests = () => axios.get('api/v1/user/friendship/requests')
  sendFriendRequest = (data) => axios.post('api/v1/user/friendship/requests', data)
  acceptFriendRequest = (data) => axios.put(`api/v1/user/friendship/requests/${data.user_id}`, data)
  rejectOrCancelFriendRequest = (data) => axios.delete(`api/v1/user/friendship/requests/${data.user_id}`, data)

  // TODO: переделать
  showUsers = () => axios.get('api/v1/user/search/users')
}

export default User
