// Reading a sitting back, after it has been scored.
//
// The review is the screen the bank was written for. Every number on it is
// decided here for the usual reason: a scoreboard with no oracle has to be
// checkable by calling it. But this module also decides something subtler than
// a number, and it is worth naming at the top of the file.
//
// **"Incorrect" here means *did not earn the mark*.** A question left blank cost
// exactly what a wrong answer cost — the submit statement counts
// `WHERE a.is_correct`, so a blank and a wrong answer are the same to it — and
// doc 10 §8 opens this screen filtered to Incorrect on the grounds that nobody
// reviews the ones they got right. If blanks fell outside that filter they
// would be misses hidden from the default view of the screen that exists to
// show misses, and correct + incorrect would stop summing to the paper. So the
// filter claims them, and the card still says *unanswered* rather than
// inventing a choice: the grouping and the label answer different questions.

import { PASS_RATIO, passMark } from './score.ts';
import { DOMAINS, weightPercent, type Domain } from './weights.ts';

/**
 * What one question scored.
 *
 * Three values, not two, because the ticket is explicit that a blank is shown
 * as a blank. `unanswered` is a presentational distinction on top of the binary
 * the score is actually counted from.
 */
export type QuestionVerdict = 'correct' | 'incorrect' | 'unanswered';

/**
 * The three verdicts in words.
 *
 * The written state lives in this layer for the reason `navigator.ts` gives:
 * colour, border style and a glyph carry it visually, and this is the same
 * information for greyscale and for a screen reader. Held here rather than
 * spelled out at each of the three call sites — the card's heading, the card's
 * tile, and the rail tile's label — because three copies of a ternary over the
 * same union is three chances for one of them to call a blank incorrect.
 *
 * A blank is **"not answered"**, never "incorrect", even though it is grouped
 * with the misses and scored as one. The label and the grouping answer
 * different questions.
 */
export const VERDICT_LABEL: Readonly<Record<QuestionVerdict, string>> = {
  correct: 'correct',
  incorrect: 'incorrect',
  unanswered: 'not answered',
};

/** What the review needs to know about one question. Nothing about its content. */
export interface ReviewedQuestion {
  domain: Domain;
  verdict: QuestionVerdict;
  /** Orthogonal to the verdict, per doc 05 §8 — drawn over it, never instead of it. */
  flagged: boolean;
}

/**
 * How the sitting recorded one question, read back.
 *
 * `isCorrect` is the row's own denormalised column (doc 04 §5.3), not something
 * re-derived from today's bank. A correction to a question after the sitting
 * must not silently rewrite what that sitting scored.
 */
export function verdictOf(recorded: {
  optionRef: string | null;
  isCorrect: boolean | null;
}): QuestionVerdict {
  if (recorded.optionRef === null) return 'unanswered';
  // Deliberately `=== true` rather than a truthiness test, so a row that somehow
  // holds an option with no recorded correctness reads the way the submit
  // statement counted it — `count(*) WHERE a.is_correct` counts neither false
  // nor null — instead of the way a reader might hope.
  return recorded.isCorrect === true ? 'correct' : 'incorrect';
}

/** The four views of a sitting, in the order doc 10 §8 puts them. */
export const REVIEW_FILTERS = ['incorrect', 'correct', 'flagged', 'all'] as const;

export type ReviewFilter = (typeof REVIEW_FILTERS)[number];

/** Doc 10 §8: the screen opens on the misses. */
export const DEFAULT_REVIEW_FILTER: ReviewFilter = 'incorrect';

/** Whether one question belongs in one view. See this file's header on `incorrect`. */
export function matchesFilter(question: ReviewedQuestion, filter: ReviewFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'correct':
      return question.verdict === 'correct';
    case 'incorrect':
      return question.verdict !== 'correct';
    case 'flagged':
      return question.flagged;
  }
}

export type ReviewCounts = Record<ReviewFilter, number>;

/**
 * How many questions each filter would show.
 *
 * The count beside a filter is what tells a reader whether pressing it is worth
 * anything, and it is also the only way to know an empty result is empty rather
 * than broken. Derived from the same predicate the filtering uses, so the
 * number on the chip and the cards behind it cannot disagree.
 */
export function countByFilter(questions: readonly ReviewedQuestion[]): ReviewCounts {
  const counts = { incorrect: 0, correct: 0, flagged: 0, all: 0 } as ReviewCounts;
  for (const question of questions) {
    for (const filter of REVIEW_FILTERS) {
      if (matchesFilter(question, filter)) counts[filter] += 1;
    }
  }
  return counts;
}

export interface DomainResult {
  domain: Domain;
  /** What the real exam publishes for this domain, so the card can say it. */
  weightPercent: number;
  correct: number;
  /** Every question the paper asked from this domain, blanks included. */
  total: number;
  /** Rounded to one decimal, for display. The comparison below never reads it. */
  percent: number;
  /** At or above the pass ratio for this domain's own slice. */
  meetsMark: boolean;
}

/**
 * How the sitting went, domain by domain.
 *
 * Blanks stay in the denominator. Dropping them would make a domain look
 * stronger the more of it was skipped, which is the opposite of what someone
 * reading this card is trying to find out.
 *
 * Domains the paper did not ask are omitted rather than shown as 0 of 0. The
 * sixteen papers all carry six domains, so this is defensive — but a meter at
 * "0%" for a domain that was never on the paper reads as a failure.
 *
 * Ordered by the canonical weight order, heaviest first, the same as everywhere
 * else the six appear.
 */
export function domainBreakdown(questions: readonly ReviewedQuestion[]): DomainResult[] {
  const rows: DomainResult[] = [];

  for (const domain of DOMAINS) {
    const asked = questions.filter((q) => q.domain === domain);
    if (asked.length === 0) continue;

    const correct = asked.filter((q) => q.verdict === 'correct').length;
    rows.push({
      domain,
      weightPercent: weightPercent(domain),
      correct,
      total: asked.length,
      percent: Math.round((correct / asked.length) * 1000) / 10,
      // Compared as a ratio of counts, never as the rounded percentage above.
      // Deciding "met the mark" on a display figure is how 74.95% becomes 75%.
      meetsMark: correct >= passMark(asked.length),
    });
  }

  return rows;
}

/**
 * Which of the three things there is to say about this sitting's place in the
 * paper's history.
 *
 * `first-unfinalised` exists because of a bug this replaced. The obvious
 * branch — "no first-attempt score, therefore this is the first sitting" — is
 * wrong: `firstAttemptScore` is `max(score) WHERE is_first_attempt`, and an
 * **abandoned** first sitting has no score at all. So reviewing sitting two
 * after abandoning sitting one announced "this is the first sitting of this
 * paper", against PRD §5's rule that an abandoned attempt *is* the first
 * attempt. The ordinal is what actually knows, and the missing score is a
 * separate thing worth saying rather than a reason to say the wrong thing.
 *
 * It becomes reachable the moment #26 lands lazy finalisation, and it is the
 * one number this project exists to keep honest.
 */
export type Standing = 'first-sitting' | 'first-unfinalised' | 'settled';

export function standingOf(ordinal: number, firstAttemptScore: number | null): Standing {
  if (ordinal <= 1) return 'first-sitting';
  // `=== null`, not falsy: a first attempt that scored 0 is a real and settled
  // number, and collapsing it into "not finalised" would hide the worst one.
  return firstAttemptScore === null ? 'first-unfinalised' : 'settled';
}

export interface PassBar {
  /** Where the fill ends, 0–100. */
  fillPercent: number;
  /** Where the pass tick sits, 0–100 — the ratio, not a rounded count. */
  tickPercent: number;
}

/**
 * The score bar's two positions.
 *
 * The tick is drawn from {@link PASS_RATIO} rather than from
 * `passMark / questionCount`, because the mark rounds **up** to a whole
 * question: at a length where the ratio does not divide evenly, a tick placed
 * at the rounded mark would sit slightly right of the line the score is
 * actually compared against, and a fill just short of it would look like a
 * pass. At 60 and at 40 the two coincide exactly, which the test asserts so
 * this stays true if a third length ever appears.
 */
export function passBar(score: number, questionCount: number): PassBar {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  if (!Number.isInteger(score) || score < 0 || score > questionCount) {
    throw new Error(`A sitting of ${questionCount} question(s) cannot score ${score}.`);
  }

  return {
    fillPercent: Math.round((score / questionCount) * 1000) / 10,
    tickPercent: PASS_RATIO * 100,
  };
}

export interface VerdictSummary {
  /** Which semantic family says it. The words below say it too, for greyscale. */
  tone: 'correct' | 'incorrect';
  text: string;
}

/**
 * The score in one sentence, as doc 10 §8's verdict chip.
 *
 * The distance is stated rather than left to the reader to subtract, because
 * "four short" is the thing a candidate does something about and `41 / 60` is
 * not. The words carry the verdict on their own — doc 05 §8's rule is that
 * colour is never the only signal, and this chip is the most colour-forward
 * element on the screen.
 */
export function verdictSummary(score: number, questionCount: number): VerdictSummary {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  if (!Number.isInteger(score) || score < 0 || score > questionCount) {
    throw new Error(`A sitting of ${questionCount} question(s) cannot score ${score}.`);
  }

  const mark = passMark(questionCount);
  if (score < mark) return { tone: 'incorrect', text: `${mark - score} short of the pass mark` };
  if (score === mark) return { tone: 'correct', text: 'Passed, on the mark' };
  return { tone: 'correct', text: `Passed with ${score - mark} to spare` };
}

/**
 * How long the sitting was actually sat, in seconds.
 *
 * **Capped at the time limit**, which is not a cosmetic rounding. An expired
 * sitting is finalised whenever somebody next presses the button — doc 03 §6
 * permits it to sit expired-but-unfinalised indefinitely — so
 * `submitted_at - started_at` on one of those measures the gap until the reader
 * came back, not the sitting. Observed on a real expired sitting: 25:01:20 on a
 * ninety-minute paper. Nothing was used after the deadline; the server refuses
 * every write past it.
 *
 * A sitting with no clock (practice, domain) has nothing to cap against and
 * reports the whole elapsed time, which for those modes is the truth.
 *
 * Clamped at zero for the same reason `formatElapsed` is: the two timestamps
 * are both the server's, so a negative gap should not arise, and a negative
 * duration on a score card would be believed as readily as a positive one.
 */
export function timeUsedSeconds(
  startedAt: Date,
  submittedAt: Date,
  timeLimitSeconds: number | null,
): number {
  const elapsed = Math.max(0, Math.round((submittedAt.getTime() - startedAt.getTime()) / 1000));
  return timeLimitSeconds === null ? elapsed : Math.min(elapsed, timeLimitSeconds);
}

/**
 * How long the sitting took, as `MM:SS` or `H:MM:SS`.
 *
 * Separate from `formatRemaining` in `clock.ts`, which is a countdown and
 * deliberately never grows an hours field — it stops at `00:00` and its largest
 * reading is 90:00. This one counts up and can pass an hour, so it needs the
 * field. Clamped at zero for the same reason the countdown is: a negative
 * duration on a score card would be believed exactly as readily as a positive
 * one.
 */
export function formatElapsed(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const rest = clamped % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(rest).padStart(2, '0');
  return hours === 0 ? `${mm}:${ss}` : `${hours}:${mm}:${ss}`;
}

/**
 * Which of doc 05 §8's states one option row is in.
 *
 * Four, not three: an option can be the correct one *and* the one chosen, and
 * that has to be sayable without a fifth colour — the same reason flagged is
 * orthogonal rather than a value in the tile's enum.
 */
export type OptionRole = 'correct-chosen' | 'correct' | 'chosen-wrong' | 'not-correct';

export function optionRole(
  option: { ref: string; correct: boolean },
  chosenRef: string | null,
): OptionRole {
  const chosen = chosenRef !== null && option.ref === chosenRef;
  if (option.correct) return chosen ? 'correct-chosen' : 'correct';
  return chosen ? 'chosen-wrong' : 'not-correct';
}

/**
 * The same four states in words, verbatim from doc 05 §8.
 *
 * The written state lives in this layer for the reason `navigator.ts` gives:
 * colour, border and glyph carry the state visually, and this is the same
 * information for a screen reader and for anyone the colours fail. Doc 05 makes
 * `filter: grayscale(1)` a standing test, and these strings are what passes it.
 *
 * "Not correct" rather than "incorrect" on the two nobody chose, because
 * *nobody was wrong about them* — and their explanation is shown regardless,
 * which is the whole point of the screen.
 */
export const OPTION_ROLE_LABEL: Readonly<Record<OptionRole, string>> = {
  'correct-chosen': 'Correct · your answer',
  correct: 'Correct answer',
  'chosen-wrong': 'Your answer',
  'not-correct': 'Not correct',
};
