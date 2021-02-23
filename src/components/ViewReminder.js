import { Dialog, DialogContent, DialogTitle, setRef } from "@material-ui/core"
import { useState } from "react"
import { useSelector } from "react-redux"
import { formatShortDate, formatTime } from '../utils/formatDate'
import { useForm } from "../utils/hooks/useForm"

export default function ViewReminder ({ open, setOpen, setEditMode, setViewReminderMode }) {

  const { currentReminder } = useSelector(({ calendarReducer: { currentReminder } }) => {
    return { currentReminder }
  })
  return (
    <div className="view-modal">
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
          <span className="city">{currentReminder?.city}</span>
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
            marginTop: '20px',
            marginBottom: '10px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline'
            }}
          >
            <span className="key">Date</span>
            <span className="value">{formatShortDate(currentReminder?.date)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              width: 'auto',
              alignItems: 'baseline'
            }}
          >
            <span className="key">Time</span>
            <span 
              className="value"
            >{currentReminder?.time}</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            padding: '0 10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'baseline',
              margin: '10px 0'
            }}
          >
            <span className="key">Description</span>
            <span className="value__description">{currentReminder?.description}</span>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'baseline',
              margin: '0px 0'
            }}
          >
            <span className="key">Color</span>
            <span className="value">{currentReminder?.color}</span>
          </div>
          <button className="edit__button" onClick={() => setViewReminderMode('Edit')}>Editar</button>
        </div>
      </div>
    </div>
  )
}