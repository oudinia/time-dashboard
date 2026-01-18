export interface TimeZoneSlot {
  id: string;
  timezone: string;           // IANA timezone e.g., "America/New_York"
  label: string;              // Display name e.g., "East Coast Office"
  country?: string;           // ISO country code e.g., "US", "GB", "JP"
  workingHours?: { start: string; end: string };
  color?: string;
  coordinates?: { lat: number; lng: number };  // For weather lookup
}

export type ClockDisplayMode = 'compact' | 'standard' | 'expanded';

export type TimeZoneSlotFormData = Omit<TimeZoneSlot, 'id'>;
