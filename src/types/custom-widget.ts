// Database model types for Custom Widgets
import type { WidgetSpec, WidgetCategory, WidgetIcon } from './widget-spec';

// ============================================================================
// Database Model
// ============================================================================

export interface CustomWidget {
  id: string;
  spec: WidgetSpec;
  specVersion: string;
  name: string;
  description: string | null;
  icon: WidgetIcon | null;
  category: WidgetCategory;
  tags: string[];

  // Ownership (prepared for future auth)
  userId: string | null;

  // Versioning
  version: number;
  isLatest: boolean;
  parentId: string | null;

  // Future marketplace fields
  isPublic: boolean;
  isApproved: boolean;
  downloads: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Input Types
// ============================================================================

export interface CreateCustomWidgetInput {
  spec: WidgetSpec;
  name?: string;           // Override meta.name if provided
  description?: string;    // Override meta.description if provided
  icon?: WidgetIcon;       // Override meta.icon if provided
  category?: WidgetCategory;
  tags?: string[];
  userId?: string;
}

export interface UpdateCustomWidgetInput {
  spec?: WidgetSpec;
  name?: string;
  description?: string;
  icon?: WidgetIcon;
  category?: WidgetCategory;
  tags?: string[];
  isPublic?: boolean;
}

// ============================================================================
// Query Filters
// ============================================================================

export interface CustomWidgetFilters {
  userId?: string;
  category?: WidgetCategory;
  tags?: string[];
  isPublic?: boolean;
  isApproved?: boolean;
  search?: string;
  isLatest?: boolean;
}

export interface CustomWidgetSortOptions {
  field: 'createdAt' | 'updatedAt' | 'name' | 'downloads';
  direction: 'asc' | 'desc';
}

export interface CustomWidgetListOptions {
  filters?: CustomWidgetFilters;
  sort?: CustomWidgetSortOptions;
  limit?: number;
  offset?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CustomWidgetListResponse {
  widgets: CustomWidget[];
  total: number;
  hasMore: boolean;
}

export interface CustomWidgetResponse {
  widget: CustomWidget;
}

export interface CustomWidgetDeleteResponse {
  success: boolean;
  deletedId: string;
}

// ============================================================================
// Local Storage Types (for Vite app without backend)
// ============================================================================

export interface LocalCustomWidget {
  id: string;
  spec: WidgetSpec;
  name: string;
  description: string | null;
  icon: WidgetIcon | null;
  category: WidgetCategory;
  tags: string[];
  createdAt: string;  // ISO string for localStorage
  updatedAt: string;  // ISO string for localStorage
}

// ============================================================================
// Widget Instance Configuration
// ============================================================================

// Used when adding a custom widget to a dashboard
export interface CustomWidgetInstance {
  customWidgetId: string;  // Reference to the CustomWidget
  timezones: string[];     // TimeZoneSlot IDs to use
  settings?: Record<string, unknown>;  // Override settings
}
