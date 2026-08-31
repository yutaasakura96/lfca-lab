// The first-attempt rule.
//
// This decides the one number in the product that cannot be recovered. Best
// score drifts to 100% by construction once re-sits are allowed — there are
// only sixteen papers, so repeats are guaranteed and eventually it measures
// recall. The first-attempt score is the honest one, and it is honest only
// because it can neither be overwritten nor dodged.
//
// Pure, and separate from the query that uses it, so the rule can be stated
// once and tested without a database.

import type { AttemptMode } from './modes.ts';

/**
 * Whether a new attempt claims the first-attempt flag.
 *
 * Two conditions, and the second is the subtle one:
 *
 * 1. **Only exam mode.** Practice, domain and holdout sittings have nothing to
 *    be first at — there is no per-paper history to be earliest in.
 * 2. **No earlier attempt at this paper exists**, judged when the attempt is
 *    *created*.
 *
 * Judging it at creation rather than at submission is the whole point. Start
 * paper 07, abandon it, sit it again the next day and finish the second sitting
 * first: at submit-time the *second* attempt would claim the flag, while the
 * abandoned one — finalised later, when its ninety minutes lapse — could never
 * claim it. The requirement says the opposite: an abandoned attempt **is** the
 * first attempt. Deciding at creation makes the flag a property of being
 * earliest, which is what it means, and makes it independent of the order
 * sittings happen to be finalised in.
 */
export function claimsFirstAttempt(mode: AttemptMode, hasEarlierAttempt: boolean): boolean {
  if (mode !== 'exam') return false;
  return !hasEarlierAttempt;
}
