const minuteInSeconds: number = 60;
const hourInSeconds: number = 3600;
const dayInSeconds: number = 86400;

function convertSeconds(seconds: number): string {
  // return seconds
  if (seconds < minuteInSeconds) {
    return `${seconds} secs`;
  }
  // return minutes
  else if (seconds >= minuteInSeconds && seconds < hourInSeconds) {
    return `${Math.floor(seconds / 60)} mins`;
  }
  // return hours
  else if (seconds >= hourInSeconds && seconds < dayInSeconds) {
    return `${Math.floor(seconds / hourInSeconds)} hrs`;
  }
  // return days
  else if (seconds >= dayInSeconds) {
    return `${Math.round(Math.floor(seconds) / dayInSeconds)} days`;
  } else {
    return "unknown";
  }
}

export { convertSeconds };
