import type { ComponentType } from 'react';
import type { DisplayComponentType, DisplayStyle, LayoutConfig } from '@/types/widget-spec';

import { DigitalClock } from './DigitalClock';
import { AnalogClock } from './AnalogClock';
import { TimeLabel } from './TimeLabel';
import { DateLabel } from './DateLabel';
import { TimezoneBadge } from './TimezoneBadge';
import { OffsetBadge } from './OffsetBadge';
import { HolidayCountdown } from './HolidayCountdown';
import { WorkingStatus } from './WorkingStatus';
import { StatCard } from './StatCard';
import { ComparisonBar } from './ComparisonBar';
import { ColorDot } from './ColorDot';
import { TextDisplay } from './TextDisplay';
import { Divider } from './Divider';
import { Spacer } from './Spacer';
import { Container } from './Container';
import { Card } from './Card';

// Base props that all display components receive
export interface DisplayComponentProps {
  style?: DisplayStyle;
  className?: string;
  children?: React.ReactNode;
  layout?: LayoutConfig;
}

// Registry of component types to their specific props
export interface ComponentPropsMap {
  'digital-clock': { time: string };
  'analog-clock': { time: string };
  'time-label': { time: string; label?: string };
  'date-label': { date: string };
  'timezone-badge': { abbreviation: string };
  'offset-badge': { offset: string };
  'holiday-countdown': { nextHoliday: string | null; daysUntilHoliday: number | null };
  'working-status': { isWorkingTime: boolean; hoursUntilStart?: number | null; hoursUntilEnd?: number | null };
  'stat-card': { label: string; value: string | number; icon?: string };
  'comparison-bar': { time: string; workingHours?: { start: string; end: string } | null; color?: string; label?: string };
  'color-dot': { color: string };
  'text': { content: string };
  'divider': { orientation?: 'horizontal' | 'vertical' };
  'spacer': Record<string, never>;
  'container': { children?: React.ReactNode };
  'card': { children?: React.ReactNode };
}

// The component registry - maps component types to their React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<DisplayComponentType, ComponentType<any>> = {
  'digital-clock': DigitalClock,
  'analog-clock': AnalogClock,
  'time-label': TimeLabel,
  'date-label': DateLabel,
  'timezone-badge': TimezoneBadge,
  'offset-badge': OffsetBadge,
  'holiday-countdown': HolidayCountdown,
  'working-status': WorkingStatus,
  'stat-card': StatCard,
  'comparison-bar': ComparisonBar,
  'color-dot': ColorDot,
  'text': TextDisplay,
  'divider': Divider,
  'spacer': Spacer,
  'container': Container,
  'card': Card,
};

// Helper to check if a component type is valid
export function isValidComponentType(type: string): type is DisplayComponentType {
  return type in componentRegistry;
}

// Helper to get a component by type
export function getComponent(type: DisplayComponentType): ComponentType<DisplayComponentProps & Record<string, unknown>> | null {
  return componentRegistry[type] || null;
}

// List of all available component types
export const availableComponentTypes = Object.keys(componentRegistry) as DisplayComponentType[];

// Props that each component type expects (for binding resolution)
export const componentPropBindings: Record<DisplayComponentType, string[]> = {
  'digital-clock': ['time'],
  'analog-clock': ['time'],
  'time-label': ['time', 'label'],
  'date-label': ['date'],
  'timezone-badge': ['abbreviation'],
  'offset-badge': ['offset'],
  'holiday-countdown': ['nextHoliday', 'daysUntilHoliday'],
  'working-status': ['isWorkingTime', 'hoursUntilStart', 'hoursUntilEnd'],
  'stat-card': ['label', 'value', 'icon'],
  'comparison-bar': ['time', 'workingHours', 'color', 'label'],
  'color-dot': ['color'],
  'text': ['content'],
  'divider': ['orientation'],
  'spacer': [],
  'container': [],
  'card': [],
};
