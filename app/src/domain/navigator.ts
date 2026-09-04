// The navigator's model: sixty questions and what is known about each.
//
// This is the screen element that makes a ninety-minute sitting survivable —
// skip the hard one, bank the easy ones, come back — so what it says has to be
// exactly true. It reports two numbers a candidate makes decisions on, and a
// count that was wrong by one would be believed.
//
// It is pure for the usual reason: the counts are decided here, and a decided
// number in this app is a tested number. It is also where the **written**
// state lives. Colour, border style and a folded corner carry each state
// visually; `label` is the same information in words, which is what reaches a
// screen reader and anyone the colours fail.

/** One question's place on the paper. Nothing about its content. */
export interface NavigatorQuestion {
  id: string;
  /** 0-based position on the paper — the exam's defined order (PRD E1). */
  seq: number;
}

/** What the sitting holds for one question. The same shape the writes produce. */
export interface RecordedState {
  optionRef: string | null;
  flagged: boolean;
}

/**
 * A question with nothing recorded against it.
 *
 * The one place the default lives. "No row yet" and "a row with no option
 * chosen" are the same thing to every reader of this state, and they have to
 * stay the same thing: the flagged-but-unanswered row exists precisely because
 * the flag needed somewhere to live (doc 04 §6).
 */
export const UNANSWERED: RecordedState = { optionRef: null, flagged: false };

/** What is recorded for one question, or the unanswered default. */
export function stateFor(
  all: Readonly<Record<string, RecordedState>>,
  questionId: string,
): RecordedState {
  return all[questionId] ?? UNANSWERED;
}

/**
 * One question's state, replaced — the rest of the sitting untouched.
 *
 * Returns a new record rather than mutating, because it feeds React state and
 * a mutated object is a render that does not happen.
 */
export function patch(
  all: Readonly<Record<string, RecordedState>>,
  questionId: string,
  apply: (before: RecordedState) => RecordedState,
): Record<string, RecordedState> {
  return { ...all, [questionId]: apply(stateFor(all, questionId)) };
}

/**
 * One tile.
 *
 * `answered`, `flagged` and `current` are three independent booleans rather
 * than one enum, and that is the design system's rule rather than a
 * convenience: flagged is drawn *over* whatever the tile already is, so
 * answered-and-flagged has to be expressible without a sixth value.
 */
export interface NavigatorTile {
  questionId: string;
  seq: number;
  /** 1-based, as displayed. The question counter says the same number. */
  number: number;
  answered: boolean;
  flagged: boolean;
  current: boolean;
  /** The tile's whole state in words. Survives greyscale and a screen reader. */
  label: string;
}

export interface NavigatorModel {
  tiles: NavigatorTile[];
  answered: number;
  unanswered: number;
  flagged: number;
}

/**
 * A question is answered when an option is chosen, and not before.
 *
 * A flagged question with no answer has a row — the flag needs somewhere to
 * live (doc 04 §6) — and that row must not read as progress. It scores as
 * unanswered, so it counts as unanswered here.
 */
function isAnswered(recorded: RecordedState): boolean {
  return recorded.optionRef !== null;
}

function describe(tile: Omit<NavigatorTile, 'label'>): string {
  const parts = [`Question ${tile.number}`, tile.answered ? 'answered' : 'unanswered'];
  if (tile.flagged) parts.push('flagged for review');
  if (tile.current) parts.push('current question');
  return parts.join(', ');
}

/**
 * Build the navigator for a sitting.
 *
 * Throws rather than repairs. A position off the end of the paper, or two
 * questions claiming one slot, is a bug in the caller, and a navigator that
 * quietly clamped or de-duplicated would keep drawing sixty plausible tiles
 * over a paper it had misread.
 *
 * Rows for questions this paper does not ask are ignored rather than counted.
 * Answers are already scoped to one attempt, so this should not arise — but a
 * count inflated by a stray row is exactly the kind of believed-wrong number
 * this layer exists to prevent.
 */
export function buildNavigator(
  questions: readonly NavigatorQuestion[],
  recorded: Readonly<Record<string, RecordedState>>,
  currentSeq: number,
): NavigatorModel {
  const ordered = [...questions].sort((a, b) => a.seq - b.seq);

  // The paper's positions must be exactly 0…n-1, which is what `exam_item.seq`
  // is (doc 04 §3.4). Asserting it is what lets everything downstream treat a
  // seq and an array index as the same number — the tile reports `seq` when it
  // is clicked, and the sitting reads that back as an index. They agree only
  // because of this, so a gap or a duplicate has to stop here rather than
  // quietly selecting the wrong question sixty tiles later.
  for (const [index, question] of ordered.entries()) {
    if (question.seq !== index) {
      throw new Error(
        `A paper's positions run 0 to n-1; found ${question.seq} where ${index} was expected.`,
      );
    }
  }

  if (!Number.isInteger(currentSeq) || currentSeq < 0 || currentSeq >= ordered.length) {
    throw new Error(
      `The current question must be on the paper; got ${currentSeq} of ${ordered.length}.`,
    );
  }

  let answered = 0;
  let flagged = 0;

  const tiles = ordered.map((question) => {
    const state = stateFor(recorded, question.id);
    const tile = {
      questionId: question.id,
      seq: question.seq,
      number: question.seq + 1,
      answered: isAnswered(state),
      flagged: state.flagged,
      current: question.seq === currentSeq,
    };

    if (tile.answered) answered += 1;
    if (tile.flagged) flagged += 1;

    return { ...tile, label: describe(tile) };
  });

  return { tiles, answered, unanswered: tiles.length - answered, flagged };
}

/**
 * One question this sitting has a row for, and when that row was last written.
 *
 * `updatedAt` moves on every change of answer *and* every change of flag (doc
 * 04 §5.3), which is exactly what makes it a record of attention rather than of
 * answering. `answeredAt` deliberately does not move on a later change, because
 * least-recently-seen selection reads it — so it is the wrong column for this.
 */
export interface TouchedQuestion {
  questionId: string;
  updatedAt: Date;
}

/**
 * Where a resumed sitting opens.
 *
 * PRD E5 wants to close the tab at question 40 and come back to question 40.
 * There is no column recording which question was on screen, and this derives
 * the answer instead: the question whose row was written most recently is the
 * one last engaged with. **Nothing is stored and no write happens on
 * navigation** — the position is a reading of the answers, which are written
 * anyway.
 *
 * The honest limit, stated rather than hidden: a question looked at and left
 * blank leaves no row, so walking forward past forty without answering and
 * then reloading returns to the last question actually touched. That is a
 * weaker guarantee than a stored position, and the alternative was a write on
 * every arrow press to record something a lost copy of which costs nothing.
 *
 * Falls back to the first question — a fresh sitting has touched nothing, and
 * that is the same case as an interrupted one that answered nothing.
 */
export function resumeSeq(
  questions: readonly NavigatorQuestion[],
  touched: readonly TouchedQuestion[],
): number {
  const seqOf = new Map(questions.map((question) => [question.id, question.seq]));

  let best = 0;
  let bestAt = -Infinity;

  for (const row of touched) {
    const seq = seqOf.get(row.questionId);
    // A row for a question this paper does not ask cannot be resumed onto —
    // `buildNavigator` would refuse the position — so it is skipped rather
    // than clamped.
    if (seq === undefined) continue;

    const at = row.updatedAt.getTime();
    // Ties take the later question. Two rows written in the same millisecond
    // is not a real sequence, and moving forward is the better guess than
    // moving back.
    if (at > bestAt || (at === bestAt && seq > best)) {
      best = seq;
      bestAt = at;
    }
  }

  return best;
}
