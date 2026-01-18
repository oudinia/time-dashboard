import { useMemo } from 'react';
import type {
  WidgetSpec,
  DisplayConfig,
  ResolvedDataItem,
} from '@/types/widget-spec';
import type { TimeZoneSlot } from '@/types/timezone';
import { useMultipleTimezones } from '@/hooks/useCurrentTime';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getComponent, isValidComponentType } from '../display-components/registry';
import { resolveTimezoneData, resolveStaticContent } from './binding-resolver';
import { shouldShowComponent } from './condition-evaluator';
import { getLayoutClasses } from './layout-renderer';
import { getStyleClasses, getInlineStyles } from './style-resolver';
import { cn } from '@/lib/utils';

interface SpecRendererProps {
  spec: WidgetSpec;
  timezoneIds: string[];
  className?: string;
}

interface DisplayComponentRendererProps {
  config: DisplayConfig;
  data: ResolvedDataItem;
  index: number;
}

/**
 * Renders a single display component with its bindings resolved
 */
function DisplayComponentRenderer({ config, data, index }: DisplayComponentRendererProps) {
  // Check showIf condition
  if (!shouldShowComponent(config.showIf, data)) {
    return null;
  }

  // Get the component from registry
  if (!isValidComponentType(config.component)) {
    console.warn(`Unknown component type: ${config.component}`);
    return null;
  }

  const Component = getComponent(config.component);
  if (!Component) {
    return null;
  }

  // Resolve all props from bindings and static content
  const resolvedProps = resolveStaticContent(config, data);

  // Apply style classes
  const styleClasses = getStyleClasses(config.style);
  void getInlineStyles; // Currently unused but available for future use

  // Handle container components with children
  if (config.children && config.children.length > 0) {
    const childLayoutClasses = config.layout ? getLayoutClasses(config.layout) : '';

    return (
      <Component
        key={index}
        {...resolvedProps}
        style={config.style}
        layout={config.layout}
        className={cn(styleClasses, childLayoutClasses)}
      >
        {config.children.map((childConfig, childIndex) => (
          <DisplayComponentRenderer
            key={childIndex}
            config={childConfig}
            data={data}
            index={childIndex}
          />
        ))}
      </Component>
    );
  }

  return (
    <Component
      key={index}
      {...resolvedProps}
      style={config.style}
      className={styleClasses}
    />
  );
}

interface DataItemRendererProps {
  display: DisplayConfig[];
  data: ResolvedDataItem;
  itemIndex: number;
}

/**
 * Renders all display components for a single data item
 */
function DataItemRenderer({ display, data, itemIndex }: DataItemRendererProps) {
  return (
    <div key={itemIndex} className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
      {display.map((config, configIndex) => (
        <DisplayComponentRenderer
          key={`${itemIndex}-${configIndex}`}
          config={config}
          data={data}
          index={configIndex}
        />
      ))}
    </div>
  );
}

/**
 * Main SpecRenderer component
 * Interprets a WidgetSpec and renders it with the provided timezone data
 */
export function SpecRenderer({ spec, timezoneIds, className }: SpecRendererProps) {
  const { slots } = useTimezoneStore();
  const { timeFormat, showSeconds } = useSettingsStore();

  // Get the selected timezone slots
  const selectedSlots = useMemo(() => {
    return timezoneIds
      .map((id) => slots.find((s) => s.id === id))
      .filter(Boolean) as TimeZoneSlot[];
  }, [timezoneIds, slots]);

  // Get timezone strings for the hook
  const timezones = useMemo(
    () => selectedSlots.map((s) => s.timezone),
    [selectedSlots]
  );

  // Get refresh interval from spec or use default
  const refreshInterval = spec.settings?.refreshInterval || 1000;
  const times = useMultipleTimezones(timezones, refreshInterval);

  // Resolve all timezone data
  const resolvedData = useMemo(() => {
    return selectedSlots.map((slot) => {
      const time = times[slot.timezone];
      if (!time) {
        // Return placeholder data if time not available yet
        return null;
      }
      return resolveTimezoneData(slot, time, timeFormat, showSeconds);
    }).filter(Boolean) as ResolvedDataItem[];
  }, [selectedSlots, times, timeFormat, showSeconds]);

  // Empty state
  if (selectedSlots.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500 p-8",
        className
      )}>
        <p className="text-center">
          No timezones selected.
          <br />
          <span className="text-sm">Add timezones to this widget to see data.</span>
        </p>
      </div>
    );
  }

  // Loading state
  if (resolvedData.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500 p-8",
        className
      )}>
        <p className="text-center text-sm">Loading...</p>
      </div>
    );
  }

  // Get layout classes
  const layoutClasses = getLayoutClasses(spec.layout);

  return (
    <div className={cn('p-4', className)}>
      {spec.settings?.showHeader && spec.meta.name && (
        <h3 className="text-lg font-semibold mb-4">{spec.meta.name}</h3>
      )}
      <div className={layoutClasses}>
        {resolvedData.map((data, index) => (
          <DataItemRenderer
            key={index}
            display={spec.display}
            data={data}
            itemIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
