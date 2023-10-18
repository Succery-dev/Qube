export const getFormattedDate = (date: string) => {
  const dateObject = new Date(date);
  return `${dateObject.getUTCFullYear()}/${String(dateObject.getUTCMonth()+1).padStart(2, "0")}/${String(dateObject.getUTCDate()).padStart(2, "0")} ${dateObject.getUTCHours()}:${String(dateObject.getUTCMinutes()).padStart(2, "0")}`;
}
