import { cn } from '@/lib/utils';
import type { DisplayStyle, LayoutConfig, GapSize } from '@/types/widget-spec';

interface CardProps {
  children?: React.ReactNode;
  layout?: LayoutConfig;
  style?: DisplayStyle;
  className?: string;
}

const gapClasses: Record<GapSize, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
};

const paddingClasses: Record<GapSize, string> = {
  none: 'p-0',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
  xl: 'p-6',
};

export function Card({ children, layout, style, className }: CardProps) {
  const padding = style?.padding || 'md';
  const gap = layout?.gap || 'sm';

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg',
        'bg-neutral-50 dark:bg-neutral-800/50',
        'border border-neutral-200 dark:border-neutral-700',
        paddingClasses[padding],
        gapClasses[gap],
        style?.shadow === true && 'shadow',
        style?.shadow === 'sm' && 'shadow-sm',
        style?.shadow === 'md' && 'shadow-md',
        style?.shadow === 'lg' && 'shadow-lg',
        className
      )}
      style={{
        backgroundColor: style?.bgColor,
        borderColor: style?.borderColor,
        opacity: style?.opacity,
      }}
    >
      {children}
    </div>
  );
}
