import React from 'react';

const AuthStateContext = React.createContext()
const AuthDispatchContext = React.createContext();

function AuthProvider({children}) {
  function authReducer(prevState, action) {
    switch( action.type ) {
      case 'RETRIEVE_USER': 
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
        }
      case 'LOGIN':
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
      }
      case 'LOGOUT': 
        return {
          ...prevState,
          user: {
            token: null,
            info: null
          },
          isLoading: false,
        }
      case 'REGISTER': 
        return {
          ...prevState,
          user: {
            token: action.token,
            info: action.info
          },
          isLoading: false,
        }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }

	const initialAuthState = {
    isLoading: true,
    user: {
      token: null,
      info: null
    }
  }
	const [authState, dispatch] = React.useReducer(authReducer, initialAuthState)

	const authContext = React.useMemo(() => ({
    signIn: async(access_token) => {
      let userInfoData = null
      try {
        if (Device.brand) {
          await SecureStore.setItemAsync('access_token', access_token)
        } else {
          localStorage.setItem('access_token', access_token)
        }
        Axios.setToken(access_token)
      } catch(e) {
        console.log(e)
      }
      await api.call('me')
        .then(({ data }) => {
          userInfoData = data.data
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          
        })
      dispatch({ type: 'LOGIN', token: access_token, info: userInfoData })
    },
    signOut: async() => {
      try {
        if (Device.brand) {
          await SecureStore.deleteItemAsync('access_token')
        } else {
          localStorage.removeItem('access_token')
        }
      } catch(e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })
    },
    signUp: () => {
      //
    },
    userInfo: () => authState.user.info
    // userInfo: authState.user.info
  }), [])

	useEffect(() => {
    (async () => {
      async function retrieve () {
        // setIsLoading(false);
        let userToken = null
        let userInfoData = null
        try {
          if (Device.brand) {
            userToken = await SecureStore.getItemAsync('access_token')
          } else {
            userToken = localStorage.getItem('access_token')
          }
  
          Axios.setToken(userToken)
  
          await api.call('me')
            .then(({ data }) => {
              userInfoData = data.data
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              //            
            })
  
        } catch(e) {
          console.log(e)
        }
        
        dispatch({ type: 'RETRIEVE_USER', token: userToken, info: userInfoData })
      }
      await retrieve()
    })()
  }, [])

	return (
    <AuthDispatchContext.Provider value={authContext}>
      <AuthStateContext.Provider value={authState}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

function useAuthState() {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider')
  }
  return context
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider')
  }
  return context
}

export {AuthProvider, useAuthState, useAuthDispatch}