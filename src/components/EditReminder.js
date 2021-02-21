import { Dialog, DialogContent, DialogTitle } from "@material-ui/core"
import { useState } from "react"
import { useSelector } from "react-redux"
import { formatShortDate } from '../utils/formatDate'
import { useForm } from "../utils/hooks/useForm"
import { validateForm } from "../utils/validations"

export default function EditReminder ({ editReminder, reminder, open, setOpen }) {
  const { hours, colors, currentReminder } = useSelector(({ calendarReducer: { hours, colors, currentReminder } }) => {
    return { hours, colors, currentReminder }
  })
  const [formValues, handleInputChange, reset] = useForm({
    description: currentReminder.description,
    color: currentReminder.color,
    city: currentReminder.city,
    date: currentReminder.date,
    time: currentReminder.time,
  })
 
  const { description, color, city, date, time } = formValues
  const [errors, setErrors] = useState(null)

  const updateReminder = (e) => {
    e.preventDefault()
    
    setErrors(null)
    
    const errs = validateForm(formValues)
    setErrors(errs)
    
    if (!errs) {
      editReminder({...formValues, id: currentReminder.id})
      reset()
    }
  }

  return (
    <form className="view-modal" onSubmit={updateReminder}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span className="modal__title">Reminder Details</span>
        </div>
        <div>
          <input 
            className="city"
            type="text"
            id="city"
            name="city"
            value={city}
            onChange={handleInputChange} 
            required
          />
          <span>{currentReminder?.forecast}</span>
        </div>
        <div>
          <span className="temp">{`${currentReminder?.temperature}°`}</span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '5px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '0 10px',
            marginTop: '20px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline'
            }}
          >
            <span className="key">Date</span>
            <input 
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={handleInputChange} 
              required
            />
          </div>
          <div
            style={{
              display: 'flex',
              width: 'auto',
              alignItems: 'baseline'
            }}
          >
          <span className="key">Time</span>
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
                      {hour.length === 3 ? `${hour.charAt(0)}:${hour.substr(hour.length - 2)}` : `${hour.substr(0, 2)}:${hour.substr(hour.length - 2)}`}
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
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            padding: '0 10px',
            marginTop: '10px'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'baseline',
              margin: '10px 0',
            }}
          >
            <span className="key">Description</span>
            <input 
              className="value__description__input"
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange} 
              required
            />
           
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'baseline',
            }}
          >
            <span className="key">Color</span>
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
          <button className="edit__button" type="submit">Actualizar</button>
          {errors && <p className="contentInput__error">{errors}</p>}
        </div>
      </div>
    </form>)

 
}