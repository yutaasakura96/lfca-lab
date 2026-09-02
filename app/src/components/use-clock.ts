'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clockBand,
  correctedNow,
  formatRemaining,
  remainingToDeadline,
  skewMillis,
  skewOverRoundTrip,
  type ClockBand,
} from '../domain/clock.ts';

export interface ClockReading {
  /** Seconds left. Negative past the deadline; `null` when there is no clock. */
  remaining: number | null;
  band: ClockBand;
  /** `MM:SS`, clamped at zero. Empty when there is no clock. */
  display: string;
  expired: boolean;
}

export interface ClockState extends ClockReading {
  /**
   * Re-anchor the display on the server's clock, discounting the journey.
   * Cannot move the deadline.
   */
  syncTo: (serverNow: string, sentAt: number, serverSaysExpired: boolean) => void;
}

/**
 * The countdown on screen: one second at a time, on the server's timeline.
 *
 * Three things make this correct, and none of them is the browser's clock.
 *
 * **The deadline is fixed at render and never replaced.** It is derived on the
 * server from `started_at` and the limit, both written once at start. Because
 * nothing here can assign a later one, there is no code path — no resync, no
 * failure, no retry — through which time can be added. A resync corrects
 * *now*, never the deadline.
 *
 * **Skew is measured, not assumed.** The first render deliberately uses the
 * server's own `now`, which makes the markup identical on both sides of
 * hydration. Only afterwards does the effect compare the browser's clock with
 * the server's and keep the difference, so a machine set to next year counts
 * down correctly from that moment on.
 *
 * That first measurement is **biased by however long the page took to arrive**,
 * and biased generously — the render's `now` was stamped before the journey, so
 * the corrected clock sits behind the true one and shows slightly more time
 * than remains. It is a page load's worth, and it is replaced by a measured
 * round trip as soon as the sitting resyncs, which it does immediately on
 * mount. Saying it out loud rather than leaving "measured" to imply a precision
 * this first reading does not have.
 *
 * **The server's verdict outranks the arithmetic.** If a resync says the
 * sitting is over, it is over, whatever this side computes. The reverse is not
 * true: local expiry stands on its own, because the alternative is a countdown
 * that reaches zero and keeps taking answers until the network answers.
 */
export function useClock(deadlineIso: string | null, serverNowIso: string): ClockState {
  const deadline = useMemo(
    () => (deadlineIso === null ? null : new Date(deadlineIso)),
    [deadlineIso],
  );

  // `null` until measured. The gap is one render, and it is the render that
  // has to match what the server sent.
  const [skew, setSkew] = useState<number | null>(null);
  const [serverExpired, setServerExpired] = useState(false);

  // Bumped once a second purely to re-render. The time itself is never stored
  // — it is recomputed from the deadline on every tick, so a missed interval
  // (a throttled background tab, a sleeping laptop) costs a stale frame and
  // never a stale count.
  const [, setTick] = useState(0);

  const syncTo = useCallback(
    (serverNow: string, sentAt: number, serverSaysExpired: boolean) => {
      setSkew(skewOverRoundTrip(new Date(serverNow), new Date(sentAt), new Date()));
      if (serverSaysExpired) setServerExpired(true);
    },
    [],
  );

  useEffect(() => {
    setSkew(skewMillis(new Date(serverNowIso), new Date()));
  }, [serverNowIso]);

  const now = skew === null ? new Date(serverNowIso) : correctedNow(new Date(), skew);

  const remaining = remainingToDeadline(deadline, now);

  const expired = serverExpired || (remaining !== null && remaining <= 0);

  useEffect(() => {
    // Nothing left to count. Stopping matters more than it looks: an expired
    // sitting can sit on screen indefinitely, and a timer redrawing `00:00`
    // once a second forever is a battery cost with no reader.
    if (deadline === null || expired) return;
    const timer = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, [deadline, expired]);

  return {
    remaining,
    band: clockBand(remaining),
    display: formatRemaining(remaining),
    expired,
    syncTo,
  };
}
