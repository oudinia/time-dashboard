import type { DateTime } from 'luxon';
import type {
  DisplayBindings,
  DisplayConfig,
  DataField,
  ResolvedDataItem,
} from '@/types/widget-spec';
import type { TimeZoneSlot } from '@/types/timezone';
import { getTimezoneAbbreviation, getTimezoneOffset, formatDate } from '@/lib/timezone';
import { getNextHoliday } from '@/lib/holidays';

/**
 * Build resolved data from a timezone slot and current time
 */
export function resolveTimezoneData(
  slot: TimeZoneSlot,
  time: DateTime,
  timeFormat: '12h' | '24h',
  showSeconds: boolean
): ResolvedDataItem {
  const timeFormatString =
    timeFormat === '12h'
      ? showSeconds
        ? 'hh:mm:ss a'
        : 'hh:mm a'
      : showSeconds
      ? 'HH:mm:ss'
      : 'HH:mm';

  // Calculate working hours status
  let isWorkingTime = false;
  let hoursUntilStart: number | null = null;
  let hoursUntilEnd: number | null = null;

  if (slot.workingHours) {
    const [startHour, startMin] = slot.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = slot.workingHours.end.split(':').map(Number);
    const currentMinutes = time.hour * 60 + time.minute;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    isWorkingTime = currentMinutes >= startMinutes && currentMinutes < endMinutes;

    if (!isWorkingTime && currentMinutes < startMinutes) {
      hoursUntilStart = Math.ceil((startMinutes - currentMinutes) / 60);
    }
    if (isWorkingTime) {
      hoursUntilEnd = Math.ceil((endMinutes - currentMinutes) / 60);
    }
  }

  // Get holiday info
  const nextHolidayInfo = slot.country ? getNextHoliday(slot.country) : null;

  return {
    time: time.toFormat(timeFormatString),
    date: formatDate(time),
    timezone: slot.timezone,
    label: slot.label,
    country: slot.country || '',
    color: slot.color || '#3B82F6',
    offset: getTimezoneOffset(slot.timezone),
    abbreviation: getTimezoneAbbreviation(slot.timezone),
    workingHours: slot.workingHours || null,
    isWorkingTime,
    hoursUntilStart,
    hoursUntilEnd,
    nextHoliday: nextHolidayInfo?.name || null,
    daysUntilHoliday: nextHolidayInfo?.daysUntil ?? null,
    holidays: [], // Could be populated with upcoming holidays if needed
  };
}

/**
 * Resolve bindings for a display component
 * Maps binding field names to actual data values
 */
export function resolveBindings(
  bindings: DisplayBindings | undefined,
  data: ResolvedDataItem
): Record<string, unknown> {
  if (!bindings) {
    return {};
  }

  const resolved: Record<string, unknown> = {};

  for (const [propName, fieldName] of Object.entries(bindings)) {
    // Check if it's a data field or a static string
    const dataField = fieldName as DataField;
    if (dataField in data) {
      resolved[propName] = data[dataField as keyof ResolvedDataItem];
    } else {
      // It's a static string value
      resolved[propName] = fieldName;
    }
  }

  return resolved;
}

/**
 * Get all available data fields for documentation
 */
export const availableDataFields: DataField[] = [
  'time',
  'date',
  'timezone',
  'label',
  'country',
  'color',
  'offset',
  'abbreviation',
  'workingHours',
  'isWorkingTime',
  'hoursUntilStart',
  'hoursUntilEnd',
  'nextHoliday',
  'daysUntilHoliday',
  'holidays',
];

/**
 * Resolve static content from a display config
 */
export function resolveStaticContent(
  config: DisplayConfig,
  data: ResolvedDataItem
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  // Handle static content
  if (config.content !== undefined) {
    resolved.content = config.content;
  }

  // Handle icon
  if (config.icon !== undefined) {
    resolved.icon = config.icon;
  }

  // Resolve bindings
  if (config.bindings) {
    Object.assign(resolved, resolveBindings(config.bindings, data));
  }

  return resolved;
}
