'use client';

import { useCallback, useRef, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
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
      // This is doc 12 §6's whole reason for Sentry existing: the save failure
      // at question 40 of a first attempt is the one failure the candidate
      // cannot see, and by definition nobody is reading a console when it
      // happens.
      //
      // Wrapped, because Sentry failing must be a silent no-op (doc 03 §2). An
      // exception here would come out of the retry timer, on a path whose whole
      // job is to keep answering possible while the network is away — reporting
      // a problem must never become one.
      try {
        Sentry.captureMessage(
          `outbox: ${failures} consecutive failed passes (${failure.code})`,
          'error',
        );
      } catch {
        // Nothing to do, and nowhere to say it.
      }
    },
  });

  const send = useCallback((write: OutboxWrite) => box.current?.send(write), []);
  const flush = useCallback(() => box.current?.flush(), []);

  return { ...state, send, flush };
}
