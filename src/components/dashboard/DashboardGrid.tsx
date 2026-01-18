import { useState, useCallback } from 'react';
import { WidgetConfig, WorldClockSettings } from '@/types/dashboard';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { WorldClockWidget } from '@/components/widgets/WorldClockWidget';
import { TimelineWidget } from '@/components/widgets/TimelineWidget';
import { CustomWidget } from '@/components/widgets/CustomWidget';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useCustomWidgetStore } from '@/stores/customWidgetStore';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  dashboardId: string;
  widgets: WidgetConfig[];
}

const WIDGET_TITLES: Record<Exclude<WidgetConfig['type'], 'custom'>, string> = {
  'world-clock': 'World Clock',
  timeline: 'Timeline',
};

function getWidgetTitle(widget: WidgetConfig, getWidget: (id: string) => { name: string } | null): string {
  if (widget.type === 'custom' && widget.customWidgetId) {
    const customWidget = getWidget(widget.customWidgetId);
    return customWidget?.name || 'Custom Widget';
  }
  return WIDGET_TITLES[widget.type as keyof typeof WIDGET_TITLES] || 'Widget';
}

function RenderWidget({ widget }: { widget: WidgetConfig }) {
  switch (widget.type) {
    case 'world-clock':
      return (
        <WorldClockWidget
          timezoneIds={widget.timezones}
          settings={widget.settings as Partial<WorldClockSettings>}
        />
      );
    case 'timeline':
      return <TimelineWidget timezoneIds={widget.timezones} />;
    case 'custom':
      if (!widget.customWidgetId) {
        return <div className="p-4 text-center text-neutral-500">No custom widget configured</div>;
      }
      return <CustomWidget customWidgetId={widget.customWidgetId} timezoneIds={widget.timezones} />;
    default:
      return <div>Unknown widget type</div>;
  }
}

export function DashboardGrid({ dashboardId, widgets }: DashboardGridProps) {
  const { updateDashboard, getActiveDashboard } = useDashboardStore();
  const { getWidget } = useCustomWidgetStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    setDraggedId(widgetId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, widgetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (widgetId !== draggedId) {
      setDragOverId(widgetId);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const dashboard = getActiveDashboard();
    if (!dashboard) return;

    // Reorder widgets
    const widgetsCopy = [...dashboard.widgets];
    const draggedIndex = widgetsCopy.findIndex((w) => w.id === draggedId);
    const targetIndex = widgetsCopy.findIndex((w) => w.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = widgetsCopy.splice(draggedIndex, 1);
      widgetsCopy.splice(targetIndex, 0, removed);
      updateDashboard(dashboardId, { widgets: widgetsCopy });
    }

    setDraggedId(null);
  }, [draggedId, dashboardId, getActiveDashboard, updateDashboard]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  if (widgets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-neutral-400 dark:text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
        <p className="text-center">
          No widgets yet.
          <br />
          <span className="text-sm">Add a widget to get started.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          draggable
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragOver={(e) => handleDragOver(e, widget.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, widget.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            'transition-all duration-200',
            draggedId === widget.id && 'opacity-50 scale-[0.98]',
            dragOverId === widget.id && 'ring-2 ring-blue-400 ring-offset-2 rounded-lg'
          )}
        >
          <WidgetWrapper
            widget={widget}
            dashboardId={dashboardId}
            title={getWidgetTitle(widget, getWidget)}
            isDragging={draggedId === widget.id}
          >
            <RenderWidget widget={widget} />
          </WidgetWrapper>
        </div>
      ))}
    </div>
  );
}
