'use client';

import { useStartSitting } from './use-start-sitting.ts';

/**
 * Start (or re-sit) one of the sixteen papers.
 *
 * The POST, the busy label and the failure behaviour all live in
 * {@link useStartSitting}, shared with the two composed modes — so what this
 * component holds is the one thing that differs, which is the paper.
 */
export function StartExamButton({
  examId,
  label,
  className,
}: {
  examId: string;
  label: string;
  className: string;
}) {
  const { busy, start } = useStartSitting();

  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={() => void start({ mode: 'exam', examId })}
    >
      {busy ? 'Starting…' : label}
    </button>
  );
}
