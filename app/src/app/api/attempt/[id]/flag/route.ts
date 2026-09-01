import { db } from '../../../../../db/client.ts';
import { setFlag } from '../../../../../db/queries/answer.ts';
import { allowsFlagging } from '../../../../../domain/modes.ts';
import { apiError } from '../../../../../lib/api.ts';
import { openWriteForQuestion } from '../../../../../lib/attempt-access.ts';
import { FlagRequest } from '../../../../../lib/requests.ts';

/**
 * Flag or unflag one question.
 *
 * Its own endpoint, not a field on `/answer`. Two reasons, and both are about
 * failure: a flag can never accidentally carry an option ref, because there is
 * nowhere in this request to put one; and neither write is coupled to the
 * other's retry, so a failing answer does not drag a successful flag back with
 * it.
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const write = await openWriteForQuestion(
    request,
    id,
    FlagRequest,
    'That is not a flag this app can record.',
    new Date(),
  );
  if (!write.ok) return write.response;

  // Practice and domain mode are forward-only, so a flag there would be a mark
  // on something already behind you. Refused rather than quietly stored and
  // never read.
  if (!allowsFlagging(write.attempt.mode)) {
    return apiError(
      409,
      'flagging_not_available',
      'This kind of sitting does not use flags.',
    );
  }

  await setFlag(db, {
    attemptId: write.attempt.id,
    questionId: write.body.questionId,
    flagged: write.body.flagged,
  });

  return Response.json({ saved: true }, { status: 200 });
}
