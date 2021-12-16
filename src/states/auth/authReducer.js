import React from 'react';

export const authReducer = (prevState, action) => {
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
