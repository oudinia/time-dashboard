import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  style?: DisplayStyle;
  className?: string;
}

const marginClasses = {
  none: '',
  xs: 'my-1',
  sm: 'my-2',
  md: 'my-3',
  lg: 'my-4',
  xl: 'my-6',
};

const verticalMarginClasses = {
  none: '',
  xs: 'mx-1',
  sm: 'mx-2',
  md: 'mx-3',
  lg: 'mx-4',
  xl: 'mx-6',
};

export function Divider({ orientation = 'horizontal', style, className }: DividerProps) {
  const margin = style?.margin || 'sm';
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'bg-neutral-200 dark:bg-neutral-700',
        isVertical
          ? cn('w-px h-full', verticalMarginClasses[margin])
          : cn('h-px w-full', marginClasses[margin]),
        className
      )}
      style={{
        backgroundColor: style?.bgColor,
        opacity: style?.opacity,
      }}
    />
  );
}
