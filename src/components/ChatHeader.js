import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  Avatar,
  Title,
  Caption
} from 'react-native-paper'

export const ChatHeader = ({ chat, typingUser }) => {

  const [ textParticipants, setTextParticipants ] = useState('')

  useEffect(() => {
    const lastDigit = chat.participants_count % 10
    
    if (lastDigit === 1) {
      setTextParticipants('участник')
    } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
      setTextParticipants('участника')
    } else {
      setTextParticipants('участников')
    }
  },[])

  return (
    <View style={styles.container}>
      { chat.is_private || chat.avatar ?
          <Avatar.Image 
            source={{uri: chat.is_private ? chat.interlocutor.avatar : chat.avatar}}
            style={{backgroundColor: '#e1e1e1', marginRight: 10}}
            size={37}
          />
        :
          <View style={[styles.avatar, {backgroundColor: '#2887f5'}]}>
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>{chat.name?.charAt(0).toUpperCase()}</Text>
          </View>
      }

      <View>
        <Text style={styles.title}>
          {chat.is_private ? `${chat.interlocutor.first_name} ${chat.interlocutor.last_name}` : chat.name}
        </Text>
        { typingUser ?
            <Text style={styles.subtitle}>{`${typingUser} печатает...`}</Text>
          :
            chat.is_private ?
                <Text style={styles.subtitle}>online</Text>
              :
                <Text style={styles.subtitle}>{chat.participants_count} {textParticipants}</Text>
        }
      </View> 
    </View>
  )

  // <View style={styles.container}>
  //     {chat.is_private ?
  //       <>
  //         <View style={[styles.chatUserAvatar, {marginRight: 10}]}>
  //           <Image source={{uri: chat.interlocutor.avatar}} style={styles.chatUserAvatar} />
  //         </View>
  //         <View>
  //           <Text style={styles.title}>{`${chat.interlocutor.first_name} ${chat.interlocutor.last_name}`}</Text>
  //           { typingUser ?
  //               <Text style={styles.subtitle}>{`${typingUser} печатает...`}</Text>
  //             :
  //               <Text style={styles.subtitle}>online</Text>
  //           }
  //         </View>
  //       </>
  //     :
  //       <>
  //         <View style={styles.generalChatAvatar}>
  //           <Text style={styles.chatName}>{chat.name.charAt(0).toUpperCase()}</Text>
  //         </View>
  //         <View>
  //           <Text style={styles.title}>{chat.name}</Text>
  //           { typingUser ?
  //               <Text style={styles.subtitle}>{`${typingUser} печатает...`}</Text>
  //             :
  //               chat.participants_count ?
  //                   <Text style={styles.subtitle}>{chat.participants_count} {textParticipants}</Text>
  //                 :
  //                   null
  //           }
  //         </View>
  //       </>
  //     }
  //   </View>
}

const styles = StyleSheet.create({
  avatar: {
    width: 37,
    height: 37,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  generalChatAvatar: {
    width: 37,
    height: 37,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2887f5',
    marginRight: 10
  },
  chatUserAvatar: {
    width: 37,
    height: 37,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1e1e1'
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: 'black'
  },
  subtitle: {
    color: 'grey'
  },
  chatName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18
  }
})