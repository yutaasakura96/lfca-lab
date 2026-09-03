import { db } from '../../../../../db/client.ts';
import { submitAttempt } from '../../../../../db/queries/submit.ts';
import { hasExpired } from '../../../../../domain/clock.ts';
import { outcomeOf } from '../../../../../domain/submission.ts';
import { openAttemptForRead } from '../../../../../lib/attempt-access.ts';

/** Only these two are measured. PRD P1 and D1 say the other two deliberately are not. */
const SCORED_MODES = new Set(['exam', 'holdout']);

/**
 * Finalise a sitting and say what it scored.
 *
 * **The read helper, not the write one, and that is the whole design of this
 * handler.** `openAttemptForWrite` refuses a submitted attempt and refuses an
 * expired one, and both refusals would be wrong here. A second submit has to be
 * answered with the score the first one decided — doc 07 §5 is explicit that a
 * double submit is `200` and not a conflict, because PRD §5's "no-op" means the
 * candidate sees their score rather than an error. And an expired sitting is
 * precisely one that still needs finalising; refusing it would leave a sitting
 * that can never be scored by anyone.
 *
 * **The clock decides the reason, never the client.** A sitting past its
 * deadline is recorded as `expired` whoever pressed the button, so E6 can tell
 * finishing apart from running out of time. There is no field in the request to
 * say otherwise — the body is empty, and is not read at all.
 *
 * **`is_first_attempt` is untouched here.** It was settled at creation (doc 04
 * §5.2). Everything about this endpoint would still be correct if it did not
 * know the column existed, and that is the intended relationship.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const access = await openAttemptForRead(id);
  if (!access.ok) return access.response;

  const { attempt } = access;
  const now = new Date();

  const finalised = await submitAttempt(db, {
    attemptId: attempt.id,
    // Read from the attempt's own `started_at` and limit, so two tabs and a
    // wrong machine clock all reach the same verdict.
    reason: hasExpired(attempt, now) ? 'expired' : 'user',
    scored: SCORED_MODES.has(attempt.mode),
  });

  // Whatever `finalised` holds is what is reported — the first caller's figures
  // when this one lost the race, which is the same rule for the reason as for
  // the score: a second submit reports, it does not decide.
  return Response.json(outcomeOf(finalised), { status: 200 });
}
