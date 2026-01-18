// Display Components for Widget Spec Rendering
export { DigitalClock } from './DigitalClock';
export { AnalogClock } from './AnalogClock';
export { TimeLabel } from './TimeLabel';
export { DateLabel } from './DateLabel';
export { TimezoneBadge } from './TimezoneBadge';
export { OffsetBadge } from './OffsetBadge';
export { HolidayCountdown } from './HolidayCountdown';
export { WorkingStatus } from './WorkingStatus';
export { StatCard } from './StatCard';
export { ComparisonBar } from './ComparisonBar';
export { ColorDot } from './ColorDot';
export { TextDisplay } from './TextDisplay';
export { Divider } from './Divider';
export { Spacer } from './Spacer';
export { Container } from './Container';
export { Card } from './Card';

// Registry
export {
  componentRegistry,
  isValidComponentType,
  getComponent,
  availableComponentTypes,
  componentPropBindings,
} from './registry';

export type { DisplayComponentProps, ComponentPropsMap } from './registry';
