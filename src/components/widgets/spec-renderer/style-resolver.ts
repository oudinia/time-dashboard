import type { DisplayStyle } from '@/types/widget-spec';
import { cn } from '@/lib/utils';

/**
 * Generate Tailwind classes from a DisplayStyle configuration
 */
export function getStyleClasses(style?: DisplayStyle): string {
  if (!style) return '';

  const classes: string[] = [];

  // Text alignment
  if (style.textAlign) {
    switch (style.textAlign) {
      case 'center':
        classes.push('text-center');
        break;
      case 'right':
        classes.push('text-right');
        break;
      case 'left':
        classes.push('text-left');
        break;
    }
  }

  // Font weight
  if (style.fontWeight) {
    switch (style.fontWeight) {
      case 'normal':
        classes.push('font-normal');
        break;
      case 'medium':
        classes.push('font-medium');
        break;
      case 'semibold':
        classes.push('font-semibold');
        break;
      case 'bold':
        classes.push('font-bold');
        break;
    }
  }

  // Rounded
  if (style.rounded) {
    if (style.rounded === true) {
      classes.push('rounded');
    } else {
      switch (style.rounded) {
        case 'sm':
          classes.push('rounded-sm');
          break;
        case 'md':
          classes.push('rounded-md');
          break;
        case 'lg':
          classes.push('rounded-lg');
          break;
        case 'full':
          classes.push('rounded-full');
          break;
      }
    }
  }

  // Shadow
  if (style.shadow) {
    if (style.shadow === true) {
      classes.push('shadow');
    } else {
      switch (style.shadow) {
        case 'sm':
          classes.push('shadow-sm');
          break;
        case 'md':
          classes.push('shadow-md');
          break;
        case 'lg':
          classes.push('shadow-lg');
          break;
      }
    }
  }

  // Border
  if (style.border) {
    classes.push('border', 'border-neutral-200', 'dark:border-neutral-700');
  }

  // Padding
  if (style.padding) {
    switch (style.padding) {
      case 'none':
        classes.push('p-0');
        break;
      case 'xs':
        classes.push('p-1');
        break;
      case 'sm':
        classes.push('p-2');
        break;
      case 'md':
        classes.push('p-3');
        break;
      case 'lg':
        classes.push('p-4');
        break;
      case 'xl':
        classes.push('p-6');
        break;
    }
  }

  // Margin
  if (style.margin) {
    switch (style.margin) {
      case 'none':
        classes.push('m-0');
        break;
      case 'xs':
        classes.push('m-1');
        break;
      case 'sm':
        classes.push('m-2');
        break;
      case 'md':
        classes.push('m-3');
        break;
      case 'lg':
        classes.push('m-4');
        break;
      case 'xl':
        classes.push('m-6');
        break;
    }
  }

  return cn(...classes);
}

/**
 * Generate inline styles from a DisplayStyle configuration
 * For properties that can't be expressed as Tailwind classes
 */
export function getInlineStyles(style?: DisplayStyle): React.CSSProperties {
  if (!style) return {};

  const inlineStyles: React.CSSProperties = {};

  // Custom colors that aren't standard Tailwind classes
  if (style.textColor) {
    inlineStyles.color = style.textColor;
  }

  if (style.bgColor) {
    inlineStyles.backgroundColor = style.bgColor;
  }

  if (style.borderColor) {
    inlineStyles.borderColor = style.borderColor;
  }

  // Custom dimensions
  if (style.width) {
    inlineStyles.width = style.width;
  }

  if (style.height) {
    inlineStyles.height = style.height;
  }

  // Opacity
  if (style.opacity !== undefined) {
    inlineStyles.opacity = style.opacity;
  }

  return inlineStyles;
}
