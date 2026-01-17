import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { COMMON_TIMEZONES } from '@/lib/timezone';
import { cn } from '@/lib/utils';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

export function TimezoneSelector({ value, onChange, className }: TimezoneSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allTimezones = useMemo(() => {
    try {
      // supportedValuesOf is available in modern browsers
      const intlTimezones = (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.('timeZone') ?? [];
      const allTz = new Set([
        ...COMMON_TIMEZONES.map((t) => t.value),
        ...intlTimezones,
      ]);
      return Array.from(allTz).sort();
    } catch {
      return COMMON_TIMEZONES.map((t) => t.value);
    }
  }, []);

  const filteredTimezones = useMemo(() => {
    if (!search) {
      return COMMON_TIMEZONES;
    }
    const searchLower = search.toLowerCase();
    return allTimezones
      .filter((tz) => tz.toLowerCase().includes(searchLower))
      .slice(0, 20)
      .map((tz) => ({
        value: tz,
        label: tz.replace(/_/g, ' '),
      }));
  }, [search, allTimezones]);

  const selectedLabel =
    COMMON_TIMEZONES.find((t) => t.value === value)?.label ||
    value.replace(/_/g, ' ');

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <Search className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <div className="p-2">
              <Input
                placeholder="Search timezone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredTimezones.map((tz) => (
                <button
                  key={tz.value}
                  type="button"
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    value === tz.value && 'bg-neutral-100 dark:bg-neutral-800'
                  )}
                  onClick={() => {
                    onChange(tz.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {tz.label}
                </button>
              ))}
              {filteredTimezones.length === 0 && (
                <div className="px-3 py-2 text-sm text-neutral-500">
                  No timezones found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
