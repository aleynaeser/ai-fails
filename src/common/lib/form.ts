import type { z } from 'zod';

type ZodTypeAny = z.ZodTypeAny;
type ZodObjectAny = z.ZodObject<Record<string, ZodTypeAny>>;

/** Unwrap ZodDefault, ZodOptional, ZodNullable to get inner type and default when applicable */
function getInnerAndDefault(schema: ZodTypeAny): { inner: ZodTypeAny; defaultVal?: unknown } {
  const def = (schema as { _def?: { typeName?: string; innerType?: ZodTypeAny; defaultValue?: unknown } })._def;
  if (!def) return { inner: schema };

  const name = def.typeName as string | undefined;

  if (name === 'ZodDefault') {
    const inner = def.innerType as ZodTypeAny | undefined;
    let defaultVal = def.defaultValue;
    if (typeof defaultVal === 'function') defaultVal = defaultVal();
    return { inner: inner ?? schema, defaultVal };
  }
  if (name === 'ZodOptional' || name === 'ZodNullable') {
    const inner = def.innerType as ZodTypeAny | undefined;
    return { inner: inner ?? schema, defaultVal: undefined };
  }

  return { inner: schema };
}

/** Single default value by Zod type (after unwrapping optional/default) */
function getDefaultForSchema(schema: ZodTypeAny): unknown {
  const { inner, defaultVal } = getInnerAndDefault(schema);
  if (defaultVal !== undefined) return defaultVal;

  const def = (inner as { _def?: { typeName?: string; shape?: Record<string, ZodTypeAny> } })._def;
  if (!def) return undefined;

  const name = def.typeName as string | undefined;

  switch (name) {
    case 'ZodString':
      return '';
    case 'ZodNumber':
      return 0;
    case 'ZodBoolean':
      return false;
    case 'ZodObject': {
      const shape = def.shape as Record<string, ZodTypeAny> | undefined;
      if (!shape) return {};
      return Object.fromEntries(
        Object.keys(shape).map((key) => [key, getDefaultForSchema(shape[key])])
      );
    }
    case 'ZodArray':
      return [];
    case 'ZodEnum': {
      const values = (def as { values?: unknown[] }).values;
      return Array.isArray(values) && values.length > 0 ? values[0] : undefined;
    }
    case 'ZodLiteral':
      return (def as { value?: unknown }).value;
    default:
      return undefined;
  }
}

/**
 * Build default values for a Zod object schema from its types:
 * string → '', number → 0, boolean → false, object → nested defaults, array → [], optional/nullable → undefined.
 * ZodDefault uses the schema's default value.
 * Use overrides to set specific keys (e.g. objects or custom defaults).
 */
export function getDefaultValues<T extends ZodObjectAny>(
  schema: T,
  overrides?: Partial<z.infer<T>>
): z.infer<T> {
  const shape = schema.shape as Record<string, ZodTypeAny>;
  const base = Object.fromEntries(
    Object.keys(shape).map((key) => [key, getDefaultForSchema(shape[key])])
  ) as z.infer<T>;
  return overrides ? { ...base, ...overrides } : base;
}
