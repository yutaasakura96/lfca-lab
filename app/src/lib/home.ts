import type { Db } from '../db/client.ts';
import { holdoutStanding, listOpenSittings, type OpenSittingRow } from '../db/queries/attempt.ts';
import { holdoutCard, type HoldoutCard } from '../domain/holdout.ts';
import { finaliseExpiredSittings } from './auto-submit.ts';

export interface HomeData {
  /** The "In progress" band — every unfinished sitting, the holdout included. */
  open: OpenSittingRow[];
  /** What the holdout card says. */
  holdout: HoldoutCard;
}

/**
 * Home's read, lifted out of the page so the suite can read it as data.
 *
 * **Listing is a touch, so this sweeps first**, exactly as the exam list does.
 * Without it a sitting whose clock ran out unattended would go on offering to
 * be resumed from the first screen after sign-in — and for the holdout, the
 * card would say *Resume* over a sitting that is already its result. Both reads
 * follow the one sweep, so the band and the card cannot disagree about whether
 * a holdout is still running.
 *
 * An open holdout appears in **both** places, deliberately (#56): the band
 * lists what is unfinished, and the card says where the holdout stands.
 */
export async function loadHome(db: Db, userId: string, now: Date): Promise<HomeData> {
  await finaliseExpiredSittings(db, userId, now);
  const [open, standing] = await Promise.all([
    listOpenSittings(db, userId),
    holdoutStanding(db, userId),
  ]);
  return { open, holdout: holdoutCard(standing) };
}
