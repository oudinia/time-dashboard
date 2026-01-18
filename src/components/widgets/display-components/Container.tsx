import { cn } from '@/lib/utils';
import type { DisplayStyle, LayoutConfig, GapSize } from '@/types/widget-spec';

interface ContainerProps {
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

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export function Container({ children, layout, style, className }: ContainerProps) {
  const layoutType = layout?.type || 'flex';
  const gap = layout?.gap || 'md';
  const padding = style?.padding || 'none';

  const layoutClasses = (() => {
    switch (layoutType) {
      case 'grid':
        const cols = layout?.columns || 'auto';
        return cn(
          'grid',
          cols === 'auto' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : `grid-cols-${cols}`
        );
      case 'stack':
        return 'flex flex-col';
      case 'flex':
      default:
        return cn(
          'flex',
          layout?.direction === 'column' ? 'flex-col' : 'flex-row',
          layout?.wrap && 'flex-wrap'
        );
    }
  })();

  return (
    <div
      className={cn(
        layoutClasses,
        gapClasses[gap],
        paddingClasses[padding],
        layout?.align && alignClasses[layout.align],
        layout?.justify && justifyClasses[layout.justify],
        style?.rounded === true && 'rounded',
        style?.rounded === 'sm' && 'rounded-sm',
        style?.rounded === 'md' && 'rounded-md',
        style?.rounded === 'lg' && 'rounded-lg',
        style?.rounded === 'full' && 'rounded-full',
        style?.border && 'border border-neutral-200 dark:border-neutral-700',
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
