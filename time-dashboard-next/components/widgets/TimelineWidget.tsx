'use client';

import { useMemo, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { TimeZoneSlot } from '@/types/timezone';

interface TimelineWidgetProps {
  timezoneIds: string[];
  showWorkingHours?: boolean;
}

interface TimelineRowProps {
  slot: TimeZoneSlot;
  showWorkingHours: boolean;
}

function TimelineRow({ slot, showWorkingHours }: TimelineRowProps) {
  const [now, setNow] = useState(() => DateTime.now().setZone(slot.timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now().setZone(slot.timezone));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [slot.timezone]);

  // Calculate position of current time (0-100%)
  const currentHour = now.hour + now.minute / 60;
  const currentPosition = (currentHour / 24) * 100;

  // Calculate working hours positions
  const workingStart = slot.workingHours
    ? (parseInt(slot.workingHours.start.split(':')[0], 10) +
        parseInt(slot.workingHours.start.split(':')[1], 10) / 60) /
      24 *
      100
    : 0;
  const workingEnd = slot.workingHours
    ? (parseInt(slot.workingHours.end.split(':')[0], 10) +
        parseInt(slot.workingHours.end.split(':')[1], 10) / 60) /
      24 *
      100
    : 0;
  const workingWidth = workingEnd - workingStart;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 w-32 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: slot.color }}
        />
        <span className="text-sm font-medium truncate">{slot.label}</span>
      </div>
      <div className="flex-1 relative h-6 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
        {/* Working hours highlight */}
        {showWorkingHours && slot.workingHours && (
          <div
            className="absolute top-0 h-full opacity-20"
            style={{
              left: `${workingStart}%`,
              width: `${workingWidth}%`,
              backgroundColor: slot.color,
            }}
          />
        )}
        {/* Current time marker */}
        <div
          className="absolute top-0 h-full w-0.5 -translate-x-1/2"
          style={{
            left: `${currentPosition}%`,
            backgroundColor: slot.color,
          }}
        />
        {/* Time label */}
        <div
          className="absolute top-0 h-full flex items-center"
          style={{
            left: `${currentPosition}%`,
            transform: `translateX(${currentPosition > 80 ? '-100%' : '4px'})`,
          }}
        >
          <span
            className="text-xs font-mono px-1 rounded"
            style={{
              backgroundColor: slot.color,
              color: 'white',
            }}
          >
            {now.toFormat('HH:mm')}
          </span>
        </div>
      </div>
      <div className="w-12 text-right text-xs text-neutral-400 shrink-0">
        {now.offsetNameShort}
      </div>
    </div>
  );
}

// Hour markers component
function TimelineHourMarkers() {
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <div className="flex items-center gap-3 pb-1 border-b border-neutral-200 dark:border-neutral-700">
      <div className="w-32 shrink-0" />
      <div className="flex-1 relative h-4">
        {hours.map((hour) => (
          <div
            key={hour}
            className="absolute text-[10px] text-neutral-400 dark:text-neutral-500 -translate-x-1/2"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            {hour.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
      <div className="w-12 shrink-0" />
    </div>
  );
}

export function TimelineWidget({ timezoneIds, showWorkingHours = true }: TimelineWidgetProps) {
  const { slots } = useTimezoneStore();

  const selectedSlots = useMemo(() => {
    return timezoneIds
      .map((id) => slots.find((s) => s.id === id))
      .filter(Boolean) as TimeZoneSlot[];
  }, [timezoneIds, slots]);

  if (selectedSlots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500 p-8">
        <p className="text-center">
          No timezones selected.
          <br />
          <span className="text-sm">Add timezones to this widget to see the timeline.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <TimelineHourMarkers />
      <div className="space-y-0">
        {selectedSlots.map((slot) => (
          <TimelineRow key={slot.id} slot={slot} showWorkingHours={showWorkingHours} />
        ))}
      </div>
    </div>
  );
}
