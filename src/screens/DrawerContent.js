import React from 'react';
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

import{ AuthContext } from '../components/context';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={{
                                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                                }}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>Имя Фамилия</Title>
                                <Caption style={styles.caption}>@login</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Подписок</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Подписчиков</Caption>
                            </View>
                        </View>
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
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons 
                                name="face-profile" 
                                color="black"
                                size={size}
                                />
                            )}
                            label="Профиль"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
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
                    <Drawer.Section title="Плюшки">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Тёмная тема</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
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
                    label="Выйти нахуй"
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
  });