'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { StartAttemptRequestBody } from '../lib/requests.ts';

/**
 * Starting a sitting is a write, so it is a POST — not a link.
 *
 * A link would make starting a sitting a GET, which browsers and prefetchers
 * feel free to issue on their own. An accidentally-started sitting is not
 * harmless: in exam mode it starts a ninety-minute clock, and if it is the
 * first attempt at that paper it takes the first-attempt flag with it. In the
 * composed modes it freezes a set of questions and marks them seen.
 *
 * Shared by all three start buttons so that fact is expressed once. The body is
 * typed as the request schema's own inferred type — `src/lib/requests.ts` is
 * where a sitting's shape is decided, and no component restates the length
 * unions.
 *
 * Busy state is the disabled tokens and a changed label. No spinner — the
 * design system has no animated primitive (doc 03 §8).
 */
export function useStartSitting(): {
  busy: boolean;
  start: (body: StartAttemptRequestBody) => Promise<void>;
} {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return {
    busy,
    start: async (body) => {
      setBusy(true);
      try {
        const response = await fetch('/api/attempt', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          setBusy(false);
          // A refusal usually means the screen was stale — a sitting of this
          // paper is already running. Re-reading the server is more useful
          // than reporting an error the next render would have prevented.
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
    },
  };
}
