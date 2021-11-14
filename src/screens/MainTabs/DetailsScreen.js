import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Axios, Pusher } from '../../services/boot';

async function getToken() {
  let tokenStorage = ""
  if (Device.brand) {
    tokenStorage = await SecureStore.getItemAsync('access_token');
  } else {
    tokenStorage = localStorage.getItem('access_token');
  }
  console.log('ТОКЕН ХРАНИЛИЩА: ', tokenStorage)

  // const ast = await Pusher(tokenStorage)

  // // console.log(ast)
  // ast.channel(`post-channel`)
  //     .listen('PostChanged', (e) => {
  //         console.log(e)
  //     });

  //     console.log(ast)
}

function like(post_id) {
  api.call('likePost', { post: post_id })
    .then(({ data }) => {
      // this.setState({
      //   posts: data.data
      // });
      console.log('ОК: ' + data);
    })
    .catch(error => {
      // console.log(error)
    })
    .finally(() => {
      // console.log(this.state.posts)
    })
}

export const DetailsScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Details Screen</Text>
        <Button
            title="Like"
            onPress={() => like(1)}
        />
        <Button
            title="Go to details screen...again"
            onPress={() => navigation.push("Details")}
        />
        <Button
            title="Go to home"
            onPress={() => navigation.navigate("Home")}
        />
        <Button
            title="Go back"
            onPress={() => navigation.goBack()}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});