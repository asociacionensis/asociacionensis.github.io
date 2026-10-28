# Asociación Ensis

Recreación Histórica y Artes Marciales Históricas Europeas

Sitio estático construido con [Astro](https://astro.build) y
[Tailwind CSS](https://tailwindcss.com).

## Puesta en marcha

```sh
npm install
npm run dev        # servidor de desarrollo en http://localhost:4321
npm run build      # genera el sitio estático en dist/
npm run preview    # sirve dist/ para revisar el resultado
npm run check      # comprobación de tipos
npm test           # pruebas (node --test)
npm run verify     # comprobación de claves i18n + tipos + pruebas + build
```

## Estructura

```
public/            imágenes y fuentes servidas tal cual
src/
  config.ts        datos del sitio: contacto, grupos, redes, rutas
  content/legal/   textos legales en Markdown (una versión por idioma)
  components/      componentes .astro
  layouts/         plantillas de página
  pages/           rutas (incluye las páginas de eventos en Markdown)
  styles/          tokens de diseño (@theme) y capa base
  utils/           fechas, rutas y carga de eventos
tests/             pruebas con el runner de Node
scripts/           comprobación de claves de traducción
```

## Añadir un taller o charla

Los eventos son páginas Markdown en `src/pages/eventos/` (y su copia en
`src/pages/ca/eventos/`). El nombre del archivo es el identificador de la
página: `cocina-medieval.md` se publica en `/eventos/cocina-medieval/`.

La fecha decide si aparece como próxima actividad o como actividad
finalizada; si además falta `registrationUrl`, no se muestra ningún botón de
inscripción.

```markdown
---
layout: ../../layouts/EventLayout.astro
title: Cocina Medieval
date: 2027-03-14
location: Centre Cívic, Barcelona
image: /images/cocina.webp
imageAlt: Taller de cocina medieval
summary: >-
  Descripción breve del taller.
registrationUrl: https://ejemplo.com/inscripcion
---

Texto largo de la página.
```

`image` apunta a un archivo de `public/images/`: se sirve tal cual, sin
optimizar. La versión en catalan es el mismo archivo en
`src/pages/ca/eventos/`, con el texto traducido.

## Rutas

El sitio es bilingüe. El castellano es el idioma por defecto y **no** lleva
prefijo; el catalán vive bajo `/ca`.

| Ruta | Contenido |
|---|---|
| `/` · `/ca/` | Portada |
| `/proyectos/recreacion-historica` | Las Hijas de Walpurgis |
| `/proyectos/artes-marciales-historicas-europeas` | Sala Sant Martí - Walpurgis |
| `/eventos` · `/eventos/<evento>` | Listado y detalle de actividades |
| `/contacto` · `/privacidad` · `/condiciones` | Contacto y textos legales |
| `/ca/estatuts` | Estatuts (solo en catalán) |
| `/404` | Página de error (global; no existe `/ca/404`) |

## Idiomas

Los textos viven en `src/i18n/es.json` y `src/i18n/ca.json`. Ambos archivos
deben tener **exactamente las mismas claves** y los mismos marcadores
`{{variable}}`. La comprobación también verifica que toda clave usada en el
código exista en el diccionario.

```sh
node scripts/check-i18n-keys.mjs ca.json   # verifica la paridad de claves
```

Para añadir un texto:

1. Ponlo en `src/i18n/es.json` con una clave que describa el **concepto**, no la
   página donde se usa (p. ej. `workshops.pastNote`, no `eventosPage.pastNote`).
2. Cópialo a `src/i18n/ca.json` y tradúcelo.
3. Consúmelo con `t('clave')`. Si la frase lleva un enlace en medio, divídela en
   dos claves y pon el enlace entre medias (ver `workshops.followBefore` /
   `followAfter`).

Lo que **no** se traduce (URLs, números, nombres propios) vive en
`src/config.ts`.

Astro **no** genera las páginas de cada idioma por sí solo: `src/pages/ca/`
tiene que existir. Las dos versiones delegan en los mismos componentes de
`src/components/pages/`, así que no pueden divergir.

## Diseño

Los tokens de color, tipografía y medidas viven en `src/styles/global.css`.
El tema oscuro es el predeterminado; el claro se activa con la clase `light` en
`<html>` y se recuerda en `localStorage`.

El tema está basado en la plantilla
[Solid State de HTML5 UP](https://html5up.net/solid-state), bajo licencia CCA 3.0
(ver `LICENSE.txt`).

## Entornos

La rama `main` publica el sitio en la raíz del dominio. La rama `develop`
publica una vista previa bajo `/_dev/`: el build recibe `SITE_BASE=/_dev/` y
todas las rutas y archivos públicos llevan ese prefijo.
