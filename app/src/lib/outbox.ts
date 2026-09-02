// The outbox: a failing network, survived, without lying about it.
//
// Doc 03 §7. Every answer and every flag is a separate immediate write, and the
// endpoint upserts on `(attempt_id, question_id)` — so a write is safe to send
// again, and sending it again is the whole strategy. What this adds is the
// memory: which writes are still owed, how long to wait before trying them
// again, and whether the screen may stop saying "not saved".
//
// **In memory, deliberately.** A durable queue would buy answering while fully
// offline, at the cost of replaying stale writes against an attempt the server
// has already auto-submitted at ninety minutes. Doc 10's contract is "at most
// the in-flight answer is lost", and this meets it exactly. See the decision
// log, 2026-08-30.
//
// It knows nothing about React and nothing about the clock. That is not tidiness
// — the clock must never pause for a failing write (doc 10 §4), and the surest
// way to guarantee that is for the thing that retries to have no way to reach it.
//
// **It lives here rather than in `src/domain/`, and that was a choice.** The
// rule is that anything deciding a number is a pure function there (doc 03 §4),
// and `retryDelay` decides one. But the numbers that directory exists for are
// the product's — which questions, in what order, what the score is, how much
// time is left — and a backoff is transport policy, not one of those. It sits
// beside `writes.ts`, its only collaborator, and is unit-tested in the same
// suite the domain is, which is what the rule was actually protecting.

import type { WriteFailure } from './writes.ts';

/** The delays before each retry, in order. Doubling from one second. */
const RETRY_DELAYS_MS = [1_000, 2_000, 4_000, 8_000, 16_000];

/** The longest this ever waits between attempts. */
export const RETRY_CAP_MS = 30_000;

/**
 * How long to wait after `consecutiveFailures` failures in a row.
 *
 * Doc 03 §7 writes the schedule as "1s, 2s, 4s, 8s, capped 30s". Doubling
 * reaches the cap on the sixth attempt and holds there: a sitting can be
 * ninety minutes long, and a queue that kept doubling would be checking twice
 * an hour by the end of it.
 */
export function retryDelay(consecutiveFailures: number): number {
  return RETRY_DELAYS_MS[consecutiveFailures - 1] ?? RETRY_CAP_MS;
}

/**
 * Consecutive failures before this is worth saying out loud once.
 *
 * Doc 03 §8: a breadcrumb per failure, an event only after five in a row on one
 * attempt — so that a tunnel that flaps for a second does not report, and a
 * write path that is actually broken reports exactly once.
 */
export const SUSTAINED_AFTER = 5;

/** One write the outbox owes the server. */
export interface OutboxWrite {
  /**
   * What this write is *about* — in the sitting, `${questionId}:${lane}`.
   *
   * The queue holds at most one write per key, and a newer one replaces an
   * older one that has not landed. This is what stops a retry putting back an
   * answer the candidate has since changed: only the latest intention for a
   * given thing is ever owed.
   */
  key: string;
  send: () => Promise<WriteFailure | null>;
  /**
   * Called once this write is done with — landed (`null`), or refused for a
   * reason repeating cannot fix. A write still being retried has not settled.
   */
  settled?: (failure: WriteFailure | null) => void;
}

export interface OutboxState {
  /** Writes the server has not confirmed. Submit waits on this reaching zero. */
  pending: number;
  /**
   * A write has failed and is waiting to be tried again. What the chip reads.
   *
   * Doc 03 §7 says to show the chip "while outbox non-empty", and this is the
   * faithful reading of that rather than a departure from it: in doc 03's own
   * design the first attempt happens *outside* the queue, so a write is only
   * ever in the outbox because it failed. Here every write goes through the
   * queue — which is what stops a retry overwriting a newer click — so
   * `pending` also counts the healthy write that is in the air right now, and
   * binding the chip to it would flash "not saved" on every ordinary click.
   * `pending` remains the right signal for **submit**, which doc 03 blocks for
   * exactly that in-flight write.
   */
  retrying: boolean;
}

/** Cancels a scheduled retry. */
type Cancel = () => void;

export interface OutboxOptions {
  /** Called whenever `pending` or `retrying` changes, never for an equal state. */
  onChange?: (state: OutboxState) => void;
  /** Called once when failures reach {@link SUSTAINED_AFTER}, not on every retry. */
  onSustained?: (failure: WriteFailure, failures: number) => void;
  /** Injected so a test can read the delay chosen without waiting it out. */
  schedule?: (run: () => void, ms: number) => Cancel;
}

export interface Outbox {
  /** Queue a write and try it now. Replaces any unlanded write with the same key. */
  send: (write: OutboxWrite) => void;
  /** Try everything owed immediately, abandoning the current wait. */
  flush: () => void;
  state: () => OutboxState;
}

function defaultSchedule(run: () => void, ms: number): Cancel {
  const timer = setTimeout(run, ms);
  return () => clearTimeout(timer);
}

export function createOutbox(options: OutboxOptions = {}): Outbox {
  const schedule = options.schedule ?? defaultSchedule;

  // Insertion-ordered, and re-setting an existing key keeps its place — so the
  // queue drains in the order the writes were owed, and superseding one does
  // not send it to the back.
  const queue = new Map<string, OutboxWrite>();

  let draining = false;
  let failures = 0;
  let reported = false;
  let cancelRetry: Cancel | null = null;
  let lastNotified: OutboxState = { pending: 0, retrying: false };

  function state(): OutboxState {
    return { pending: queue.size, retrying: failures > 0 };
  }

  function notify() {
    const next = state();
    if (next.pending === lastNotified.pending && next.retrying === lastNotified.retrying) return;
    lastNotified = next;
    options.onChange?.(next);
  }

  function cancelPending() {
    cancelRetry?.();
    cancelRetry = null;
  }

  function scheduleRetry() {
    cancelPending();
    if (queue.size === 0) return;
    cancelRetry = schedule(() => {
      cancelRetry = null;
      void drain();
    }, retryDelay(failures));
  }

  /**
   * One pass: every write currently owed, attempted once, oldest first.
   *
   * It does **not** stop at the first retryable failure, and that is the
   * deliberate half. Stopping would be cheaper when the connection is simply
   * down — one request instead of five to learn the same thing — but it starves
   * everything behind a write that keeps failing on its own, and a flag that
   * will not save must never be able to hold an answer hostage. The number of
   * doomed requests is bounded by the number of writes genuinely owed, which is
   * the number of times the candidate clicked while the network was away.
   *
   * The queue is re-read on every iteration rather than snapshotted, so a click
   * that arrives mid-pass is sent in that pass instead of waiting out a backoff
   * it played no part in causing.
   *
   * What has been attempted is tracked **by write, not by key**, and the
   * difference is a lost answer. A click that lands while that same question's
   * previous write is still in the air replaces it in the queue; the older
   * write then finishes and, correctly, does not delete the newer one. Were the
   * key marked as done, the pass would walk past the replacement, find nothing
   * else owed, schedule no retry — and the queue would sit holding an answer
   * the database never receives, with no chip to say so. It needs no network
   * fault: changing an answer during an ordinary round trip is enough.
   */
  async function drain(): Promise<void> {
    if (draining) return;
    draining = true;
    try {
      const attempted = new Set<OutboxWrite>();
      let retryableFailure: WriteFailure | null = null;

      for (;;) {
        let found: [string, OutboxWrite] | null = null;
        for (const entry of queue) {
          if (!attempted.has(entry[1])) {
            found = entry;
            break;
          }
        }
        if (found === null) break;

        const [key, write] = found;
        attempted.add(write);

        const failure = await write.send();

        if (failure !== null && failure.retryable) {
          // Left in the queue exactly as it was, superseded or not.
          retryableFailure = failure;
          continue;
        }

        // Landed, or refused for a reason repeating cannot fix. Either way this
        // write is finished — but only remove it if it is still the one owed,
        // since a newer click may have replaced it while it was in the air.
        if (queue.get(key) === write) queue.delete(key);
        notify();
        write.settled?.(failure);
      }

      if (retryableFailure === null) {
        failures = 0;
        reported = false;
      } else {
        // Consecutive *passes* that ended owing something, which is what the
        // backoff is measured in. Counting individual failures would let a
        // sitting with five queued writes reach the cap on its first round.
        failures += 1;
        if (failures >= SUSTAINED_AFTER && !reported) {
          reported = true;
          options.onSustained?.(retryableFailure, failures);
        }
        scheduleRetry();
      }
      notify();
    } finally {
      draining = false;
    }
  }

  /**
   * One write, sent on its own, while the rest of the queue keeps its wait.
   *
   * This is what a click does during an outage. A full pass would be wrong
   * here: it re-sends everything already owed, so the tenth answer given while
   * the network is away would fire eleven requests, and the outage as a whole
   * would cost the square of the number of clicks. The write the candidate just
   * made goes now; the ones already waiting are already accounted for.
   */
  async function attemptOne(key: string): Promise<void> {
    // A pass in flight will re-read the queue and pick this up itself.
    if (draining) return;
    draining = true;
    let answered = false;
    try {
      const write = queue.get(key);
      if (write !== undefined) {
        const failure = await write.send();
        if (failure === null || !failure.retryable) {
          if (queue.get(key) === write) queue.delete(key);
          notify();
          write.settled?.(failure);
          answered = true;
        }
      }
    } finally {
      draining = false;
    }

    if (answered) {
      // The server answered, so the wait has nothing left to wait for: send the
      // rest now. On an empty queue this is what clears the backoff count, and
      // with it the chip.
      cancelPending();
      void drain();
      return;
    }

    // Still owed, and the wait this click deliberately left alone should still
    // be there. But a request can outlive its own backoff: if the retry fired
    // while this one was in the air, the pass it started hit the drain guard
    // and did nothing, and the timer that would have woken the queue is spent.
    // Nothing else would ever start it again, so the queue would sit owing
    // writes with the chip up and no retry coming.
    if (cancelRetry === null) scheduleRetry();
  }

  return {
    send(write) {
      queue.set(write.key, write);
      notify();
      // The click posts now. Doc 03 §7's flow is post, then queue on failure —
      // making a fresh click serve out a thirty-second backoff would turn a
      // recovering network into an answer that looks lost.
      if (cancelRetry !== null) void attemptOne(write.key);
      else void drain();
    },
    flush() {
      cancelPending();
      void drain();
    },
    state,
  };
}
