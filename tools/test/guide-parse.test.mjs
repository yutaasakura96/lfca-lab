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
