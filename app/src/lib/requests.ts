// What a write request is allowed to say.
//
// Every route handler parses its body through one of these before anything else
// runs, and client-side validation is never trusted — it exists to make the UI
// pleasant. The whole surface is two ids and a boolean, which is small enough
// to state exactly, and stating it exactly is what keeps it small.
//
// No I/O here, so these are unit-tested without a server or a database.

import { z } from 'zod';
import { DEFAULT_PRACTICE_LENGTH, DOMAINS } from '../domain/weights.ts';

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

/**
 * Starting a sitting.
 *
 * The whole input surface, stated exactly, because it is the whole attack
 * surface: a mode from a fixed set, a paper id matching a known shape, a domain
 * from the six, and a length from three choices. Never a free integer, never a
 * string that reaches a query unvalidated.
 *
 * A discriminated union rather than one object with optional fields, so *"a
 * domain sitting has a domain"* is a fact the parser establishes rather than
 * something the handler re-checks. The check constraints in doc 04 §5.1 say the
 * same thing at the other end; this is what stops the round trip.
 *
 * **The two `length` fields are different types and deliberately not shared.**
 * A weighted sitting is 20, 40 or 60 — lengths the composer must hit exactly. A
 * domain sitting's `'all'` is not a length at all, it is a fact about the pool.
 * Both default to 20, and practice's default is read from the one place it is
 * decided rather than retyped here.
 */
export const StartAttemptRequest = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('exam'), examId: z.string().regex(/^exam-\d{2}$/) }),
  z.object({
    mode: z.literal('practice'),
    length: z
      .union([z.literal(20), z.literal(40), z.literal(60)])
      .default(DEFAULT_PRACTICE_LENGTH),
  }),
  z.object({ mode: z.literal('holdout') }),
  z.object({
    mode: z.literal('domain'),
    domain: z.enum(DOMAINS),
    length: z.union([z.literal(20), z.literal(40), z.literal('all')]).default(20),
  }),
]);

export type StartAttemptRequestBody = z.infer<typeof StartAttemptRequest>;
