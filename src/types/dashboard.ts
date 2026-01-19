export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type FlagDisplayMode = 'both' | 'state' | 'country' | 'none';

export interface WorldClockSettings {
  displayMode: 'compact' | 'standard' | 'expanded';
  showWeather: boolean;
  showHoliday: boolean;
  showWorkingHours: boolean;
  columns?: 1 | 2 | 3 | 'auto';  // Cards per row (auto = responsive)
  flagDisplay?: FlagDisplayMode;  // Flag display mode (default: 'both' for US)
}

export interface WidgetConfig {
  id: string;
  type: 'world-clock' | 'timeline' | 'custom';
  title?: string;             // Custom title (auto-generated codename if empty)
  timezones: string[];        // TimeZoneSlot IDs
  position: WidgetPosition;
  settings: WorldClockSettings | Record<string, unknown>;
  span?: 1 | 2;               // Column span (1 = half width, 2 = full width)
  // For custom widgets
  customWidgetId?: string;    // Reference to CustomWidget.id
}

export interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
}
