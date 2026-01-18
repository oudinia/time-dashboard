import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type { DisplayStyle } from '@/types/widget-spec';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  style?: DisplayStyle;
  className?: string;
}

const sizeClasses = {
  xs: { card: 'p-2', icon: 'w-4 h-4', value: 'text-lg', label: 'text-xs' },
  sm: { card: 'p-2.5', icon: 'w-5 h-5', value: 'text-xl', label: 'text-xs' },
  md: { card: 'p-3', icon: 'w-6 h-6', value: 'text-2xl', label: 'text-sm' },
  lg: { card: 'p-4', icon: 'w-7 h-7', value: 'text-3xl', label: 'text-sm' },
  xl: { card: 'p-5', icon: 'w-8 h-8', value: 'text-4xl', label: 'text-base' },
  '2xl': { card: 'p-6', icon: 'w-10 h-10', value: 'text-5xl', label: 'text-lg' },
};

// Map icon names to Lucide icons
function getIcon(iconName?: string) {
  if (!iconName) return null;

  // Convert kebab-case to PascalCase
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascalCase];
  return Icon || null;
}

export function StatCard({ label, value, icon, style, className }: StatCardProps) {
  const size = style?.size || 'md';
  const sizes = sizeClasses[size];
  const Icon = getIcon(icon);

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg',
        'bg-neutral-50 dark:bg-neutral-800/50',
        style?.border && 'border border-neutral-200 dark:border-neutral-700',
        style?.shadow === true && 'shadow',
        style?.shadow === 'sm' && 'shadow-sm',
        style?.shadow === 'md' && 'shadow-md',
        style?.shadow === 'lg' && 'shadow-lg',
        sizes.card,
        className
      )}
      style={{
        backgroundColor: style?.bgColor,
        borderColor: style?.borderColor,
        opacity: style?.opacity,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        {Icon && (
          <Icon
            className={cn(
              'text-neutral-400 dark:text-neutral-500',
              sizes.icon
            )}
          />
        )}
        <span
          className={cn(
            'text-neutral-500 dark:text-neutral-400',
            sizes.label
          )}
          style={{ color: style?.textColor }}
        >
          {label}
        </span>
      </div>
      <span
        className={cn(
          'font-semibold tabular-nums',
          sizes.value
        )}
        style={{ color: style?.textColor }}
      >
        {value}
      </span>
    </div>
  );
}
