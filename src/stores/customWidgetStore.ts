import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WidgetSpec,
  WidgetCategory,
} from '@/types/widget-spec';
import type {
  LocalCustomWidget,
  CreateCustomWidgetInput,
  UpdateCustomWidgetInput,
  CustomWidgetFilters,
} from '@/types/custom-widget';
import { generateId } from '@/lib/utils';
import { validateWidgetSpec } from '@/lib/widget-validator';

interface CustomWidgetStoreState {
  widgets: LocalCustomWidget[];

  // CRUD operations
  addWidget: (input: CreateCustomWidgetInput) => LocalCustomWidget | null;
  updateWidget: (id: string, input: UpdateCustomWidgetInput) => LocalCustomWidget | null;
  deleteWidget: (id: string) => boolean;
  getWidget: (id: string) => LocalCustomWidget | null;

  // Query operations
  listWidgets: (filters?: CustomWidgetFilters) => LocalCustomWidget[];
  getWidgetsByCategory: (category: WidgetCategory) => LocalCustomWidget[];

  // Import/Export
  exportWidget: (id: string) => string | null;
  importWidget: (json: string) => LocalCustomWidget | null;
  duplicateWidget: (id: string, newName?: string) => LocalCustomWidget | null;
}

export const useCustomWidgetStore = create<CustomWidgetStoreState>()(
  persist(
    (set, get) => ({
      widgets: [],

      addWidget: (input) => {
        // Validate the spec first
        const validation = validateWidgetSpec(input.spec);
        if (!validation.valid) {
          console.error('Invalid widget spec:', validation.errors);
          return null;
        }

        const now = new Date().toISOString();
        const newWidget: LocalCustomWidget = {
          id: generateId(),
          spec: input.spec,
          name: input.name || input.spec.meta.name,
          description: input.description ?? input.spec.meta.description ?? null,
          icon: input.icon ?? input.spec.meta.icon ?? 'clock',
          category: input.category ?? input.spec.meta.category ?? 'custom',
          tags: input.tags ?? input.spec.meta.tags ?? [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));

        return newWidget;
      },

      updateWidget: (id, input) => {
        const existingWidget = get().widgets.find((w) => w.id === id);
        if (!existingWidget) return null;

        // If updating spec, validate it
        if (input.spec) {
          const validation = validateWidgetSpec(input.spec);
          if (!validation.valid) {
            console.error('Invalid widget spec:', validation.errors);
            return null;
          }
        }

        const updatedWidget: LocalCustomWidget = {
          ...existingWidget,
          ...(input.spec && { spec: input.spec }),
          ...(input.name && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.icon && { icon: input.icon }),
          ...(input.category && { category: input.category }),
          ...(input.tags && { tags: input.tags }),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? updatedWidget : w
          ),
        }));

        return updatedWidget;
      },

      deleteWidget: (id) => {
        const exists = get().widgets.some((w) => w.id === id);
        if (!exists) return false;

        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }));

        return true;
      },

      getWidget: (id) => {
        return get().widgets.find((w) => w.id === id) ?? null;
      },

      listWidgets: (filters) => {
        let result = get().widgets;

        if (!filters) return result;

        if (filters.category) {
          result = result.filter((w) => w.category === filters.category);
        }

        if (filters.tags && filters.tags.length > 0) {
          result = result.filter((w) =>
            filters.tags!.some((tag) => w.tags.includes(tag))
          );
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          result = result.filter(
            (w) =>
              w.name.toLowerCase().includes(searchLower) ||
              w.description?.toLowerCase().includes(searchLower) ||
              w.tags.some((t) => t.toLowerCase().includes(searchLower))
          );
        }

        return result;
      },

      getWidgetsByCategory: (category) => {
        return get().widgets.filter((w) => w.category === category);
      },

      exportWidget: (id) => {
        const widget = get().widgets.find((w) => w.id === id);
        if (!widget) return null;

        // Export just the spec for sharing
        return JSON.stringify(widget.spec, null, 2);
      },

      importWidget: (json) => {
        try {
          const parsed = JSON.parse(json);

          // Check if it's a full LocalCustomWidget or just a WidgetSpec
          const isFullWidget = 'spec' in parsed && 'id' in parsed;
          const spec: WidgetSpec = isFullWidget ? parsed.spec : parsed;

          // Validate the spec
          const validation = validateWidgetSpec(spec);
          if (!validation.valid) {
            console.error('Invalid widget spec:', validation.errors);
            return null;
          }

          const now = new Date().toISOString();
          const newWidget: LocalCustomWidget = {
            id: generateId(),
            spec,
            name: isFullWidget ? `${parsed.name} (Imported)` : spec.meta.name,
            description: isFullWidget ? parsed.description : (spec.meta.description ?? null),
            icon: isFullWidget ? parsed.icon : (spec.meta.icon ?? 'clock'),
            category: isFullWidget ? parsed.category : (spec.meta.category ?? 'custom'),
            tags: isFullWidget ? parsed.tags : (spec.meta.tags ?? []),
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            widgets: [...state.widgets, newWidget],
          }));

          return newWidget;
        } catch (e) {
          console.error('Failed to import widget:', e);
          return null;
        }
      },

      duplicateWidget: (id, newName) => {
        const original = get().widgets.find((w) => w.id === id);
        if (!original) return null;

        const now = new Date().toISOString();
        const duplicated: LocalCustomWidget = {
          ...original,
          id: generateId(),
          name: newName || `${original.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          widgets: [...state.widgets, duplicated],
        }));

        return duplicated;
      },
    }),
    {
      name: 'custom-widget-storage',
    }
  )
);
