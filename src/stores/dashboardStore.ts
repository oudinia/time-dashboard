import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardConfig, WidgetConfig, WidgetPosition } from '@/types/dashboard';
import { generateId } from '@/lib/utils';

interface DashboardStoreState {
  dashboards: DashboardConfig[];
  activeDashboardId: string | null;

  // Dashboard CRUD
  addDashboard: (name: string) => DashboardConfig;
  updateDashboard: (id: string, data: Partial<Omit<DashboardConfig, 'id'>>) => void;
  deleteDashboard: (id: string) => void;
  setActiveDashboard: (id: string) => void;
  getActiveDashboard: () => DashboardConfig | null;

  // Widget CRUD
  addWidget: (dashboardId: string, type: WidgetConfig['type'], timezones?: string[]) => WidgetConfig;
  updateWidget: (dashboardId: string, widgetId: string, data: Partial<Omit<WidgetConfig, 'id' | 'type'>>) => void;
  deleteWidget: (dashboardId: string, widgetId: string) => void;
  updateWidgetPosition: (dashboardId: string, widgetId: string, position: WidgetPosition) => void;

  // Import/Export
  exportDashboard: (id: string) => string | null;
  importDashboard: (json: string) => DashboardConfig | null;
}

const DEFAULT_DASHBOARD: DashboardConfig = {
  id: 'default',
  name: 'Global Offices',
  widgets: [
    {
      id: 'default-clock',
      type: 'world-clock',
      timezones: ['default-ny', 'default-london', 'default-tokyo'],
      position: { x: 0, y: 0, w: 2, h: 1 },
      settings: {},
    },
    {
      id: 'default-timeline',
      type: 'timeline',
      timezones: ['default-ny', 'default-london', 'default-tokyo'],
      position: { x: 0, y: 1, w: 2, h: 1 },
      settings: {},
    },
  ],
};

export const useDashboardStore = create<DashboardStoreState>()(
  persist(
    (set, get) => ({
      dashboards: [DEFAULT_DASHBOARD],
      activeDashboardId: 'default',

      addDashboard: (name) => {
        const newDashboard: DashboardConfig = {
          id: generateId(),
          name,
          widgets: [],
        };
        set((state) => ({
          dashboards: [...state.dashboards, newDashboard],
          activeDashboardId: newDashboard.id,
        }));
        return newDashboard;
      },

      updateDashboard: (id, data) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id ? { ...d, ...data } : d
          ),
        }));
      },

      deleteDashboard: (id) => {
        const state = get();
        if (state.dashboards.length <= 1) return; // Keep at least one dashboard

        set((state) => {
          const newDashboards = state.dashboards.filter((d) => d.id !== id);
          const newActiveId = state.activeDashboardId === id
            ? newDashboards[0]?.id ?? null
            : state.activeDashboardId;
          return {
            dashboards: newDashboards,
            activeDashboardId: newActiveId,
          };
        });
      },

      setActiveDashboard: (id) => {
        set({ activeDashboardId: id });
      },

      getActiveDashboard: () => {
        const state = get();
        return state.dashboards.find((d) => d.id === state.activeDashboardId) ?? null;
      },

      addWidget: (dashboardId, type, timezones = []) => {
        const dashboard = get().dashboards.find((d) => d.id === dashboardId);
        if (!dashboard) throw new Error('Dashboard not found');

        // Calculate position for new widget (append at the end)
        const maxY = Math.max(0, ...dashboard.widgets.map((w) => w.position.y + w.position.h));

        const newWidget: WidgetConfig = {
          id: generateId(),
          type,
          timezones,
          position: { x: 0, y: maxY, w: 2, h: 1 },
          settings: {},
        };

        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? { ...d, widgets: [...d.widgets, newWidget] }
              : d
          ),
        }));

        return newWidget;
      },

      updateWidget: (dashboardId, widgetId, data) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.map((w) =>
                    w.id === widgetId ? { ...w, ...data } : w
                  ),
                }
              : d
          ),
        }));
      },

      deleteWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? { ...d, widgets: d.widgets.filter((w) => w.id !== widgetId) }
              : d
          ),
        }));
      },

      updateWidgetPosition: (dashboardId, widgetId, position) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.map((w) =>
                    w.id === widgetId ? { ...w, position } : w
                  ),
                }
              : d
          ),
        }));
      },

      exportDashboard: (id) => {
        const dashboard = get().dashboards.find((d) => d.id === id);
        if (!dashboard) return null;
        return JSON.stringify(dashboard, null, 2);
      },

      importDashboard: (json) => {
        try {
          const parsed = JSON.parse(json) as DashboardConfig;
          // Generate new ID to avoid conflicts
          const newDashboard: DashboardConfig = {
            ...parsed,
            id: generateId(),
            name: `${parsed.name} (Imported)`,
            widgets: parsed.widgets.map((w) => ({
              ...w,
              id: generateId(),
            })),
          };
          set((state) => ({
            dashboards: [...state.dashboards, newDashboard],
            activeDashboardId: newDashboard.id,
          }));
          return newDashboard;
        } catch {
          return null;
        }
      },
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
