import type {
  WidgetSpec,
  WidgetSpecValidationError,
  WidgetSpecValidationResult,
  DataSource,
  DataField,
  DisplayComponentType,
  LayoutType,
  GapSize,
  DisplayConfig,
} from '@/types/widget-spec';
import { availableComponentTypes } from '@/components/widgets/display-components/registry';

// Valid values for each type
const validDataSources: DataSource[] = ['timezones', 'holidays'];

const validDataFields: DataField[] = [
  'time', 'date', 'timezone', 'label', 'country', 'color',
  'offset', 'abbreviation', 'workingHours', 'isWorkingTime',
  'hoursUntilStart', 'hoursUntilEnd', 'nextHoliday',
  'daysUntilHoliday', 'holidays',
];

const validLayoutTypes: LayoutType[] = ['grid', 'flex', 'stack', 'single'];
const validGapSizes: GapSize[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

// Security patterns to check against
const dangerousPatterns = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,  // onClick=, onError=, etc.
  /data:\s*text\/html/i,
  /<iframe/i,
  /<embed/i,
  /<object/i,
];

/**
 * Check a string for potential XSS or injection attacks
 */
function containsDangerousContent(value: unknown): boolean {
  if (typeof value !== 'string') return false;

  return dangerousPatterns.some(pattern => pattern.test(value));
}

/**
 * Recursively check an object for dangerous content
 */
function checkObjectForDangerousContent(obj: unknown, path: string): WidgetSpecValidationError[] {
  const errors: WidgetSpecValidationError[] = [];

  if (typeof obj === 'string') {
    if (containsDangerousContent(obj)) {
      errors.push({
        path,
        message: 'String contains potentially dangerous content (script, javascript:, event handlers)',
        code: 'SECURITY_VIOLATION',
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      errors.push(...checkObjectForDangerousContent(item, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      errors.push(...checkObjectForDangerousContent(value, `${path}.${key}`));
    });
  }

  return errors;
}

/**
 * Validate a single display config
 */
function validateDisplayConfig(
  config: DisplayConfig,
  path: string,
  errors: WidgetSpecValidationError[]
): void {
  // Check component type
  if (!config.component) {
    errors.push({
      path: `${path}.component`,
      message: 'Display component must have a "component" property',
      code: 'MISSING_REQUIRED',
    });
  } else if (!availableComponentTypes.includes(config.component as DisplayComponentType)) {
    errors.push({
      path: `${path}.component`,
      message: `Invalid component type "${config.component}". Available types: ${availableComponentTypes.join(', ')}`,
      code: 'INVALID_VALUE',
    });
  }

  // Validate bindings - check that bound fields are valid data fields
  if (config.bindings) {
    Object.entries(config.bindings).forEach(([propName, fieldName]) => {
      // Only validate if it looks like a data field (not a static string like a color value)
      if (validDataFields.includes(fieldName as DataField)) {
        // Valid data field - OK
      } else if (fieldName.startsWith('#') || fieldName.includes(' ')) {
        // Looks like a color or static string - OK
      } else {
        // Could be a typo for a data field
        const similar = validDataFields.find(f =>
          f.toLowerCase() === fieldName.toLowerCase()
        );
        if (similar) {
          errors.push({
            path: `${path}.bindings.${propName}`,
            message: `Did you mean "${similar}" instead of "${fieldName}"?`,
            code: 'INVALID_VALUE',
          });
        }
      }
    });
  }

  // Validate children recursively
  if (config.children) {
    config.children.forEach((child, index) => {
      validateDisplayConfig(child, `${path}.children[${index}]`, errors);
    });
  }
}

/**
 * Validate a widget specification
 */
export function validateWidgetSpec(spec: unknown): WidgetSpecValidationResult {
  const errors: WidgetSpecValidationError[] = [];
  const warnings: string[] = [];

  // Type check
  if (!spec || typeof spec !== 'object') {
    return {
      valid: false,
      errors: [{
        path: '',
        message: 'Widget spec must be an object',
        code: 'INVALID_TYPE',
      }],
    };
  }

  const widgetSpec = spec as Record<string, unknown>;

  // Security check - scan entire spec for dangerous content
  errors.push(...checkObjectForDangerousContent(spec, ''));

  // Version check
  if (widgetSpec.version !== '1.0') {
    errors.push({
      path: 'version',
      message: 'Widget spec version must be "1.0"',
      code: 'INVALID_VALUE',
    });
  }

  // Meta validation
  if (!widgetSpec.meta || typeof widgetSpec.meta !== 'object') {
    errors.push({
      path: 'meta',
      message: 'Widget spec must have a "meta" object',
      code: 'MISSING_REQUIRED',
    });
  } else {
    const meta = widgetSpec.meta as Record<string, unknown>;
    if (!meta.name || typeof meta.name !== 'string') {
      errors.push({
        path: 'meta.name',
        message: 'Widget meta must have a "name" string',
        code: 'MISSING_REQUIRED',
      });
    }
  }

  // Data validation
  if (!widgetSpec.data || typeof widgetSpec.data !== 'object') {
    errors.push({
      path: 'data',
      message: 'Widget spec must have a "data" object',
      code: 'MISSING_REQUIRED',
    });
  } else {
    const data = widgetSpec.data as Record<string, unknown>;

    if (!validDataSources.includes(data.source as DataSource)) {
      errors.push({
        path: 'data.source',
        message: `Invalid data source "${data.source}". Available sources: ${validDataSources.join(', ')}`,
        code: 'INVALID_VALUE',
      });
    }

    if (!Array.isArray(data.fields)) {
      errors.push({
        path: 'data.fields',
        message: 'data.fields must be an array',
        code: 'INVALID_TYPE',
      });
    } else {
      data.fields.forEach((field, index) => {
        if (!validDataFields.includes(field as DataField)) {
          errors.push({
            path: `data.fields[${index}]`,
            message: `Invalid data field "${field}". Available fields: ${validDataFields.join(', ')}`,
            code: 'INVALID_VALUE',
          });
        }
      });
    }
  }

  // Layout validation
  if (!widgetSpec.layout || typeof widgetSpec.layout !== 'object') {
    errors.push({
      path: 'layout',
      message: 'Widget spec must have a "layout" object',
      code: 'MISSING_REQUIRED',
    });
  } else {
    const layout = widgetSpec.layout as Record<string, unknown>;

    if (!validLayoutTypes.includes(layout.type as LayoutType)) {
      errors.push({
        path: 'layout.type',
        message: `Invalid layout type "${layout.type}". Available types: ${validLayoutTypes.join(', ')}`,
        code: 'INVALID_VALUE',
      });
    }

    if (layout.gap && !validGapSizes.includes(layout.gap as GapSize)) {
      errors.push({
        path: 'layout.gap',
        message: `Invalid gap size "${layout.gap}". Available sizes: ${validGapSizes.join(', ')}`,
        code: 'INVALID_VALUE',
      });
    }
  }

  // Display validation
  if (!Array.isArray(widgetSpec.display)) {
    errors.push({
      path: 'display',
      message: 'Widget spec must have a "display" array',
      code: 'MISSING_REQUIRED',
    });
  } else {
    if (widgetSpec.display.length === 0) {
      warnings.push('Display array is empty - widget will show nothing');
    }

    widgetSpec.display.forEach((displayConfig, index) => {
      validateDisplayConfig(
        displayConfig as DisplayConfig,
        `display[${index}]`,
        errors
      );
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Safely parse and validate a JSON string as a widget spec
 */
export function parseWidgetSpec(jsonString: string): {
  spec: WidgetSpec | null;
  validation: WidgetSpecValidationResult;
  parseError?: string;
} {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return {
      spec: null,
      validation: {
        valid: false,
        errors: [{
          path: '',
          message: `JSON parse error: ${e instanceof Error ? e.message : 'Unknown error'}`,
          code: 'INVALID_TYPE',
        }],
      },
      parseError: e instanceof Error ? e.message : 'Unknown parse error',
    };
  }

  const validation = validateWidgetSpec(parsed);

  return {
    spec: validation.valid ? (parsed as WidgetSpec) : null,
    validation,
  };
}
