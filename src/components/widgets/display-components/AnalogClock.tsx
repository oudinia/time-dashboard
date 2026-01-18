import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { DisplayStyle } from '@/types/widget-spec';

interface AnalogClockProps {
  time: string;  // Expected format: "HH:mm" or "HH:mm:ss"
  style?: DisplayStyle;
  className?: string;
}

const sizeMap = {
  xs: 48,
  sm: 64,
  md: 96,
  lg: 128,
  xl: 160,
  '2xl': 192,
};

export function AnalogClock({ time, style, className }: AnalogClockProps) {
  const size = sizeMap[style?.size || 'md'];

  const { hourAngle, minuteAngle, secondAngle, hasSeconds } = useMemo(() => {
    const parts = time.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2];

    // Hour hand: 30 degrees per hour + 0.5 degrees per minute
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    // Minute hand: 6 degrees per minute
    const minuteDeg = minutes * 6;
    // Second hand: 6 degrees per second
    const secondDeg = seconds !== undefined ? seconds * 6 : 0;

    return {
      hourAngle: hourDeg,
      minuteAngle: minuteDeg,
      secondAngle: secondDeg,
      hasSeconds: seconds !== undefined,
    };
  }, [time]);

  const center = size / 2;
  const radius = (size / 2) - 4;
  const hourLength = radius * 0.5;
  const minuteLength = radius * 0.7;
  const secondLength = radius * 0.8;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('analog-clock', className)}
      style={{ opacity: style?.opacity }}
    >
      {/* Clock face */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-neutral-200 dark:text-neutral-700"
      />

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (radius - 6) * Math.cos(angle);
        const y1 = center + (radius - 6) * Math.sin(angle);
        const x2 = center + (radius - 2) * Math.cos(angle);
        const y2 = center + (radius - 2) * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 2 : 1}
            className="text-neutral-400 dark:text-neutral-500"
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={center + hourLength * Math.sin(hourAngle * Math.PI / 180)}
        y2={center - hourLength * Math.cos(hourAngle * Math.PI / 180)}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        className="text-neutral-800 dark:text-neutral-200"
      />

      {/* Minute hand */}
      <line
        x1={center}
        y1={center}
        x2={center + minuteLength * Math.sin(minuteAngle * Math.PI / 180)}
        y2={center - minuteLength * Math.cos(minuteAngle * Math.PI / 180)}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="text-neutral-700 dark:text-neutral-300"
      />

      {/* Second hand (optional) */}
      {hasSeconds && (
        <line
          x1={center}
          y1={center}
          x2={center + secondLength * Math.sin(secondAngle * Math.PI / 180)}
          y2={center - secondLength * Math.cos(secondAngle * Math.PI / 180)}
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          className="text-red-500"
        />
      )}

      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={3}
        fill="currentColor"
        className="text-neutral-800 dark:text-neutral-200"
      />
    </svg>
  );
}
