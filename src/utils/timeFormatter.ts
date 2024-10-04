

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

export const TIME_UNITS = {
  second,
  minute,
  hour,
  day,
  week,
  month,
  year,
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < TIME_UNITS.minute) {
    return 'just now';
  } else if (diff < TIME_UNITS.hour) {
    return `${Math.floor(diff / TIME_UNITS.minute)} minutes ago`;
  } else if (diff < TIME_UNITS.day) {
    return `${Math.floor(diff / TIME_UNITS.hour)} hours ago`;
  } else if (diff < TIME_UNITS.week) {
    return `${Math.floor(diff / TIME_UNITS.day)} days ago`;
  } else if (diff < TIME_UNITS.month) {
    return `${Math.floor(diff / TIME_UNITS.week)} weeks ago`;
  } else if (diff < TIME_UNITS.year) {
    return `${Math.floor(diff / TIME_UNITS.month)} months ago`;
  } else {
    return `${Math.floor(diff / TIME_UNITS.year)} years ago`;
  }
};