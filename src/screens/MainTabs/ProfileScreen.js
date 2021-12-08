import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, InputAccessoryView, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView, Text } from 'react-native';

import { Feather } from '@expo/vector-icons';

import Api from '../../services/api';
const api = new Api('Coin');
import _ from 'lodash'

export const ProfileScreen = () => {
  
  const [text, setText] = useState('')
  
  const inputRef = useRef('qwerty')
  const inputAccessoryViewID = 'uniqueID'

  const [inputAccessoryShown, setInputAccessoryShown] = useState(true);

  useEffect(() => {
    console.log('inputAccessoryShown changed on:', inputAccessoryShown)
  }, [inputAccessoryShown])

  return (
    <SafeAreaView>
      <View style={{ flex: 1 }}>
      </View>
    </SafeAreaView>
  )
};
