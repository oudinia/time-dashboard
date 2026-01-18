// Holiday data fetched from API (seeded from date-holidays package)
// The date-holidays package is only used during database seeding, not at runtime

export interface Holiday {
  name: string;
  date: string;
  type: string;
}

export interface NextHoliday {
  name: string;
  date: Date;
  daysUntil: number;
}

// Cache for holiday data
const holidayCache = new Map<string, { holidays: Holiday[]; fetchedAt: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// API base URL - configurable for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Fetch holidays for a country from the API
 */
export async function fetchHolidays(countryCode: string): Promise<Holiday[]> {
  const cacheKey = countryCode.toUpperCase();
  const cached = holidayCache.get(cacheKey);

  // Return cached data if fresh
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) {
    return cached.holidays;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/holidays/${cacheKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.statusText}`);
    }

    const data = await response.json();
    const holidays: Holiday[] = data.holidays || [];

    // Cache the result
    holidayCache.set(cacheKey, { holidays, fetchedAt: Date.now() });

    return holidays;
  } catch (error) {
    console.error(`Error fetching holidays for ${countryCode}:`, error);
    // Return cached data even if stale, or empty array
    return cached?.holidays || [];
  }
}

/**
 * Get the next upcoming holiday for a country
 * Uses cached data if available, fetches if needed
 */
export function getNextHoliday(countryCode: string, referenceDate?: Date): NextHoliday | null {
  const cacheKey = countryCode.toUpperCase();
  const cached = holidayCache.get(cacheKey);

  if (!cached || cached.holidays.length === 0) {
    // Trigger async fetch for next time
    fetchHolidays(countryCode);
    return null;
  }

  const now = referenceDate || new Date();

  // Find the next upcoming holiday
  const upcomingHolidays = cached.holidays
    .map((h) => ({
      name: h.name,
      date: new Date(h.date),
    }))
    .filter((h) => h.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (upcomingHolidays.length === 0) {
    return null;
  }

  const nextHoliday = upcomingHolidays[0];
  const diffTime = nextHoliday.date.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    name: nextHoliday.name,
    date: nextHoliday.date,
    daysUntil,
  };
}

/**
 * Preload holidays for multiple countries
 * Call this on app initialization
 */
export async function preloadHolidays(countryCodes: string[]): Promise<void> {
  await Promise.all(countryCodes.map((code) => fetchHolidays(code)));
}

/**
 * Clear the holiday cache
 */
export function clearHolidayCache(): void {
  holidayCache.clear();
}

// Common countries with their codes for the selector
export const COMMON_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SG', name: 'Singapore' },
  { code: 'KR', name: 'South Korea' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'PL', name: 'Poland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'PT', name: 'Portugal' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
];

export function formatHolidayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
