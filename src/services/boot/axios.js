import React, { Component } from 'react';
import * as Device from 'expo-device';
import axios from 'axios';

import * as SecureStore from 'expo-secure-store';

axios.defaults.baseURL = 'https://a232-95-110-46-156.ngrok.io';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
  if (window.Echo !== null) {
    config.headers.common['X-Socket-ID'] = window.Echo.socketId();
  }
  if (axios.token) {
    config.headers.common.authorization = `Bearer ${axios.token}`;
  }

  return config;
});

async function retrieveToken() {
  let token = "";
  if (Device.brand) {
    token = await SecureStore.getItemAsync('access_token');
  } else {
    token = localStorage.getItem('access_token');
  }
  axios.token = token;
}

retrieveToken();

const setToken = (token) => {
  axios.token = token
};

const getToken = (token) => {
  return axios.token;
};

export default {
  setToken,
  getToken
};