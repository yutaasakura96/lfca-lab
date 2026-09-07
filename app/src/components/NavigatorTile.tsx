import type { NavigatorTile as Tile } from '../domain/navigator.ts';
import { Glyph } from './Glyph.tsx';

/**
 * One question, as a tile.
 *
 * The single tile implementation, used by the rail, the sheet and the composed
 * sitting's session card. Its size is not its own: the container decides, so
 * the same component is 34px in the rail and 44px in the sheet without knowing
 * which it is in.
 *
 * **Every state is carried twice.** Visually by border style, fill and either a
 * folded corner or a glyph, so the whole set stays distinguishable at
 * `filter: grayscale(1)`; and in words by `label`, so it reaches a screen
 * reader too. Colour is never the only signal — which is why a graded tile
 * shows a check or a cross in place of its number rather than relying on the
 * correct and incorrect fills being told apart.
 *
 * **It is a `<button>` only when it goes somewhere.** In a timed sitting a tile
 * is a control: free navigation is the whole of PRD E2, so it is reachable by
 * keyboard and announces that it was pressed. A composed sitting is strictly
 * forward (decision log, 2026-09-06), so its tiles report progress and nothing
 * else — and a button that refuses every press is worse than not being one: it
 * takes a tab stop and offers an affordance it will not honour. Without
 * `onSelect` it renders as a `<span>`.
 *
 * The prototype draws the tile as a div, so `screens.css` undoes the browser's
 * button styling and leaves `base.css`'s `.tile` whole.
 */
export function NavigatorTile({
  tile,
  onSelect,
}: {
  tile: Tile;
  onSelect?: (seq: number) => void;
}) {
  // Order in the attribute is irrelevant — `base.css` decides which state wins
  // by its own source order, so current beats answered wherever they collide,
  // and flagged draws over both rather than replacing either.
  const classes = ['tile'];
  if (tile.answered) classes.push('tile--answered');
  if (tile.verdict === 'correct') classes.push('tile--correct');
  if (tile.verdict === 'incorrect') classes.push('tile--incorrect');
  if (tile.current) classes.push('tile--current');
  if (tile.flagged) classes.push('tile--flagged');

  // The glyph replaces the number rather than joining it: 34px does not hold
  // both, and between the two the glyph is the one carrying the state that
  // colour alone would otherwise have to.
  const face =
    tile.verdict === undefined ? (
      tile.number
    ) : (
      <Glyph role={tile.verdict === 'correct' ? 'correct' : 'chosen-wrong'} />
    );

  if (onSelect === undefined) {
    return (
      <span
        className={classes.join(' ')}
        role="img"
        aria-label={tile.label}
        aria-current={tile.current ? 'true' : undefined}
      >
        {face}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-label={tile.label}
      aria-current={tile.current ? 'true' : undefined}
      onClick={() => onSelect(tile.seq)}
    >
      {face}
    </button>
  );
}
