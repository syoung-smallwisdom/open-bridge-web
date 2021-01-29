import * as React from 'react'
import { SessionData } from '../types/types'
import { clearSession, getSession, setSession } from './utility'

type ActionType = 'LOGIN' | 'LOGOUT' | 'SET_ALERT' | 'CLEAR_ALERT'
/*| 'CONSENT'
  | 'WITHDRAW'*/
type Action = { type: ActionType; payload?: SessionData }
type Dispatch = (action: Action) => void
type SessionDataProviderProps = { children: React.ReactNode }

const initialState = {
  token: undefined,
  orgMembership: undefined,
  dataGroups: [],
  roles:[],
  id:''
}

const SessionDataStateContext = React.createContext<SessionData | undefined>(
  undefined,
)
const SessionDataDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)

function countReducer(state: SessionData, action: Action): SessionData {
  switch (action.type) {
    case 'SET_ALERT': {
      const newState = {
        ...state,
        alert: action.payload!.alert!,
      }
      setSession(newState)
      return newState
    }

    case 'CLEAR_ALERT': {
      const newState = {
        ...state,
        alert: undefined,
      }
      setSession(newState)
      return newState
    }
    /* case 'CONSENT': {
      const newState = {
        ...state,
        consented: true,
        alert: undefined,
      }
      setSession(newState)
      return newState
    }
    case 'WITHDRAW': {
      const newState = {
        ...state,
        consented: false,
      }
      setSession(newState)
      return newState
    }*/
    case 'LOGIN':
      const newState = {
        ...state,
        token: action.payload!.token,
        orgMembership:action.payload!.orgMembership,
        //consented: action.payload!.consented,
        name: action.payload!.name,
       dataGroups: action.payload!.dataGroups,
       roles: action.payload!.roles,
       id: action.payload!.id
      }

      setSession(newState)
      return newState

    case 'LOGOUT':
      clearSession()
      return {
        ...state,
        token: undefined,
        orgMembership: undefined,
        //consented: undefined,
        // alert: undefined,
        dataGroups: []
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function SessionDataProvider({ children }: SessionDataProviderProps) {
  const [state, dispatch] = React.useReducer(
    countReducer,
    getSession() || initialState,
  )
  return (
    <SessionDataStateContext.Provider value={state}>
      <SessionDataDispatchContext.Provider value={dispatch}>
        {children}
      </SessionDataDispatchContext.Provider>
    </SessionDataStateContext.Provider>
  )
}

function useSessionDataState() {
  const context = React.useContext(SessionDataStateContext)
  if (context === undefined) {
    throw new Error('useSessionDataState must be used within a AuthContext')
  }
  return context
}

function useSessionDataDispatch() {
  const context = React.useContext(SessionDataDispatchContext)
  if (context === undefined) {
    throw new Error('useSessionDataDispatch must be used within a AuthContext')
  }
  return context
}

export { SessionDataProvider, useSessionDataState, useSessionDataDispatch }
