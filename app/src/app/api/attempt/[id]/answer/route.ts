import { db } from '../../../../../db/client.ts';
import { recordAnswer } from '../../../../../db/queries/answer.ts';
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
 * explanation. Immediate feedback belongs to practice and domain mode, and the
 * branch that decides it will read `attempt.mode` from the database — never
 * anything the client sent.
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

  if (result === 'unknown_option') {
    return apiError(400, 'invalid_request', 'That question has no such option.');
  }

  return Response.json({ saved: true }, { status: 200 });
}
