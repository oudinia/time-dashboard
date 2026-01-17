export interface TimeZoneSlot {
  id: string;
  timezone: string;           // IANA timezone e.g., "America/New_York"
  label: string;              // Display name e.g., "East Coast Office"
  workingHours?: { start: string; end: string };
  color?: string;
}

export type TimeZoneSlotFormData = Omit<TimeZoneSlot, 'id'>;
