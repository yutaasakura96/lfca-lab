import { db } from '../../../db/client.ts';
import {
  createAttempt,
  holdoutStanding,
  startComposedSitting,
  startHoldoutSitting,
  type HoldoutStanding,
} from '../../../db/queries/attempt.ts';
import { openAttemptForExam } from '../../../db/queries/exams.ts';
import {
  selectDomainQuestions,
  selectHoldoutQuestions,
  selectPracticeQuestions,
} from '../../../db/queries/selection.ts';
import { questionCountFor } from '../../../domain/modes.ts';
import { getSession } from '../../../lib/session.ts';
import { apiError } from '../../../lib/api.ts';
import { StartAttemptRequest } from '../../../lib/requests.ts';

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

  const parsed = StartAttemptRequest.safeParse(body);
  if (!parsed.success) {
    // No field-level detail. The input surface is four enums and an id, so a
    // failure here is a bug or an attack — neither is a user typo worth
    // explaining back.
    return apiError(400, 'invalid_request', 'That is not a sitting this app can start.');
  }

  const input = parsed.data;
  const userId = session.user.id;

  if (input.mode === 'exam') {
    // A paper with a sitting already running resumes it rather than starting a
    // second. Two live sittings of one paper is not a state this product has —
    // and starting one by accident is how a first attempt gets abandoned.
    const open = await openAttemptForExam(db, userId, input.examId);
    if (open !== null) {
      return Response.json({ attemptId: open, resumed: true }, { status: 200 });
    }

    const started = await createAttempt(db, {
      userId,
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

  if (input.mode === 'practice' || input.mode === 'domain') {
    // Composed outside the transaction, on purpose. This is several reads over
    // the whole bank and the candidate's answer history, and none of it is
    // anything the two inserts need to be consistent with — the set is decided,
    // *then* it is written down whole.
    //
    // There is deliberately no `resumed` short-circuit here. Unlike a paper,
    // there is no single sitting of "practice" to hand back, and two concurrent
    // domain runs are not a state worth forbidding.
    const composed =
      input.mode === 'practice'
        ? await selectPracticeQuestions(db, userId, input.length)
        : await selectDomainQuestions(db, userId, input.domain, input.length);

    const started = await startComposedSitting(
      db,
      input.mode === 'practice'
        ? { userId, mode: 'practice' }
        : { userId, mode: 'domain', domain: input.domain },
      composed,
    );

    // `questionCount` is what was frozen, not what was asked for. A domain
    // sitting of `all` has no asked-for number, and a pool that cannot fill a
    // request is a fact about the bank rather than a failure — never an error,
    // never padded.
    return Response.json(
      {
        attemptId: started.id,
        questionCount: composed.length,
        deadline: started.deadline?.toISOString() ?? null,
      },
      { status: 201 },
    );
  }

  // The holdout: forty pinned questions, sixty minutes, sat once.
  //
  // Three outcomes, and the middle one is the one worth reading. A holdout that
  // is *running* — started, tab closed, clock still going — is handed back, as
  // an exam paper's open sitting is. Refusing it would strand the one sitting
  // that can never be redone, reachable only through home's resume band. Only
  // a *finished* holdout is refused, which keeps `holdout_already_sat` meaning
  // already sat rather than already started.
  //
  // This narrows doc 07 §2, which reads as a flat refusal of any second start.
  // The doc is corrected with the feature's close-out (#61), not here.
  //
  // The read is a courtesy, not the guard. Two starts can both read "never
  // sat"; `one_holdout_per_user` is what refuses the second insert, and the
  // loser is then answered from a second read, exactly as if it had lost the
  // race before reading at all.
  const existing = answerFromStanding(await holdoutStanding(db, userId));
  if (existing) return existing;

  // Composed, then written whole, as a practice sitting is. The query refuses
  // anything but exactly forty, so a broken bank fails here — before the
  // transaction opens, with no attempt row left behind.
  const composed = await selectHoldoutQuestions(db);
  const started = await startHoldoutSitting(db, userId, composed);
  if (started === null) {
    const winner = answerFromStanding(await holdoutStanding(db, userId));
    if (winner) return winner;
    throw new Error('The holdout index refused a start, and no holdout sitting exists.');
  }

  return Response.json(
    {
      attemptId: started.id,
      questionCount: composed.length,
      deadline: started.deadline?.toISOString() ?? null,
    },
    { status: 201 },
  );
}

/**
 * What an existing holdout sitting means for a start, or `null` if there is none.
 *
 * `sat` is checked first. Both at once is a state `one_holdout_per_user` makes
 * impossible, and if it were ever found, the honest answer to "may I start the
 * holdout?" is still no.
 */
function answerFromStanding(standing: HoldoutStanding): Response | null {
  if (standing.sat !== null) {
    return apiError(409, 'holdout_already_sat', 'The holdout has already been sat.');
  }
  if (standing.openId !== null) {
    return Response.json({ attemptId: standing.openId, resumed: true }, { status: 200 });
  }
  return null;
}
