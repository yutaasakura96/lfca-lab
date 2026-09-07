import type { OptionRole } from '../domain/review.ts';

/**
 * The check, the cross and the dash, at option-row size.
 *
 * Doc 05 §8's rule is that colour is never the only signal, so every state
 * carries a glyph *and* a word. These are `aria-hidden` because the word beside
 * them is the accessible name — a screen reader announcing "check, correct
 * answer" would say it twice.
 *
 * Shared by the review, which shows a finished sitting, and by the composed
 * sitting, which shows the same four states one question at a time. Two copies
 * would eventually draw a blank's dash as a cross on one of the two screens,
 * and the difference between those is what the drawing is *for*.
 */
export function Glyph({ role }: { role: OptionRole }) {
  const common = {
    className: 'ico',
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
  };

  if (role === 'correct' || role === 'correct-chosen') {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M2.5 7.4 5.4 10.3 11.5 3.6" />
      </svg>
    );
  }
  if (role === 'chosen-wrong') {
    return (
      <svg {...common}>
        <path d="M3.6 3.6 10.4 10.4M10.4 3.6 3.6 10.4" />
      </svg>
    );
  }
  // Not correct, and nobody chose it. A dash rather than a cross: nobody was
  // wrong about this one, and its explanation is shown all the same.
  return (
    <svg {...common}>
      <path d="M3.4 7h7.2" />
    </svg>
  );
}
