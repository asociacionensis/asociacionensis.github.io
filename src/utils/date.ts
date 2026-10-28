import type { Locale } from '../i18n';

/**
 * Event dates are plain calendar days (UTC midnight), so both the comparison
 * and the format run in UTC. Using the machine time zone would move an event
 * to the previous day on any build host west of UTC.
 */
export function isPast(date: Date, now = new Date()): boolean {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end.getTime() < now.getTime();
}

export function formatDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
