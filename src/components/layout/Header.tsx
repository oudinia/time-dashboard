import { Clock, Moon, Sun } from 'lucide-react';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { getTimezoneAbbreviation } from '@/lib/timezone';

export function Header() {
  const { darkMode, toggleDarkMode, localTimezone, timeFormat } = useSettingsStore();
  const currentTime = useCurrentTime(localTimezone);

  const formattedTime =
    timeFormat === '12h'
      ? currentTime.toFormat('hh:mm a')
      : currentTime.toFormat('HH:mm');

  const timezoneAbbr = getTimezoneAbbreviation(localTimezone);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold">Time Zone Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-2xl font-mono font-semibold tabular-nums">
              {formattedTime}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {timezoneAbbr}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
