import { describe, expect, it } from 'vitest';
import { lastPractisedLabel } from '../../src/domain/coverage.ts';

/**
 * The label is prose over a date, so it is tested at its boundaries rather than
 * at examples: every place the wording changes, and one either side of it.
 */

const now = new Date('2026-09-06T12:00:00Z');

/** `days` whole UTC days before {@link now}, at an hour that cannot round. */
function daysAgo(days: number): Date {
  return new Date(Date.UTC(2026, 8, 6 - days, 9, 30, 0));
}

describe('lastPractisedLabel', () => {
  it('says a domain was never practised rather than leaving a blank', () => {
    // PRD §4: a zero-history account reads as words. A blank here would look
    // like a value that failed to load.
    expect(lastPractisedLabel(null, now)).toBe('not started');
  });

  it('names today and yesterday', () => {
    expect(lastPractisedLabel(daysAgo(0), now)).toBe('today');
    expect(lastPractisedLabel(daysAgo(1), now)).toBe('yesterday');
  });

  it('counts days up to the week boundary', () => {
    expect(lastPractisedLabel(daysAgo(2), now)).toBe('2 days ago');
    expect(lastPractisedLabel(daysAgo(6), now)).toBe('6 days ago');
  });

  it('switches to weeks at seven days, and does not round up', () => {
    expect(lastPractisedLabel(daysAgo(7), now)).toBe('1 week ago');
    expect(lastPractisedLabel(daysAgo(13), now)).toBe('1 week ago');
    expect(lastPractisedLabel(daysAgo(14), now)).toBe('2 weeks ago');
  });

  it('stops counting weeks after a year', () => {
    expect(lastPractisedLabel(daysAgo(364), now)).toBe('52 weeks ago');
    expect(lastPractisedLabel(daysAgo(365), now)).toBe('over a year ago');
  });

  it('reads a future timestamp as today rather than counting backwards', () => {
    // Only reachable through a clock disagreement, but "in -1 days" is the kind
    // of nonsense that outlives whatever caused it.
    expect(lastPractisedLabel(daysAgo(-3), now)).toBe('today');
  });

  it('compares calendar days, not elapsed hours', () => {
    // A minute before midnight and a minute after are one day apart by the
    // clock and by the word, however few minutes separate them.
    const late = new Date('2026-09-05T23:59:00Z');
    const early = new Date('2026-09-06T00:01:00Z');
    expect(lastPractisedLabel(late, early)).toBe('yesterday');
  });
});
