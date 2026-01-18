import { useState, useEffect } from 'react';
import { fetchWeather, getCoordinatesForTimezone, WeatherData } from '@/lib/weather';

export function useWeather(
  timezone: string,
  customCoordinates?: { lat: number; lng: number }
): WeatherData | null {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const coords = customCoordinates || getCoordinatesForTimezone(timezone);
    if (!coords) return;

    let mounted = true;

    fetchWeather(coords.lat, coords.lng).then((data) => {
      if (mounted && data) {
        setWeather(data);
      }
    });

    // Refresh weather every 15 minutes
    const interval = setInterval(() => {
      fetchWeather(coords.lat, coords.lng).then((data) => {
        if (mounted && data) {
          setWeather(data);
        }
      });
    }, 15 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [timezone, customCoordinates?.lat, customCoordinates?.lng]);

  return weather;
}

export function useMultipleWeather(
  timezones: string[],
  coordinatesMap?: Record<string, { lat: number; lng: number }>
): Record<string, WeatherData | null> {
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData | null>>({});

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      const results: Record<string, WeatherData | null> = {};

      await Promise.all(
        timezones.map(async (tz) => {
          const coords = coordinatesMap?.[tz] || getCoordinatesForTimezone(tz);
          if (coords) {
            const data = await fetchWeather(coords.lat, coords.lng);
            results[tz] = data;
          } else {
            results[tz] = null;
          }
        })
      );

      if (mounted) {
        setWeatherMap(results);
      }
    };

    fetchAll();

    const interval = setInterval(fetchAll, 15 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [timezones.join(','), JSON.stringify(coordinatesMap)]);

  return weatherMap;
}
