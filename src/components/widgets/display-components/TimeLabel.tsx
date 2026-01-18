import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface TimeLabelProps {
  time: string;
  label?: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export function TimeLabel({ time, label, style, className }: TimeLabelProps) {
  const size = style?.size || 'md';

  return (
    <div
      className={cn('flex items-baseline gap-2', className)}
      style={{ opacity: style?.opacity }}
    >
      <span
        className={cn(
          'font-mono font-medium tabular-nums',
          sizeClasses[size]
        )}
        style={{ color: style?.textColor }}
      >
        {time}
      </span>
      {label && (
        <span
          className={cn(
            'text-neutral-500 dark:text-neutral-400',
            size === 'xs' && 'text-[10px]',
            size === 'sm' && 'text-xs',
            (size === 'md' || size === 'lg') && 'text-sm',
            (size === 'xl' || size === '2xl') && 'text-base'
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
