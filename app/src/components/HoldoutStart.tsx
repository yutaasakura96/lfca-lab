'use client';

import { useCallback, useId, useState } from 'react';
import { ModalShell } from './ModalShell.tsx';
import { useStartSitting } from './use-start-sitting.ts';

/**
 * Start the holdout — which on this card only ever opens the dialog.
 *
 * **The dialog is the guard, and its button is the only thing that posts**
 * (#56). The card's own button writes nothing; Cancel writes nothing. There is
 * no data gate in front of it — gating on the sixteen papers is the readiness
 * gating the 2026-08-28 decision declined — so the one irreversible press is
 * made deliberate by being the second one, after the three facts that make it
 * irreversible have been read.
 */
export function HoldoutStart() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
        Start the holdout
      </button>
      {open ? <HoldoutDialog onCancel={close} /> : null}
    </>
  );
}

/**
 * The one-shot confirmation.
 *
 * `ModalShell` plus its own words, as `SubmitDialog` and `FinishDialog` are —
 * nothing either of those says applies before a sitting exists. Escape and
 * Cancel both close it until the POST is in flight; after that there is
 * nothing to cancel, because the request has already been made.
 */
function HoldoutDialog({ onCancel }: { onCancel: () => void }) {
  const titleId = useId();
  const { busy, start } = useStartSitting();

  return (
    <ModalShell titleId={titleId} dismissible={!busy} onDismiss={onCancel}>
      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <span className="eyebrow">The holdout</span>
        <h2 className="h1" id={titleId}>
          Start the holdout?
        </h2>
        <p
          className="prose"
          style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}
        >
          Forty questions you have never been shown, scored against a pass mark of 30.
        </p>
      </div>

      {/* The three facts the press cannot be taken back from, each on its own
          line so none of them is buried in a sentence about the others. */}
      <ul className="modelines" style={{ fontSize: 'var(--text-base)' }}>
        <li>
          <strong>One-shot.</strong> It can be sat once. There is no second sitting, and no reset.
        </li>
        <li>
          <strong>Sixty minutes.</strong> The clock starts when you press Start and does not stop
          if you close the tab.
        </li>
        <li>
          <strong>Abandoning it still counts.</strong> A holdout left unfinished is submitted as it
          stood when the sixty minutes run out, and that is its score.
        </li>
      </ul>

      <div className="dialog__actions">
        <button type="button" className="btn btn--lg" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--lg btn--primary"
          disabled={busy}
          onClick={() => void start({ mode: 'holdout' })}
        >
          {/* Doc 03 §8: the disabled tokens and a changed label. No spinner. */}
          {busy ? 'Starting…' : 'Start the holdout'}
        </button>
      </div>
    </ModalShell>
  );
}
