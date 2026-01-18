// Weather service using Open-Meteo API (free, no API key required)

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
}

// Cache for weather data (15 minute TTL)
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day`
    );

    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }

    const data: OpenMeteoResponse = await response.json();

    const weather: WeatherData = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      isDay: data.current.is_day === 1,
    };

    weatherCache.set(cacheKey, { data: weather, timestamp: Date.now() });
    return weather;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

// WMO Weather interpretation codes
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear',
    1: 'Mostly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ Hail',
    99: 'Severe Thunderstorm',
  };
  return descriptions[code] || 'Unknown';
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  // Sun/Moon based icons
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1) return isDay ? '🌤️' : '🌙';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌧️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

// Common city coordinates mapped by timezone
export const TIMEZONE_COORDINATES: Record<string, { lat: number; lng: number; city: string }> = {
  'America/New_York': { lat: 40.7128, lng: -74.006, city: 'New York' },
  'America/Los_Angeles': { lat: 34.0522, lng: -118.2437, city: 'Los Angeles' },
  'America/Chicago': { lat: 41.8781, lng: -87.6298, city: 'Chicago' },
  'America/Denver': { lat: 39.7392, lng: -104.9903, city: 'Denver' },
  'America/Phoenix': { lat: 33.4484, lng: -112.074, city: 'Phoenix' },
  'America/Toronto': { lat: 43.6532, lng: -79.3832, city: 'Toronto' },
  'America/Vancouver': { lat: 49.2827, lng: -123.1207, city: 'Vancouver' },
  'America/Mexico_City': { lat: 19.4326, lng: -99.1332, city: 'Mexico City' },
  'America/Sao_Paulo': { lat: -23.5505, lng: -46.6333, city: 'São Paulo' },
  'Europe/London': { lat: 51.5074, lng: -0.1278, city: 'London' },
  'Europe/Paris': { lat: 48.8566, lng: 2.3522, city: 'Paris' },
  'Europe/Berlin': { lat: 52.52, lng: 13.405, city: 'Berlin' },
  'Europe/Madrid': { lat: 40.4168, lng: -3.7038, city: 'Madrid' },
  'Europe/Rome': { lat: 41.9028, lng: 12.4964, city: 'Rome' },
  'Europe/Amsterdam': { lat: 52.3676, lng: 4.9041, city: 'Amsterdam' },
  'Europe/Moscow': { lat: 55.7558, lng: 37.6173, city: 'Moscow' },
  'Europe/Istanbul': { lat: 41.0082, lng: 28.9784, city: 'Istanbul' },
  'Asia/Tokyo': { lat: 35.6762, lng: 139.6503, city: 'Tokyo' },
  'Asia/Shanghai': { lat: 31.2304, lng: 121.4737, city: 'Shanghai' },
  'Asia/Hong_Kong': { lat: 22.3193, lng: 114.1694, city: 'Hong Kong' },
  'Asia/Singapore': { lat: 1.3521, lng: 103.8198, city: 'Singapore' },
  'Asia/Seoul': { lat: 37.5665, lng: 126.978, city: 'Seoul' },
  'Asia/Mumbai': { lat: 19.076, lng: 72.8777, city: 'Mumbai' },
  'Asia/Dubai': { lat: 25.2048, lng: 55.2708, city: 'Dubai' },
  'Asia/Bangkok': { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
  'Asia/Jakarta': { lat: -6.2088, lng: 106.8456, city: 'Jakarta' },
  'Australia/Sydney': { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  'Australia/Melbourne': { lat: -37.8136, lng: 144.9631, city: 'Melbourne' },
  'Australia/Perth': { lat: -31.9505, lng: 115.8605, city: 'Perth' },
  'Pacific/Auckland': { lat: -36.8485, lng: 174.7633, city: 'Auckland' },
  'Africa/Cairo': { lat: 30.0444, lng: 31.2357, city: 'Cairo' },
  'Africa/Johannesburg': { lat: -26.2041, lng: 28.0473, city: 'Johannesburg' },
};

export function getCoordinatesForTimezone(timezone: string): { lat: number; lng: number } | null {
  return TIMEZONE_COORDINATES[timezone] || null;
}
