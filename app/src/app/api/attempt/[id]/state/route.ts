import { db } from '../../../../../db/client.ts';
import { getAttemptAnswers } from '../../../../../db/queries/answer.ts';
import { deadlineOf } from '../../../../../domain/clock.ts';
import { openAttemptForRead } from '../../../../../lib/attempt-access.ts';
import { finaliseIfExpired } from '../../../../../lib/auto-submit.ts';

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
 * **It finalises an expired sitting, and that is what makes this the endpoint
 * doc 07 §6 describes.** "Ninety minutes elapsed while the tab was closed" is
 * discovered here more often than anywhere else — a laptop reopened is a
 * `visibilitychange`, and this is what that fires. The sitting is submitted as
 * it stood, through the ordinary submit path, and the client is told
 * `submitted` so it routes to the review.
 *
 * **`expired` is therefore no longer reachable.** It existed only because the
 * finalisation was not built (doc 07 §6, and the log's 2026-09-02 entry); the
 * same read that would have returned it now closes the attempt first. It has
 * not changed meaning — there is simply no longer a moment at which it is true
 * on the way out of this handler.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const access = await openAttemptForRead(id);
  if (!access.ok) return access.response;

  const { userId } = access;
  const now = new Date();

  // Before the counts are read, so a sitting closed by this call reports the
  // answers it was closed with rather than a state one statement out of date.
  const { attempt } = await finaliseIfExpired(db, access.attempt, now);

  const answers = await getAttemptAnswers(db, userId, attempt.id);

  return Response.json(
    {
      status: attempt.submittedAt !== null ? 'submitted' : 'in_progress',
      deadline: deadlineOf(attempt)?.toISOString() ?? null,
      serverNow: now.toISOString(),
      answeredCount: answers.filter((answer) => answer.optionRef !== null).length,
      flaggedCount: answers.filter((answer) => answer.flagged).length,
    },
    { status: 200 },
  );
}
