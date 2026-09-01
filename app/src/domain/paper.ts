// Laying out a question as it appears on a generated paper.
//
// The sixteen papers record, per item, **where the correct option sits** — 0 to
// 3. That number is the whole answer key, so it stays on the server: the
// browser receives options already in their final order and nothing that says
// which one is right.
//
// The bank's own authoring varies which option is correct, and the papers were
// built to a deliberate answer-position balance. Reproducing that ordering is
// what makes a re-sit the same paper, and what stops the app accidentally
// putting every correct answer first.

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
  if (options.length !== 4) {
    throw new Error(`A question has four options; got ${options.length}.`);
  }
  if (!Number.isInteger(correctPosition) || correctPosition < 0 || correctPosition > 3) {
    throw new Error(`The correct option sits at 0–3; got ${correctPosition}.`);
  }

  const authored = [...options].sort((a, b) => a.position - b.position);
  const correct = authored.filter((o) => o.correct);
  if (correct.length !== 1) {
    throw new Error(`A question has exactly one correct option; got ${correct.length}.`);
  }

  const distractors = authored.filter((o) => !o.correct);
  const laidOut: AuthoredOption[] = [];

  for (let slot = 0; slot < 4; slot += 1) {
    if (slot === correctPosition) laidOut.push(correct[0] as AuthoredOption);
    else laidOut.push(distractors.shift() as AuthoredOption);
  }

  // Mapped down to ref and text — the stripping is here rather than at the
  // caller so there is one place where the answer key stops travelling, and it
  // is the same place that knows the answer.
  return laidOut.map(({ ref, text }) => ({ ref, text }));
}
