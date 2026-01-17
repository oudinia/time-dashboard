import { DateTime } from 'luxon';

export function getCurrentTimeInTimezone(timezone: string): DateTime {
  return DateTime.now().setZone(timezone);
}

export function formatTime(dt: DateTime, format: 'short' | 'medium' | 'long' = 'short'): string {
  switch (format) {
    case 'short':
      return dt.toFormat('HH:mm');
    case 'medium':
      return dt.toFormat('hh:mm a');
    case 'long':
      return dt.toFormat('hh:mm:ss a');
    default:
      return dt.toFormat('HH:mm');
  }
}

export function formatDate(dt: DateTime): string {
  return dt.toFormat('EEE, MMM d');
}

export function getTimezoneOffset(timezone: string): string {
  const dt = DateTime.now().setZone(timezone);
  const offset = dt.offset;
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
}

export function getTimezoneAbbreviation(timezone: string): string {
  const dt = DateTime.now().setZone(timezone);
  return dt.offsetNameShort || getTimezoneOffset(timezone);
}

export function parseTimeString(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(':').map(Number);
  return { hour, minute };
}

export function isWorkingDay(timezone: string, workingDays: number[]): boolean {
  const dt = getCurrentTimeInTimezone(timezone);
  return workingDays.includes(dt.weekday);
}

export function isWithinWorkingHours(
  timezone: string,
  startTime: string,
  endTime: string,
  workingDays: number[]
): boolean {
  const now = getCurrentTimeInTimezone(timezone);

  if (!isWorkingDay(timezone, workingDays)) {
    return false;
  }

  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);

  const currentMinutes = now.hour * 60 + now.minute;
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export function getLocalTimezone(): string {
  return DateTime.local().zoneName || 'UTC';
}

export const COMMON_TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Sao_Paulo', label: 'Brasilia Time (São Paulo)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (Mumbai)' },
  { value: 'Asia/Singapore', label: 'Singapore Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
];
