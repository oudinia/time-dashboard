import { useState, useRef } from 'react';
import { Plus, Download, Upload, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { WidgetConfig } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface DashboardEditorProps {
  dashboardId: string;
}

interface WidgetOption {
  type: WidgetConfig['type'];
  label: string;
  description: string;
  icon: React.ReactNode;
}

const WIDGET_OPTIONS: WidgetOption[] = [
  {
    type: 'world-clock',
    label: 'World Clock',
    description: 'Display clocks for multiple timezones',
    icon: <Clock className="w-8 h-8" />,
  },
  {
    type: 'timeline',
    label: 'Timeline',
    description: '24-hour bar showing time across zones',
    icon: <BarChart3 className="w-8 h-8" />,
  },
];

export function DashboardEditor({ dashboardId }: DashboardEditorProps) {
  const { addWidget, exportDashboard, importDashboard } = useDashboardStore();
  const { slots } = useTimezoneStore();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddWidget = (type: WidgetConfig['type']) => {
    // Add widget with all available timezones by default
    const timezoneIds = slots.map((s) => s.id);
    addWidget(dashboardId, type, timezoneIds);
    setIsAddWidgetOpen(false);
  };

  const handleExport = () => {
    const json = exportDashboard(dashboardId);
    if (!json) return;

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = importDashboard(text);
      if (!result) {
        setImportError('Invalid dashboard file format');
      } else {
        setIsImportOpen(false);
        setImportText('');
        setImportError(null);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportText = () => {
    if (!importText.trim()) {
      setImportError('Please paste a dashboard JSON');
      return;
    }

    const result = importDashboard(importText);
    if (!result) {
      setImportError('Invalid dashboard JSON format');
    } else {
      setIsImportOpen(false);
      setImportText('');
      setImportError(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setIsAddWidgetOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Widget
        </Button>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsImportOpen(true)}>
          <Upload className="w-4 h-4 mr-1" />
          Import
        </Button>
      </div>

      {/* Add Widget Dialog */}
      <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {WIDGET_OPTIONS.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleAddWidget(option.type)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700',
                  'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors',
                  'text-center'
                )}
              >
                <div className="text-neutral-600 dark:text-neutral-300">
                  {option.icon}
                </div>
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
              <span className="text-xs text-neutral-400">or paste JSON</span>
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
            </div>

            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportError(null);
              }}
              placeholder="Paste dashboard JSON here..."
              className={cn(
                'w-full h-32 px-3 py-2 text-sm rounded-md border bg-transparent',
                'border-neutral-200 dark:border-neutral-800',
                'focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-neutral-300',
                'font-mono'
              )}
            />

            {importError && (
              <p className="text-sm text-red-500">{importError}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportText} disabled={!importText.trim()}>
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
