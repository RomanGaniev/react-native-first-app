import React, { Component } from 'react';
import axios from 'axios';

import * as SecureStore from 'expo-secure-store';

async function getToken() {
  const token = await SecureStore.getItemAsync('access_token');

  axios.token = token;
}

getToken();

axios.defaults.baseURL = 'https://6e5d-62-133-167-222.ngrok.io/';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
  if (axios.token) {
    config.headers.common.authorization = `Bearer ${axios.token}`;
  }

  return config;
});

const setToken = (token) => {
  axios.token = token

  axios.interceptors.request.use(config => {
    if (axios.token) {
      config.headers.common.authorization = `Bearer ${axios.token}`;
    }

    return config;
  });
};

React.Component.prototype.$axios = axios;

export default {
  setToken,
  getToken
};