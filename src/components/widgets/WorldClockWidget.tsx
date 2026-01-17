import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { useMultipleTimezones } from '@/hooks/useCurrentTime';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getTimezoneAbbreviation, formatDate } from '@/lib/timezone';
import { TimeZoneSlot } from '@/types/timezone';

interface WorldClockWidgetProps {
  timezoneIds: string[];
}

interface ClockDisplayProps {
  slot: TimeZoneSlot;
  time: DateTime;
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
}

function ClockDisplay({ slot, time, timeFormat, showSeconds }: ClockDisplayProps) {
  const timeFormatString =
    timeFormat === '12h'
      ? showSeconds
        ? 'hh:mm:ss a'
        : 'hh:mm a'
      : showSeconds
      ? 'HH:mm:ss'
      : 'HH:mm';

  const formattedTime = time.toFormat(timeFormatString);
  const timezoneAbbr = getTimezoneAbbreviation(slot.timezone);
  const dateStr = formatDate(time);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: slot.color }}
        />
        <span className="font-medium text-sm truncate max-w-[150px]">{slot.label}</span>
      </div>
      <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {formattedTime}
      </span>
      <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        {timezoneAbbr}
      </span>
      <span className="text-xs text-neutral-400 dark:text-neutral-500">
        {dateStr}
      </span>
    </div>
  );
}

export function WorldClockWidget({ timezoneIds }: WorldClockWidgetProps) {
  const { slots } = useTimezoneStore();
  const { timeFormat, showSeconds } = useSettingsStore();

  const selectedSlots = useMemo(() => {
    return timezoneIds
      .map((id) => slots.find((s) => s.id === id))
      .filter(Boolean) as TimeZoneSlot[];
  }, [timezoneIds, slots]);

  const timezones = useMemo(() => selectedSlots.map((s) => s.timezone), [selectedSlots]);
  const times = useMultipleTimezones(timezones);

  if (selectedSlots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500 p-8">
        <p className="text-center">
          No timezones selected.
          <br />
          <span className="text-sm">Add timezones to this widget to see clocks.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {selectedSlots.map((slot) => (
          <ClockDisplay
            key={slot.id}
            slot={slot}
            time={times[slot.timezone]}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
          />
        ))}
      </div>
    </div>
  );
}
