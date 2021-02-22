export function validateForm (values) {
  let errors = ''

  if (values.description.length > 30) {
    errors = `Description must be shorter than 30 chars. Current length ${values.description.length}.`
  }

  if (new Date(values.date) < new Date()) {
    errors = `The earliest date to create a reminder is today`
  }

  return errors
}