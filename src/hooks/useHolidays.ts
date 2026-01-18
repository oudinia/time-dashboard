import { useState, useEffect, useCallback } from 'react';
import { fetchHolidays, getNextHoliday, preloadHolidays } from '@/lib/holidays';
import type { Holiday, NextHoliday } from '@/lib/holidays';

/**
 * Hook to fetch and manage holidays for a single country
 */
export function useHolidays(countryCode: string | undefined) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [nextHoliday, setNextHoliday] = useState<NextHoliday | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!countryCode) {
      setHolidays([]);
      setNextHoliday(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchHolidays(countryCode)
      .then((data) => {
        if (!cancelled) {
          setHolidays(data);
          setNextHoliday(getNextHoliday(countryCode));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  // Refresh next holiday calculation periodically
  useEffect(() => {
    if (!countryCode) return;

    const interval = setInterval(() => {
      setNextHoliday(getNextHoliday(countryCode));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [countryCode]);

  return { holidays, nextHoliday, loading, error };
}

/**
 * Hook to fetch holidays for multiple countries at once
 */
export function useMultipleHolidays(countryCodes: string[]) {
  const [holidaysMap, setHolidaysMap] = useState<Record<string, Holiday[]>>({});
  const [nextHolidaysMap, setNextHolidaysMap] = useState<Record<string, NextHoliday | null>>({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (countryCodes.length === 0) {
      setHolidaysMap({});
      setNextHolidaysMap({});
      return;
    }

    setLoading(true);

    try {
      await preloadHolidays(countryCodes);

      const newHolidaysMap: Record<string, Holiday[]> = {};
      const newNextHolidaysMap: Record<string, NextHoliday | null> = {};

      for (const code of countryCodes) {
        const holidays = await fetchHolidays(code);
        newHolidaysMap[code] = holidays;
        newNextHolidaysMap[code] = getNextHoliday(code);
      }

      setHolidaysMap(newHolidaysMap);
      setNextHolidaysMap(newNextHolidaysMap);
    } finally {
      setLoading(false);
    }
  }, [countryCodes]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Refresh next holiday calculations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNextHolidaysMap: Record<string, NextHoliday | null> = {};
      for (const code of countryCodes) {
        newNextHolidaysMap[code] = getNextHoliday(code);
      }
      setNextHolidaysMap(newNextHolidaysMap);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [countryCodes]);

  return {
    holidaysMap,
    nextHolidaysMap,
    loading,
    refresh,
    getNextHoliday: (countryCode: string) => nextHolidaysMap[countryCode] || null,
  };
}
