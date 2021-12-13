import React, { Component } from 'react';
import axios from 'axios'

class Auth {

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

  me = () => axios.get('api/v1/auth/me')

}
export default Auth
