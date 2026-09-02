'use client';

import { useCallback, useRef, useState } from 'react';
import { createOutbox, type Outbox, type OutboxState, type OutboxWrite } from '../lib/outbox.ts';

export interface OutboxHandle extends OutboxState {
  send: (write: OutboxWrite) => void;
  /** Try everything owed at once — what the `online` event calls. */
  flush: () => void;
}

const IDLE: OutboxState = { pending: 0, retrying: false };

/**
 * The outbox, as something a component can render from.
 *
 * All the behaviour is in `src/lib/outbox.ts`, which knows nothing about React;
 * this is the adapter that turns its two numbers into a render. It is a thin
 * layer on purpose — the retry schedule is the part worth testing, and it is
 * tested where a test does not need a DOM.
 *
 * **Nothing tears the outbox down on unmount, and that is deliberate.** The
 * queue holds answers the database does not have yet. Navigating away inside
 * the app is not a reason to abandon them, and the case where the page is
 * genuinely going away is covered by the `beforeunload` warning in the sitting.
 */
export function useOutbox(): OutboxHandle {
  const [state, setState] = useState<OutboxState>(IDLE);
  const box = useRef<Outbox | null>(null);

  // Created on first render rather than in an effect: the first click can come
  // before effects have run, and a click with nowhere to put its write is the
  // one thing this cannot afford.
  box.current ??= createOutbox({
    onChange: setState,
    onSustained: (failure, failures) => {
      // Doc 03 §8 wants one Sentry event here, not one per retry, so that a
      // tunnel that flaps does not spam and a broken write path reports once.
      // Sentry does not exist yet (doc 12 §6), so this is the console standing
      // in for it — deliberately once per episode, on the same threshold.
      console.error(`outbox: ${failures} consecutive failed passes (${failure.code})`);
    },
  });

  const send = useCallback((write: OutboxWrite) => box.current?.send(write), []);
  const flush = useCallback(() => box.current?.flush(), []);

  return { ...state, send, flush };
}
