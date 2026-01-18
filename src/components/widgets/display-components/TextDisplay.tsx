import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface TextDisplayProps {
  content: string;
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

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function TextDisplay({ content, style, className }: TextDisplayProps) {
  const size = style?.size || 'md';
  const weight = style?.fontWeight || 'normal';

  return (
    <span
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        style?.textAlign === 'center' && 'text-center',
        style?.textAlign === 'right' && 'text-right',
        className
      )}
      style={{
        color: style?.textColor,
        opacity: style?.opacity,
      }}
    >
      {content}
    </span>
  );
}
