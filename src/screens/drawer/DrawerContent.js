import React, { useContext } from 'react'
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

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import { AuthDispatchContext } from '../../states/auth/authDispatchContext'
import { AuthStateContext } from '../../states/auth/authStateContext'

export function DrawerContent(props) {

	const { signOut } = useContext(AuthDispatchContext)
	const { user } = useContext(AuthStateContext)

	return(
		<View style={{flex:1}}>
			<DrawerContentScrollView>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{flexDirection: 'row',marginTop: 15}}>
							<Avatar.Image 
								source={{
									uri: user.info.avatar
								}}
								style={{backgroundColor: '#e1e1e1'}}
								size={50}
							/>
							<View style={{marginLeft: 15, flexDirection: 'column'}}>
								<Title style={styles.title}>{user.info.first_name}</Title>
								<Caption style={styles.caption}>{user.info.email}</Caption>
							</View>
						</View>
					</View>
					<Drawer.Section style={styles.drawerSection}>
						<DrawerItem 
							icon={() => (
								<MaterialCommunityIcons 
									name="face-outline" 
									color="#2887f5"
									size={28}
								/>
							)}
							label="Мой профиль"
							labelStyle={styles.label}
							onPress={() => {props.navigation.navigate('MyProfileScreen')}}
						/>
						<DrawerItem 
							icon={() => (
								<Ionicons 
									name="bookmark-outline" 
									color="#2887f5"
									size={28}
								/>
							)}
							label="Закладки"
							labelStyle={styles.label}
							onPress={() => {props.navigation.navigate('BookmarkScreen')}}
						/>
						<DrawerItem 
							icon={() => (
								<Ionicons 
									name="search-outline" 
									color="#2887f5"
									size={28}
								/>
							)}
							label="Поиск"
							labelStyle={styles.label}
							onPress={() => {props.navigation.navigate('SearchScreen')}}
						/>
						<DrawerItem 
							icon={() => (
								<Ionicons 
									name="settings-outline" 
									color="#2887f5"
									size={28}
								/>
							)}
							label="Настройки"
							labelStyle={styles.label}
							onPress={() => {props.navigation.navigate('SettingsScreen')}}
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomDrawerSection}>
				<DrawerItem 
					icon={() => (
						<MaterialCommunityIcons 
							name="logout" 
							color="#ff2e2e"
							size={28}
						/>
					)}
					label="Выйти"
					labelStyle={styles.label}
					onPress={() => {
						props.navigation.closeDrawer()
						signOut()
					}}
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
		paddingLeft: 14,
	},
	title: {
		fontSize: 19,
		marginTop: 0,
		fontWeight: '600',
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
	drawerSection: {
		marginTop: 15
	},
	label: {
		fontSize: 17,
		fontWeight: '400',
		color: 'black'
	}
})