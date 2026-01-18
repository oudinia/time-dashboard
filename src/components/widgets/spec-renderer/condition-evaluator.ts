import type { DisplayCondition, ResolvedDataItem, DataField } from '@/types/widget-spec';

/**
 * Safely evaluates a condition against resolved data
 * No eval() or dynamic code execution - purely declarative
 */
export function evaluateCondition(
  condition: DisplayCondition,
  data: ResolvedDataItem
): boolean {
  const field = condition.field as DataField;
  const fieldValue = data[field as keyof ResolvedDataItem];
  const conditionValue = condition.value;

  switch (condition.operator) {
    case 'eq':
      return fieldValue === conditionValue;

    case 'neq':
      return fieldValue !== conditionValue;

    case 'gt':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue > conditionValue;
      }
      return false;

    case 'lt':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue < conditionValue;
      }
      return false;

    case 'gte':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue >= conditionValue;
      }
      return false;

    case 'lte':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue <= conditionValue;
      }
      return false;

    case 'truthy':
      return Boolean(fieldValue);

    case 'falsy':
      return !fieldValue;

    default:
      // Unknown operator - default to true (show the component)
      return true;
  }
}

/**
 * Check if component should be shown based on its showIf condition
 */
export function shouldShowComponent(
  showIf: DisplayCondition | undefined,
  data: ResolvedDataItem
): boolean {
  if (!showIf) {
    // No condition = always show
    return true;
  }

  return evaluateCondition(showIf, data);
}
