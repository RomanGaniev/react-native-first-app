import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import {
    Avatar,
    Title,
    Caption,
    Drawer
} from 'react-native-paper'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthDispatchContext } from '../states/auth/authDispatchContext';
import { AuthStateContext } from '../states/auth/authStateContext';

// import * as SecureStore from 'expo-secure-store';
// import * as Device from 'expo-device';

export function DrawerContent(props) {

	const { signOut } = useContext(AuthDispatchContext)
	const { user } = useContext(AuthStateContext)

	console.log('context user drawer: ', user)

	// const [ user, setUser ] = useState(null)

	// useEffect(() => {
	// 		let abc = userInfo()
	// 		setUser(abc)
	// }, [])

	// useEffect(() => {
	// 		let abc = userInfo()
	// 		setUser(abc)
	// }, [userInfo])

	return(
		<View style={{flex:1}}>
			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{flexDirection:'row',marginTop: 15}}>
							<View style={{backgroundColor: '#e1e1e1', ...styles.avatar}}>
								<Avatar.Image 
									source={{
										uri: user.info.avatar
									}}
									style={{backgroundColor: '#e1e1e1'}}
									size={50}
								/>
							</View>
							<View style={{marginLeft:15, flexDirection:'column'}}>
								<Title style={styles.title}>{user.info.first_name + ' ' + user.info.last_name}</Title>
								<Caption style={styles.caption}>{user.info.email}</Caption>
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
						<DrawerItem 
							icon={({color, size}) => (
								<MaterialCommunityIcons 
									name="face-profile" 
									color="black"
									size={size}
								/>
							)}
							label="Инфо пользователя"
							onPress={() => console.log('userInfo', user.info)}
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
					onPress={signOut}
				/>
			</Drawer.Section>
		</View>
	)
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
	}
  })