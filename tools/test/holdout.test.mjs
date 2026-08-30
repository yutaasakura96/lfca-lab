import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOLDOUT_SIZE, checkHoldoutIntegrity } from '../lib/holdout.mjs';

// Every case here is in memory. Nothing in this file reads a repo file: the
// point of the function under test is that it has no opinion about where the
// two lists came from, so the exam builder and the validator cannot disagree
// about what a violation is.

function ids(n, prefix = 'q.linux.command-line.command-syntax') {
  return Array.from({ length: n }, (_, i) => `${prefix}.${String(i + 1).padStart(2, '0')}`);
}

function pinnedOf(list) {
  return { note: 'test', pinned_at: '2026-08-30', holdout: list };
}

const FORTY = ids(HOLDOUT_SIZE);

test('the holdout is forty items', () => {
  assert.equal(HOLDOUT_SIZE, 40);
});

test('a pinned list set-equal to unused produces no findings', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(FORTY), unused: [...FORTY].reverse() });
  assert.deepEqual(findings, []);
});

test('every finding is an error under the holdout-integrity check', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(ids(3)), unused: ids(5) });
  assert.ok(findings.length > 0);
  for (const f of findings) {
    assert.equal(f.check, 'holdout-integrity');
    assert.equal(f.severity, 'error');
    assert.equal(typeof f.message, 'string');
  }
});

test('there are no warnings, ever', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(ids(3)), unused: FORTY });
  assert.ok(findings.length > 0);
  assert.equal(findings.filter((f) => f.severity !== 'error').length, 0);
});

test('an empty pinned list is one error, not forty-one', () => {
  // Absence and emptiness mean the same thing to a reader — the holdout is not
  // pinned — so they read the same way in the output.
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf([]), unused: FORTY });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /empty/i);
});

test('a doubled file with forty entries but fewer distinct ids fails the count on its own', () => {
  // 20 ids, each written twice: length is 40, so a naive length check passes.
  const list = ids(20).flatMap((id) => [id, id]);
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(list), unused: ids(20) });
  const count = findings.filter((f) => /distinct/i.test(f.message));
  assert.equal(count.length, 1, 'expected a count finding naming the distinct total');
  assert.match(count[0].message, /20/);
  assert.match(count[0].message, /40/);
});

test('the second direction does not assert a cause it cannot know', () => {
  // An id in unused but unpinned can mean a rebuild moved a pinned item onto a
  // paper, or that someone deleted a line. The message must not pick one.
  const findings = checkHoldoutIntegrity({
    pinned: pinnedOf(ids(39)),
    unused: [...ids(39), 'q.devops.ci-cd.stray.01'],
  });
  const f = findings.find((x) => x.id === 'q.devops.ci-cd.stray.01');
  assert.match(f.message, /or/i, 'expected both causes offered, not one asserted');
});

test('an absent pinned file is an error, not a skipped check', () => {
  const findings = checkHoldoutIntegrity({ pinned: null, unused: FORTY });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].check, 'holdout-integrity');
  assert.equal(findings[0].severity, 'error');
  assert.match(findings[0].message, /not pinned/i);
});

test('an absent pinned file reports once, not forty times', () => {
  const findings = checkHoldoutIntegrity({ pinned: undefined, unused: FORTY });
  assert.equal(findings.length, 1);
});

test('a pinned file with no holdout array is malformed, and says so readably', () => {
  const findings = checkHoldoutIntegrity({ pinned: { note: 'oops' }, unused: FORTY });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /malformed/i);
  assert.match(findings[0].message, /holdout/);
});

test('a pinned file that is an array rather than an object is malformed', () => {
  const findings = checkHoldoutIntegrity({ pinned: FORTY, unused: FORTY });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /malformed/i);
});

test('a non-string id is malformed rather than compared as one', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf([...ids(39), 7]), unused: FORTY });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /malformed/i);
});

test('a pinned count other than forty is its own finding', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(ids(39)), unused: ids(39) });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /39/);
  assert.match(findings[0].message, /40/);
});

test('the count finding is distinct from the set comparison', () => {
  // 39 pinned against 40 unused: one count finding, plus one for the id that
  // a rebuild would have left unpinned.
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(ids(39)), unused: FORTY });
  const counts = findings.filter((f) => /pins 39/.test(f.message));
  assert.equal(counts.length, 1);
  assert.equal(findings.length, 2);
});

test('a duplicate id in the pinned list is reported', () => {
  const list = [...ids(39), ids(1)[0]];
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(list), unused: ids(39) });
  const dupes = findings.filter((f) => /duplicate/i.test(f.message));
  assert.equal(dupes.length, 1);
  assert.equal(dupes[0].id, ids(1)[0]);
});

test('duplicates do not also register as a set difference', () => {
  const list = [...ids(39), ids(1)[0]];
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(list), unused: ids(39) });
  assert.equal(findings.filter((f) => /rebuild/i.test(f.message)).length, 0);
});

test('an id pinned but no longer unused says a rebuild would put it on a paper', () => {
  const pinned = [...ids(39), 'q.security.compliance.gone.01'];
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(pinned), unused: ids(39) });
  const f = findings.find((x) => x.id === 'q.security.compliance.gone.01');
  assert.ok(f, 'expected a finding naming the pinned id');
  assert.match(f.message, /onto a paper|on a paper/i);
});

test('an id unused but not pinned says the holdout would gain an item', () => {
  const findings = checkHoldoutIntegrity({
    pinned: pinnedOf(ids(39)),
    unused: [...ids(39), 'q.devops.ci-cd.stray.01'],
  });
  const f = findings.find((x) => x.id === 'q.devops.ci-cd.stray.01');
  assert.ok(f, 'expected a finding naming the unused id');
  assert.match(f.message, /not pinned/i);
});

test('both directions are reported when both occur, and are distinguishable', () => {
  const findings = checkHoldoutIntegrity({
    pinned: pinnedOf([...ids(39), 'q.pinned.only.01']),
    unused: [...ids(39), 'q.unused.only.01'],
  });
  const pinnedOnly = findings.find((f) => f.id === 'q.pinned.only.01');
  const unusedOnly = findings.find((f) => f.id === 'q.unused.only.01');
  assert.ok(pinnedOnly);
  assert.ok(unusedOnly);
  assert.notEqual(pinnedOnly.message, unusedOnly.message);
});

test('an absent unused list is an error rather than a vacuous pass', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf(FORTY), unused: null });
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /unused/i);
});

test('a missing unused list still lets the count and duplicate checks run', () => {
  const findings = checkHoldoutIntegrity({ pinned: pinnedOf([ids(1)[0], ids(1)[0]]), unused: null });
  assert.ok(findings.some((f) => /duplicate/i.test(f.message)));
  assert.ok(findings.some((f) => /pins 2/.test(f.message)));
});

test('order does not matter in either direction', () => {
  const shuffled = [...FORTY].sort((a, b) => (a < b ? 1 : -1));
  assert.deepEqual(checkHoldoutIntegrity({ pinned: pinnedOf(shuffled), unused: FORTY }), []);
});
