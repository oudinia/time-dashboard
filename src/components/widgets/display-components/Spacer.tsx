import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface SpacerProps {
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: 'h-1 w-1',
  sm: 'h-2 w-2',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-12 w-12',
};

export function Spacer({ style, className }: SpacerProps) {
  const size = style?.size || 'md';

  return (
    <div
      className={cn('flex-shrink-0', sizeClasses[size], className)}
      style={{
        width: style?.width,
        height: style?.height,
      }}
    />
  );
}
