import { 
  format, 
  startOfWeek, 
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  parse,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns"
import { useSelector, useDispatch } from 'react-redux'
import { SET_NEXT_MONTH, SET_PREV_MONTH, SELECT_DAY } from '../store'
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { IconButton, Dialog, DialogActions } from '@material-ui/core'
import { useState } from "react";
import { useForm } from "../utils/hooks/useForm";
import { SET_CURRENT_REMINDER, SET_REMINDER } from "../store/calendarReducer";
import axios from 'axios'
import { validateForm } from "../utils/validations";
import Reminder from "./Reminder";
import { v4 as uuidv4 } from 'uuid';


export default function Calendar () {
  const { 
    currentMonth, 
    selectedDate,
    reminders,
    currentReminder,
    hours,
    colors
  } = useSelector(({ calendarReducer: { currentMonth, selectedDate, reminders, currentReminder, hours, colors } }) => {
    return { currentMonth, selectedDate, reminders, currentReminder, hours, colors }
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [dateToAdd, setDateToAdd] = useState(null)
  const [errors, setErrors] = useState(null)
  const [viewReminder, setViewReminder] = useState(false)

  const [formValues, handleInputChange, reset] = useForm({
    description: '',
    color: '',
    city: '',
    time: '',
  })
  const { description, color, city, time } = formValues
  const dispatch = useDispatch()

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>
            {format(currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  const onDateClick = day => {
    console.log('day', day)
    dispatch({ type: SELECT_DAY, payload: day })
  };

  const nextMonth = () => {
    dispatch({ type: SET_NEXT_MONTH, payload: addMonths(currentMonth, 1) })
  };

  const prevMonth = () => {
    dispatch({ type: SET_PREV_MONTH, payload: subMonths(currentMonth, 1) })
  };

  const renderDialog = (e) => {
    return (
      <Dialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        className="add-reminder-modal"
      >
        <DialogActions>
          <form onSubmit={addReminder}>
            <label htmlFor='description'>
              Description
            </label>
            <input 
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange} 
              required
            />
            <label htmlFor='city'>
              City
            </label>
            <input 
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={handleInputChange} 
              required
            />
            <label htmlFor='unit'>Color</label>
            <select
              type='text'
              name='color'
              id='color'
              value={color}
              onChange={handleInputChange}
              required
            >
              <option>Choose color</option>
              {!!colors &&
                colors.length > 0 &&
                colors.map((color) => {
                  return (
                    <option 
                      value={color.name} 
                      key={color.name}
                      style={{ backgroundColor: color.color }}
                    >
                      {color.name}
                    </option>
                  )
                })}
            </select>
            <label htmlFor='unit'>Time</label>
            <select
              type='text'
              name='time'
              id='time'
              value={time}
              onChange={handleInputChange}
              required
            >
              <option>Choose time</option>
              {!!hours &&
                hours.length > 0 &&
                hours.map((hour) => {
                  return (
                    <option 
                      value={hour.replace(':', '')} 
                      key={hour}
                    >
                      {hour}
                    </option>
                  )
                })}
            </select>
            {errors && <p className="contentInput__error">{errors}</p>}
            <button type="submit">
              Add reminder
            </button>
          </form>
        </DialogActions>
      </Dialog>
    )
  }

  const renderReminderDialog = () => {
    return (
      <Reminder 
        reminder={currentReminder}
        open={viewReminder}
        setOpen={setViewReminder}
      />
    )
  }

  const launchDialog = (e) => {
    
    console.log('e', e)
    reset()
    setOpenDialog(true);
    setDateToAdd(e)
  }

  const addReminder = async (e) => {
    e.preventDefault()

    setErrors(null)
    
    const errs = validateForm(formValues)
    setErrors(errs)
    
    if (!errs) {

      const { data } = await axios({
        baseURL: `https://api.openweathermap.org`,
        url: `/data/2.5/forecast/daily?q=${formValues.city}&cnt=16&appid=${process.env.REACT_APP_API_KEY}`,
        method: 'GET',
      })

      const dateDiff = new Date(dateToAdd).getDate() - new Date().getDate()

      const newReminder = {
        ...formValues,
        id: uuidv4(),
        date: dateToAdd.toString(),
        forecast: `${data.list[dateDiff].weather[0].description}`,
        temperature: `${Math.floor(data.list[dateDiff].temp.day - 273)}`
      }
  
      dispatch({type: SET_REMINDER, payload: newReminder })
      setOpenDialog(false)
    }
    
    
  }

  const showReminder = (reminder) => {
    console.log('mostrar reminder', reminder)
    setViewReminder(true)
    dispatch({ type: SET_CURRENT_REMINDER, payload: reminder })
  }

  const orderReminders = (reminders) => {
    if (reminders.length < 2) return reminders

    let orderedReminders = []
    let parsedTime = reminders.map(reminder => {
      reminder.time = parseInt(reminder.time)
      return reminder
    })

    orderedReminders = parsedTime.sort((a, b) => a.time - b.time)
    return orderedReminders
  }

  const renderCells = () => {
    //const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthStart = startOfMonth(currentMonth);
    //const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    console.log('startDate', startDate)
    const endDate = endOfWeek(monthEnd);
    //const startDate = new Date(monthStart.setDate(monthStart.getDate() - monthStart.getDay()))
    //const endDate = new Date(monthEnd.setDate(monthEnd.getDate() + 6 - monthEnd.getDay()))

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
          >
            <span 
              className="number"
              onClick={() => onDateClick(parse(cloneDay, 'yyyy-MMMM-dd', new Date()))}
            >{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {new Date(cloneDay) >= new Date() && isSameMonth(day, monthStart) &&
              <IconButton 
                style={{ padding: '0px' }} 
                onClick={() => launchDialog(cloneDay)}
                title='Add reminder'
              >
                <ControlPointIcon
                  className='add-remainder-icon'
                  style={{ color: 'grey', fontSize: '1.5rem' }}
                />
              </IconButton>}
            {reminders[cloneDay] && reminders[cloneDay].length > 0 && orderReminders(reminders[cloneDay]).map(reminder => {
              if (reminder.date === cloneDay.toString()) {
                console.log('recordatorio', reminder)
                return (
                  <div 
                    className="reminder-outer-div"
                    onClick={showReminder.bind(this, reminder)}
                    style={{
                      backgroundColor: reminder.color,
                      margin: 0
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
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  }

  
  console.log('reminders', reminders)
  console.log('currentReminder', currentReminder)

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderDialog()}
      {renderReminderDialog()}
    </div>
  )
}