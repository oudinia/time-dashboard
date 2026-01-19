import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GripVertical, Settings, Trash2, Check, LayoutList, LayoutGrid, Maximize2, CloudSun, Square, RectangleHorizontal, Pencil, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WidgetConfig, WorldClockSettings, FlagDisplayMode } from '@/types/dashboard';
import { ClockDisplayMode } from '@/types/timezone';
import { cn } from '@/lib/utils';

interface WidgetWrapperProps {
  widget: WidgetConfig;
  dashboardId: string;
  children: React.ReactNode;
  title: string;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface TimezonePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function TimezonePicker({ selectedIds, onChange }: TimezonePickerProps) {
  const { t } = useTranslation();
  const { slots } = useTimezoneStore();

  const toggleTimezone = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((tid) => tid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {t('widget.settings.selectTimezones')}
      </p>
      <div className="max-h-60 overflow-y-auto space-y-1">
        {slots.map((slot) => {
          const isSelected = selectedIds.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => toggleTimezone(slot.id)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors',
                isSelected
                  ? 'bg-neutral-100 dark:bg-neutral-800'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              )}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slot.color }}
              />
              <span className="flex-1 text-sm">{slot.label}</span>
              {isSelected && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          );
        })}
        {slots.length === 0 && (
          <p className="text-sm text-neutral-400 p-2">
            {t('timezone.noTimezones')}
          </p>
        )}
      </div>
    </div>
  );
}

interface DisplaySettingsProps {
  displayMode: ClockDisplayMode;
  showWeather: boolean;
  columns: 1 | 2 | 3 | 'auto';
  flagDisplay: FlagDisplayMode;
  onDisplayModeChange: (mode: ClockDisplayMode) => void;
  onShowWeatherChange: (show: boolean) => void;
  onColumnsChange: (cols: 1 | 2 | 3 | 'auto') => void;
  onFlagDisplayChange: (mode: FlagDisplayMode) => void;
}

function DisplaySettings({
  displayMode,
  showWeather,
  columns,
  flagDisplay,
  onDisplayModeChange,
  onShowWeatherChange,
  onColumnsChange,
  onFlagDisplayChange,
}: DisplaySettingsProps) {
  const { t } = useTranslation();

  const displayModes: { mode: ClockDisplayMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { mode: 'compact', label: t('widget.displayModes.compact'), icon: <LayoutList className="w-4 h-4" />, desc: t('widget.displayModes.compactDesc') },
    { mode: 'standard', label: t('widget.displayModes.standard'), icon: <LayoutGrid className="w-4 h-4" />, desc: t('widget.displayModes.standardDesc') },
    { mode: 'expanded', label: t('widget.displayModes.expanded'), icon: <Maximize2 className="w-4 h-4" />, desc: t('widget.displayModes.expandedDesc') },
  ];

  const columnOptions: { value: 1 | 2 | 3 | 'auto'; label: string }[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 'auto', label: t('common.auto') },
  ];

  const flagOptions: { value: FlagDisplayMode; label: string; desc: string }[] = [
    { value: 'both', label: t('widget.flagModes.both'), desc: t('widget.flagModes.bothDesc') },
    { value: 'state', label: t('widget.flagModes.state'), desc: t('widget.flagModes.stateDesc') },
    { value: 'country', label: t('widget.flagModes.country'), desc: t('widget.flagModes.countryDesc') },
    { value: 'none', label: t('widget.flagModes.none'), desc: t('widget.flagModes.noneDesc') },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">{t('widget.settings.displayMode')}</p>
        <div className="grid grid-cols-3 gap-2">
          {displayModes.map(({ mode, label, icon, desc }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onDisplayModeChange(mode)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors',
                displayMode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              {icon}
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] text-neutral-400">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">{t('widget.settings.cardsPerRow')}</p>
        <div className="flex gap-2">
          {columnOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onColumnsChange(value)}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors',
                columns === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Flag className="w-4 h-4 text-neutral-400" />
          <p className="text-sm font-medium">{t('widget.settings.flagDisplay')}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {flagOptions.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFlagDisplayChange(value)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-colors',
                flagDisplay === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] text-neutral-400 text-center leading-tight">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-neutral-400" />
          <div>
            <p className="text-sm font-medium">{t('widget.settings.showWeather')}</p>
            <p className="text-xs text-neutral-400">{t('widget.settings.showWeatherDesc')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onShowWeatherChange(!showWeather)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            showWeather ? 'bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-700'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              showWeather ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </div>
  );
}

export function WidgetWrapper({
  widget,
  dashboardId,
  children,
  title,
  isDragging,
  dragHandleProps,
}: WidgetWrapperProps) {
  const { t } = useTranslation();
  const { updateWidget, deleteWidget } = useDashboardStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingTimezones, setPendingTimezones] = useState<string[]>(widget.timezones);

  // Widget title
  const [pendingTitle, setPendingTitle] = useState(widget.title ?? '');

  // Widget span (full width)
  const [pendingSpan, setPendingSpan] = useState<1 | 2>(widget.span ?? 1);

  // World clock specific settings
  const currentSettings = widget.settings as Partial<WorldClockSettings> || {};
  const [pendingDisplayMode, setPendingDisplayMode] = useState<ClockDisplayMode>(
    currentSettings.displayMode ?? 'standard'
  );
  const [pendingShowWeather, setPendingShowWeather] = useState(
    currentSettings.showWeather ?? true
  );
  const [pendingColumns, setPendingColumns] = useState<1 | 2 | 3 | 'auto'>(
    currentSettings.columns ?? 'auto'
  );
  const [pendingFlagDisplay, setPendingFlagDisplay] = useState<FlagDisplayMode>(
    currentSettings.flagDisplay ?? 'both'
  );

  const isWorldClock = widget.type === 'world-clock';

  const handleDelete = () => {
    if (confirm(t('dashboard.removeWidget'))) {
      deleteWidget(dashboardId, widget.id);
    }
  };

  const handleSaveSettings = () => {
    const updates: Partial<WidgetConfig> = {
      timezones: pendingTimezones,
      span: pendingSpan,
      title: pendingTitle.trim() || undefined, // Clear if empty
    };

    if (isWorldClock) {
      updates.settings = {
        ...currentSettings,
        displayMode: pendingDisplayMode,
        showWeather: pendingShowWeather,
        columns: pendingColumns,
        flagDisplay: pendingFlagDisplay,
      };
    }

    updateWidget(dashboardId, widget.id, updates);
    setIsSettingsOpen(false);
  };

  const openSettings = () => {
    setPendingTimezones(widget.timezones);
    setPendingTitle(widget.title ?? '');
    setPendingSpan(widget.span ?? 1);
    setPendingDisplayMode(currentSettings.displayMode ?? 'standard');
    setPendingShowWeather(currentSettings.showWeather ?? true);
    setPendingColumns(currentSettings.columns ?? 'auto');
    setPendingFlagDisplay(currentSettings.flagDisplay ?? 'both');
    setIsSettingsOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-shadow',
          isDragging && 'shadow-lg ring-2 ring-blue-500'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <GripVertical className="w-4 h-4 text-neutral-400" />
            </div>
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={openSettings}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[150px]">{children}</div>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title} {t('widget.settings.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Widget Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('widget.settings.widgetName')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  placeholder={title}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-1">{t('widget.settings.widgetNamePlaceholder')}</p>
            </div>

            {/* Widget Width */}
            <div>
              <p className="text-sm font-medium mb-2">{t('widget.settings.widgetWidth')}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingSpan(1)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors',
                    pendingSpan === 1
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  )}
                >
                  <Square className="w-4 h-4" />
                  {t('common.half')}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingSpan(2)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors',
                    pendingSpan === 2
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  )}
                >
                  <RectangleHorizontal className="w-4 h-4" />
                  {t('common.full')}
                </button>
              </div>
            </div>

            {isWorldClock && (
              <DisplaySettings
                displayMode={pendingDisplayMode}
                showWeather={pendingShowWeather}
                columns={pendingColumns}
                flagDisplay={pendingFlagDisplay}
                onDisplayModeChange={setPendingDisplayMode}
                onShowWeatherChange={setPendingShowWeather}
                onColumnsChange={setPendingColumns}
                onFlagDisplayChange={setPendingFlagDisplay}
              />
            )}

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <TimezonePicker
                selectedIds={pendingTimezones}
                onChange={setPendingTimezones}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveSettings}>{t('common.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
