'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Starting a sitting is a write, so it is a POST — not a link.
 *
 * A link would make starting an exam a GET, which browsers and prefetchers feel
 * free to issue on their own. An accidentally-started sitting is not harmless
 * here: it starts a 90-minute clock, and if it is the first attempt at that
 * paper it takes the first-attempt flag with it.
 *
 * Busy state is the disabled tokens and a changed label. No spinner — the
 * design system has no animated primitive.
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
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const response = await fetch('/api/attempt', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ mode: 'exam', examId }),
          });

          if (!response.ok) {
            setBusy(false);
            router.refresh();
            return;
          }

          const { attemptId } = (await response.json()) as { attemptId: string };
          router.push(`/attempt/${attemptId}`);
        } catch {
          // The sitting was not started, so there is nothing to recover — the
          // honest response is to let them try again.
          setBusy(false);
        }
      }}
    >
      {busy ? 'Starting…' : label}
    </button>
  );
}
