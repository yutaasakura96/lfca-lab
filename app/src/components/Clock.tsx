import type { ClockBand } from '../domain/clock.ts';

/**
 * The countdown, in one of doc 05 §9's three states.
 *
 * Presentational and stateless: it is handed a band and a string, and decides
 * neither. Both come from `src/domain/clock.ts`, which is where a number is
 * allowed to be decided.
 *
 * **The time is always written out.** The ramp is weight as much as hue —
 * quiet ink, a tinted chip, then a solid fill — but a glance at a colour is
 * not a reading, and the band alone would be a state carried by colour, which
 * doc 05's rule 4 forbids outright. The word "Left" carries the meaning; the
 * numerals carry the number.
 */
export function Clock({ band, display }: { band: ClockBand; display: string }) {
  return (
    <div
      className={band === 'normal' ? 'clock' : `clock clock--${band}`}
      role="timer"
      // Not a live region, deliberately. A countdown that announced itself
      // every second would make the sitting unusable with a screen reader,
      // and the reader can reach it whenever they want to know.
      aria-live="off"
    >
      <span className="clock__label">Left</span>
      {display}
    </div>
  );
}
