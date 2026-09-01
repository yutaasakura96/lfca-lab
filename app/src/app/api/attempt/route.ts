import { z } from 'zod';
import { db } from '../../../db/client.ts';
import { createAttempt } from '../../../db/queries/attempt.ts';
import { openAttemptForExam } from '../../../db/queries/exams.ts';
import { questionCountFor } from '../../../domain/modes.ts';
import { DOMAINS } from '../../../domain/weights.ts';
import { getSession } from '../../../lib/session.ts';
import { apiError, type ErrorCode } from '../../../lib/api.ts';

/**
 * Start a sitting.
 *
 * The whole input surface, stated exactly, because it is the whole attack
 * surface: a mode from a fixed set, a paper id matching a known shape, a domain
 * from the six, and a length from three choices. Never a free integer, never a
 * string that reaches a query unvalidated.
 */
const StartAttempt = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('exam'), examId: z.string().regex(/^exam-\d{2}$/) }),
  z.object({ mode: z.literal('practice') }),
  z.object({ mode: z.literal('holdout') }),
  z.object({
    mode: z.literal('domain'),
    domain: z.enum(DOMAINS),
    length: z.union([z.literal(20), z.literal(40), z.literal('all')]).default(20),
  }),
]);

export async function POST(request: Request): Promise<Response> {
  const session = await getSession();
  if (!session) return apiError(401, 'unauthenticated', 'Sign in to continue.');
  if ((session.user as { allowlisted?: boolean }).allowlisted !== true) {
    return apiError(403, 'not_allowlisted', 'This app is private.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, 'invalid_request', 'Expected a JSON body.');
  }

  const parsed = StartAttempt.safeParse(body);
  if (!parsed.success) {
    // No field-level detail. The input surface is four enums and an id, so a
    // failure here is a bug or an attack — neither is a user typo worth
    // explaining back.
    return apiError(400, 'invalid_request', 'That is not a sitting this app can start.');
  }

  const input = parsed.data;

  if (input.mode === 'exam') {
    // A paper with a sitting already running resumes it rather than starting a
    // second. Two live sittings of one paper is not a state this product has —
    // and starting one by accident is how a first attempt gets abandoned.
    const open = await openAttemptForExam(db, session.user.id, input.examId);
    if (open !== null) {
      return Response.json({ attemptId: open, resumed: true }, { status: 200 });
    }

    const started = await createAttempt(db, {
      userId: session.user.id,
      mode: 'exam',
      examId: input.examId,
      questionCount: questionCountFor('exam'),
    });

    return Response.json(
      {
        attemptId: started.id,
        questionCount: questionCountFor('exam'),
        deadline: started.deadline?.toISOString() ?? null,
        resumed: false,
      },
      { status: 201 },
    );
  }

  // Practice, domain and holdout sittings arrive with their own slices. Refused
  // explicitly rather than half-implemented, so a caller gets a clear answer
  // instead of an attempt it cannot use.
  const notYet: ErrorCode = 'invalid_request';
  return apiError(400, notYet, 'Only exam sittings can be started yet.');
}
