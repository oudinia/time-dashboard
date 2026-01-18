import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface DateLabelProps {
  date: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
};

export function DateLabel({ date, style, className }: DateLabelProps) {
  const size = style?.size || 'sm';

  return (
    <span
      className={cn(
        'text-neutral-500 dark:text-neutral-400',
        sizeClasses[size],
        style?.fontWeight === 'medium' && 'font-medium',
        style?.fontWeight === 'semibold' && 'font-semibold',
        style?.fontWeight === 'bold' && 'font-bold',
        className
      )}
      style={{
        color: style?.textColor,
        opacity: style?.opacity,
      }}
    >
      {date}
    </span>
  );
}
