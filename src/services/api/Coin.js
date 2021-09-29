import React, { Component } from 'react';
import axios from 'axios'

class Coin {

  createPost = (data) => axios.post('api/v1/user/post/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  showPosts = () => axios.get('api/v1/user/posts')

  likePost = (data) => axios.post(`api/v1/user/posts/${data.post}/like`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  login = (data) => axios.post('api/v1/auth/login', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  logout = (data) => axios.post('api/v1/auth/logout', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  registration = (data) => axios.post('api/v1/auth/registration', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

}
export default Coin