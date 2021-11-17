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
  // const _keyboardDidShow = () => setKeyboardStatus(true);
  // const _keyboardDidHide = () => setKeyboardStatus(false);

  // useEffect(() => {
  //   inputRef.current.focus()
  // }, [keyboardStatus])

  useEffect(() => {
    console.log('inputAccessoryShown changed on:', inputAccessoryShown)
  }, [inputAccessoryShown])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{paddingHorizontal: 14, paddingBottom: 7}}>
          <View style={{height: 1, backgroundColor: '#ececec'}}></View>
        </View>
        <View>
          <TextInput
            ref={inputRef}
            multiline
            inputAccessoryViewID={inputAccessoryViewID}
            placeholder='Что у вас нового?'
            placeholderTextColor='grey'
            autoFocus={false}
            style={{fontSize: 22, fontWeight: '300', marginHorizontal: 14, paddingTop: 20}}
            value={text}
            onChangeText={(val) => setText(val)}
            onFocus={() => {
              setInputAccessoryShown(false)
            }}
            onBlur={() => {
              setInputAccessoryShown(true)
            }}
          />
            <InputAccessoryView style={{height: 50}} nativeID={inputAccessoryViewID}>
              <View style={{backgroundColor: 'green', flex: 1}}>
                <View style={{paddingHorizontal: 15}}>
                  <View style={{height: 1, backgroundColor: '#ececec'}}></View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, flex: 1}}>
                  <TouchableOpacity>
                    <Feather name="image" size={25} color="grey" />
                  </TouchableOpacity>
                    <Text>with nativeID</Text>
                  <TouchableOpacity onPress={() => inputRef.current.blur()}>
                    <Feather name="chevron-down" size={30} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
          </InputAccessoryView>
          
          { inputAccessoryShown &&
              <InputAccessoryView style={{height: 50}}>
                <View style={{backgroundColor: 'orange', flex: 1}}>
                  <View style={{paddingHorizontal: 15}}>
                    <View style={{height: 1, backgroundColor: '#ececec'}}></View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, flex: 1}}>
                    <TouchableOpacity>
                      <Feather name="image" size={25} color="grey" />
                    </TouchableOpacity>
                    <Text>without nativeID</Text>
                    <TouchableOpacity onPress={() => inputRef.current.focus()}>
                      <Feather name="chevron-up" size={30} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              </InputAccessoryView>
          }
          
        </View>
        
      </ScrollView>
      
    </SafeAreaView>
  )
};
