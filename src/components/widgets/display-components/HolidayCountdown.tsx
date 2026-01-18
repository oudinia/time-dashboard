import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface HolidayCountdownProps {
  nextHoliday: string | null;
  daysUntilHoliday: number | null;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'text-[10px] px-1 py-0.5',
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-2.5 py-1.5',
  xl: 'text-base px-3 py-2',
  '2xl': 'text-lg px-4 py-2.5',
};

const iconSizes = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
  '2xl': 'w-6 h-6',
};

export function HolidayCountdown({
  nextHoliday,
  daysUntilHoliday,
  style,
  className,
}: HolidayCountdownProps) {
  const size = style?.size || 'sm';

  if (!nextHoliday) {
    return null;
  }

  const daysText =
    daysUntilHoliday === 0
      ? 'Today'
      : daysUntilHoliday === 1
      ? 'Tomorrow'
      : `in ${daysUntilHoliday}d`;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded',
        'bg-neutral-100 dark:bg-neutral-700/50',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: style?.bgColor,
        opacity: style?.opacity,
      }}
    >
      <Calendar
        className={cn(
          'text-neutral-400 dark:text-neutral-500',
          iconSizes[size]
        )}
      />
      <span
        className="text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]"
        style={{ color: style?.textColor }}
      >
        {nextHoliday}
      </span>
      <span className="text-neutral-400 dark:text-neutral-500">
        ({daysText})
      </span>
    </div>
  );
}
