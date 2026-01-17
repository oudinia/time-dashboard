import { useState } from 'react';
import { GripVertical, Settings, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WidgetConfig } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface WidgetWrapperProps {
  widget: WidgetConfig;
  dashboardId: string;
  children: React.ReactNode;
  title: string;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface TimezonePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function TimezonePicker({ selectedIds, onChange }: TimezonePickerProps) {
  const { slots } = useTimezoneStore();

  const toggleTimezone = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((tid) => tid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Select timezones to display in this widget:
      </p>
      <div className="max-h-60 overflow-y-auto space-y-1">
        {slots.map((slot) => {
          const isSelected = selectedIds.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => toggleTimezone(slot.id)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors',
                isSelected
                  ? 'bg-neutral-100 dark:bg-neutral-800'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              )}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slot.color }}
              />
              <span className="flex-1 text-sm">{slot.label}</span>
              {isSelected && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          );
        })}
        {slots.length === 0 && (
          <p className="text-sm text-neutral-400 p-2">
            No timezones available. Add some in the Timezones panel.
          </p>
        )}
      </div>
    </div>
  );
}

export function WidgetWrapper({
  widget,
  dashboardId,
  children,
  title,
  isDragging,
  dragHandleProps,
}: WidgetWrapperProps) {
  const { updateWidget, deleteWidget } = useDashboardStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingTimezones, setPendingTimezones] = useState<string[]>(widget.timezones);

  const handleDelete = () => {
    if (confirm('Remove this widget from the dashboard?')) {
      deleteWidget(dashboardId, widget.id);
    }
  };

  const handleSaveSettings = () => {
    updateWidget(dashboardId, widget.id, { timezones: pendingTimezones });
    setIsSettingsOpen(false);
  };

  const openSettings = () => {
    setPendingTimezones(widget.timezones);
    setIsSettingsOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-shadow',
          isDragging && 'shadow-lg ring-2 ring-blue-500'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <GripVertical className="w-4 h-4 text-neutral-400" />
            </div>
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={openSettings}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[150px]">{children}</div>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title} Settings</DialogTitle>
          </DialogHeader>
          <TimezonePicker
            selectedIds={pendingTimezones}
            onChange={setPendingTimezones}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
