import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface WorkingStatusProps {
  isWorkingTime: boolean;
  hoursUntilStart?: number | null;
  hoursUntilEnd?: number | null;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'text-[10px] px-1 py-0.5',
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-2.5 py-1',
  xl: 'text-base px-3 py-1.5',
  '2xl': 'text-lg px-4 py-2',
};

export function WorkingStatus({
  isWorkingTime,
  hoursUntilStart,
  hoursUntilEnd,
  style,
  className,
}: WorkingStatusProps) {
  const size = style?.size || 'sm';

  const statusText = isWorkingTime ? 'Working' : 'Off';
  const timeHint = isWorkingTime
    ? hoursUntilEnd != null
      ? `(${hoursUntilEnd}h left)`
      : ''
    : hoursUntilStart != null
    ? `(starts in ${hoursUntilStart}h)`
    : '';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        isWorkingTime
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400',
        sizeClasses[size],
        className
      )}
      style={{
        color: style?.textColor,
        backgroundColor: style?.bgColor,
        opacity: style?.opacity,
      }}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          isWorkingTime ? 'bg-green-500' : 'bg-neutral-400 dark:bg-neutral-500'
        )}
      />
      {statusText}
      {timeHint && <span className="text-current opacity-70">{timeHint}</span>}
    </span>
  );
}
