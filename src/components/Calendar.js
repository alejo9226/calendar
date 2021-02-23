import { 
  format, 
  startOfWeek, 
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  parse,
  isWeekend,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns"
import { useSelector, useDispatch } from 'react-redux'
import { SET_NEXT_MONTH, SET_PREV_MONTH, SELECT_DAY } from '../store'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { IconButton, Dialog, DialogActions } from '@material-ui/core'
import { useState } from "react"
import { useForm } from "../utils/hooks/useForm"
import { DELETE_REMINDERS, SET_CURRENT_REMINDER, SET_REMINDER } from "../store/calendarReducer"
import axios from 'axios'
import { validateForm } from "../utils/validations"
import Reminder from "./Reminder"
import { v4 as uuidv4 } from 'uuid'


export default function Calendar () {

  const { 
    currentMonth, 
    selectedDate,
    reminders,
    currentReminder,
  } = useSelector(({ calendarReducer: { currentMonth, selectedDate, reminders, currentReminder } }) => {
    return { currentMonth, selectedDate, reminders, currentReminder }
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [dateToAdd, setDateToAdd] = useState(null)
  const [viewReminderMode, setViewReminderMode] = useState('')
  const dispatch = useDispatch()

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy"
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          {/* <div className="icon" onClick={prevMonth}>
            chevron_left
          </div> */}
          <IconButton className="icon" onClick={prevMonth}>
            <ArrowBackIosIcon 
              style={{ color: 'grey', fontSize: '1.2rem' }}
            />
          </IconButton>
        </div>
        <div className="col col-center">
          <span>
            {format(currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end">
          <IconButton className="icon" onClick={nextMonth}>
            <ArrowForwardIosIcon 
              style={{ color: 'grey', fontSize: '1.2rem' }}
            />
          </IconButton>
        </div>
      </div>
    )
  }
  const renderDays = () => {
    const dateFormat = "EEEE"
    const days = []

    let startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      )
    }

    return <div className="days row">{days}</div>
  }

  const onDateClick = day => {
    dispatch({ type: SELECT_DAY, payload: day })
  }

  const nextMonth = () => {
    dispatch({ type: SET_NEXT_MONTH, payload: addMonths(currentMonth, 1) })
  }

  const prevMonth = () => {
    dispatch({ type: SET_PREV_MONTH, payload: subMonths(currentMonth, 1) })
  }

  const renderReminderDialog = (mode) => {
    return (
      <Reminder 
        reminder={currentReminder}
        open={openDialog}
        dateToAdd={dateToAdd}
        setOpen={setOpenDialog}
        viewReminderMode={mode}
        setViewReminderMode={setViewReminderMode}
      />
    )
  }

  const createReminder = (date) => {
    setViewReminderMode('Create')
    setOpenDialog(true)
    setDateToAdd(date)
  }

  const showReminder = (reminder) => {
    setOpenDialog(true)
    setViewReminderMode('View')
    dispatch({ type: SET_CURRENT_REMINDER, payload: reminder })
  }

  const deleteReminders = (date) => {
    dispatch({type: DELETE_REMINDERS, payload: date})
  }

  const orderReminders = (unorderedReminders) => {
    if (unorderedReminders.length < 2) {
      return unorderedReminders
    } else {
    
      unorderedReminders.sort((a, b) => {
        if (a.time < b.time) {
          return -1
        }
        if (a.time > b.time) {
          return 1
        }
        return 0
      })
      return unorderedReminders
    }
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : "" 
            } ${
              isWeekend(day) ? "weekend" : ""
            }`}
            key={day}
          >
            <span 
              className="number"
            >
              {formattedDate}
            </span>
            {new Date(cloneDay) > new Date() - (1000 * 60 * 60 * 24) && isSameMonth(day, monthStart) &&
              <IconButton 
                style={{ padding: '0px' }} 
                onClick={() => createReminder(cloneDay)}
                title='Add reminder'
                data-testid='add-reminder-button'
              >
                <ControlPointIcon
                  className='add-remainder-icon'
                  style={{ color: 'grey', fontSize: '1.5rem' }}
                />
              </IconButton>}
            {!!reminders && reminders.findIndex(reminder => reminder.date == cloneDay.toString()) !== -1 && 
              <IconButton 
                style={{ 
                  padding: '0px',
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }} 
                onClick={() => deleteReminders(cloneDay.toString())}
                title='Delete reminders'
              >
                <DeleteIcon
                  className='delete-remainder-icon'
                  style={{ color: 'grey', fontSize: '1.5rem' }}
                />
              </IconButton>}
            {!!reminders && reminders.findIndex(reminder => reminder.date == cloneDay.toString()) !== -1 && 
              orderReminders(reminders.filter(rem => rem.date == cloneDay.toString())).map(reminder => {
              if (reminder.date === cloneDay.toString()) {
                return (
                  <div 
                    data-testid="reminder"
                    className="reminder-outer-div"
                    onClick={showReminder.bind(this, reminder)}
                    style={{
                      backgroundColor: reminder.color,
                      margin: 0,
                      padding: '0 5px'
                    }}
                    key={reminder.id}
                  >
                    <p
                      className="reminder-description"
                    >{reminder.description}</p>
                  </div>
                )
              }
            })}
          </div>
        )
        day = addDays(day, 1)
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      )
      days = []
    }

    return <div className="body">{rows}</div>
  }
  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderReminderDialog(viewReminderMode)}
    </div>
  )
}