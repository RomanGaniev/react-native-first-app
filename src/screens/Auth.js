import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
// import ajax from '../services/FetchCoins';
import PostsList from '../components/PostsList';
import { Axios } from '../boot'
import Api from '../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../components/context';

const Auth = ({navigation}) => {

  // constructor(props) {
  //   super(props);
  //   this.state = { email: '', password: '', refreshing: false };
  //   // this.handleStatusChange = this.handleStatusChange.bind(this);
  // }

  const [data, setData] = React.useState({
    email: '',
    password: '',
    refreshing: false
  });

  const { signIn } = React.useContext(AuthContext);

  loginHandle = () => {
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

  async function saveToken(token) {
    await SecureStore.setItemAsync('access_token', token);
    // this.props.navigation.navigate('Posts');
  };

  async function deleteToken() {
    // try {
    //   const token = await SecureStore.getItemAsync('access_token')
    // } catch (e) {
      await SecureStore.deleteItemAsync('access_token')
    // }
  };

  async function getToken() {
    const token = await SecureStore.getItemAsync('access_token');
    if(token) {
      console.log(token)
    } else {
      alert('Никто не авторизован')
    }
  };

  // function onChangeEmail(e) {
  //   this.setState({
  //     email: e
  //   });
  // }
  // function onChangePassword(e) {
  //   this.setState({
  //     password: e
  //   });
  // }

  // login() {
  //   if(this.state.email && this.state.password) {
  //     const fd = new FormData()
  //     fd.append('email', this.state.email)
  //     fd.append('password', this.state.password)
  //     api.call('login', fd)
  //       .then(({ data }) => {
  //         console.log(data)
  //         this.saveToken(data.access_token)
  //         Axios.setToken(data.access_token)
  //       })
  //       .catch(error => {
  //         alert('Неверная связка логин-пароль')
  //       })
  //       .finally(() => {
  //         //
  //       })
  //   } else {
  //     if(!this.state.email) {
  //       alert('Введите электронную почту')
  //     } else if(!this.state.password) {
  //       alert('Введите пароль')
  //     } else {
  //       alert('Заполните поля')
  //     }
      
  //   }
  // }
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
          <Button title='Удалить токен' onPress={() => deleteToken()}></Button>
          <Button title='Посты' onPress={() => this.props.navigation.navigate('Posts')}></Button>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', flexGrow: 1, flex: 1, justifyContent: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18, color: 'grey'}}>Еще нет аккаунта?</Text>
              <Button title='Зарегистрируйтесь' onPress={() => this.props.navigation.navigate('Registration')}></Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

export default Auth;

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
    backgroundColor: 'pink',
    // alignItems: 'center',
    // justifyContent: 'center',
  }
})