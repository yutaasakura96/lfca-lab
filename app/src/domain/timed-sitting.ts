// What the timed screen says about the sitting it is showing.
//
// Two sittings take the timed arrangement — clock, free navigation, flags,
// submit — and they are not the same thing: a paper is one of sixteen, sat as
// often as wanted, with a best and a first attempt; the holdout is sat once and
// has neither (#56). The screen is shared and the words are not, so the words
// are decided here, once, from the stored mode and the stored limit, rather
// than spelled inline across the bar and the dialog where a holdout would read
// "ninety minutes" by accident.

/** The two modes that take the timed arrangement. */
export type TimedMode = 'exam' | 'holdout';

export interface TimedSittingCopy {
  /** The bar's and the dialog's name for this sitting. */
  title: string;
  /** The chip beside it. */
  modeLabel: string;
  /** The bar's Submit button, at rest. */
  submitLabel: string;
  /** The confirmation's heading. */
  confirmTitle: string;
  /** What pressing Submit does, said before it is pressed. */
  confirmBody: string;
  /** The limit in words, for "the ninety minutes are up". */
  minutes: string;
  /** "Your exam was submitted automatically." */
  noun: 'exam' | 'holdout';
  /** What the outcome says about a sitting the candidate submitted. */
  finishedBody: string;
  /**
   * Whether the outcome may offer this sitting's review, and whether a sitting
   * closed by the clock on arrival may be sent there. False for the holdout
   * until #59 builds its review: nothing may point at a 404 (#56, and the #37
   * precedent in the decision log, 2026-09-08).
   */
  reviewable: boolean;
  /** The outcome's way onward. */
  back: { href: string; label: string };
}

const MINUTE_WORDS: Readonly<Record<number, string>> = { 60: 'sixty', 90: 'ninety' };

export function timedSittingCopy(sitting: {
  mode: TimedMode;
  examId: string | null;
  timeLimitSeconds: number;
}): TimedSittingCopy {
  const limit = sitting.timeLimitSeconds / 60;
  const minutes = MINUTE_WORDS[limit] ?? String(limit);

  if (sitting.mode === 'exam') {
    // Unreachable: `attempt_exam_iff_exam_mode` makes mode and paper inseparable.
    if (sitting.examId === null) throw new Error('An exam sitting has no paper.');
    const number = sitting.examId.replace('exam-', '');
    return {
      title: `Practice exam ${number}`,
      modeLabel: 'Exam mode',
      submitLabel: 'Submit exam',
      confirmTitle: `Submit practice exam ${number}?`,
      confirmBody:
        'This ends the sitting. Every answer is revealed at once and the score is recorded against your best and first attempts. You cannot come back and change anything.',
      minutes,
      noun: 'exam',
      finishedBody:
        'This sitting is recorded. Questions left blank are marked incorrect, and the first-attempt score for this paper is unchanged by any later sitting.',
      reviewable: true,
      back: { href: '/exams', label: 'Back to the sixteen exams' },
    };
  }

  if (sitting.mode === 'holdout') {
    return {
      title: 'Holdout',
      modeLabel: 'Holdout',
      submitLabel: 'Submit holdout',
      confirmTitle: 'Submit the holdout?',
      confirmBody:
        'This ends the sitting. Every answer is revealed at once and the score is recorded. The holdout cannot be sat again, and you cannot come back and change anything.',
      minutes,
      noun: 'holdout',
      finishedBody:
        "This sitting is recorded. Questions left blank are marked incorrect, and this is the holdout's only score.",
      reviewable: false,
      back: { href: '/', label: 'Back to home' },
    };
  }

  // A mode with no clock has nothing true to say on this screen.
  throw new Error(`Mode ${String(sitting.mode)} is not a timed sitting.`);
}
