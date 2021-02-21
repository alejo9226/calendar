import { Dialog, DialogContent, DialogTitle } from "@material-ui/core"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { EDIT_REMINDER } from "../store/calendarReducer"
import { formatShortDate } from '../utils/formatDate'
import { useForm } from "../utils/hooks/useForm"
import { validateForm } from "../utils/validations"
import EditReminder from "./EditReminder"
import ViewReminder from "./ViewReminder"

export default function Reminder ({ open, setOpen }) {
  
  const [editMode, setEditMode] = useState(false)
  const [errors, setErrors] = useState(null)

  const dispatch = useDispatch()

  const editReminder = async (reminder) => {

    setErrors(null)

    const { data } = await axios({
      baseURL: `https://api.openweathermap.org`,
      url: `/data/2.5/forecast/daily?q=${reminder.city}&cnt=16&appid=${process.env.REACT_APP_API_KEY}`,
      method: 'GET',
    })

    const dateDiff = new Date(reminder.date).getDate() - new Date().getDate()

    const newReminder = {
      ...reminder,
      date: reminder.date.toString(),
      forecast: `${data.list[dateDiff].weather[0].description}`,
      temperature: `${Math.floor(data.list[dateDiff].temp.day - 273)}`
    }
    console.log('newReminder', newReminder)
    //dispatch({type: EDIT_REMINDER, payload: newReminder })
    
    
  }

 

    if (!editMode) {
      return (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
          <ViewReminder 
            open={open}
            setOpen={setOpen}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        </Dialog>
      )
    } else {
      return (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
          <EditReminder 
            open={open}
            setOpen={setOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            editReminder={editReminder}
          />
        </Dialog>
      )
    }
}