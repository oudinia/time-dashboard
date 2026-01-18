// Widget Spec JSON Format - Declarative Widget Definition
// This is the schema for AI-generated widget definitions

// ============================================================================
// Data Source Configuration
// ============================================================================

export type DataSource = 'timezones' | 'holidays';

export type DataField =
  // Time fields
  | 'time'
  | 'date'
  | 'timezone'
  | 'label'
  | 'country'
  | 'color'
  | 'offset'
  | 'abbreviation'
  // Working hours fields
  | 'workingHours'
  | 'isWorkingTime'
  | 'hoursUntilStart'
  | 'hoursUntilEnd'
  // Holiday fields
  | 'nextHoliday'
  | 'daysUntilHoliday'
  | 'holidays';

export interface DataConfig {
  source: DataSource;
  fields: DataField[];
  filter?: DataFilter;
  sort?: DataSort;
}

export interface DataFilter {
  field: DataField;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: string | number | boolean | string[];
}

export interface DataSort {
  field: DataField;
  direction: 'asc' | 'desc';
}

// ============================================================================
// Layout Configuration
// ============================================================================

export type LayoutType = 'grid' | 'flex' | 'stack' | 'single';
export type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface LayoutConfig {
  type: LayoutType;
  // Grid-specific
  columns?: number | 'auto';
  rows?: number | 'auto';
  // Flex-specific
  direction?: 'row' | 'column';
  wrap?: boolean;
  align?: FlexAlign;
  justify?: FlexJustify;
  // Common
  gap?: GapSize;
  padding?: GapSize;
}

// ============================================================================
// Display Component Configuration
// ============================================================================

export type DisplayComponentType =
  // Clock components
  | 'digital-clock'
  | 'analog-clock'
  | 'time-label'
  | 'date-label'
  // Info components
  | 'timezone-badge'
  | 'offset-badge'
  | 'holiday-countdown'
  | 'working-status'
  // Stats components
  | 'stat-card'
  | 'comparison-bar'
  // Basic components
  | 'color-dot'
  | 'text'
  | 'divider'
  | 'spacer'
  // Container components
  | 'container'
  | 'card';

export interface DisplayBindings {
  // Binding a field from data to a component prop
  [propName: string]: DataField | string;
}

export interface DisplayStyle {
  // Size
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  width?: string;
  height?: string;
  // Colors
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  // Typography
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  // Spacing
  padding?: GapSize;
  margin?: GapSize;
  // Effects
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
  shadow?: boolean | 'sm' | 'md' | 'lg';
  border?: boolean;
  // Visibility
  opacity?: number;
}

export interface DisplayCondition {
  field: DataField;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'truthy' | 'falsy';
  value?: string | number | boolean;
}

export interface DisplayConfig {
  component: DisplayComponentType;
  bindings?: DisplayBindings;
  style?: DisplayStyle;
  showIf?: DisplayCondition;
  // For static content
  content?: string;
  icon?: string;
  // Nested children for container components
  children?: DisplayConfig[];
  // Layout within item
  layout?: LayoutConfig;
}

// ============================================================================
// Widget Metadata
// ============================================================================

export type WidgetCategory =
  | 'clocks'
  | 'calendars'
  | 'holidays'
  | 'stats'
  | 'timelines'
  | 'custom';

export type WidgetIcon =
  | 'clock'
  | 'calendar'
  | 'globe'
  | 'sun'
  | 'moon'
  | 'building'
  | 'users'
  | 'chart'
  | 'grid'
  | 'list';

export interface WidgetMeta {
  name: string;
  description?: string;
  icon?: WidgetIcon;
  category?: WidgetCategory;
  author?: string;
  tags?: string[];
}

// ============================================================================
// Complete Widget Spec
// ============================================================================

export interface WidgetSpec {
  version: '1.0';
  meta: WidgetMeta;
  data: DataConfig;
  layout: LayoutConfig;
  display: DisplayConfig[];
  // Optional widget-level settings
  settings?: {
    refreshInterval?: number;  // in milliseconds
    showHeader?: boolean;
    showBorder?: boolean;
    defaultTimezones?: string[];  // IANA timezone IDs to use if none provided
  };
}

// ============================================================================
// Validation Types
// ============================================================================

export interface WidgetSpecValidationError {
  path: string;
  message: string;
  code: 'INVALID_TYPE' | 'MISSING_REQUIRED' | 'INVALID_VALUE' | 'SECURITY_VIOLATION';
}

export interface WidgetSpecValidationResult {
  valid: boolean;
  errors: WidgetSpecValidationError[];
  warnings?: string[];
}

// ============================================================================
// Runtime Data Types (resolved from bindings)
// ============================================================================

export interface ResolvedTimezoneData {
  time: string;
  date: string;
  timezone: string;
  label: string;
  country: string;
  color: string;
  offset: string;
  abbreviation: string;
  workingHours: { start: string; end: string } | null;
  isWorkingTime: boolean;
  hoursUntilStart: number | null;
  hoursUntilEnd: number | null;
  nextHoliday: string | null;
  daysUntilHoliday: number | null;
  holidays: Array<{ name: string; date: string }>;
}

export type ResolvedDataItem = ResolvedTimezoneData;
