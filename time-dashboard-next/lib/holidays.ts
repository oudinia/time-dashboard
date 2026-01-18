// API client for holidays with caching

export interface Holiday {
  name: string;
  date: string;
  type: string;
}

export interface HolidaysResponse {
  country: string;
  holidays: Holiday[];
}

export interface CountriesResponse {
  countries: Array<{ code: string; name: string }>;
}

export interface NextHoliday {
  name: string;
  date: Date;
  daysUntil: number;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

export async function getHolidays(countryCode: string): Promise<Holiday[]> {
  try {
    const response = await fetchWithCache<HolidaysResponse>(
      `/api/holidays/${countryCode}?years=5`
    );
    return response.holidays;
  } catch (error) {
    console.error(`Failed to fetch holidays for ${countryCode}:`, error);
    return [];
  }
}

export async function getCountries(): Promise<Array<{ code: string; name: string }>> {
  try {
    const response = await fetchWithCache<CountriesResponse>(
      '/api/holidays/countries'
    );
    return response.countries;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return [];
  }
}

export function getNextHoliday(holidays: Holiday[], referenceDate?: Date): NextHoliday | null {
  const now = referenceDate || new Date();

  const futureHolidays = holidays
    .map((h) => ({
      name: h.name,
      date: new Date(h.date),
    }))
    .filter((h) => h.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (futureHolidays.length === 0) {
    return null;
  }

  const nextHoliday = futureHolidays[0];
  const diffTime = nextHoliday.date.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    name: nextHoliday.name,
    date: nextHoliday.date,
    daysUntil,
  };
}

export function formatHolidayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// All countries grouped by continent
export const COUNTRIES_BY_CONTINENT: Record<string, Array<{ code: string; name: string }>> = {
  'North America': [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'CU', name: 'Cuba' },
    { code: 'HT', name: 'Haiti' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'HN', name: 'Honduras' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'PA', name: 'Panama' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BZ', name: 'Belize' },
    { code: 'PR', name: 'Puerto Rico' },
  ],
  'South America': [
    { code: 'BR', name: 'Brazil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'CL', name: 'Chile' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'GY', name: 'Guyana' },
    { code: 'SR', name: 'Suriname' },
  ],
  'Europe': [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PL', name: 'Poland' },
    { code: 'RO', name: 'Romania' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'GR', name: 'Greece' },
    { code: 'PT', name: 'Portugal' },
    { code: 'SE', name: 'Sweden' },
    { code: 'HU', name: 'Hungary' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'NO', name: 'Norway' },
    { code: 'IE', name: 'Ireland' },
    { code: 'HR', name: 'Croatia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'LV', name: 'Latvia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MT', name: 'Malta' },
    { code: 'IS', name: 'Iceland' },
    { code: 'AL', name: 'Albania' },
    { code: 'RS', name: 'Serbia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'MD', name: 'Moldova' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'BY', name: 'Belarus' },
    { code: 'RU', name: 'Russia' },
    { code: 'MC', name: 'Monaco' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'AD', name: 'Andorra' },
    { code: 'SM', name: 'San Marino' },
    { code: 'VA', name: 'Vatican City' },
  ],
  'Asia': [
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'JP', name: 'Japan' },
    { code: 'PH', name: 'Philippines' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'TR', name: 'Turkey' },
    { code: 'IR', name: 'Iran' },
    { code: 'TH', name: 'Thailand' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'KR', name: 'South Korea' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'AF', name: 'Afghanistan' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'NP', name: 'Nepal' },
    { code: 'YE', name: 'Yemen' },
    { code: 'KP', name: 'North Korea' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'SY', name: 'Syria' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'JO', name: 'Jordan' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'IL', name: 'Israel' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'LA', name: 'Laos' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'OM', name: 'Oman' },
    { code: 'PS', name: 'Palestine' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'GE', name: 'Georgia' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'AM', name: 'Armenia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'MO', name: 'Macau' },
    { code: 'MV', name: 'Maldives' },
  ],
  'Africa': [
    { code: 'NG', name: 'Nigeria' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'EG', name: 'Egypt' },
    { code: 'CD', name: 'DR Congo' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'SD', name: 'Sudan' },
    { code: 'MA', name: 'Morocco' },
    { code: 'AO', name: 'Angola' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'GH', name: 'Ghana' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CI', name: 'Ivory Coast' },
    { code: 'NE', name: 'Niger' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'ML', name: 'Mali' },
    { code: 'MW', name: 'Malawi' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'TD', name: 'Chad' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'GN', name: 'Guinea' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BI', name: 'Burundi' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'TG', name: 'Togo' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'LY', name: 'Libya' },
    { code: 'CG', name: 'Congo' },
    { code: 'LR', name: 'Liberia' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'NA', name: 'Namibia' },
    { code: 'GM', name: 'Gambia' },
    { code: 'BW', name: 'Botswana' },
    { code: 'GA', name: 'Gabon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'SC', name: 'Seychelles' },
  ],
  'Oceania': [
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'WS', name: 'Samoa' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'TO', name: 'Tonga' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'PW', name: 'Palau' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'NR', name: 'Nauru' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'GU', name: 'Guam' },
  ],
};

// Flat list for backwards compatibility
export const COMMON_COUNTRIES = Object.values(COUNTRIES_BY_CONTINENT).flat();
