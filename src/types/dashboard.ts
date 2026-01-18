export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WorldClockSettings {
  displayMode: 'compact' | 'standard' | 'expanded';
  showWeather: boolean;
  showHoliday: boolean;
  showWorkingHours: boolean;
  columns?: 1 | 2 | 3 | 'auto';  // Cards per row (auto = responsive)
}

export interface WidgetConfig {
  id: string;
  type: 'world-clock' | 'timeline' | 'custom';
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
