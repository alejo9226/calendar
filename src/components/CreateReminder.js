import { Dialog, DialogContent, DialogTitle, setRef } from "@material-ui/core"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatShortDate, formatTime } from '../utils/formatDate'
import { useForm } from "../utils/hooks/useForm"
import { validateForm } from "../utils/validations"
import { v4 as uuidv4 } from 'uuid'
import { createReminder, SET_REMINDER } from "../store/calendarReducer"

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
      setOpen(false)
      dispatch(createReminder(formValues, dateToAdd))
    }
  }

  return (
    <div className="view-modal">
      <div>
        <span className="modal__title">Reminder Details</span>
      </div>
      <div>
        <form onSubmit={addReminder} data-testid='create-reminder' style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              padding: '0 5px'
            }}
          >
            <div
              style={{
                display: 'flex',
                marginRight: '10px',
                
              }}
            >
              <label htmlFor='city' className="key">
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
            </div>
            <div
              style={{
                display: 'flex',
                marginRight: '10px',
                
              }}
            >
              <label htmlFor='color' className="key">Color</label>
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
            </div>
            <div
              style={{
                display: 'flex',
              }}
            >
              <label htmlFor='time' className="key">Time</label>
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
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: '20px',
              marginBottom: '15px',
              padding: '0 5px'
            }}
          >
            <div
             style={{
               display: 'flex',
               flex: 1 
             }}
            >
              <label htmlFor='description' className="key">
                Description
              </label>
              <input 
                style={{
                  width: '100%'
                }}
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={handleInputChange} 
                required
              />
            </div>
          </div>
          {errors && <p className="contentInput__error">{errors}</p>}
          <button type="submit" className="create__button">
            Add reminder
          </button>
        </form>
      </div>
    </div>
  )
}