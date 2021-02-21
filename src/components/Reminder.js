import { Dialog } from "@material-ui/core"
import axios from "axios"
import { parseISO } from "date-fns"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { EDIT_REMINDER } from "../store/calendarReducer"
import CreateReminder from "./CreateReminder"
import EditReminder from "./EditReminder"
import ViewReminder from "./ViewReminder"

export default function Reminder ({ open, dateToAdd, setOpen, setOpenDialog, viewReminderMode, setViewReminderMode }) {
  
  const [editMode, setEditMode] = useState(false)
  const [createMode, setCreateMode] = useState(false)
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
      date: parseISO(reminder.date).toString(),
      forecast: `${data.list[dateDiff].weather[0].description}`,
      temperature: `${Math.floor(data.list[dateDiff].temp.day - 273)}`
    }
    dispatch({type: EDIT_REMINDER, payload: newReminder })
    closeModal()
  }

  const closeModal = () => {
    setViewReminderMode('')
    setOpen(false)
    setEditMode(false)
  }
    return (
      <Dialog
        open={open}
        onClose={() => closeModal()}
      >
        {viewReminderMode === 'Create' ? 
          <CreateReminder 
            open={open}
            setOpen={setOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            dateToAdd={dateToAdd}
            setOpenDialog={setOpenDialog}
          /> : viewReminderMode === 'View' ? 
          <ViewReminder 
            open={open}
            setOpen={setOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            dateToAdd={dateToAdd}
            setOpenDialog={setOpenDialog}
            setViewReminderMode={setViewReminderMode}
          /> : viewReminderMode === 'Edit' ? 
          <EditReminder 
            open={open}
            setOpen={setOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            dateToAdd={dateToAdd}
            setOpenDialog={setOpenDialog}
            editReminder={editReminder}
          /> : ''}
      </Dialog>
    )
    
   
}