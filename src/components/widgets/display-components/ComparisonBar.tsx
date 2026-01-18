import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface ComparisonBarProps {
  time: string;  // Current time in HH:mm format
  workingHours?: { start: string; end: string } | null;
  color?: string;
  label?: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: { bar: 'h-4', text: 'text-[10px]' },
  sm: { bar: 'h-5', text: 'text-xs' },
  md: { bar: 'h-6', text: 'text-xs' },
  lg: { bar: 'h-8', text: 'text-sm' },
  xl: { bar: 'h-10', text: 'text-sm' },
  '2xl': { bar: 'h-12', text: 'text-base' },
};

function timeToPercent(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return ((hours * 60 + minutes) / (24 * 60)) * 100;
}

export function ComparisonBar({
  time,
  workingHours,
  color,
  label,
  style,
  className,
}: ComparisonBarProps) {
  const size = style?.size || 'md';
  const sizes = sizeClasses[size];

  const currentPercent = timeToPercent(time);

  const workingStart = workingHours ? timeToPercent(workingHours.start) : null;
  const workingEnd = workingHours ? timeToPercent(workingHours.end) : null;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className={cn('text-neutral-500 dark:text-neutral-400', sizes.text)}>
          {label}
        </span>
      )}
      <div
        className={cn(
          'relative w-full rounded overflow-hidden',
          'bg-neutral-200 dark:bg-neutral-700',
          sizes.bar
        )}
        style={{ opacity: style?.opacity }}
      >
        {/* Working hours background */}
        {workingStart !== null && workingEnd !== null && (
          <div
            className="absolute top-0 h-full bg-green-200/50 dark:bg-green-800/30"
            style={{
              left: `${workingStart}%`,
              width: `${workingEnd - workingStart}%`,
            }}
          />
        )}

        {/* Current time indicator */}
        <div
          className="absolute top-0 h-full w-0.5 -translate-x-1/2"
          style={{
            left: `${currentPercent}%`,
            backgroundColor: color || '#3B82F6',
          }}
        />

        {/* Hour markers */}
        {[0, 6, 12, 18].map((hour) => (
          <div
            key={hour}
            className="absolute top-0 h-full w-px bg-neutral-300 dark:bg-neutral-600"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            <span
              className={cn(
                'absolute -bottom-4 -translate-x-1/2 text-neutral-400 dark:text-neutral-500',
                sizes.text
              )}
            >
              {hour}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
