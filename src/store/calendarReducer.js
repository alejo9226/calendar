import thunk from 'redux-thunk'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { daysSubstract } from '../utils/formatDate'
export const SET_NEXT_MONTH = 'SET_NEXT_MONTH'
export const SET_PREV_MONTH = 'SET_PREV_MONTH'
export const SELECT_DAY = 'SELECT_DAY'
export const SET_REMINDER = 'SET_REMINDER'
export const EDIT_REMINDER = 'EDIT_REMINDER'
export const DELETE_REMINDERS = 'DELETE_REMINDERS'
export const SET_CURRENT_REMINDER = 'SET_CURRENT_REMINDER'
export const CLEAR_CURRENT_REMINDER = 'CLEAR_CURRENT_REMINDER'

export function createReminder (formValues, dateToAdd) {
  return async function (dispatch) {
    try {
      const { data } = await axios({
        baseURL: `https://api.openweathermap.org`,
        url: `/data/2.5/forecast/daily?q=${formValues.city}&cnt=16&appid=${process.env.REACT_APP_API_KEY}`,
        method: 'GET',
      })

      const dateDiff = daysSubstract(dateToAdd)

      const newReminder = {
        ...formValues,
        id: uuidv4(),
        date: dateToAdd.toString(),
        forecast:  dateDiff > 15 ? `N/A` : `${data.list[dateDiff].weather[0].description}`,
        temperature: dateDiff > 15 ? `_` : `${Math.floor(data.list[dateDiff].temp.day - 273)}`
      }
      dispatch({type: SET_REMINDER, payload: newReminder })
    } catch (err) {
      console.log('err', err)
    }
  }
}

const colors = [
  {
    name: 'Red',
    value: 'red'
  },
  {
    name: 'Green',
    value: 'green'
  },
  {
    name: 'Blue',
    value: 'blue'
  }
]

const hours = [
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]

const initialState = {
  hours,
  colors,
  currentMonth: new Date(),
  selectedDate: new Date(),
  reminders: [],
  currentReminder: null
}

function calendarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NEXT_MONTH:
      return {
        ...state,
        currentMonth: action.payload
      }
    case SET_PREV_MONTH:
      return {
        ...state,
        currentMonth: action.payload
      }
    case SELECT_DAY:
      return {
        ...state,
        selectedDate: action.payload
      }
    case SET_REMINDER:
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      }
    case SET_CURRENT_REMINDER:
      const current = state.reminders.findIndex(reminder => reminder.id === action.payload.id)
      return {
        ...state,
        currentReminder: state.reminders[current]
      }
    case CLEAR_CURRENT_REMINDER:
      return {
        ...state,
        currentReminder: null
      }
    case EDIT_REMINDER:
      const { id } = action.payload
      const currentReminder = state.reminders.findIndex(reminder => reminder.id === id)
      const stateCopy = [...state.reminders]
      stateCopy.splice(currentReminder, 1, action.payload)
     
      return {
        ...state,
        reminders: [...stateCopy]
      }
    case DELETE_REMINDERS: 
      const filteredReminders = state.reminders.filter(reminder => reminder.date !== action.payload)
      return {
        ...state,
        reminders: [...filteredReminders]
      }
    default:
      return state
  }
}

export default calendarReducer