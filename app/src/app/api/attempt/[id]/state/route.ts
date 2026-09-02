import { db } from '../../../../../db/client.ts';
import { getAttemptAnswers } from '../../../../../db/queries/answer.ts';
import { deadlineOf, hasExpired } from '../../../../../domain/clock.ts';
import { openAttemptForRead } from '../../../../../lib/attempt-access.ts';

/**
 * Resync the clock, and the counts beside it.
 *
 * The only `GET` in the write surface, and it exists for one reason: the
 * browser's own clock cannot be trusted, so the countdown has to be corrected
 * against the server's notion of now — on tab focus, and after a reconnect.
 * `serverNow` is what makes that correction possible; `deadline` is what the
 * countdown runs to.
 *
 * **Nothing here can extend a clock.** The deadline is recomputed from
 * `started_at` and the limit, both written once at start, so calling this a
 * thousand times returns the same instant a thousand times. A second tab
 * calling it gets the same answer as the first, which is why two tabs cannot
 * disagree about how long is left.
 *
 * **What it deliberately does not do: finalise.** Doc 07 §6 has this endpoint
 * close an expired sitting lazily, and it will — but auto-submit reuses the
 * submit path, and that path is the next slice's. Until then this reports
 * `expired` honestly and writes nothing. An expired-but-unfinalised attempt is
 * a correct state to be in (doc 03 §6): its score is already fully determined
 * by its answer rows, and no write here is what keeps that true.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const access = await openAttemptForRead(id);
  if (!access.ok) return access.response;

  const { attempt, userId } = access;
  const now = new Date();

  const answers = await getAttemptAnswers(db, userId, attempt.id);

  return Response.json(
    {
      status:
        attempt.submittedAt !== null
          ? 'submitted'
          : hasExpired(attempt, now)
            ? 'expired'
            : 'in_progress',
      deadline: deadlineOf(attempt)?.toISOString() ?? null,
      serverNow: now.toISOString(),
      answeredCount: answers.filter((answer) => answer.optionRef !== null).length,
      flaggedCount: answers.filter((answer) => answer.flagged).length,
    },
    { status: 200 },
  );
}
