import React, {useContext, useEffect, useState} from 'react'
import { useToggle } from '../../../services/helpers/useToggle'

const MessengerStateContext = React.createContext()
const MessengerDispatchContext = React.createContext()

function MessengerProvider({children}) {

	const messengerReducer = (prevState, action) => {
		switch( action.type ) {
		  case 'TOGGLE_CREATE': 
			return {
			  ...prevState,
			  modalCreateChatVisible: !prevState.modalCreateChatVisible,
			}
		  case 'TOGGLE_EDIT':
			return {
			  ...prevState,
			  modalEditChatVisible: !prevState.modalEditChatVisible,
			}
		}
	}
	
	const initialMessengerState = {
		modalCreateChatVisible: false,
		modalEditChatVisible: false
	}
	
	const [messengerState, dispatch] = React.useReducer(messengerReducer, initialMessengerState)
	
	const messengerDispatch = React.useMemo(() => ({
		toggleCreate: () => {
		
			try {
			//
			} catch(e) {
				console.log(e)
			}
			
			dispatch({ type: 'TOGGLE_CREATE' })
		},
		toggleEdit: () => {
	
			try {
				//
			} catch(e) {
				console.log(e)
			}
	
			dispatch({ type: 'TOGGLE_EDIT' })
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
		throw new Error('useMessengerState must be used within a MessengerProvider')
	}
	return context
}

function useMessengerDispatch () {
	const context = useContext(MessengerDispatchContext)
	if (context === undefined) {
		throw new Error('useMessengerDispatch must be used within a MessengerProvider')
	}
	return context
}

export {MessengerProvider, useMessengerState, useMessengerDispatch}