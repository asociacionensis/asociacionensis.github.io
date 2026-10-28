/**
 * Prefixes a root-relative public path with the Astro base (e.g. "/_dev/").
 * Files in `public/` are copied as they are, so unlike imported assets and
 * CSS urls they do not pick the base up on their own.
 */
export function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
