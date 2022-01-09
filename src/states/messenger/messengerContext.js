import React, { useContext } from 'react'
import {
	MessengerStateContext,
	MessengerDispatchContext,
	messengerReducer
} from '.'

function MessengerProvider({children}) {
	
	const initialMessengerState = {
		modalCreateChatVisible: false,
		modalEditChatVisible: false
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