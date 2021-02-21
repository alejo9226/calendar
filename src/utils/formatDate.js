export const formatShortDate = (date) => {
  const newDate = new Date(date);
  const options = {
    weekday: 'long',
    year: "2-digit",
    month: "long",
    day: "numeric",
  };
  const formatDate = newDate.toLocaleDateString("en-US", options);
  return formatDate;
}

export const formatTime = (time) => {
  if (time.toString().length === 4) {
    return `${time.toString().substr(0, 2)}:${time.toString().substr(time.toString().length - 2)}`    
  } else {
    return `0${time.toString().charAt(0)}:${time.toString().substr(time.toString().length - 2)}`
  }
}