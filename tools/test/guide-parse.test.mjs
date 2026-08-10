import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGuideFile, loadGuide } from '../lib/guide-parse.mjs';

const SAMPLE = [
  '# Networking',
  '',
  '<a id="s-networking-dns"></a>',
  '## DNS',
  '',
  '<a id="c-sysadmin.networking.dns"></a>',
  '### DNS',
  '*id: `sysadmin.networking.dns` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-1035, man-dig-1*',
  '',
  '**What it is** Name to address resolution.',
  '**Commands**',
  '',
  '| Command | Purpose |',
  '| --- | --- |',
  '| `dig +short example.com` | Query an A record |',
  '',
  '*Not to be confused with [hosts file](system-administration.md#cmp-sysadmin.system-administration.etc-hosts).*',
  '',
  '<a id="cmp-sysadmin.networking.dns"></a>',
  '#### Not to be confused with: DNS vs DHCP',
  '*compares: `sysadmin.networking.dns`, `sysadmin.networking.dhcp`*',
  '',
  '| Axis | DNS | DHCP |',
  '| --- | --- | --- |',
  '',
  '#### Quick reference',
  '',
  '| Concept | Term | In one sentence | Why it is examinable |',
  '| --- | --- | --- | --- |',
  '| `sysadmin.networking.whois` | whois | Registry lookup. | Confused with dig. |',
  '',
  '#### Scenario',
  '',
  'A host resolves example.com.',
  '',
  '#### Knowledge check',
  '',
  '1. State the difference between DNS and DHCP.',
  '',
].join('\n');

test('a topic definition is parsed with its metadata', () => {
  const f = parseGuideFile('study-guide/02-system-administration/networking.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.dns');
  assert.equal(def.kind, 'topic');
  assert.equal(def.term, 'DNS');
  assert.deepEqual(def.meta, {
    depth: 3,
    importance: 4,
    coverage: 'PARTIALLY COVERED',
    sources: ['rfc-1035', 'man-dig-1'],
  });
});

test('a quick reference row is parsed as a glossary definition', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.whois');
  assert.equal(def.kind, 'glossary');
  assert.equal(def.meta, null);
});

test('a concept block ends at the next anchor', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.dns');
  assert.match(def.blockText, /dig \+short example\.com/);
  assert.doesNotMatch(def.blockText, /Quick reference/);
});

test('a comparison block is parsed with its compares list in order', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.equal(f.comparisons.length, 1);
  assert.equal(f.comparisons[0].owner, 'sysadmin.networking.dns');
  assert.deepEqual(f.comparisons[0].compares, [
    'sysadmin.networking.dns',
    'sysadmin.networking.dhcp',
  ]);
});

test('a pointer records its target file, anchor and containing concept', () => {
  const f = parseGuideFile('study-guide/02-system-administration/networking.md', SAMPLE);
  assert.equal(f.pointers.length, 1);
  assert.equal(f.pointers[0].targetPath, 'study-guide/02-system-administration/system-administration.md');
  assert.equal(f.pointers[0].targetAnchor, 'cmp-sysadmin.system-administration.etc-hosts');
  assert.equal(f.pointers[0].conceptId, 'sysadmin.networking.dns');
});

test('a section records its definitions and its apparatus', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.equal(f.sections.length, 1);
  assert.equal(f.sections[0].heading, 'DNS');
  assert.deepEqual(f.sections[0].definitionIds.sort(), [
    'sysadmin.networking.dns',
    'sysadmin.networking.whois',
  ]);
  assert.equal(f.sections[0].hasScenario, true);
  assert.equal(f.sections[0].hasKnowledgeCheck, true);
});

test('a missing apparatus heading is reported as absent, not as an error', () => {
  const f = parseGuideFile('x.md', ['<a id="s-a"></a>', '## A', '', 'text'].join('\n'));
  assert.equal(f.sections[0].hasScenario, false);
  assert.equal(f.sections[0].hasKnowledgeCheck, false);
});

test('a topic anchor with no metadata line is recorded as malformed', () => {
  const f = parseGuideFile('x.md', ['<a id="c-a.b.c"></a>', '### Thing', '', 'body'].join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.match(f.malformed[0].reason, /metadata/);
});

test('every markdown link is collected', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.ok(f.links.some((l) => l.href.includes('#cmp-sysadmin.system-administration.etc-hosts')));
});

test('anchors are collected for cross-reference resolution', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.ok(f.anchors.has('c-sysadmin.networking.dns'));
  assert.ok(f.anchors.has('cmp-sysadmin.networking.dns'));
  assert.ok(f.anchors.has('s-networking-dns'));
});

// --- Fix round 1 -----------------------------------------------------------

test('CRITICAL 1: a well-formed file still parses when saved with CRLF line endings', () => {
  const crlf = SAMPLE.replace(/\n/g, '\r\n');
  const f = parseGuideFile('study-guide/02-system-administration/networking.md', crlf);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.dns');
  assert.ok(def, 'the DNS concept must still be recognised under CRLF');
  assert.deepEqual(def.meta, {
    depth: 3,
    importance: 4,
    coverage: 'PARTIALLY COVERED',
    sources: ['rfc-1035', 'man-dig-1'],
  });
  assert.equal(f.comparisons.length, 1);
  assert.ok(f.anchors.has('s-networking-dns'));
  assert.equal(f.malformed.length, 0, 'a well-formed CRLF file must report no malformed entries');
});

test('CRITICAL 2: a well-formed block still parses when its anchor line has trailing whitespace', () => {
  const text = [
    '<a id="c-a.b.c"></a> ',
    '### Thing',
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    '',
    'body text',
  ].join('\n');
  const f = parseGuideFile('x.md', text);
  assert.equal(f.definitions.length, 1);
  assert.equal(f.definitions[0].id, 'a.b.c');
  assert.equal(f.malformed.length, 0);
  assert.ok(f.anchors.has('c-a.b.c'));
});

test('IMPORTANT 3: a Quick reference heading at a level other than 4 is reported as malformed', () => {
  const lines = [
    '<a id="s-a"></a>',       // 0
    '## A',                   // 1
    '',                       // 2
    '### Quick reference',    // 3 -> malformed line 4
    '',                       // 4
    '| Concept | Term |',     // 5
    '| --- | --- |',          // 6
    '| `a.b.c` | Term |',     // 7
    '',                       // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 4);
  assert.match(f.malformed[0].reason, /Quick reference/);
  assert.match(f.malformed[0].reason, /level 3/);
  // Because the heading was never recognised as the level-4 opener, the row
  // beneath it must not be silently absorbed as a glossary definition either.
  assert.equal(f.definitions.length, 0);
});

test('IMPORTANT 4: an un-backticked glossary row inside Quick reference is reported as malformed', () => {
  const lines = [
    '<a id="s-a"></a>',            // 0
    '## A',                        // 1
    '',                            // 2
    '#### Quick reference',        // 3
    '',                            // 4
    '| Concept | Term |',          // 5 header row, not malformed
    '| --- | --- |',               // 6 separator row, not malformed
    '| unbacked-id | Term |',      // 7 -> malformed line 8
    '',                            // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 8);
  assert.match(f.malformed[0].reason, /backticked/);
  assert.equal(f.definitions.length, 0);
});

test('MINOR 5: a metadata line present but not matching the required form names the offending text', () => {
  const text = ['<a id="c-a.b.c"></a>', '### Thing', '*id: bad-form*', '', 'body'].join('\n');
  const f = parseGuideFile('x.md', text);
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.match(f.malformed[0].reason, /metadata line/);
  assert.match(f.malformed[0].reason, /does not match|not.*match/i);
  assert.ok(
    f.malformed[0].reason.includes('*id: bad-form*'),
    'the reason should include the offending line text',
  );
});

test('MINOR 6: a cmp- anchor missing its heading is reported at the heading line, not the anchor line', () => {
  const lines = [
    '<a id="cmp-a.b"></a>',        // 0
    'not a heading',               // 1 -> malformed line 2
    '*compares: `a.b`, `a.c`*',    // 2
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 2);
  assert.match(f.malformed[0].reason, /heading/);
});

test('MINOR 6: a cmp- anchor missing its compares line is reported at the compares line, not the anchor line', () => {
  const lines = [
    '<a id="cmp-a.b"></a>',   // 0
    '#### Something',        // 1
    'not a compares line',   // 2 -> malformed line 3
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 3);
  assert.match(f.malformed[0].reason, /compares/);
});

test('MINOR 7: loadGuide throws an explicit error for an absolute rootDir', async () => {
  await assert.rejects(
    () => loadGuide('/tmp/definitely-absolute-guide-root'),
    /absolute/,
  );
});

// --- Fix round 2 -----------------------------------------------------------

test('IMPORTANT 1: a valid but indented Quick reference row still parses as a glossary definition', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5 header row
    '| --- | --- |',                     // 6 separator row
    '  | `a.b.c` | Term text |',         // 7 indented valid row -> line 8
    '',                                  // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  const def = f.definitions.find((d) => d.id === 'a.b.c');
  assert.ok(def, 'the indented row must still be recognised as a glossary definition');
  assert.equal(def.kind, 'glossary');
  assert.equal(def.line, 8);
  assert.equal(def.meta, null);
  assert.equal(f.malformed.length, 0);
});

test('IMPORTANT 1: an indented un-backticked Quick reference row is reported as malformed', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5 header row
    '| --- | --- |',                     // 6 separator row
    '   | unbacked-id | Term |',         // 7 indented invalid row -> line 8
    '',                                  // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 8);
  assert.match(f.malformed[0].reason, /backticked/);
});

// --- Fix round 3 -----------------------------------------------------------
//
// Round 2's "first contiguous run of table rows" rule is replaced outright
// (not patched) because it could not distinguish a genuinely separate
// second table from the *same* table interrupted by a blank line, an HTML
// comment, or a whitespace-only line — any of those silently ended the run
// and dropped a well-formed row after it. The new rule has no run state: a
// line's membership in the Quick reference section is decided by which
// section it sits in and by its own shape, never by adjacency to other
// rows.

test('ROUND 3: a second table under the same Quick reference heading has its rows reported as malformed', () => {
  // This replaces "MINOR 2: a second table under the same Quick reference
  // heading produces no malformed entries" from round 2. That test asserted
  // the round-2 behaviour this round deliberately reverses: in this guide's
  // format a Quick reference section holds exactly one glossary table, so a
  // second table's rows are themselves a format violation and reporting
  // them is correct, not a false positive.
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5 glossary header, not malformed
    '| --- | --- |',                     // 6 glossary separator, not malformed
    '| `a.b.c` | Term text |',           // 7 glossary row -> definition
    '',                                  // 8 blank line, not a row, does not end anything
    '| Other | Header |',                // 9 second table header -> malformed line 10
    '| --- | --- |',                     // 10 separator shape, skipped regardless of table
    '| some data | more |',              // 11 second table row -> malformed line 12
    '',                                  // 12
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 2);
  assert.equal(f.malformed[0].line, 10);
  assert.match(f.malformed[0].reason, /backticked/);
  assert.equal(f.malformed[1].line, 12);
  assert.match(f.malformed[1].reason, /backticked/);
  assert.deepEqual(f.definitions.map((d) => d.id), ['a.b.c']);
});

test('ROUND 3: a well-formed row after a blank-line interruption still parses', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '| `a.b.c` | First |',               // 7 -> line 8
    '',                                  // 8 blank line inside the table
    '| `a.b.d` | Second |',              // 9 -> line 10
    '',                                  // 10
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.deepEqual(f.definitions.map((d) => d.id), ['a.b.c', 'a.b.d']);
  assert.equal(f.malformed.length, 0);
});

test('ROUND 3: a well-formed row after an HTML comment interruption still parses', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '| `a.b.c` | First |',               // 7 -> line 8
    '<!-- a comment -->',                // 8
    '| `a.b.d` | Second |',              // 9 -> line 10
    '',                                  // 10
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.deepEqual(f.definitions.map((d) => d.id), ['a.b.c', 'a.b.d']);
  assert.equal(f.malformed.length, 0);
});

test('ROUND 3: a well-formed row after a whitespace-only line interruption still parses', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '| `a.b.c` | First |',               // 7 -> line 8
    '   ',                               // 8 whitespace-only line
    '| `a.b.d` | Second |',              // 9 -> line 10
    '',                                  // 10
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.deepEqual(f.definitions.map((d) => d.id), ['a.b.c', 'a.b.d']);
  assert.equal(f.malformed.length, 0);
});

test('ROUND 3: a Quick reference heading with wrong capitalisation is reported as malformed', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick Reference',              // 3 -> malformed line 4
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '| `a.b.c` | Term |',                // 7
    '',                                  // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 4);
  assert.match(f.malformed[0].reason, /Quick reference/i);
  assert.match(f.malformed[0].reason, /"Quick Reference"/);
  // The heading was never recognised as the well-formed level-4 opener, so
  // the row beneath it must not be silently absorbed as a glossary
  // definition either — same symmetry as the wrong-level case.
  assert.equal(f.definitions.length, 0);
});

test('ROUND 3: header and separator rows alone produce no entries', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5 header row
    '| --- | --- |',                     // 6 separator row
    '',                                  // 7
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.malformed.length, 0);
  assert.equal(f.definitions.length, 0);
});

// --- Fix round 4 ------------------------------------------------------------
//
// No pass had any fenced-code-block awareness: a documentation example of
// the marker grammar, shown inside a ``` or ~~~ fence, was parsed as if it
// were real. `study-guide/STYLE.md` exists specifically to show fenced
// examples of this grammar, so this was live, not hypothetical — a fenced
// example naming a real concept id could satisfy the "every concept has a
// definition site" coverage check for a concept never actually written up.
// `computeFenceLines` now decides fence membership once, up front, and
// every marker-recognition pass consults it before recognising anything.
// Round 4 also fixes a second, unrelated bug: a Quick reference row
// prefixed by a blockquote or list marker (`> | ... |`, `- | ... |`) was
// silently dropped by `trimStart()`, which strips only whitespace — and the
// comment directly above that code claimed the opposite. Such a row now
// reports `malformed` naming the offending prefix.

test('CRITICAL 1: a fenced concept-anchor example produces no definition, no anchor, and no malformed entry', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    'Here is what the anchor grammar looks like:',
    '',
    '```',
    '<a id="c-a.b.c"></a>',
    '### Thing',
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    '',
    'body',
    '```',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0, 'a fenced example must not become a real definition');
  assert.equal(f.malformed.length, 0, 'a fenced example must not be reported as malformed either');
  assert.ok(!f.anchors.has('c-a.b.c'));
  assert.ok(f.anchors.has('s-a'), 'the real, unfenced anchor must still be recognised');
});

test('CRITICAL 2: a fenced comparison block produces no comparison and no malformed entry', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '```',
    '<a id="cmp-a.b"></a>',
    '#### Something',
    '*compares: `a.b`, `a.c`*',
    '```',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.comparisons.length, 0);
  assert.equal(f.malformed.length, 0);
  assert.ok(!f.anchors.has('cmp-a.b'));
});

test('CRITICAL 3: a fenced pointer produces no pointer and no link', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '```',
    '*Not to be confused with [hosts file](system-administration.md#cmp-x.y).*',
    '```',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.pointers.length, 0);
  assert.equal(f.links.length, 0);
});

test('CRITICAL 4: a fenced glossary row produces no definition and no malformed entry', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '#### Quick reference',
    '',
    '| Concept | Term |',
    '| --- | --- |',
    '```',
    '| `a.b.c` | Term |',
    '```',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 0);
});

test('IMPORTANT 1: a ~~~ fence suppresses marker recognition the same as a ``` fence', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '~~~',
    '<a id="c-a.b.c"></a>',
    '### Thing',
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    '',
    'body',
    '~~~',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 0);
  assert.ok(!f.anchors.has('c-a.b.c'));
});

test('IMPORTANT 2: a fence opened with four backticks is not closed by three, and reopens correctly after the real close', () => {
  const lines = [
    '<a id="s-a"></a>',              // 0
    '## A',                          // 1
    '',                              // 2
    '````',                          // 3 open with 4 backticks
    '<a id="c-a.b.c"></a>',          // 4 still inside fence
    '### Thing',                     // 5
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*', // 6
    '```',                           // 7 only 3 backticks -> does NOT close
    'still inside the fence',        // 8
    '````',                          // 9 closes with 4
    '',                              // 10
    '<a id="c-x.y.z"></a>',          // 11 real anchor, outside any fence
    '### Thing2',                    // 12
    '*id: `x.y.z` · depth 1 · importance 1 · LFS200: NOT COVERED · sources: none*', // 13
    '',                              // 14
    'body2',                         // 15
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.deepEqual(f.definitions.map((d) => d.id), ['x.y.z']);
  assert.equal(f.malformed.length, 0);
  assert.ok(!f.anchors.has('c-a.b.c'));
  assert.ok(f.anchors.has('c-x.y.z'));
});

test('IMPORTANT 3: an unterminated fence swallows everything to end of file', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '```',
    '<a id="c-a.b.c"></a>',
    '### Thing',
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    '',
    'body',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 0);
  assert.ok(!f.anchors.has('c-a.b.c'));
});

test('IMPORTANT 4: a command inside a fence still appears in the enclosing concept\'s blockText', () => {
  const lines = [
    '<a id="s-a"></a>',
    '## A',
    '',
    '<a id="c-a.b.c"></a>',
    '### Thing',
    '*id: `a.b.c` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    '',
    '**Commands**',
    '',
    '```bash',
    'dig +short example.com',
    '```',
    '',
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  const def = f.definitions.find((d) => d.id === 'a.b.c');
  assert.ok(def, 'the real, unfenced concept anchor must still be recognised');
  assert.equal(f.malformed.length, 0);
  assert.match(def.blockText, /dig \+short example\.com/);
});

test('MINOR 5: a blockquote-prefixed Quick reference row reports malformed naming the prefix', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '> | `a.b.c` | Term |',              // 7 -> malformed line 8
    '',                                  // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 8);
  assert.match(f.malformed[0].reason, /">"/);
  assert.match(f.malformed[0].reason, /blockquote|list/);
});

test('MINOR 6: a list-prefixed Quick reference row reports malformed naming the prefix', () => {
  const lines = [
    '<a id="s-a"></a>',                  // 0
    '## A',                              // 1
    '',                                  // 2
    '#### Quick reference',              // 3
    '',                                  // 4
    '| Concept | Term |',                // 5
    '| --- | --- |',                     // 6
    '- | `a.b.c` | Term |',              // 7 -> malformed line 8
    '',                                  // 8
  ];
  const f = parseGuideFile('x.md', lines.join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.equal(f.malformed[0].line, 8);
  assert.match(f.malformed[0].reason, /"-"/);
  assert.match(f.malformed[0].reason, /blockquote|list/);
});
