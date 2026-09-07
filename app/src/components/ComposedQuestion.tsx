'use client';

import { OPTION_ROLE_LABEL, optionRole } from '../domain/review.ts';
import type { WriteFailure } from '../lib/writes.ts';
import { Glyph } from './Glyph.tsx';
import { BankText, Stem } from './Stem.tsx';
import type { SittingOption } from './SittingQuestion.tsx';

/** What the answer endpoint sends back in a graded mode. Doc 07 §3. */
export interface AnswerFeedback {
  isCorrect: boolean;
  correctRef: string;
  /** The `why` for **all four** refs, not only the right one (PRD P1, E4). */
  why: Record<string, string>;
}

export interface ComposedQuestionProps {
  question: {
    id: string;
    stem: string;
    competency: string;
    conceptId: string;
    options: SittingOption[];
  };
  /** 1-based, as displayed. The session card says the same number. */
  number: number;
  total: number;
  /** How many of the sitting have been marked, for the progress meter. */
  correct: number;
  incorrect: number;
  /** What was chosen, the instant it was chosen. Locks the options. */
  answer: string | null;
  /** What the server said about it, once it has said anything. */
  feedback: AnswerFeedback | null;
  /** A refusal repeating cannot fix, whose value has been put back. */
  failure: WriteFailure | null;
  onAnswer: (optionRef: string) => void;
  onNext: () => void;
  hasNext: boolean;
}

/** Which of doc 05 §8's families dresses a graded option row. The review's map. */
const ROLE_CLASS = {
  'correct-chosen': 'opt opt--correct',
  correct: 'opt opt--correct',
  'chosen-wrong': 'opt opt--incorrect',
  // Neutral surface, no hue of its own. Doc 05's sixth option-row state.
  'not-correct': 'opt opt--muted',
} as const;

function failureMessage(failure: WriteFailure): string {
  switch (failure.code) {
    case 'attempt_already_submitted':
      return 'This sitting was already finished.';
    default:
      // A question not in this sitting, or a body the server would not parse.
      // Both are bugs rather than anything a candidate can act on, so this says
      // what happened to the answer and does not invent an instruction.
      return 'Not saved — your answer was put back. Try again.';
  }
}

/**
 * One question of a composed sitting, marked the moment it is answered.
 *
 * Three states, and the middle one is the one worth naming. Before answering,
 * the four options are controls. **Between the click and the reply they are
 * not, and there is still no verdict** — correctness is the server's to state
 * (doc 07 §3) and the client has never been sent the key it would need to
 * decide one for itself. So the chosen option is echoed instantly, which is
 * honest because *what was chosen* is not the server's fact, and the marking
 * appears when the reply lands. On a working connection that is one frame; on a
 * failing one the outbox keeps trying and the bar says so.
 *
 * Locking on the *click* rather than on the reply is deliberate. Forward-only
 * means committing to an answer, and a window in which it could be changed
 * while the write was in the air would be exactly the window in which it could
 * be changed after seeing nothing and before seeing the mark.
 *
 * **Next does not wait for the verdict.** It is enabled as soon as an answer
 * exists, so a connection that is down cannot strand a sitting on one question
 * — and the verdict, when it lands, still lands here if the reader is still on
 * it. Doc 10 §7's Previous is not drawn: the board predates the rule, and the
 * board is what is corrected (decision log, 2026-09-06).
 */
export function ComposedQuestion({
  question,
  number,
  total,
  correct,
  incorrect,
  answer,
  feedback,
  failure,
  onAnswer,
  onNext,
  hasNext,
}: ComposedQuestionProps) {
  const locked = answer !== null;
  const correctIndex =
    feedback === null ? -1 : question.options.findIndex((o) => o.ref === feedback.correctRef);
  const correctLetter = correctIndex === -1 ? '' : String.fromCharCode(65 + correctIndex);

  return (
    <div className="stack" style={{ gap: 'var(--space-5)' }}>
      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <div className="qhead">
          <div className="stack" style={{ gap: 'var(--space-2)' }}>
            <h1 className="eyebrow">
              Question {number} of {total}
            </h1>
            <span className="meta">{question.competency}</span>
            {/* Doc 10 §7 gives the concept id a sunken "Why this is the answer"
                panel alongside a study-guide link. Neither exists — the guide
                stays outside the app by standing decision, and the bank has no
                rationale separate from the per-option `why` that is already
                below — so the id sits with the identifying metadata, exactly as
                the review's does (decision log, 2026-09-04). */}
            <span className="concept">{question.conceptId}</span>
          </div>
        </div>

        {/* Doc 10 §7's progress meter. Two fills over one track, so it reports
            how far through the sitting is *and* how it has gone, without ever
            being a score: there is no denominator here but the sitting's own
            length, and no mark to compare it against. */}
        <div className="meter" role="presentation">
          <span
            className="meter__fill meter__fill--correct"
            style={{ width: `${(correct / total) * 100}%` }}
          />
          <span
            className="meter__fill meter__fill--incorrect"
            style={{
              left: `${(correct / total) * 100}%`,
              width: `${(incorrect / total) * 100}%`,
            }}
          />
        </div>
      </div>

      <Stem text={question.stem} />

      {answer !== null && feedback === null && failure === null ? (
        <div className="row">
          <span className="chip" role="status">
            Marking your answer&hellip;
          </span>
        </div>
      ) : null}

      {feedback === null ? null : (
        // Doc 10 §7's verdict bar. The words carry the verdict on their own —
        // doc 05 §8's rule that colour is never the only signal — and the
        // second line is what stops the reader treating the graded rows below
        // as being only about the option they picked.
        <div
          className={feedback.isCorrect ? 'verdictbar verdictbar--correct' : 'verdictbar'}
          role="status"
        >
          <span className="verdictbar__head">
            <Glyph role={feedback.isCorrect ? 'correct' : 'chosen-wrong'} />
            {feedback.isCorrect ? 'Correct.' : `Not quite. The answer is ${correctLetter}.`}
          </span>
          <span className="meta">
            {feedback.isCorrect
              ? 'Every option is explained below, including the three nobody chose.'
              : 'Every option is explained below, including the one you chose.'}
          </span>
        </div>
      )}

      <div className="opts">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);

          if (!locked) {
            return (
              <button
                type="button"
                key={option.ref}
                className="opt opt--interactive"
                onClick={() => onAnswer(option.ref)}
              >
                <span className="opt__key">{letter}</span>
                <span className="opt__body">
                  <span className="opt__text">
                    <BankText text={option.text} />
                  </span>
                </span>
              </button>
            );
          }

          // Answered. Not a control any more, in either of the two states an
          // answered question can be in — the roles below are the review's own,
          // because a marked question is a reviewed question that happens to be
          // in front of you.
          if (feedback === null) {
            const chosen = option.ref === answer;
            return (
              <div className={chosen ? 'opt opt--selected' : 'opt'} key={option.ref}>
                <div className="opt__key">{letter}</div>
                <div className="opt__body">
                  {chosen ? (
                    <span className="opt__verdict" style={{ color: 'var(--accent-ink)' }}>
                      <svg
                        className="ico"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle cx="7" cy="7" r="4.2" fill="currentColor" />
                      </svg>
                      Your answer
                    </span>
                  ) : null}
                  <p className="opt__text">
                    <BankText text={option.text} />
                  </p>
                </div>
              </div>
            );
          }

          const role = optionRole(
            { ref: option.ref, correct: option.ref === feedback.correctRef },
            answer,
          );
          const why = feedback.why[option.ref] ?? '';

          return (
            <div className={ROLE_CLASS[role]} key={option.ref}>
              <div className="opt__key">{letter}</div>
              <div className="opt__body">
                <span className="opt__verdict">
                  <Glyph role={role} />
                  {OPTION_ROLE_LABEL[role]}
                </span>
                <p className="opt__text">
                  <BankText text={option.text} />
                </p>
                {/* PRD §5: an option with no explanation renders what exists
                    rather than an empty block. Measured across the whole bank,
                    none lack it — so this is a data defect for the validator,
                    not a hole for the reader to fall into. */}
                {why.trim() === '' ? null : (
                  <p className="opt__why">
                    <BankText text={why} />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {failure === null ? null : (
        <div className="row">
          <span className="chip chip--incorrect" role="status">
            {failureMessage(failure)}
          </span>
        </div>
      )}

      <div className="footer">
        <div className="row keys" style={{ gap: 'var(--space-3)' }}>
          <span className="kbd">1</span>
          <span className="kbd">2</span>
          <span className="kbd">3</span>
          <span className="kbd">4</span>
          <span className="meta">choose</span>
          <span className="kbd">&crarr;</span>
          <span className="kbd">&rarr;</span>
          <span className="meta">next</span>
        </div>
        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!hasNext || answer === null}
            onClick={onNext}
          >
            Next question
          </button>
        </div>
      </div>
    </div>
  );
}
