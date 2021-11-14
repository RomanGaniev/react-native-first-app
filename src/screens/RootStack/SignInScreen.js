import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import * as Device from 'expo-device';
import { Axios } from '../../services/boot'
import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../../states/auth/authContext';

export const SignInScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    email: '',
    password: '',
    refreshing: false
  });

  const { signIn } = React.useContext(AuthContext);

  let loginHandle = () => {
    if(data.email && data.password) {
      const fd = new FormData()
      fd.append('email', data.email)
      fd.append('password', data.password)
      api.call('login', fd)
        .then(({ data }) => {
          signIn(data.access_token)
        })
        .catch(error => {
          alert('Неверная связка логин-пароль')
        })
        .finally(() => {
          //
        })
    } else {
      if(!data.email) {
        alert('Введите электронную почту')
      } else if(!data.password) {
        alert('Введите пароль')
      } else {
        alert('Заполните поля')
      }
    }
  };

  function wait(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  function onRefresh() {
    this.setState({
      refreshing: true
    });
    this.setState({
      refreshing: false
    });
  };


  async function getToken() {
    let token = ""
    if (Device.brand) {
      token = await SecureStore.getItemAsync('access_token');
    } else {
      token = localStorage.getItem('access_token');
    }
    if(token) {
      console.log(token)
    } else {
      alert('Никто не авторизован')
    }
  };

  return (
    <SafeAreaView style={styles.containerscrollView}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={data.refreshing}
            onRefresh={()=> onRefresh()}
          />
        }
      >
        <View style={styles.container}>
          <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 7}}>Электронный адрес</Text>
          <TextInput
            placeholder='Введите электронную почту'
            style={styles.input}
            onChangeText={(val) => {
              setData({
                ...data,
                email: val
              });
            }}
            value={data.email}
            keyboardType='email-address'
          />
          <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 5}}>Пароль</Text>
          <TextInput
            placeholder='Введите пароль'
            style={styles.input}
            onChangeText={(val) => {
              setData({
                ...data,
                password: val
              });
            }}
            value={data.password}
          />
          <Button title='Войти' onPress={() => loginHandle()}></Button>
          <Button title='Показать токен' onPress={() => getToken()}></Button>
          {/* <Button title='Посты' onPress={() => this.props.navigation.navigate('Posts')}></Button> */}
          <View style={{flexDirection: 'row', alignItems: 'flex-end', flexGrow: 1, flex: 1, justifyContent: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18, color: 'grey'}}>Еще нет аккаунта?</Text>
              <Button title='Зарегистрируйтесь' onPress={() => navigation.navigate('SignUpScreen')}></Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: '',
    backgroundColor: 'white',
    padding: 10
  },
  input: {
    paddingHorizontal: 10,
    height: 45,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 5,
    marginBottom: 15
  },
  containerscrollView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink'
  }
})