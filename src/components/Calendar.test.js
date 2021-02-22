import { cleanup, render, act, fireEvent, getByText, getByRole, getAllByTestId } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import moxios from 'moxios'
import '@testing-library/jest-dom'
import CreateReminder from './CreateReminder'
import Calendar from './Calendar'
import rootReducer from '../store'
import { createReminder, SET_REMINDER } from '../store/calendarReducer'
import { parseISO, startOfMonth, startOfWeek } from 'date-fns'

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

const mockedDate = [
  2021,
  3,
  1
]

const mockedReminder = {
  description: 'Do homework',
  city: 'Bogota',
  color: colors[2].name,
  time: hours[3],
}

const middlewares  = [thunk]
const mockedCalendarReducer = configureStore(middlewares)

describe('Create reminder', () => {
  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    cleanup()
    moxios.uninstall()
  })

  it('should open CreateReminder modal on add-reminder-icon click', async () => {

    const store = mockedCalendarReducer({
      calendarReducer: {
        hours,
        colors,
        currentMonth: new Date(mockedDate[0], mockedDate[1], mockedDate[2], 0, 0, 0),
        selectedDate: new Date(),
        reminders: [],
        currentReminder: null
      },
    })

    const { getByTestId, getAllByTestId, debug } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    )

    
    const addReminderButtons = getAllByTestId('add-reminder-button')
    fireEvent.click(addReminderButtons[0])

    const createModal = getByTestId('create-reminder')
    expect(createModal).toBeInTheDocument()
  })

  it('should change CreateReminder modal fields', async () => {

    const store = mockedCalendarReducer({
      calendarReducer: {
        hours,
        colors,
        currentMonth: new Date(mockedDate[0], mockedDate[1], mockedDate[2], 0, 0, 0),
        selectedDate: new Date(),
        reminders: [],
        currentReminder: null
      },
    })

    const { getByTestId, getAllByTestId, debug, getByLabelText } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    )

    
    const addReminderButtons = getAllByTestId('add-reminder-button')
    fireEvent.click(addReminderButtons[0])

    const createModal = getByTestId('create-reminder')

    const descriptionField = getByLabelText('Description')
    fireEvent.change(descriptionField, { target: { value: mockedReminder.description } })
    expect(descriptionField.value).toBe(mockedReminder.description)
    const cityField = getByLabelText('City')
    fireEvent.change(cityField, { target: { value: mockedReminder.city } })
    expect(cityField.value).toBe(mockedReminder.city)
    const colorField = getByLabelText('Color')
    fireEvent.change(colorField, { target: { value: mockedReminder.color } })
    expect(colorField.value).toBe(mockedReminder.color)
    const timeField = getByLabelText('Time')
    fireEvent.change(timeField, { target: { value: mockedReminder.time } })
    expect(timeField.value).toBe(mockedReminder.time)

  })
  it('should trigger SET_REMINDER action', async () => {
    const dateToAdd = new Date()

    const { dispatch, getActions } = mockedCalendarReducer()
    createReminder(mockedReminder, dateToAdd)(dispatch)

    await moxios.wait(jest.fn)
    const req = moxios.requests.mostRecent()
    await req.respondWith({
      status: 200,
      response: {
        list: [{
          weather: [{
            description: 'moderate rain'
          }],
          temp: {
            day: 288.83
          }
        }]
      }
    })
    const actions = getActions()

    expect(actions[0].type).toBe(SET_REMINDER)
  })
  
})