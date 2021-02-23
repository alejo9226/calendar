export function validateForm (values) {
  let errors = ''

  if (values.description.length > 30) {
    errors = `Description must be shorter than 30 chars. Current length ${values.description.length}.`
  }

  if (new Date(values.date) < new Date()) {
    errors = `The earliest date to create a reminder is today`
  }
  
  if (new Date(values.date).getDate() === new Date().getDate()) {
    if (parseInt(values.time.toString().substr(0, 2)) < new Date().getHours() + 2 && new Date().getHours() > 19) {
      errors = `Try adding a reminder tomorrow`
    } else if (parseInt(values.time.toString().substr(0, 2)) < new Date().getHours() + 2) {
      errors = `You can add reminders from ${new Date().getHours() + 2}:00 onwards`
    }
  }

  return errors
}