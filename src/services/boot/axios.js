import React, { Component } from 'react'
import axios from 'axios'

axios.defaults.baseURL = 'https://26fa-178-129-246-103.ngrok.io'
axios.defaults.headers['Content-Type'] = 'application/json'

axios.interceptors.request.use(config => {
  if (window.Echo !== null) {
    config.headers.common['X-Socket-ID'] = window.Echo.socketId()
  }
  if (axios.token) {
    config.headers.common.authorization = `Bearer ${axios.token}`
  }

  return config
})

const setToken = (token) => {
  axios.token = token
}

const getToken = (token) => {
  return axios.token;
}

export default {
  setToken,
  getToken
}