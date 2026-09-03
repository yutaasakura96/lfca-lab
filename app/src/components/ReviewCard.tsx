import type { ReviewQuestion } from '../db/queries/review.ts';
import { OPTION_ROLE_LABEL, optionRole, verdictOf, type OptionRole } from '../domain/review.ts';
import { BankText, Stem } from './Stem.tsx';

/**
 * The check, the cross and the dash, at option-row size.
 *
 * Doc 05 §8's rule is that colour is never the only signal, so every state
 * carries a glyph *and* a word. These are `aria-hidden` because the word beside
 * them is the accessible name — a screen reader announcing "check, correct
 * answer" would say it twice.
 */
function Glyph({ role }: { role: OptionRole }) {
  const common = {
    className: 'ico',
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
  };

  if (role === 'correct' || role === 'correct-chosen') {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M2.5 7.4 5.4 10.3 11.5 3.6" />
      </svg>
    );
  }
  if (role === 'chosen-wrong') {
    return (
      <svg {...common}>
        <path d="M3.6 3.6 10.4 10.4M10.4 3.6 3.6 10.4" />
      </svg>
    );
  }
  // Not correct, and nobody chose it. A dash rather than a cross: nobody was
  // wrong about this one, and its explanation is shown all the same.
  return (
    <svg {...common}>
      <path d="M3.4 7h7.2" />
    </svg>
  );
}

function FlagGlyph() {
  return (
    <svg
      className="ico"
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
    </svg>
  );
}

/** Which of doc 05 §8's families dresses the option row. */
const ROLE_CLASS: Readonly<Record<OptionRole, string>> = {
  'correct-chosen': 'opt opt--correct',
  correct: 'opt opt--correct',
  'chosen-wrong': 'opt opt--incorrect',
  // Neutral surface, no hue of its own. Doc 05's sixth option-row state.
  'not-correct': 'opt opt--muted',
};

/**
 * One question of a finished sitting, with all four explanations.
 *
 * A **server** component, and everything about it stays on the server: sixty of
 * these carry the whole answer key for a paper, and rendering them here means
 * what crosses to the browser is the finished markup rather than the data. The
 * filter that hides some of them is the only client state on this screen, and
 * it is one string.
 *
 * The card is the reason the bank was written the way it was. PRD E4 requires
 * the `why` for **all four** options — the wrong-option text explains why a
 * misconception is tempting, and a review showing only the correct answer's
 * explanation would waste the most valuable content there is here.
 */
export function ReviewCard({ question }: { question: ReviewQuestion }) {
  const verdict = verdictOf(question);
  const number = question.seq + 1;

  const tile =
    verdict === 'correct'
      ? 'tile tile--correct'
      : verdict === 'incorrect'
        ? 'tile tile--incorrect'
        : // Unanswered is the bare tile: dashed, no fill, deliberately no hue.
          'tile';

  return (
    <article
      className={verdict === 'unanswered' ? 'card qcard qcard--blank' : 'card qcard'}
      // Read by the filter's CSS. The state is an attribute rather than a class
      // so that hiding a card is one rule per filter rather than one per pair.
      data-verdict={verdict}
      data-flagged={question.flagged ? 'true' : 'false'}
      id={`q${number}`}
      aria-labelledby={`q${number}-label`}
    >
      <div className="qcard__head">
        <div className="row" style={{ gap: 'var(--space-4)' }}>
          <span className={question.flagged ? `${tile} tile--flagged` : tile} aria-hidden="true">
            <Glyph
              role={
                verdict === 'correct'
                  ? 'correct'
                  : verdict === 'incorrect'
                    ? 'chosen-wrong'
                    : // A dash, not a cross. The tile is dashed and uncoloured
                      // already; a cross on it would say the candidate got it
                      // wrong rather than that they never answered.
                      'not-correct'
              }
            />
          </span>
          <span className="stack" style={{ gap: 'var(--space-0)' }}>
            <span className="eyebrow" id={`q${number}-label`}>
              Question {number} &middot;{' '}
              {verdict === 'correct'
                ? 'correct'
                : verdict === 'incorrect'
                  ? 'incorrect'
                  : 'not answered'}
            </span>
            <span className="meta">
              {question.competency} &middot; {question.type}
            </span>
            {/* Doc 10 §8 gives the concept id a sunken panel of its own,
                alongside a study-guide link and a drill link. Neither of those
                exists — the guide stays outside the app by decision, and drills
                are not in the app's v1 — and a panel titled "Why this is the
                answer" whose only occupant is a mono id is a heading that lies.
                So the id sits with the rest of the identifying metadata. */}
            <span className="concept">{question.conceptId}</span>
          </span>
        </div>
        {question.flagged ? (
          <span className="chip chip--flagged">
            <FlagGlyph />
            You flagged this
          </span>
        ) : null}
      </div>

      <Stem text={question.stem} />

      {verdict === 'unanswered' ? (
        // The ticket's rule, said out loud rather than implied by an absence:
        // a blank is a blank, never wrong-by-omission with an invented choice.
        // Dashed and uncoloured, per doc 05 §8's unanswered treatment.
        <p className="blanknote">
          You did not answer this question. It scored as incorrect; the answer and all four
          explanations are below.
        </p>
      ) : null}

      <div className="opts">
        {question.options.map((option, index) => {
          const role = optionRole(option, question.optionRef);
          return (
            <div className={ROLE_CLASS[role]} key={option.ref}>
              <div className="opt__key">{String.fromCharCode(65 + index)}</div>
              <div className="opt__body">
                <span className="opt__verdict">
                  <Glyph role={role} />
                  {OPTION_ROLE_LABEL[role]}
                </span>
                <p className="opt__text">
                  <BankText text={option.text} />
                </p>
                {/* PRD §5: an option with no explanation renders what exists
                    rather than an empty block. The column is non-null and the
                    whole bank was measured to have text in every one of them,
                    so this is a data defect for the validator — not a hole for
                    the reader to fall into. */}
                {option.why.trim() === '' ? null : (
                  <p className="opt__why">
                    <BankText text={option.why} />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
