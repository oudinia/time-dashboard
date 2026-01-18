import type { LayoutConfig, GapSize } from '@/types/widget-spec';
import { cn } from '@/lib/utils';

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

/**
 * Generate Tailwind classes for a layout configuration
 */
export function getLayoutClasses(layout: LayoutConfig): string {
  const gap = layout.gap || 'md';
  const padding = layout.padding || 'none';

  const classes: string[] = [];

  switch (layout.type) {
    case 'grid': {
      classes.push('grid');

      const cols = layout.columns || 'auto';
      if (cols === 'auto') {
        classes.push('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
      } else if (typeof cols === 'number') {
        // Use explicit grid columns
        switch (cols) {
          case 1:
            classes.push('grid-cols-1');
            break;
          case 2:
            classes.push('grid-cols-2');
            break;
          case 3:
            classes.push('grid-cols-3');
            break;
          case 4:
            classes.push('grid-cols-4');
            break;
          case 5:
            classes.push('grid-cols-5');
            break;
          case 6:
            classes.push('grid-cols-6');
            break;
          default:
            classes.push(`grid-cols-${cols}`);
        }
      }

      const rows = layout.rows;
      if (rows && typeof rows === 'number') {
        switch (rows) {
          case 1:
            classes.push('grid-rows-1');
            break;
          case 2:
            classes.push('grid-rows-2');
            break;
          case 3:
            classes.push('grid-rows-3');
            break;
          default:
            classes.push(`grid-rows-${rows}`);
        }
      }
      break;
    }

    case 'flex': {
      classes.push('flex');

      if (layout.direction === 'column') {
        classes.push('flex-col');
      } else {
        classes.push('flex-row');
      }

      if (layout.wrap) {
        classes.push('flex-wrap');
      }

      // Alignment
      if (layout.align) {
        switch (layout.align) {
          case 'start':
            classes.push('items-start');
            break;
          case 'center':
            classes.push('items-center');
            break;
          case 'end':
            classes.push('items-end');
            break;
          case 'stretch':
            classes.push('items-stretch');
            break;
          case 'baseline':
            classes.push('items-baseline');
            break;
        }
      }

      // Justify
      if (layout.justify) {
        switch (layout.justify) {
          case 'start':
            classes.push('justify-start');
            break;
          case 'center':
            classes.push('justify-center');
            break;
          case 'end':
            classes.push('justify-end');
            break;
          case 'between':
            classes.push('justify-between');
            break;
          case 'around':
            classes.push('justify-around');
            break;
          case 'evenly':
            classes.push('justify-evenly');
            break;
        }
      }
      break;
    }

    case 'stack': {
      classes.push('flex', 'flex-col');
      break;
    }

    case 'single': {
      // Single item, no special layout
      break;
    }
  }

  classes.push(gapClasses[gap]);
  classes.push(paddingClasses[padding]);

  return cn(...classes);
}

/**
 * Get classes for an item within a layout
 */
export function getItemClasses(layout: LayoutConfig): string {
  const classes: string[] = [];

  // For flex layouts, items might need specific alignment
  if (layout.type === 'flex' && layout.direction !== 'column') {
    classes.push('flex', 'items-center', 'gap-2');
  }

  return cn(...classes);
}
