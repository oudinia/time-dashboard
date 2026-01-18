import { useState, useMemo } from 'react';
import { Plus, Search, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCustomWidgetStore } from '@/stores/customWidgetStore';
import { WidgetCard } from './WidgetCard';
import { WidgetImporter } from './WidgetImporter';
import type { WidgetCategory } from '@/types/widget-spec';
import { cn } from '@/lib/utils';

interface WidgetLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget?: (widgetId: string) => void;
  selectionMode?: boolean;
}

const categories: Array<{ value: WidgetCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'clocks', label: 'Clocks' },
  { value: 'calendars', label: 'Calendars' },
  { value: 'holidays', label: 'Holidays' },
  { value: 'stats', label: 'Stats' },
  { value: 'timelines', label: 'Timelines' },
  { value: 'custom', label: 'Custom' },
];

export function WidgetLibrary({
  open,
  onOpenChange,
  onSelectWidget,
  selectionMode = false,
}: WidgetLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');
  const [importerOpen, setImporterOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const { widgets, listWidgets, duplicateWidget, exportWidget, deleteWidget } =
    useCustomWidgetStore();

  // Filter widgets based on search and category
  const filteredWidgets = useMemo(() => {
    return listWidgets({
      search: search || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
    });
  }, [listWidgets, search, selectedCategory]);

  const handleDuplicate = (widgetId: string) => {
    duplicateWidget(widgetId);
  };

  const handleExport = (widgetId: string) => {
    const json = exportWidget(widgetId);
    if (!json) return;

    const widget = widgets.find((w) => w.id === widgetId);
    const filename = `${widget?.name.toLowerCase().replace(/\s+/g, '-') || 'widget'}.json`;

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (widgetId: string) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      deleteWidget(widgetId);
    }
  };

  const handleSelect = (widgetId: string) => {
    if (selectionMode) {
      setSelectedWidgetId(widgetId);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedWidgetId) {
      onSelectWidget?.(selectedWidgetId);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Widget Library
            </DialogTitle>
            <DialogDescription>
              {selectionMode
                ? 'Select a custom widget to add to your dashboard.'
                : 'Manage your custom widgets. Import, export, or delete widgets.'}
            </DialogDescription>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex items-center gap-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search widgets..."
                className="pl-9"
              />
            </div>
            <Button onClick={() => setImporterOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category.value
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Widget Grid */}
          <div className="flex-1 overflow-y-auto py-4">
            {filteredWidgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                  {widgets.length === 0
                    ? 'No custom widgets yet'
                    : 'No widgets match your search'}
                </p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-4">
                  {widgets.length === 0
                    ? 'Import a widget spec JSON to get started.'
                    : 'Try adjusting your search or category filter.'}
                </p>
                {widgets.length === 0 && (
                  <Button variant="outline" onClick={() => setImporterOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Import Your First Widget
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {filteredWidgets.map((widget) => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onSelect={() => handleSelect(widget.id)}
                    onDuplicate={() => handleDuplicate(widget.id)}
                    onExport={() => handleExport(widget.id)}
                    onDelete={() => handleDelete(widget.id)}
                    selected={selectionMode && selectedWidgetId === widget.id}
                    showActions={!selectionMode}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer for selection mode */}
          {selectionMode && (
            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection} disabled={!selectedWidgetId}>
                Add to Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WidgetImporter
        open={importerOpen}
        onOpenChange={setImporterOpen}
        onImport={() => {
          // Widget added, stay in library
        }}
      />
    </>
  );
}
