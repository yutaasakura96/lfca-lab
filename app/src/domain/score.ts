// What a sitting scored.
//
// The whole product is a scoreboard, and nothing outside this repo can tell us
// whether a number is right. That is why scoring is a pure function over the
// answers and the sitting's own length: it can be exercised at its boundaries —
// 44, 45, 46 — rather than trusted.

/** The real exam's pass mark, as a proportion. 45 of 60 is exactly this. */
export const PASS_RATIO = 0.75;

/** One answer as it is scored: correct, wrong, or never given. */
export interface ScoredAnswer {
  questionId: string;
  /** `null` means the question was never answered — it scores as wrong. */
  isCorrect: boolean | null;
}

export interface Sitting {
  answers: ScoredAnswer[];
  /**
   * How many questions the sitting asked — **not** how many were answered. An
   * attempt abandoned at question six asked sixty; the fifty-four missing
   * answer rows count against it, or quitting early would be the highest score
   * available.
   */
  questionCount: number;
}

export interface Score {
  score: number;
  questionCount: number;
  passMark: number;
  passed: boolean;
  /** Rounded to one decimal place; for display only, never for the pass test. */
  percent: number;
}

/**
 * The mark a sitting of this length must reach.
 *
 * Rounded **up**, so a fraction of a question never passes: a 21-question
 * sitting needs 16, not 15. At the two lengths that actually exist the ratio is
 * exact — 45 of 60, 30 of 40 — and the rounding never comes into play. It is
 * here so that a future length cannot silently pass someone on 15.75.
 */
export function passMark(questionCount: number): number {
  return Math.ceil(questionCount * PASS_RATIO);
}

/**
 * What a count of correct answers means.
 *
 * Split out from {@link scoreSitting} because the count and its meaning are
 * decided in two different places by the time a sitting is finalised: the
 * submit statement counts the correct rows in the same statement that writes
 * `submitted_at`, so the count cannot be taken from a read that a late answer
 * has already invalidated. The mark, the verdict and the percentage stay here,
 * so there is still exactly one definition of each — and `scoreSitting` is that
 * definition applied to answers rather than to a number.
 */
export function outcomeFor(score: number, questionCount: number): Score {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  if (!Number.isInteger(score) || score < 0 || score > questionCount) {
    // A score outside the paper is not a score to present cautiously. It means
    // the count came from something other than this sitting's answers.
    throw new Error(`A sitting of ${questionCount} question(s) cannot score ${score}.`);
  }

  const mark = passMark(questionCount);

  return {
    score,
    questionCount,
    passMark: mark,
    // Compared against the count, never against the percentage. Deciding a pass
    // on a rounded percentage is how 44.9% becomes 45%.
    passed: score >= mark,
    percent: Math.round((score / questionCount) * 1000) / 10,
  };
}

/**
 * Score a sitting from its answers.
 *
 * **Not the path a live submit takes**, and that is deliberate rather than
 * accidental: `submitAttempt` counts the correct rows inside the statement that
 * finalises the attempt, so the count and the `submitted_at` that stops further
 * answers are decided at one instant and cannot disagree. This is the same rule
 * written as a pure function — testable at 44/45/46, which a `count(*)` is not
 * — and the integration suite runs the two against the same rows and requires
 * them to agree. Doc 11 §1 says the danger here is a believed-wrong number with
 * no oracle to check it against; two independent implementations made to agree
 * is the nearest thing to one this system can have. Do not delete it for being
 * uncalled by production code.
 */
export function scoreSitting({ answers, questionCount }: Sitting): Score {
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new Error(`A sitting asks at least one question; got ${questionCount}.`);
  }
  if (answers.length > questionCount) {
    // More answers than questions means the attempt was padded with answers to
    // questions it never asked — a bug or an attack, and either way not
    // something to score politely.
    throw new Error(
      `A sitting of ${questionCount} question(s) cannot have ${answers.length} answer(s).`,
    );
  }

  return outcomeFor(answers.filter((a) => a.isCorrect === true).length, questionCount);
}
