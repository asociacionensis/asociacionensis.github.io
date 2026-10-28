/**
 * Imported by Astro frontmatter only, so image metadata (build-time imports)
 * is safe here. Anything a client-side script needs takes the locale as an
 * argument instead of reading the `Astro` global.
 */
import type { ImageMetadata } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, type Locale, type Vars } from './i18n';
import hemaThumbnail from './assets/images/hema-thumbnail.webp';
import walpurgisThumbnail from './assets/images/las-hijas-de-walpurgis-thumbnail.webp';

export const SITE = {
  name: 'Asociación Ensis',
} as const;

export const CONTACT = {
  phone: '+34623752545',
  phoneLabel: '+34 623 75 25 45',
  email: 'asociacionensis@gmail.com',
} as const;

/** Bizum short code published on the Linktree profile. */
export const BIZUM = {
  shortCode: '13975',
} as const;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/asociacionensis/',
  facebook: 'https://www.facebook.com/100063715172269/',
  whatsapp: `https://wa.me/${CONTACT.phone.replace('+', '')}`,
} as const;

export const GROUPS = {
  walpurgis: {
    slug: 'recreacion-historica',
    groupName: 'Las Hijas de Walpurgis',
    image: walpurgisThumbnail satisfies ImageMetadata,
    social: {
      instagram: 'https://www.instagram.com/hijasdewalpurgis/',
      facebook:
        'https://www.facebook.com/p/Hijas-de-Walpurgis-100080359459099/',
    },
    joinUrl: null,
  },
  santMarti: {
    slug: 'artes-marciales-historicas-europeas',
    groupName: 'Sala Sant Martí – Walpurgis',
    image: hemaThumbnail satisfies ImageMetadata,
    social: {
      instagram: 'https://www.instagram.com/salasantmartiwalpurgis/',
    },
    /** Official COEDPI club registration sheet. */
    joinUrl:
      'https://app.coedpi.es/servicios/hoja-inscripcion/?c=sala-sant-marti-walpurgis&tipo=atleta&g=72431',
  },
} as const;

/** Tally form used for the footer contact block. */
export const TALLY_FORM_ID = 'gDqDA4';

export interface NavItem {
  href: string;
  label: string;
}

export function getNav(
  t: (key: string, vars?: Vars) => string,
  locale: Locale = DEFAULT_LOCALE,
): NavItem[] {
  return [
    { href: getRelativeLocaleUrl(locale, '/'), label: t('nav.home') },
    {
      href: getRelativeLocaleUrl(locale, '/proyectos/recreacion-historica'),
      label: t('nav.recreacion'),
    },
    {
      href: getRelativeLocaleUrl(locale, '/proyectos/artes-marciales-historicas-europeas'),
      label: t('nav.artesMarciales'),
    },
    { href: getRelativeLocaleUrl(locale, '/eventos'), label: t('nav.events') },
    {
      href: getRelativeLocaleUrl(locale, '/contacto'),
      label: t('nav.contact'),
    },
  ];
}
