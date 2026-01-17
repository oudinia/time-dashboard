import Holidays from 'date-holidays';

export interface NextHoliday {
  name: string;
  date: Date;
  daysUntil: number;
}

const holidayInstances = new Map<string, Holidays>();

function getHolidayInstance(country: string): Holidays {
  if (!holidayInstances.has(country)) {
    const hd = new Holidays(country);
    holidayInstances.set(country, hd);
  }
  return holidayInstances.get(country)!;
}

export function getNextHoliday(country: string, referenceDate?: Date): NextHoliday | null {
  try {
    const hd = getHolidayInstance(country);
    const now = referenceDate || new Date();
    const year = now.getFullYear();

    // Get holidays for current year and next year
    const currentYearHolidays = hd.getHolidays(year) || [];
    const nextYearHolidays = hd.getHolidays(year + 1) || [];

    // Combine and filter to only public holidays
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays]
      .filter(h => h.type === 'public')
      .map(h => ({
        name: h.name,
        date: new Date(h.date),
      }))
      .filter(h => h.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (allHolidays.length === 0) {
      return null;
    }

    const nextHoliday = allHolidays[0];
    const diffTime = nextHoliday.date.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      name: nextHoliday.name,
      date: nextHoliday.date,
      daysUntil,
    };
  } catch {
    return null;
  }
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
    day: 'numeric'
  });
}
