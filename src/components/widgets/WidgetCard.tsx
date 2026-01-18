import { Clock, Calendar, Globe, Sun, Building, Users, BarChart3, Grid3X3, List, MoreVertical, Copy, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { LocalCustomWidget } from '@/types/custom-widget';
import type { WidgetIcon, WidgetCategory } from '@/types/widget-spec';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface WidgetCardProps {
  widget: LocalCustomWidget;
  onSelect?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  showActions?: boolean;
}

const iconMap: Record<WidgetIcon, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  calendar: Calendar,
  globe: Globe,
  sun: Sun,
  moon: Sun, // Using Sun as placeholder since there's no moon
  building: Building,
  users: Users,
  chart: BarChart3,
  grid: Grid3X3,
  list: List,
};

const categoryColors: Record<WidgetCategory, string> = {
  clocks: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  calendars: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  holidays: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  stats: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  timelines: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  custom: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
};

export function WidgetCard({
  widget,
  onSelect,
  onDuplicate,
  onExport,
  onDelete,
  selected = false,
  showActions = true,
}: WidgetCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const Icon = iconMap[widget.icon || 'clock'];
  const categoryColor = categoryColors[widget.category];

  const createdDate = new Date(widget.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      className={cn(
        'relative transition-all cursor-pointer hover:shadow-md',
        selected && 'ring-2 ring-blue-500'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              categoryColor
            )}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{widget.name}</h3>
              {showActions && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                        }}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate?.();
                            setShowMenu(false);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExport?.();
                            setShowMenu(false);
                          }}
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                            setShowMenu(false);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {widget.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                {widget.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  categoryColor
                )}
              >
                {widget.category}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {createdDate}
              </span>
            </div>

            {widget.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {widget.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
                {widget.tags.length > 3 && (
                  <span className="text-xs text-neutral-400">
                    +{widget.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
