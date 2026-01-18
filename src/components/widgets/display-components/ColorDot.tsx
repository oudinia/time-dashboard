import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface ColorDotProps {
  color: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

export function ColorDot({ color, style, className }: ColorDotProps) {
  const size = style?.size || 'md';

  return (
    <div
      className={cn(
        'rounded-full shrink-0',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: color,
        opacity: style?.opacity,
      }}
    />
  );
}
