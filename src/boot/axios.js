// import React, { Component } from 'react';
// import axios from 'axios';

// import * as SecureStore from 'expo-secure-store';

// axios.token = getToken();

// axios.defaults.baseURL = 'https://68cd-178-129-207-160.ngrok.io/';
// axios.defaults.headers['Content-Type'] = 'application/json';

// axios.interceptors.request.use(config => {
//   // config.headers.common.origin = axios.defaults.baseURL
//   if (axios.token) {
//     config.headers.common.authorization = `Bearer ${axios.token}`
//   }

//   return config
// });

// async function getToken() {
//   const token = await SecureStore.getItemAsync('access_token');
  
//   if(token) {
//     return token
//   } else {
//     return null
//   }
// }

// const setToken = (token) => {
//   axios.token = token;
// };

// export default {
//   setToken,
// };

import React, { Component } from 'react';
import axios from 'axios';

import * as SecureStore from 'expo-secure-store';

async function getToken() {
  const token = await SecureStore.getItemAsync('access_token');

  axios.token = token;
}

getToken();
//  = LocalStorage.getItem('token')

axios.defaults.baseURL = 'https://1655-178-129-227-103.ngrok.io/';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
  // config.headers.common.origin = axios.defaults.baseURL
  if (axios.token) {
    config.headers.common.authorization = `Bearer ${axios.token}`;
  }

  return config;
});



const setToken = (token) => {
  axios.token = token

  axios.interceptors.request.use(config => {
    // config.headers.common.origin = axios.defaults.baseURL
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