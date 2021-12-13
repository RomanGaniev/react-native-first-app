import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../states/auth/authContext';

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

export function DrawerContent(props) {

    const paperTheme = useTheme()

    const { signOut, toggleTheme } = React.useContext(AuthContext)

    const [ userInfo, setUserInfo ] = useState(null)

    useEffect(() => {
        async function getUserInfo() {
        let info
        if (Device.brand) {
            info = await SecureStore.getItemAsync('user_info')
            info = JSON.parse(info)
            setUserInfo(info)
        } else {
            info = localStorage.getItem('user_info')
            info = JSON.parse(info)
            setUserInfo(info)
        }
        // console.log('User info from storage: ', userInfo)
        }
        getUserInfo()
    }, [])

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
                                <Avatar.Image 
                                    source={{
                                        uri: userInfo?.avatar
                                    }}
                                    style={{backgroundColor: '#e1e1e1'}}
                                    size={50}
                                />
                            </View>
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{userInfo?.first_name + ' ' + userInfo?.last_name}</Title>
                                <Caption style={styles.caption}>{userInfo?.email}</Caption>
                            </View>
                        </View>

                        {/* <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Подписок</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Подписчиков</Caption>
                            </View>
                        </View> */}
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Ionicons 
                                name="ios-home-outline" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Домой"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons 
                                name="face-profile" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Профиль"
                            onPress={() => {props.navigation.navigate('Messenger')}}
                        /> */}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons 
                                name="bookmark-multiple-outline" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Избранное"
                            onPress={() => {props.navigation.navigate('BookmarkScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Ionicons 
                                name="settings-outline" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Настройки"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Ionicons 
                                name="help-circle-outline" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Помощь"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        />
                    </Drawer.Section>
                    {/* <Drawer.Section title="Плюшки">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Тёмная тема</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <MaterialCommunityIcons 
                            name="logout" 
                            color="red"
                            size={size}
                        />
                    )}
                    label="Выйти"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        // marginRight: 11,
        borderRadius: 50
    },
  });