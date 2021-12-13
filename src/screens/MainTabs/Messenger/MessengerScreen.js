import React, { useState, useCallback, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';

import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';

import Api from '../../../services/api';
const api = new Api('User');
import _ from 'lodash'

export const MessengerScreen = ({navigation}) => {

  const [chats, setChats] = useState([]);

  const opttt = () => {
    navigation.setOptions({tabBarStyle: {display: 'none'}})
  }

  useEffect(() => {
    showChats()
  }, [])

  const showChats = () => {
    // setIsLoading(false)
    api.call('showChats')
      .then(({ data }) => {
        setChats(data.data)
        console.log('showChats: ', data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        //
      })
  }

  const goToChat = (chatId) => {
    navigation.navigate("ChatScreen", {
      chatId: chatId
    })
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
      { chats.map((item, index) => (
        <TouchableHighlight onPress={() => goToChat(item.id)} underlayColor="#e1e1e1" key={'chat-' + index}>
          <View style={{flexDirection:'row', marginHorizontal: 15, marginVertical: 10, backgroundColor: 'transparent'}}>
            <Avatar.Image 
              source={{
                  // uri: userInfo?.avatar
              }}
              style={{backgroundColor: '#e1e1e1'}}
              size={50}
            />
            <View style={{marginLeft:15, flexDirection:'column'}}>
              <Title style={styles.title}>{item.name}</Title>
              <View style={{flexDirection:'row'}}>
                <Caption style={styles.caption}>{item.latest_message ? item.latest_message.text : 'нет сообщений...'}</Caption>
                <Entypo name="dot-single" size={11} color="grey" />
                <Caption style={styles.captionTime}>{'20ч'}</Caption>
              </View>
              
            </View>
          </View>
        </TouchableHighlight>
          
        ))
      }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  avatar: {
      width: 50,
      height: 50,
      // marginRight: 11,
      borderRadius: 50
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
    color: 'black'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey'
  },
  captionTime: {
    fontSize: 14,
    lineHeight: 14,
    color: 'grey',
    // paddingBottom: 10
  },
});
