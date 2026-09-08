'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface ModalShellProps {
  /** The `useId` of the heading inside, so the shell can be labelled by it. */
  titleId: string;
  /**
   * Escape closes it.
   *
   * False once the sitting is over — submitted, or the clock ended it. There is
   * nothing to escape *back* to then: every write into the sitting behind is
   * refused, so closing this would leave a screen with nothing on it to do.
   */
  dismissible: boolean;
  onDismiss: () => void;
  children: ReactNode;
}

/**
 * The scrim, the box, and the two behaviours a modal owes a keyboard.
 *
 * Extracted because both dialogs had it verbatim and neither had any reason to
 * differ: focus moves in on open, Escape leaves. Both are drawn over a sitting
 * that is fully keyboard-operable underneath, so a modal that leaves focus
 * behind it is one a keyboard user has to hunt for — and that is exactly the
 * kind of behaviour two copies rot into disagreeing about, silently, because
 * nothing on screen looks different when one of them stops trapping focus.
 * Same call `Glyph` came out of `ReviewCard` on.
 *
 * What is *not* here is anything either dialog says. The two differ in every
 * region — a pass mark and a percentage against three unscored counts — and
 * that difference is the point (PRD P1); only the box is shared.
 */
export function ModalShell({ titleId, dismissible, onDismiss, children }: ModalShellProps) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.focus();
  }, []);

  useEffect(() => {
    if (!dismissible) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onDismiss();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissible, onDismiss]);

  return (
    <div className="scrim">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialog}
      >
        {children}
      </div>
    </div>
  );
}
