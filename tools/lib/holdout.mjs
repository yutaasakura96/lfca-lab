// The single definition of "the holdout is intact".
//
// `data/holdout.json` pins the 40 exam-pool items by identity. `exams/index.json`
// carries `unused` — the items the sixteen papers happened not to use, recomputed
// by every `npm run build-exams`. The two are equal today, and this function is
// the only place that says what it means for them to stop being equal.
//
// `tools/validate.mjs` calls it. `tools/build-exams.mjs` will call it too, before
// it writes, so that the builder and the validator can never hold a second
// opinion about what a violation is — that is the next ticket's work, and until
// it lands the builder can still write a paper this function would reject.
//
// No file I/O lives here on purpose: both callers already hold the two lists,
// and a function that reads its own inputs cannot be tested against the cases
// that matter.

const CHECK = 'holdout-integrity';

/** The holdout is forty items. A different number is a finding, not a new size. */
export const HOLDOUT_SIZE = 40;

function finding(id, message) {
  return { check: CHECK, severity: 'error', id, message };
}

function malformed(message) {
  return [finding('data/holdout.json', `Malformed pinned holdout file: ${message}`)];
}

/**
 * Compare a pinned holdout list against an exam index's `unused` list.
 *
 * @param {object|null|undefined} pinned The parsed `data/holdout.json`, or null
 *   when the file is absent.
 * @param {string[]|null|undefined} unused The exam index's `unused` list, or
 *   null when it could not be read.
 * @returns {{check: string, severity: string, id: string, message: string}[]}
 *   Findings, all of them errors. Empty means intact.
 */
export function checkHoldoutIntegrity({ pinned, unused }) {
  const notPinned = (why) => [finding('data/holdout.json',
    `The holdout is not pinned: ${why}. The holdout is the project's only defence against an `
    + 'untested bank, and a derived list is not a commitment.')];

  if (pinned == null) return notPinned('data/holdout.json is missing');
  if (typeof pinned !== 'object' || Array.isArray(pinned)) {
    return malformed('expected an object with a "holdout" array.');
  }
  if (!Array.isArray(pinned.holdout)) {
    return malformed('"holdout" is missing or is not an array.');
  }
  if (!pinned.holdout.every((id) => typeof id === 'string')) {
    return malformed('"holdout" must contain only strings.');
  }
  // Emptiness means what absence means, and says so once rather than reporting
  // every unused id as newly unpinned.
  if (pinned.holdout.length === 0) return notPinned('its "holdout" list is empty');

  const out = [];
  const seen = new Set();
  const duplicated = new Set();
  for (const id of pinned.holdout) {
    if (seen.has(id) && !duplicated.has(id)) {
      duplicated.add(id);
      out.push(finding(id, `Duplicate id in data/holdout.json: ${id}`));
    }
    seen.add(id);
  }

  // Counted on distinct ids, not on entries: a file of 40 lines holding 20 ids
  // twice each would otherwise satisfy a length check and be caught only as a
  // lopsided set difference.
  if (pinned.holdout.length !== HOLDOUT_SIZE) {
    out.push(finding('data/holdout.json',
      `data/holdout.json pins ${pinned.holdout.length} id(s); the holdout is ${HOLDOUT_SIZE}.`));
  } else if (seen.size !== HOLDOUT_SIZE) {
    out.push(finding('data/holdout.json',
      `data/holdout.json has ${HOLDOUT_SIZE} entries but only ${seen.size} distinct id(s); `
      + `the holdout is ${HOLDOUT_SIZE}.`));
  }

  if (!Array.isArray(unused)) {
    out.push(finding('exams/index.json',
      'Could not compare against the exam index: its "unused" list is missing or is not an array.'));
    return out;
  }

  const unusedSet = new Set(unused);

  for (const id of [...seen].sort()) {
    if (!unusedSet.has(id)) {
      out.push(finding(id,
        `${id} is pinned as a holdout item but the sixteen papers now use it — `
        + 'a rebuild would put a holdout item onto a paper.'));
    }
  }

  for (const id of [...unusedSet].sort()) {
    if (!seen.has(id)) {
      out.push(finding(id,
        `${id} is used by no paper but is not pinned in data/holdout.json — `
        + 'either a rebuild moved a pinned item onto a paper and left this one over, '
        + 'or this id was dropped from the pin file.'));
    }
  }

  return out;
}
