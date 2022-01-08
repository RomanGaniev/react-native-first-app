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

  showComments = (data) => axios.get(`api/v1/user/posts/${data.id}/comments`, data)
  sendNewComment = (data) => axios.post('api/v1/user/posts/add_comment', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  showChats = () => axios.get('api/v1/user/chats')
  showOneChat = (data) => axios.get(`api/v1/user/chats/${data.chat_id}`, data)
  createPrivateChat = (data) => axios.post(`api/v1/user/chats/${data.interlocutorId}/create_private`, data)
  createGeneralChat = (data) => axios.post(`api/v1/user/chats/create_general`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  editGeneralChat = (data) => axios.post('api/v1/user/chats/edit_general', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  deleteGeneralChat = (data) => axios.post(`api/v1/user/chats/${data.chatId}/delete_general`, data)
  showChatMessages = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/messages`, data)


  readAllMessagesWhenLeavingChat = (data) => axios.post(`api/v1/user/chats/${data.chat_id}/messages/read_all`, data)


  sendMessage = (data) => axios.post('api/v1/user/chats/send_message', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  showOneChatMessage = (data) => axios.get(`api/v1/user/chats/messages/${data.chat_message_id}`, data)
  showFriendsAddedToChat = (data) => axios.get(`api/v1/user/chats/${data.chat_id}/participants`, data)

  showFriends = () => axios.get('api/v1/user/friends')
  showFriendRequests = () => axios.get('api/v1/user/friends/requests')
  sendFriendRequest = (data) => axios.post(`api/v1/user/friends/${data.otherUserId}/send_request`, data)
  acceptFriendRequest = (data) => axios.post(`api/v1/user/friends/${data.otherUserId}/accept_request`, data)
  rejectOrCancelFriendRequest = (data) => axios.post(`api/v1/user/friends/${data.otherUserId}/reject_or_cancel_request`, data)
  removeFromFriends = (data) => axios.post(`api/v1/user/friends/${data.otherUserId}/remove`, data)

  showUsers = () => axios.get('api/v1/user/search/users')
}

export default User
