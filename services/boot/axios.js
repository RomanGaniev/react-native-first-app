import React, { Component } from 'react'
import axios from 'axios'

axios.defaults.baseURL = 'https://023c-185-169-103-101.ngrok.io'
axios.defaults.headers['Content-Type'] = 'application/json'


axios.interceptors.request.use(config => {

  if (axios.socketId) {
    config.headers.common['X-Socket-ID'] = `${axios.socketId}`
  }

  if (axios.token) {
    config.headers.common.authorization = `Bearer ${axios.token}`
  }

  return config
})

const setToken = (token) => {
  axios.token = token
}

const getToken = () => {
  return axios.token
}

const updateSocketId = (socket_id) => {
  axios.socketId = socket_id
}

export default {
  setToken,
  getToken,
  updateSocketId
}