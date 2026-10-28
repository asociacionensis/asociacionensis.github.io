import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

/**
 * Every locale the site ships, as a literal tuple rather than `string[]`, so
 * `defineConfig` infers the `'es' | 'ca'` union and `i18n.defaultLocale` is
 * checked against it instead of being accepted as any string.
 */
const LOCALES: ['es', 'ca'] = ['es', 'ca'];

// GitHub Pages serves the dev environment from a subpath, so the build needs a
// different `base` there. Production leaves this unset. Keeping it in config
// (rather than hardcoding) is what makes `getRelativeLocaleUrl()` and every
// asset URL respect the subpath instead of pointing back at the domain root.
const BASE = process.env.SITE_BASE || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://asociacionensis.github.io',
  base: BASE,
  // Org/user site served from the domain root: `build.format` is left at its
  // default ('directory') rather than restated here.
  trailingSlash: 'ignore',
  // Collapses insignificant whitespace in the shipped HTML. This does NOT strip
  // HTML comments — developer notes are written as {/* ... */} so the compiler
  // drops them instead. `true` (lossless whole-document collapse) is kept over
  // the v7 default of 'jsx' because 'jsx' also collapses whitespace inside text
  // runs, which would silently reflow any prose not padded with {' '}.
  compressHTML: true,
  // Spanish is the default and stays unprefixed (`/eventos`); Catalan is
  // prefixed (`/ca/eventos`). Keeping the default locale unprefixed preserves
  // every existing URL, so no canonical link or inbound link is invalidated.
  i18n: {
    defaultLocale: 'es',
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // The /proyectos routes render placeholder copy and carry `noindex, follow`
      // (see ProjectPage.astro). Listing them in the sitemap would contradict
      // that directive, so they are kept out until the copy lands.
      filter: (page) => !/\/proyectos\//.test(page),
    }),
    icon({
      // Icons are inlined at build time and bundled locally: the build stays
      // offline and no Iconify runtime ships to the browser. lucide covers the
      // UI glyphs, tabler covers the brand marks (lucide dropped brand logos).
      // Listing them explicitly keeps the icon budget visible and the build fast.
      include: {
        lucide: [
          'arrow-right',
          'calendar',
          'external-link',
          'globe',
          'handshake',
          'languages',
          'mail',
          'map-pin',
          'moon',
          'phone',
          'sun',
          'x',
        ],
        tabler: ['brand-facebook', 'brand-instagram', 'brand-whatsapp'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});