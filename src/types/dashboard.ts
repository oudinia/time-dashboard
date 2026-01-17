export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  id: string;
  type: 'world-clock' | 'timeline';
  timezones: string[];        // TimeZoneSlot IDs
  position: WidgetPosition;
  settings: Record<string, unknown>;
}

export interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
}
