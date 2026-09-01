// What a write request is allowed to say.
//
// Every route handler parses its body through one of these before anything else
// runs, and client-side validation is never trusted — it exists to make the UI
// pleasant. The whole surface is two ids and a boolean, which is small enough
// to state exactly, and stating it exactly is what keeps it small.
//
// No I/O here, so these are unit-tested without a server or a database.

import { z } from 'zod';

/**
 * A bank id: `q.` then dot-separated lowercase segments, e.g.
 * `q.linux.command-line.awk.03`. Asserted against all 1,150 ids in the unit
 * suite rather than against a handful of examples, because a regex tightened
 * past the real content refuses answers instead of attacks.
 */
export const QUESTION_ID = /^q\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

/** The bank authors four options per question, always `o1`–`o4`. */
export const OPTION_REF = /^o[1-4]$/;

/**
 * Recording an answer.
 *
 * `optionRef: null` clears the answer, and must be said rather than implied: a
 * missing field is a malformed body, while a null is a candidate deliberately
 * unselecting. Collapsing the two would let a bug that drops a field read as an
 * intention to erase.
 *
 * Nothing about correctness appears here. The server reads it from the bank on
 * every write; a client that offered it would be offering to score itself.
 */
export const AnswerRequest = z.object({
  questionId: z.string().regex(QUESTION_ID),
  optionRef: z.string().regex(OPTION_REF).nullable(),
});

export type AnswerRequestBody = z.infer<typeof AnswerRequest>;

/**
 * Flagging, and unflagging.
 *
 * Separate from the answer schema, not a variant of it. A flag cannot carry an
 * option ref because there is nowhere in this shape to put one — which is the
 * same reason the two have separate endpoints.
 */
export const FlagRequest = z.object({
  questionId: z.string().regex(QUESTION_ID),
  flagged: z.boolean(),
});

export type FlagRequestBody = z.infer<typeof FlagRequest>;
