import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface DigitalClockProps {
  time: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
  '2xl': 'text-6xl',
};

export function DigitalClock({ time, style, className }: DigitalClockProps) {
  const size = style?.size || 'md';

  return (
    <span
      className={cn(
        'font-mono font-semibold tabular-nums tracking-tight',
        sizeClasses[size],
        style?.fontWeight === 'normal' && 'font-normal',
        style?.fontWeight === 'medium' && 'font-medium',
        style?.fontWeight === 'bold' && 'font-bold',
        style?.textAlign === 'center' && 'text-center',
        style?.textAlign === 'right' && 'text-right',
        className
      )}
      style={{
        color: style?.textColor,
        opacity: style?.opacity,
      }}
    >
      {time}
    </span>
  );
}
