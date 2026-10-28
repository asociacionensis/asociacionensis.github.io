import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate, isPast } from '../src/utils/date.ts';

// Event dates are plain calendar days. This test runs in a time zone west of
// UTC, where a local-time implementation would move every event to the
// previous day.
process.env.TZ = 'America/Mexico_City';

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

test('an event that is over is past', () => {
  assert.equal(isPast(day('2025-11-15'), new Date('2026-10-27T12:00:00Z')), true);
});

test('an event that has not happened yet is not past', () => {
  assert.equal(isPast(day('2026-10-28'), new Date('2026-10-27T12:00:00Z')), false);
});

test('an event running today is not past', () => {
  assert.equal(isPast(day('2026-10-27'), new Date('2026-10-27T12:00:00Z')), false);
  assert.equal(isPast(day('2026-10-27'), new Date('2026-10-27T23:59:59Z')), false);
});

test('the date does not depend on the machine time zone', () => {
  assert.match(formatDate('es', day('2026-10-25')), /^25\b.*2026$/);
  assert.match(formatDate('ca', day('2026-10-25')), /^25\b.*2026$/);
});

test('the date is formatted in the language of the locale', () => {
  assert.match(formatDate('es', day('2026-10-25')), /octubre/);
  assert.match(formatDate('ca', day('2026-10-25')), /octubre/);
});
