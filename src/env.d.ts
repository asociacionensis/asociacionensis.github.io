/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    i18n: {
      locale: import('./i18n').Locale;
      t: (key: string, vars?: Record<string, string | number>) => string;
    };
  }
}