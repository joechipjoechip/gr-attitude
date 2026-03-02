import fr from './fr.json';

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof fr>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  if (typeof result === 'string') return result;
  return path; // fallback: return key if not found
}

/**
 * Translation function. Supports nested keys and simple interpolation.
 *
 * @example
 * t('nav.besoins') // "Besoins"
 * t('besoins.count_other', { count: 5 }) // "5 besoins"
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let value = getNestedValue(fr as unknown as Record<string, unknown>, key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
  }
  return value;
}

/**
 * React hook (for consistency, but t() works fine outside components too).
 */
export function useT() {
  return t;
}
