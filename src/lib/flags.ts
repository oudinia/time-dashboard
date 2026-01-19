// Flag utilities for timezone cards

// US timezone to state code mapping
const US_TIMEZONE_STATES: Record<string, string> = {
  'America/New_York': 'ny',
  'America/Detroit': 'mi',
  'America/Kentucky/Louisville': 'ky',
  'America/Kentucky/Monticello': 'ky',
  'America/Indiana/Indianapolis': 'in',
  'America/Indiana/Vincennes': 'in',
  'America/Indiana/Winamac': 'in',
  'America/Indiana/Marengo': 'in',
  'America/Indiana/Petersburg': 'in',
  'America/Indiana/Vevay': 'in',
  'America/Chicago': 'il',
  'America/Menominee': 'mi',
  'America/North_Dakota/Center': 'nd',
  'America/North_Dakota/New_Salem': 'nd',
  'America/North_Dakota/Beulah': 'nd',
  'America/Denver': 'co',
  'America/Boise': 'id',
  'America/Phoenix': 'az',
  'America/Los_Angeles': 'ca',
  'America/Anchorage': 'ak',
  'America/Juneau': 'ak',
  'America/Sitka': 'ak',
  'America/Metlakatla': 'ak',
  'America/Yakutat': 'ak',
  'America/Nome': 'ak',
  'America/Adak': 'ak',
  'Pacific/Honolulu': 'hi',
  // Common city-based guesses
  'America/Boston': 'ma',
  'America/Miami': 'fl',
  'America/Atlanta': 'ga',
  'America/Dallas': 'tx',
  'America/Houston': 'tx',
  'America/Seattle': 'wa',
  'America/Portland': 'or',
  'America/Las_Vegas': 'nv',
  'America/Salt_Lake_City': 'ut',
};

// Major city to state (for label-based detection)
const US_CITY_STATES: Record<string, string> = {
  'new york': 'ny',
  'nyc': 'ny',
  'manhattan': 'ny',
  'brooklyn': 'ny',
  'los angeles': 'ca',
  'la': 'ca',
  'san francisco': 'ca',
  'sf': 'ca',
  'san diego': 'ca',
  'chicago': 'il',
  'houston': 'tx',
  'dallas': 'tx',
  'austin': 'tx',
  'san antonio': 'tx',
  'phoenix': 'az',
  'philadelphia': 'pa',
  'philly': 'pa',
  'seattle': 'wa',
  'denver': 'co',
  'boston': 'ma',
  'atlanta': 'ga',
  'miami': 'fl',
  'orlando': 'fl',
  'tampa': 'fl',
  'detroit': 'mi',
  'minneapolis': 'mn',
  'portland': 'or',
  'las vegas': 'nv',
  'vegas': 'nv',
  'salt lake': 'ut',
  'nashville': 'tn',
  'charlotte': 'nc',
  'indianapolis': 'in',
  'columbus': 'oh',
  'cleveland': 'oh',
  'pittsburgh': 'pa',
  'baltimore': 'md',
  'washington': 'dc',
  'dc': 'dc',
};

export interface FlagInfo {
  url: string;
  alt: string;
  code: string;
}

export interface FlagSet {
  state: FlagInfo | null;   // US state flag (null for non-US)
  country: FlagInfo | null; // Country flag
  isUS: boolean;            // Whether this is a US timezone
}

/**
 * Get full flag set for a timezone slot (both state and country for US)
 */
export function getFlagsForTimezone(
  timezone: string,
  country?: string,
  label?: string
): FlagSet {
  const isUS = country === 'US' ||
    (timezone.startsWith('America/') && !isNonUSAmerica(timezone)) ||
    timezone.startsWith('Pacific/Honolulu');

  if (isUS) {
    const stateCode = getUSStateCode(timezone, label);
    return {
      state: stateCode ? {
        url: `https://flagcdn.com/w40/us-${stateCode}.png`,
        alt: stateCode.toUpperCase(),
        code: `us-${stateCode}`,
      } : null,
      country: {
        url: 'https://flagcdn.com/w40/us.png',
        alt: 'US',
        code: 'us',
      },
      isUS: true,
    };
  }

  // Non-US: only country flag
  return {
    state: null,
    country: country ? {
      url: `https://flagcdn.com/w40/${country.toLowerCase()}.png`,
      alt: country,
      code: country.toLowerCase(),
    } : null,
    isUS: false,
  };
}

/**
 * Check if an America/* timezone is NOT in the US
 */
function isNonUSAmerica(timezone: string): boolean {
  const nonUSPrefixes = [
    'America/Toronto', 'America/Vancouver', 'America/Montreal', 'America/Edmonton',
    'America/Winnipeg', 'America/Halifax', 'America/St_Johns', 'America/Regina',
    'America/Mexico_City', 'America/Tijuana', 'America/Cancun', 'America/Monterrey',
    'America/Bogota', 'America/Lima', 'America/Santiago', 'America/Buenos_Aires',
    'America/Sao_Paulo', 'America/Caracas', 'America/Guatemala', 'America/Panama',
    'America/Havana', 'America/Jamaica', 'America/Puerto_Rico', 'America/Santo_Domingo',
  ];
  return nonUSPrefixes.some(prefix => timezone.startsWith(prefix));
}

/**
 * Get flag info for a timezone slot (legacy - returns single flag)
 */
export function getFlagForTimezone(
  timezone: string,
  country?: string,
  label?: string
): FlagInfo | null {
  const flags = getFlagsForTimezone(timezone, country, label);
  // Return state flag for US, country flag for others
  return flags.state || flags.country;
}

/**
 * Try to determine US state from timezone or label
 */
function getUSStateCode(timezone: string, label?: string): string | null {
  // First try direct timezone mapping
  if (US_TIMEZONE_STATES[timezone]) {
    return US_TIMEZONE_STATES[timezone];
  }

  // Try to detect from label
  if (label) {
    const lowerLabel = label.toLowerCase();
    for (const [city, state] of Object.entries(US_CITY_STATES)) {
      if (lowerLabel.includes(city)) {
        return state;
      }
    }
  }

  // Fallback: try to guess from timezone name
  const tzParts = timezone.split('/');
  const cityPart = tzParts[tzParts.length - 1]?.toLowerCase().replace(/_/g, ' ');
  if (cityPart && US_CITY_STATES[cityPart]) {
    return US_CITY_STATES[cityPart];
  }

  return null;
}

/**
 * Check if all timezones in a list are from the same country
 */
export function isSameCountry(countries: (string | undefined)[]): boolean {
  const defined = countries.filter(Boolean) as string[];
  if (defined.length === 0) return true;
  return defined.every(c => c === defined[0]);
}

/**
 * Get flag URL for preloading
 */
export function getFlagUrls(
  timezones: { timezone: string; country?: string; label?: string }[]
): string[] {
  const urls = new Set<string>();

  for (const tz of timezones) {
    const flag = getFlagForTimezone(tz.timezone, tz.country, tz.label);
    if (flag) {
      urls.add(flag.url);
    }
  }

  return Array.from(urls);
}
