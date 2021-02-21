import { Dialog, DialogContent, DialogTitle, setRef } from "@material-ui/core"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatShortDate, formatTime } from '../utils/formatDate'
import { useForm } from "../utils/hooks/useForm"
import { validateForm } from "../utils/validations"
import { v4 as uuidv4 } from 'uuid'
import { SET_REMINDER } from "../store/calendarReducer"

export default function CreateReminder ({ dateToAdd, open, setOpen, setOpenDialog, setEditMode }) {
  const dispatch = useDispatch()
  const { hours, colors, currentReminder } = useSelector(({ calendarReducer: { hours, colors, currentReminder } }) => {
    return { hours, colors, currentReminder }
  })
  const [errors, setErrors] = useState(null)

  const [formValues, handleInputChange, reset] = useForm({
    description: '',
    color: '',
    city: '',
    time: '',
  })
  const { description, color, city, time } = formValues

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
      setOpen(false)
    }
    
    
  }

  return (
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
                value={hour} 
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
  )
}