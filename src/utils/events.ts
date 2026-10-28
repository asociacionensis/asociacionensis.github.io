import { isPast } from './date';

export interface EventFrontmatter {
  title: string;
  date: string;
  location: string;
  image: string;
  imageAlt: string;
  summary: string;
  registrationUrl?: string;
}

export interface Event extends Omit<EventFrontmatter, 'date'> {
  /** File name of the Markdown page, without the extension. */
  slug: string;
  date: Date;
}

/**
 * Turns the result of `import.meta.glob('*.md', { import: 'frontmatter' })`
 * into events. The slug comes from the file name, so a page is reachable at
 * `/eventos/<slug>/`.
 */
export function toEvents(modules: Record<string, EventFrontmatter>): Event[] {
  return Object.entries(modules).map(([path, frontmatter]) => ({
    ...frontmatter,
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    date: new Date(frontmatter.date),
  }));
}

/** Upcoming first (earliest first), then past (latest first). */
export function splitByDate(events: Event[]): {
  upcoming: Event[];
  past: Event[];
} {
  const upcoming = events
    .filter((e) => !isPast(e.date))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  const past = events
    .filter((e) => isPast(e.date))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  return { upcoming, past };
}
