import React from 'react-native'
// import Types from '../Actions/Types'
// import Immutable from 'seamless-immutable'
import createReducer from './CreateReducer'

const {StateUtils: NavigationStateUtils} = React.NavigationExperimental

export const INITIAL_STATE = {
  index: 0,
  key: 'exmaple',
  children: [{key: 'Nacho Route'}]
}

const push = (state, action) => NavigationStateUtils.push(state, {key: action.key})

const pop = (state, action) => state.index > 0 ? NavigationStateUtils.pop(state) : state

// map our types to our handlers
const ACTION_HANDLERS = {
  // ['RootContainerInitialAction']: initial,
  ['push']: push,
  ['back']: pop,
  ['pop']: pop
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
