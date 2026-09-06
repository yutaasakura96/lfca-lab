// How much of a domain has been worked, said in words.
//
// Coverage, never mastery. "X of Y seen" is a fact about what has been
// answered; how well it went is a judgement, and the 2026-08-28 decision
// declined to build a readiness signal. Nothing here reads `is_correct`, and
// nothing here should start to — a proposal that does is a proposal to put a
// score on a screen PRD P1 says is not measured.
//
// Pure, like everything in this directory: `now` is a parameter, so the label
// can be asserted at every boundary without waiting for a day to pass.

/** A day, in milliseconds. */
const DAY_MS = 24 * 60 * 60 * 1000;

/** The UTC midnight at or before an instant, as a millisecond count. */
function utcMidnight(at: Date): number {
  return Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
}

/**
 * How long ago a domain was last practised, as the words the card shows.
 *
 * Calendar days, not elapsed hours: a sitting finished at 23:59 and read at
 * 00:01 was *yesterday*, however few minutes separate them, because that is
 * what the word means to the person reading it.
 *
 * **Those calendar days are UTC days.** The label is rendered on the server,
 * and everything this system stores is UTC by rule (doc 04 §0), so a sitting
 * finished in the small hours of a local morning can read one day older than it
 * feels. The alternative is shipping the instant to the browser and formatting
 * it there, which buys a day of precision on a soft label at the cost of the
 * only client state on the screen.
 *
 * Weeks after the first, and nothing finer than that beyond a year — the
 * question this answers is "have I touched this recently", and no wording of
 * "51 weeks" answers it differently from "over a year".
 *
 * @param lastAt the most recent answer in this domain, or `null` if there is none
 * @param now the instant to measure against
 */
export function lastPractisedLabel(lastAt: Date | null, now: Date): string {
  // Never practised reads as words, not as a blank or a zero (PRD §4). A blank
  // looks like a value that failed to load.
  if (lastAt === null) return 'not started';

  const days = Math.floor((utcMidnight(now) - utcMidnight(lastAt)) / DAY_MS);

  // A timestamp in the future is only reachable through a clock disagreement,
  // and "in -1 days" is the kind of nonsense that outlives whatever caused it.
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  // The year boundary is counted in days, not in weeks: 52 weeks is 364 days,
  // so testing the weeks would call a date "over a year ago" a day early.
  if (days >= 365) return 'over a year ago';

  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}
