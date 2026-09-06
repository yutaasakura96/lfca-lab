import { db } from '../../../../../db/client.ts';
import { recordAnswer } from '../../../../../db/queries/answer.ts';
import { getQuestionKey } from '../../../../../db/queries/feedback.ts';
import { showsImmediateFeedback } from '../../../../../domain/modes.ts';
import { apiError } from '../../../../../lib/api.ts';
import { openWriteForQuestion } from '../../../../../lib/attempt-access.ts';
import { AnswerRequest } from '../../../../../lib/requests.ts';

/**
 * Record one answer.
 *
 * The hot path: called on every option click, and the contract is that at most
 * the one in flight can be lost. That is why it is a separate immediate write
 * rather than a batch saved at submit, and why it is an upsert — every retry is
 * safe because a second identical write is the same row.
 *
 * **This response is where PRD E3 is enforced.** A timed sitting gets
 * `{ saved: true }` and nothing else: no correctness, no running total, no
 * explanation. Practice and domain mode get all four options explained, which
 * is the whole of what those modes are for (P1, D1).
 *
 * **The branch reads `attempt.mode` from the database**, off the row this
 * request already had to load to prove ownership. Nothing the caller sent
 * reaches it — not a field, not a header, not a query parameter — and there is
 * no argument to this handler that could move it. That is deliberate, because
 * this is the one response in the app whose being wrong is silent: a body
 * carrying the key mid-exam looks exactly like a body that does not, unless
 * somebody reads the bytes. The integration suite reads the bytes.
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  const write = await openWriteForQuestion(
    request,
    id,
    AnswerRequest,
    'That is not an answer this app can record.',
    new Date(),
  );
  if (!write.ok) return write.response;

  const result = await recordAnswer(db, {
    attemptId: write.attempt.id,
    questionId: write.body.questionId,
    optionRef: write.body.optionRef,
  });

  if (result.result === 'unknown_option') {
    return apiError(400, 'invalid_request', 'That question has no such option.');
  }

  if (!showsImmediateFeedback(write.attempt.mode)) {
    return Response.json({ saved: true }, { status: 200 });
  }

  // A cleared answer has no verdict, because feedback is feedback on a choice.
  // The response is then the same `{ saved: true }` a timed sitting gets,
  // arrived at for an unrelated reason — and the key is not handed out for a
  // question just un-answered. Forward-only means the screen never sends this;
  // the endpoint is public surface and answers honestly anyway.
  if (result.isCorrect === null) {
    return Response.json({ saved: true }, { status: 200 });
  }

  // The verdict came back from the write that made it, so it is this click's
  // own. Only the key is read here, and the key is a fact about the question
  // rather than about the sitting — nothing in this second round trip can
  // report one click's verdict against another's.
  const key = await getQuestionKey(db, write.body.questionId);

  return Response.json(
    { saved: true, isCorrect: result.isCorrect, ...key },
    { status: 200 },
  );
}
