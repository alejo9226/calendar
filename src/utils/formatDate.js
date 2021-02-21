export const formatShortDate = (date) => {
  date += 'Z' 
  const newDate = new Date(date);
  const options = {
    weekday: 'long',
    year: "2-digit",
    month: "long",
    day: "numeric",
  };
  const formatDate = newDate.toLocaleDateString("en-US", options);
  return formatDate;
};