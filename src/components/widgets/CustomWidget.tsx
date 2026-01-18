import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useCustomWidgetStore } from '@/stores/customWidgetStore';
import { SpecRenderer } from './spec-renderer';
import { cn } from '@/lib/utils';

interface CustomWidgetProps {
  customWidgetId: string;
  timezoneIds: string[];
  className?: string;
}

export function CustomWidget({ customWidgetId, timezoneIds, className }: CustomWidgetProps) {
  const { getWidget } = useCustomWidgetStore();

  const widget = useMemo(() => getWidget(customWidgetId), [getWidget, customWidgetId]);

  if (!widget) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-full p-8 text-center',
          className
        )}
      >
        <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-neutral-500 dark:text-neutral-400">
          Widget not found
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
          The custom widget "{customWidgetId}" could not be loaded.
          <br />
          It may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <SpecRenderer
      spec={widget.spec}
      timezoneIds={timezoneIds}
      className={className}
    />
  );
}
