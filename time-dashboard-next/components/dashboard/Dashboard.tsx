'use client';

import { useDashboardStore } from '@/stores/dashboardStore';
import { DashboardGrid } from './DashboardGrid';
import { DashboardSwitcher } from './DashboardSwitcher';
import { DashboardEditor } from './DashboardEditor';

export function Dashboard() {
  const { getActiveDashboard } = useDashboardStore();
  const dashboard = getActiveDashboard();

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-neutral-400 dark:text-neutral-500">
        <p>No dashboard selected. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardSwitcher />
        <DashboardEditor dashboardId={dashboard.id} />
      </div>

      {/* Widget Grid */}
      <DashboardGrid dashboardId={dashboard.id} widgets={dashboard.widgets} />
    </div>
  );
}
