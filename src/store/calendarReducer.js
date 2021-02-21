import thunk from 'redux-thunk'
export const SET_NEXT_MONTH = 'SET_NEXT_MONTH'
export const SET_PREV_MONTH = 'SET_PREV_MONTH'
export const SELECT_DAY = 'SELECT_DAY'
export const SET_REMINDER = 'SET_REMINDER'
export const EDIT_REMINDER = 'EDIT_REMINDER'
export const DELETE_REMINDERS = 'DELETE_REMINDERS'
export const SET_CURRENT_REMINDER = 'SET_CURRENT_REMINDER'
export const CLEAR_CURRENT_REMINDER = 'CLEAR_CURRENT_REMINDER'

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
      console.log('filteredReminders', filteredReminders)
      return {
        ...state,
        reminders: [...filteredReminders]
      }
    default:
      return state
  }
}

export default calendarReducer