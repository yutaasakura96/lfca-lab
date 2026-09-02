import type { NavigatorTile as Tile } from '../domain/navigator.ts';

/**
 * One question, as a tile.
 *
 * The single tile implementation, used by both the rail and the sheet and — in
 * a later slice — by the review screen (doc 10 §299). Its size is not its own:
 * the container decides, so the same component is 34px in the rail and 44px in
 * the sheet without knowing which it is in.
 *
 * **Every state is carried twice.** Visually by border style, fill and a folded
 * corner, so the whole set stays distinguishable at `filter: grayscale(1)`; and
 * in words by `label`, so it reaches a screen reader too. Colour is never the
 * only signal.
 *
 * It is a `<button>` because it is a control: reachable by keyboard and
 * announcing that it was pressed, neither of which a div does without being
 * told. The prototype draws it as a div, so `screens.css` undoes the browser's
 * button styling and leaves `base.css`'s `.tile` whole.
 */
export function NavigatorTile({
  tile,
  onSelect,
}: {
  tile: Tile;
  onSelect: (seq: number) => void;
}) {
  // Order in the attribute is irrelevant — `base.css` decides which state wins
  // by its own source order, so current beats answered wherever they collide,
  // and flagged draws over both rather than replacing either.
  const classes = ['tile'];
  if (tile.answered) classes.push('tile--answered');
  if (tile.current) classes.push('tile--current');
  if (tile.flagged) classes.push('tile--flagged');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-label={tile.label}
      aria-current={tile.current ? 'true' : undefined}
      onClick={() => onSelect(tile.seq)}
    >
      {tile.number}
    </button>
  );
}
