import React from 'react';

export const messengerReducer = (prevState, action) => {
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
  }
}
