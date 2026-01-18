import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface OffsetBadgeProps {
  offset: string;
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

export function OffsetBadge({ offset, style, className }: OffsetBadgeProps) {
  const size = style?.size || 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono rounded',
        'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        sizeClasses[size],
        className
      )}
      style={{
        color: style?.textColor,
        backgroundColor: style?.bgColor,
        opacity: style?.opacity,
      }}
    >
      {offset}
    </span>
  );
}
