import type { WidgetSpec } from '@/types/widget-spec';

/**
 * Preset widget templates for users to get started quickly
 */

export const PRESET_WIDGETS: { id: string; spec: WidgetSpec }[] = [
  // Simple Multi-Clock Grid
  {
    id: 'office-clocks',
    spec: {
      version: '1.0',
      meta: {
        name: 'Office Clocks',
        description: 'Digital clocks for selected timezones with holiday countdown',
        icon: 'clock',
        category: 'clocks',
        tags: ['clock', 'digital', 'office'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label', 'color', 'abbreviation', 'nextHoliday', 'daysUntilHoliday'],
      },
      layout: {
        type: 'grid',
        columns: 3,
        gap: 'md',
      },
      display: [
        { component: 'color-dot', bindings: { color: 'color' } },
        {
          component: 'text',
          bindings: { content: 'label' },
          style: { fontWeight: 'medium', size: 'sm' },
        },
        {
          component: 'digital-clock',
          bindings: { time: 'time' },
          style: { size: 'lg' },
        },
        { component: 'timezone-badge', bindings: { abbreviation: 'abbreviation' } },
        {
          component: 'holiday-countdown',
          bindings: { nextHoliday: 'nextHoliday', daysUntilHoliday: 'daysUntilHoliday' },
        },
      ],
    },
  },

  // Compact Clock List
  {
    id: 'compact-clocks',
    spec: {
      version: '1.0',
      meta: {
        name: 'Compact Clock List',
        description: 'Space-efficient clock display with timezone info',
        icon: 'list',
        category: 'clocks',
        tags: ['clock', 'compact', 'list'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label', 'color', 'offset'],
      },
      layout: {
        type: 'stack',
        gap: 'sm',
      },
      display: [
        {
          component: 'container',
          layout: { type: 'flex', direction: 'row', align: 'center', justify: 'between', gap: 'md' },
          children: [
            {
              component: 'container',
              layout: { type: 'flex', direction: 'row', align: 'center', gap: 'sm' },
              children: [
                { component: 'color-dot', bindings: { color: 'color' }, style: { size: 'sm' } },
                { component: 'text', bindings: { content: 'label' }, style: { fontWeight: 'medium' } },
              ],
            },
            {
              component: 'container',
              layout: { type: 'flex', direction: 'row', align: 'center', gap: 'sm' },
              children: [
                { component: 'digital-clock', bindings: { time: 'time' }, style: { size: 'md' } },
                { component: 'offset-badge', bindings: { offset: 'offset' }, style: { size: 'xs' } },
              ],
            },
          ],
        },
      ],
    },
  },

  // Analog Clock Grid
  {
    id: 'analog-clocks',
    spec: {
      version: '1.0',
      meta: {
        name: 'Analog Clocks',
        description: 'Classic analog clock display for multiple timezones',
        icon: 'clock',
        category: 'clocks',
        tags: ['clock', 'analog', 'classic'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label', 'abbreviation'],
      },
      layout: {
        type: 'grid',
        columns: 3,
        gap: 'lg',
      },
      display: [
        { component: 'analog-clock', bindings: { time: 'time' }, style: { size: 'lg' } },
        {
          component: 'text',
          bindings: { content: 'label' },
          style: { fontWeight: 'medium', textAlign: 'center', size: 'sm' },
        },
        {
          component: 'timezone-badge',
          bindings: { abbreviation: 'abbreviation' },
          style: { size: 'xs' },
        },
      ],
    },
  },

  // Working Status Dashboard
  {
    id: 'working-status',
    spec: {
      version: '1.0',
      meta: {
        name: 'Working Status',
        description: 'See who is currently working and their status',
        icon: 'users',
        category: 'stats',
        tags: ['status', 'working', 'team'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label', 'color', 'isWorkingTime', 'hoursUntilStart', 'hoursUntilEnd'],
      },
      layout: {
        type: 'grid',
        columns: 2,
        gap: 'md',
      },
      display: [
        {
          component: 'container',
          layout: { type: 'flex', direction: 'row', align: 'center', justify: 'between', gap: 'sm' },
          style: { padding: 'sm' },
          children: [
            {
              component: 'container',
              layout: { type: 'flex', direction: 'row', align: 'center', gap: 'sm' },
              children: [
                { component: 'color-dot', bindings: { color: 'color' } },
                { component: 'text', bindings: { content: 'label' }, style: { fontWeight: 'medium' } },
              ],
            },
            {
              component: 'working-status',
              bindings: {
                isWorkingTime: 'isWorkingTime',
                hoursUntilStart: 'hoursUntilStart',
                hoursUntilEnd: 'hoursUntilEnd',
              },
            },
          ],
        },
      ],
    },
  },

  // Holiday Countdown
  {
    id: 'holiday-countdown',
    spec: {
      version: '1.0',
      meta: {
        name: 'Holiday Countdown',
        description: 'Track upcoming holidays for each timezone',
        icon: 'calendar',
        category: 'holidays',
        tags: ['holiday', 'countdown', 'calendar'],
      },
      data: {
        source: 'timezones',
        fields: ['label', 'color', 'country', 'nextHoliday', 'daysUntilHoliday'],
      },
      layout: {
        type: 'stack',
        gap: 'md',
      },
      display: [
        {
          component: 'card',
          style: { padding: 'md' },
          layout: { type: 'stack', gap: 'sm' },
          children: [
            {
              component: 'container',
              layout: { type: 'flex', direction: 'row', align: 'center', gap: 'sm' },
              children: [
                { component: 'color-dot', bindings: { color: 'color' } },
                { component: 'text', bindings: { content: 'label' }, style: { fontWeight: 'semibold' } },
              ],
            },
            {
              component: 'holiday-countdown',
              bindings: { nextHoliday: 'nextHoliday', daysUntilHoliday: 'daysUntilHoliday' },
              style: { size: 'md' },
            },
          ],
        },
      ],
    },
  },

  // Time Comparison Bars
  {
    id: 'time-comparison',
    spec: {
      version: '1.0',
      meta: {
        name: 'Time Comparison',
        description: '24-hour timeline bars for comparing time across zones',
        icon: 'chart',
        category: 'timelines',
        tags: ['timeline', 'comparison', 'bar'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label', 'color', 'workingHours'],
      },
      layout: {
        type: 'stack',
        gap: 'lg',
        padding: 'md',
      },
      display: [
        {
          component: 'comparison-bar',
          bindings: {
            time: 'time',
            label: 'label',
            color: 'color',
            workingHours: 'workingHours',
          },
          style: { size: 'md' },
        },
      ],
    },
  },

  // Minimal Clock
  {
    id: 'minimal-clock',
    spec: {
      version: '1.0',
      meta: {
        name: 'Minimal Clocks',
        description: 'Clean, minimalist time display',
        icon: 'clock',
        category: 'clocks',
        tags: ['minimal', 'clean', 'simple'],
      },
      data: {
        source: 'timezones',
        fields: ['time', 'label'],
      },
      layout: {
        type: 'grid',
        columns: 'auto',
        gap: 'lg',
      },
      display: [
        {
          component: 'digital-clock',
          bindings: { time: 'time' },
          style: { size: '2xl', fontWeight: 'semibold' },
        },
        {
          component: 'text',
          bindings: { content: 'label' },
          style: { size: 'sm', textAlign: 'center' },
        },
      ],
    },
  },
];

/**
 * Get a preset widget by ID
 */
export function getPresetWidget(id: string): WidgetSpec | null {
  const preset = PRESET_WIDGETS.find((p) => p.id === id);
  return preset?.spec ?? null;
}

/**
 * Get all preset widgets for a category
 */
export function getPresetsByCategory(category: string): typeof PRESET_WIDGETS {
  return PRESET_WIDGETS.filter((p) => p.spec.meta.category === category);
}
