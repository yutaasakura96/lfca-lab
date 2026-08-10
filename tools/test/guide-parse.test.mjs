import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGuideFile } from '../lib/guide-parse.mjs';

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
