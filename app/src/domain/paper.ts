// Laying out a question as it appears on a generated paper.
//
// The sixteen papers record, per item, **where the correct option sits** — 0 to
// 3. That number is the whole answer key, so it stays on the server: the
// browser receives options already in their final order and nothing that says
// which one is right.
//
// The papers were built to a deliberate answer-position balance, and
// reproducing that ordering is what makes a re-sit the same paper.
//
// **The bank's authoring does not vary which option is correct.** Measured
// across the whole of it: in all 1,150 questions the key is authored *first*,
// because the option carrying `provenance_kind: key` is written as `o1`. The
// sixteen papers are unaffected — the builder shuffles, and `index.json` is
// balanced 240/240/240/240 — but it means a sitting rendered in authored order
// would put every correct answer at A. So a composed sitting, which has no
// recorded slot, **derives** one instead (see `slotForComposedSitting`).

/** An option as the bank authored it. `correct` never leaves the server. */
export interface AuthoredOption {
  ref: string;
  text: string;
  correct: boolean;
  /** 0–3, the option's index in authored order. */
  position: number;
}

/** An option as the candidate sees it: no correctness, no explanation. */
export interface PresentedOption {
  ref: string;
  text: string;
}

/**
 * Place the correct option at its recorded slot, distractors around it.
 *
 * The three distractors keep their authored order and fill the remaining slots
 * in sequence. That is deterministic — the same paper lays out the same way on
 * every sitting and every re-sit — and it is the property that makes an
 * interrupted attempt resumable without storing a permutation.
 *
 * **Accepted divergence:** this will not always byte-match the distractor order
 * in the generated markdown. The correct answer's slot always matches, which is
 * what the answer-position balance is about; nothing depends on where the
 * wrong answers fall relative to each other, and parsing generated markdown to
 * recover it would make the app depend on a rendering format it should not know
 * about.
 */
export function orderOptionsForPaper(
  options: readonly AuthoredOption[],
  correctPosition: number,
): PresentedOption[] {
  // Mapped down to ref and text — the stripping is here rather than at the
  // caller so there is one place where the answer key stops travelling, and it
  // is the same place that knows the answer.
  return layOutForPaper(options, correctPosition).map(({ ref, text }) => ({ ref, text }));
}

/**
 * Where the correct option sits in one composed sitting's copy of a question.
 *
 * **Derived, not recorded, and not random.** A paper carries
 * `exam_item.correct_position` because sixteen fixed papers were built to an
 * answer-position balance that a re-sit has to reproduce. A practice or domain
 * sitting has no paper — `attempt_question` stores which questions were asked
 * and in what order, and nothing about the options (doc 04 §5.4) — so there is
 * no slot to look up. Hashing the two ids that *do* identify this question in
 * this sitting gives one anyway: stable across reloads and across the review,
 * available anywhere both ids are known, and stored nowhere.
 *
 * Stability is the requirement rather than a nicety. The verdict bar names a
 * letter — "the answer is A" — and a reload that moved the options would make
 * that sentence wrong about what the candidate saw. `Math.random()` and
 * anything reading a clock are ruled out for the same reason; this file is pure
 * (doc 03 §4) and could not reach either.
 *
 * FNV-1a, 32-bit, because it needs to be a well-mixed function of two short
 * strings and nothing more. Nothing here is a secret: the layout is not the
 * answer key, and the key never crosses to the browser during a sitting.
 */
export function slotForComposedSitting(attemptId: string, questionId: string): number {
  const input = `${attemptId}:${questionId}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    // The FNV prime, applied with shifts and `>>> 0` so this stays in 32-bit
    // unsigned arithmetic rather than drifting into float precision.
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  // FNV-1a's low bits are its weak ones, and `% 4` reads nothing else — an
  // early draft of this reached only two of the four slots. A murmur3 final
  // avalanche mixes the high bits down before the modulo, which is what makes
  // the four slots come up evenly (asserted over four thousand ids).
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b) >>> 0;
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35) >>> 0;
  hash ^= hash >>> 16;

  return (hash >>> 0) % 4;
}

/**
 * Present a composed sitting's options, at their derived slot.
 *
 * The counterpart to {@link orderOptionsForPaper}: same placement, different
 * source for the one number it needs. Both go through {@link layOutForPaper},
 * so there is one implementation of the ordering and two things that decide
 * where the key goes — a paper's recorded slot, and this one's derived one.
 *
 * This replaced a projection that rendered **authored** order, which was
 * correct reasoning from a false premise: there is genuinely no slot to
 * reproduce here, but the bank authors the key first every single time (see
 * this file's header), so authored order meant the answer was always A.
 *
 * The guards are {@link layOutForPaper}'s, and correctness is stripped here for
 * the reason it is stripped in the paper projection: one place where the answer
 * key stops travelling, and it is the same place that knows the answer.
 */
export function presentForComposedSitting(
  options: readonly AuthoredOption[],
  attemptId: string,
  questionId: string,
): PresentedOption[] {
  return layOutForPaper(options, slotForComposedSitting(attemptId, questionId)).map(
    ({ ref, text }) => ({ ref, text }),
  );
}

/**
 * The placement itself, keeping whatever the caller's options carry.
 *
 * Split out from {@link orderOptionsForPaper} for one reason: the review screen
 * shows the same paper *with* correctness and the `why` for all four options,
 * and it has to place them in the identical slots. A second implementation of
 * this ordering would eventually disagree by one, and the symptom would be the
 * review naming a letter the candidate never pressed — a wrong answer about
 * what somebody did, on the screen they are there to learn from.
 *
 * So there is one placement and two projections of it. The sitting's projection
 * is the one above, and it is still the only place correctness stops
 * travelling: this function is deliberately not the export a page reaches for.
 */
export function layOutForPaper<T extends { correct: boolean; position: number }>(
  options: readonly T[],
  correctPosition: number,
): T[] {
  if (!Number.isInteger(correctPosition) || correctPosition < 0 || correctPosition > 3) {
    throw new Error(`The correct option sits at 0–3; got ${correctPosition}.`);
  }
  assertOneKeyOfFour(options);

  const authored = [...options].sort((a, b) => a.position - b.position);
  const correct = authored.filter((o) => o.correct);
  const distractors = authored.filter((o) => !o.correct);
  const laidOut: T[] = [];

  for (let slot = 0; slot < 4; slot += 1) {
    if (slot === correctPosition) laidOut.push(correct[0] as T);
    else laidOut.push(distractors.shift() as T);
  }

  return laidOut;
}

/**
 * Four options, exactly one of them right.
 *
 * Shared by every projection so the reads that serve a question cannot come to
 * disagree about what a well-formed one is. Exported for the third of them —
 * the immediate feedback a practice or domain answer gets back, which has no
 * layout to compute and still must not name a key it cannot find.
 */
export function assertOneKeyOfFour(options: readonly { correct: boolean }[]): void {
  if (options.length !== 4) {
    throw new Error(`A question has four options; got ${options.length}.`);
  }
  const correct = options.filter((o) => o.correct).length;
  if (correct !== 1) {
    throw new Error(`A question has exactly one correct option; got ${correct}.`);
  }
}
