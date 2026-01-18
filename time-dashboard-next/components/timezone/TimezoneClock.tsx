'use client';

import { useCurrentTime } from '@/hooks/useCurrentTime';
import { useSettingsStore } from '@/stores/settingsStore';
import { getTimezoneAbbreviation, formatDate } from '@/lib/timezone';

interface TimezoneClockProps {
  timezone: string;
  size?: 'sm' | 'md' | 'lg';
  showDate?: boolean;
  showTimezone?: boolean;
}

export function TimezoneClock({
  timezone,
  size = 'md',
  showDate = false,
  showTimezone = true,
}: TimezoneClockProps) {
  const { timeFormat, showSeconds } = useSettingsStore();
  const currentTime = useCurrentTime(timezone);

  const timeFormatString = timeFormat === '12h'
    ? showSeconds ? 'hh:mm:ss a' : 'hh:mm a'
    : showSeconds ? 'HH:mm:ss' : 'HH:mm';

  const formattedTime = currentTime.toFormat(timeFormatString);
  const timezoneAbbr = getTimezoneAbbreviation(timezone);
  const dateStr = formatDate(currentTime);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-mono font-semibold tabular-nums ${sizeClasses[size]}`}
      >
        {formattedTime}
      </span>
      {showTimezone && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {timezoneAbbr}
        </span>
      )}
      {showDate && (
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {dateStr}
        </span>
      )}
    </div>
  );
}
