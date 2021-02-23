import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import calendarReducer from './calendarReducer'

export const SET_NEXT_MONTH = 'SET_NEXT_MONTH'
export const SET_PREV_MONTH = 'SET_PREV_MONTH'
export const SELECT_DAY = 'SELECT_DAY'

export const rootReducer = combineReducers({ 
  calendarReducer, 
})

const middlewares = applyMiddleware(thunk)

export default createStore(rootReducer, middlewares)