import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { Cloud, Droplets, Wind } from 'lucide-react';
import { useMultipleTimezones } from '@/hooks/useCurrentTime';
import { useMultipleWeather } from '@/hooks/useWeather';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getTimezoneAbbreviation, formatDate, getTimezoneOffset } from '@/lib/timezone';
import { getWeatherIcon, getWeatherDescription, WeatherData } from '@/lib/weather';
import { TimeZoneSlot, ClockDisplayMode } from '@/types/timezone';
import { WorldClockSettings } from '@/types/dashboard';

interface WorldClockWidgetProps {
  timezoneIds: string[];
  settings?: Partial<WorldClockSettings>;
}

interface ClockCardProps {
  slot: TimeZoneSlot;
  time: DateTime;
  weather: WeatherData | null;
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  displayMode: ClockDisplayMode;
  showWeather: boolean;
}

function CompactClockCard({ slot, time, weather, timeFormat, showSeconds, showWeather }: Omit<ClockCardProps, 'displayMode'>) {
  const timeFormatString = timeFormat === '12h'
    ? showSeconds ? 'hh:mm:ss a' : 'hh:mm a'
    : showSeconds ? 'HH:mm:ss' : 'HH:mm';

  const formattedTime = time.toFormat(timeFormatString);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: slot.color }}
        />
        <span className="font-medium text-sm truncate">{slot.label}</span>
      </div>
      <div className="flex items-center gap-3">
        {showWeather && weather && (
          <span className="text-sm">{getWeatherIcon(weather.weatherCode, weather.isDay)} {weather.temperature}°</span>
        )}
        <span className="font-mono text-lg font-semibold tabular-nums tracking-tight">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}

function StandardClockCard({ slot, time, weather, timeFormat, showSeconds, showWeather }: Omit<ClockCardProps, 'displayMode'>) {
  const timeFormatString = timeFormat === '12h'
    ? showSeconds ? 'hh:mm:ss a' : 'hh:mm a'
    : showSeconds ? 'HH:mm:ss' : 'HH:mm';

  const formattedTime = time.toFormat(timeFormatString);
  const timezoneAbbr = getTimezoneAbbreviation(slot.timezone);
  const dateStr = formatDate(time);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: slot.color }}
        />
        <span className="font-medium text-sm truncate max-w-[150px]">{slot.label}</span>
      </div>
      <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {formattedTime}
      </span>
      <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        {timezoneAbbr}
      </span>
      <span className="text-xs text-neutral-400 dark:text-neutral-500">
        {dateStr}
      </span>
      {showWeather && weather && (
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span>{getWeatherIcon(weather.weatherCode, weather.isDay)}</span>
          <span className="font-medium">{weather.temperature}°C</span>
          <span className="text-neutral-400">{getWeatherDescription(weather.weatherCode)}</span>
        </div>
      )}
    </div>
  );
}

function ExpandedClockCard({ slot, time, weather, timeFormat, showSeconds, showWeather }: Omit<ClockCardProps, 'displayMode'>) {
  const timeFormatString = timeFormat === '12h'
    ? showSeconds ? 'hh:mm:ss a' : 'hh:mm a'
    : showSeconds ? 'HH:mm:ss' : 'HH:mm';

  const formattedTime = time.toFormat(timeFormatString);
  const timezoneAbbr = getTimezoneAbbreviation(slot.timezone);
  const dateStr = time.toFormat('EEEE, MMMM d, yyyy');
  const offset = getTimezoneOffset(slot.timezone);

  return (
    <div className="flex flex-col p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: slot.color }}
          />
          <div>
            <h3 className="font-semibold text-lg">{slot.label}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {timezoneAbbr} ({offset})
            </p>
          </div>
        </div>
        {showWeather && weather && (
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-2xl">{getWeatherIcon(weather.weatherCode, weather.isDay)}</span>
              <span className="text-2xl font-bold">{weather.temperature}°</span>
            </div>
            <p className="text-xs text-neutral-500">{getWeatherDescription(weather.weatherCode)}</p>
          </div>
        )}
      </div>

      {/* Time */}
      <div className="text-center py-4">
        <span className="font-mono text-5xl font-bold tabular-nums tracking-tight">
          {formattedTime}
        </span>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          {dateStr}
        </p>
      </div>

      {/* Weather Details */}
      {showWeather && weather && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-sm">
            <Cloud className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500 text-xs">Feels like</p>
              <p className="font-medium">{weather.feelsLike}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500 text-xs">Humidity</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500 text-xs">Wind</p>
              <p className="font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Indicator */}
      {slot.workingHours && (
        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <WorkingHoursIndicator slot={slot} time={time} />
        </div>
      )}
    </div>
  );
}

function WorkingHoursIndicator({ slot, time }: { slot: TimeZoneSlot; time: DateTime }) {
  if (!slot.workingHours) return null;

  const { start, end } = slot.workingHours;
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const currentMinutes = time.hour * 60 + time.minute;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const isWorking = currentMinutes >= startMinutes && currentMinutes < endMinutes;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">Working hours</span>
      <div className="flex items-center gap-2">
        <span className="text-neutral-600 dark:text-neutral-400">
          {start} - {end}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          isWorking
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
        }`}>
          {isWorking ? 'Available' : 'Away'}
        </span>
      </div>
    </div>
  );
}

function ClockCard(props: ClockCardProps) {
  switch (props.displayMode) {
    case 'compact':
      return <CompactClockCard {...props} />;
    case 'expanded':
      return <ExpandedClockCard {...props} />;
    default:
      return <StandardClockCard {...props} />;
  }
}

export function WorldClockWidget({ timezoneIds, settings }: WorldClockWidgetProps) {
  const { slots } = useTimezoneStore();
  const { timeFormat, showSeconds } = useSettingsStore();

  const displayMode = settings?.displayMode ?? 'standard';
  const showWeather = settings?.showWeather ?? true;
  const columns = settings?.columns ?? 'auto';

  const selectedSlots = useMemo(() => {
    return timezoneIds
      .map((id) => slots.find((s) => s.id === id))
      .filter(Boolean) as TimeZoneSlot[];
  }, [timezoneIds, slots]);

  const timezones = useMemo(() => selectedSlots.map((s) => s.timezone), [selectedSlots]);
  const times = useMultipleTimezones(timezones);

  // Build coordinates map for weather
  const coordinatesMap = useMemo(() => {
    const map: Record<string, { lat: number; lng: number }> = {};
    selectedSlots.forEach((slot) => {
      if (slot.coordinates) {
        map[slot.timezone] = slot.coordinates;
      }
    });
    return map;
  }, [selectedSlots]);

  const weatherData = useMultipleWeather(
    showWeather ? timezones : [],
    coordinatesMap
  );

  if (selectedSlots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500 p-8">
        <p className="text-center">
          No timezones selected.
          <br />
          <span className="text-sm">Add timezones to this widget to see clocks.</span>
        </p>
      </div>
    );
  }

  // Default grid classes by display mode
  const defaultGridClasses = {
    compact: 'grid gap-2 grid-cols-1',
    standard: 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    expanded: 'grid gap-4 grid-cols-1 lg:grid-cols-2',
  };

  // Column override classes
  const columnClasses = {
    1: 'grid gap-4 grid-cols-1',
    2: 'grid gap-4 grid-cols-1 sm:grid-cols-2',
    3: 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    auto: defaultGridClasses[displayMode],
  };

  const gridClass = columnClasses[columns];

  return (
    <div className="p-4">
      <div className={gridClass}>
        {selectedSlots.map((slot) => (
          <ClockCard
            key={slot.id}
            slot={slot}
            time={times[slot.timezone]}
            weather={weatherData[slot.timezone] ?? null}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
            displayMode={displayMode}
            showWeather={showWeather}
          />
        ))}
      </div>
    </div>
  );
}
