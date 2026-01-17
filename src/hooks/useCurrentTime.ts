import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export function useCurrentTime(timezone: string, updateInterval = 1000) {
  const [time, setTime] = useState(() => DateTime.now().setZone(timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(DateTime.now().setZone(timezone));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [timezone, updateInterval]);

  return time;
}

export function useMultipleTimezones(timezones: string[], updateInterval = 1000) {
  const [times, setTimes] = useState<Record<string, DateTime>>(() => {
    const initial: Record<string, DateTime> = {};
    for (const tz of timezones) {
      initial[tz] = DateTime.now().setZone(tz);
    }
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, DateTime> = {};
      for (const tz of timezones) {
        updated[tz] = DateTime.now().setZone(tz);
      }
      setTimes(updated);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [timezones, updateInterval]);

  return times;
}
