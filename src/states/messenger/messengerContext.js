import React, {useContext, useEffect, useState} from 'react'

const MessengerStateContext = React.createContext()
const MessengerDispatchContext = React.createContext()

function MessengerProvider({children}) {

	const messengerReducer = (prevState, action) => {
		switch( action.type ) {
			case 'TOGGLE_MODAL_CREATE_CHAT_VISIBLE': 
				return {
					...prevState,
					modalCreateChatVisible: !prevState.modalCreateChatVisible,
				}
			case 'TOGGLE_MODAL_EDIT_CHAT_VISIBLE':
				return {
					...prevState,
					modalEditChatVisible: !prevState.modalEditChatVisible,
				}
			// case 'SET_CHAT_WHERE_ADDED_MESSAGE':
			// 	return {
			// 		...prevState,
			// 		chatWhereAddedMessage: {
			// 			id: action.chat_id,
			// 			is_loading: true
			// 		},
			// 	}
			// case 'CLEAN_CHAT_WHERE_ADDED_MESSAGE':
			// 	return {
			// 		...prevState,
			// 		chatWhereAddedMessage: {
			// 			id: null,
			// 			is_loading: false
			// 		},
			// 	}
			case 'SET_EDITED_CHAT':
				return {
					...prevState,
					editedChat: {
						id: action.chat_id,
						is_loading: true
					},
				}
			case 'CLEAN_EDITED_CHAT':
				return {
					...prevState,
					editedChat: {
						id: null,
						is_loading: false
					},
				}
		}
	}
	
	const initialMessengerState = {
		modalCreateChatVisible: false,
		modalEditChatVisible: false,
		// chatWhereAddedMessage: {
		// 	id: null,
		// 	is_loading: false
		// },
		editedChat: {
			id: null,
			is_loading: false
		}
	}
	
	const [messengerState, dispatch] = React.useReducer(messengerReducer, initialMessengerState)
	
	const messengerDispatch = React.useMemo(() => ({
		toggleModalCreateChatVisible: () => {
			try {
				dispatch({ type: 'TOGGLE_MODAL_CREATE_CHAT_VISIBLE' })
			} catch(e) {
				console.log(e)
			}
		},
		toggleModalEditChatVisible: () => {
			try {
				dispatch({ type: 'TOGGLE_MODAL_EDIT_CHAT_VISIBLE' })
			} catch(e) {
				console.log(e)
			}
		},
		// setChatWhereAddedMessage: (chat_id) => {
		// 	try {
		// 		dispatch({ type: 'SET_CHAT_WHERE_ADDED_MESSAGE', chat_id: chat_id, is_loading: true })
		// 	} catch(e) {
		// 		console.log(e)
		// 	}
		// },
		// cleanChatWhereAddedMessage: () => {
		// 	try {
		// 		dispatch({ type: 'CLEAN_CHAT_WHERE_ADDED_MESSAGE' })
		// 	} catch(e) {
		// 		console.log(e)
		// 	}
		// },
		setEditedChat: (chat_id) => {
			try {
				dispatch({ type: 'SET_EDITED_CHAT', chat_id: chat_id, is_loading: true })
			} catch(e) {
				console.log(e)
			}
		},
		cleanEditedChat: () => {
			try {
				dispatch({ type: 'CLEAN_EDITED_CHAT' })
			} catch(e) {
				console.log(e)
			}
		}
	}), [])

	return (
		<MessengerStateContext.Provider value={messengerState}>
			<MessengerDispatchContext.Provider value={messengerDispatch}>
				{children}
			</MessengerDispatchContext.Provider>
		</MessengerStateContext.Provider>
	)
}

function useMessengerState() {
	const context = useContext(MessengerStateContext)
	if (context === undefined) {
		throw new Error('useMessengerState должен быть использован внутри MessengerProvider')
	}
	return context
}

function useMessengerDispatch () {
	const context = useContext(MessengerDispatchContext)
	if (context === undefined) {
		throw new Error('useMessengerDispatch должен быть использован внутри MessengerProvider')
	}
	return context
}

export { MessengerProvider, useMessengerState, useMessengerDispatch }