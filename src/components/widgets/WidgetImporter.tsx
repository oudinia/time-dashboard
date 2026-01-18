import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { parseWidgetSpec } from '@/lib/widget-validator';
import { useCustomWidgetStore } from '@/stores/customWidgetStore';
import type { WidgetSpec } from '@/types/widget-spec';
import { cn } from '@/lib/utils';

interface WidgetImporterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (widgetId: string) => void;
}

export function WidgetImporter({ open, onOpenChange, onImport }: WidgetImporterProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: Array<{ path: string; message: string }>;
    warnings?: string[];
    spec?: WidgetSpec;
  } | null>(null);
  const [importing, setImporting] = useState(false);

  const { addWidget } = useCustomWidgetStore();

  const handleJsonChange = (value: string) => {
    setJsonInput(value);

    if (!value.trim()) {
      setValidationResult(null);
      return;
    }

    const result = parseWidgetSpec(value);
    setValidationResult({
      valid: result.validation.valid,
      errors: result.validation.errors,
      warnings: result.validation.warnings,
      spec: result.spec ?? undefined,
    });
  };

  const handleImport = () => {
    if (!validationResult?.valid || !validationResult.spec) return;

    setImporting(true);

    try {
      const newWidget = addWidget({ spec: validationResult.spec });
      if (newWidget) {
        onImport?.(newWidget.id);
        onOpenChange(false);
        setJsonInput('');
        setValidationResult(null);
      }
    } finally {
      setImporting(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleJsonChange(text);
    } catch (e) {
      console.error('Failed to read clipboard:', e);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleJsonChange(text);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Widget
          </DialogTitle>
          <DialogDescription>
            Paste a widget specification JSON to import a custom widget.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasteFromClipboard}
            >
              Paste from Clipboard
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <FileJson className="w-4 h-4 mr-1" />
                  Upload JSON File
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Widget Spec JSON</label>
            <textarea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder={`{
  "version": "1.0",
  "meta": { "name": "My Widget", ... },
  "data": { "source": "timezones", ... },
  "layout": { "type": "grid", ... },
  "display": [ ... ]
}`}
              className={cn(
                'w-full h-64 p-3 font-mono text-sm rounded-lg border',
                'bg-neutral-50 dark:bg-neutral-900',
                'border-neutral-200 dark:border-neutral-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'resize-none'
              )}
            />
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div
              className={cn(
                'rounded-lg p-4 border',
                validationResult.valid
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              )}
            >
              <div className="flex items-start gap-2">
                {validationResult.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  {validationResult.valid ? (
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Valid Widget Spec
                      </p>
                      {validationResult.spec && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Ready to import: <strong>{validationResult.spec.meta.name}</strong>
                          {validationResult.spec.meta.description && (
                            <span className="block text-green-600 dark:text-green-400">
                              {validationResult.spec.meta.description}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Validation Errors ({validationResult.errors.length})
                      </p>
                      <ul className="mt-2 space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <li
                            key={index}
                            className="text-sm text-red-700 dark:text-red-300"
                          >
                            <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded text-xs">
                              {error.path || 'root'}
                            </code>{' '}
                            {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.warnings && validationResult.warnings.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Warnings:
                      </p>
                      <ul className="mt-1 space-y-1">
                        {validationResult.warnings.map((warning, index) => (
                          <li
                            key={index}
                            className="text-sm text-yellow-600 dark:text-yellow-400"
                          >
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validationResult?.valid || importing}
          >
            {importing ? 'Importing...' : 'Import Widget'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
