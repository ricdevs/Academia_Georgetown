export const BOOKING_DURATION_MIN = 30;
export const BOOKING_TZ = 'Europe/Madrid';
export const BOOKING_SLOTS = ['10:00', '11:30', '16:00', '17:30'] as const;
export const BOOKING_TITLE = 'Prueba de nivel presencial — Academia Georgetown';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function localParts(date: string, time: string, extraMinutes = 0): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const stamp = new Date(year, month - 1, day, hours, minutes);
  stamp.setMinutes(stamp.getMinutes() + extraMinutes);
  return `${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}T${pad(stamp.getHours())}${pad(stamp.getMinutes())}00`;
}

export function googleCalendarUrl(options: {
  date: string;
  time: string;
  title?: string;
  details: string;
  location: string;
}): string {
  const start = localParts(options.date, options.time);
  const end = localParts(options.date, options.time, BOOKING_DURATION_MIN);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: options.title || BOOKING_TITLE,
    dates: `${start}/${end}`,
    details: options.details,
    location: options.location,
    ctz: BOOKING_TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function weekdayDates(count = 15, from = new Date()): string[] {
  const dates: string[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
  while (dates.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(
        `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`,
      );
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}
