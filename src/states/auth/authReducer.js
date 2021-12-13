import React from 'react';

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

import Api from '../../services/api';
const api = new Api('Auth');
import _ from 'lodash';

export const authReducer = (prevState, action) => {
    // const getUserInfo = () => {
    //   api.call('me')
    //     .then(({ data }) => {
    //       setUserInfo(data.data)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    //     .finally(() => {
    //       // setIsLoadingComments(false)
    //     })
    // }

    // const setUserInfo = async (userInfo) => {
    //   if (Device.brand) {
    //     await SecureStore.setItemAsync('user_info', JSON.stringify(userInfo) );
    //   } else {
    //     localStorage.setItem('user_info', JSON.stringify(userInfo));
    //   }
    //   console.log('user_info: ', userInfo)
    // }

    switch( action.type ) {
      case 'RETRIEVE_USER': 
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          user: {
            token: null,
            info: null
          },
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
        };
    }
};
