'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getHolidays,
  getNextHoliday,
  type Holiday,
  type NextHoliday,
} from '@/lib/holidays';

interface UseHolidaysResult {
  holidays: Holiday[];
  nextHoliday: NextHoliday | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Global cache to share data between hook instances
const holidayCache = new Map<string, Holiday[]>();

export function useHolidays(countryCode: string | undefined): UseHolidaysResult {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHolidays = useCallback(async () => {
    if (!countryCode) {
      setHolidays([]);
      return;
    }

    // Check cache first
    const cached = holidayCache.get(countryCode);
    if (cached) {
      setHolidays(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getHolidays(countryCode);
      holidayCache.set(countryCode, data);
      setHolidays(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch holidays'));
    } finally {
      setIsLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const nextHoliday = countryCode ? getNextHoliday(holidays) : null;

  return {
    holidays,
    nextHoliday,
    isLoading,
    error,
    refetch: fetchHolidays,
  };
}

// Hook for multiple countries at once
export function useMultipleHolidays(
  countryCodes: string[]
): Map<string, UseHolidaysResult> {
  const [results, setResults] = useState<Map<string, UseHolidaysResult>>(
    new Map()
  );

  useEffect(() => {
    const fetchAll = async () => {
      const newResults = new Map<string, UseHolidaysResult>();

      for (const code of countryCodes) {
        if (!code) continue;

        // Check cache first
        const cached = holidayCache.get(code);
        if (cached) {
          newResults.set(code, {
            holidays: cached,
            nextHoliday: getNextHoliday(cached),
            isLoading: false,
            error: null,
            refetch: () => {},
          });
          continue;
        }

        try {
          const data = await getHolidays(code);
          holidayCache.set(code, data);
          newResults.set(code, {
            holidays: data,
            nextHoliday: getNextHoliday(data),
            isLoading: false,
            error: null,
            refetch: () => {},
          });
        } catch (e) {
          newResults.set(code, {
            holidays: [],
            nextHoliday: null,
            isLoading: false,
            error: e instanceof Error ? e : new Error('Failed to fetch'),
            refetch: () => {},
          });
        }
      }

      setResults(newResults);
    };

    if (countryCodes.length > 0) {
      fetchAll();
    }
  }, [countryCodes]);

  return results;
}
