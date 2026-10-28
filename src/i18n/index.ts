import { i18n } from 'astro:config/client';
import es from './es.json';
import ca from './ca.json';

export type Locale = 'es' | 'ca';

// Derived from the resolved Astro config — no manual sync needed.
export const DEFAULT_LOCALE = i18n!.defaultLocale as Locale;
export const SUPPORTED = i18n!.locales as Locale[];

const DICTIONARIES: Record<Locale, unknown> = { es, ca };

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (SUPPORTED as string[]).includes(v);
}

export type Vars = Record<string, string | number>;

const PLACEHOLDER = /\{\{\s*([\w.-]+)\s*\}\}/g;

function lookup(dictionary: unknown, key: string): string | undefined {
  let node: unknown = dictionary;

  for (const segment of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[segment];
  }

  return typeof node === 'string' ? node : undefined;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;

  return template.replace(PLACEHOLDER, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/**
 * Total by design: the dictionaries are plain JSON with no build-time key
 * checking, so a missing key must not take a page down. It warns, falls back to
 * the default locale, and finally returns the key itself.
 */
function makeT(locale: Locale): (key: string, vars?: Vars) => string {
  return function t(key: string, vars?: Vars): string {
    let value = lookup(DICTIONARIES[locale], key);

    if (value === undefined && locale !== DEFAULT_LOCALE) {
      value = lookup(DICTIONARIES[DEFAULT_LOCALE], key);

      if (value !== undefined) {
        console.warn(
          `[i18n] Missing "${key}" in "${locale}"; falling back to "${DEFAULT_LOCALE}".`,
        );
      }
    }

    if (value === undefined) {
      console.warn(`[i18n] Missing "${key}" in "${DEFAULT_LOCALE}".`);
      return key;
    }

    return interpolate(value, vars);
  };
}

/**
 * Resolves `Astro.currentLocale` and builds its translator in one step.
 */
export function useI18n(raw: string | undefined): {
  locale: Locale;
  t: (key: string, vars?: Vars) => string;
} {
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { locale, t: makeT(locale) };
}