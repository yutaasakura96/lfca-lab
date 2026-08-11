#!/usr/bin/env node
import { loadDataset, competencyKey } from './lib/load.mjs';
import { assignBlocks, blocksMentioning } from './lib/comparisons.mjs';
import { guideIndex, guidePathFor, relativeGuideLink } from './lib/guide-paths.mjs';

function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = n % 100;
  return `${n}${suffixes[(mod100 - 20) % 10] ?? suffixes[mod100] ?? suffixes[0]}`;
}

const target = process.argv[2];
const dataset = await loadDataset('data');
const index = guideIndex(dataset);

if (!target) {
  console.log('Usage: node tools/guide-plan.mjs "<Domain> :: <Competency>"\n\nAvailable:');
  for (const entry of index.values()) console.log(`  ${entry.domain} :: ${entry.competency}`);
  process.exit(1);
}

const key = target.replace(' :: ', '::');
const entry = index.get(key);
if (!entry) {
  // A typo'd or renamed competency name must fail loudly with a readable
  // message and non-zero exit, never a raw stack trace — this is the same
  // guard `assertKnownScope` provides for check-guide.mjs.
  const readable = [...index.values()].map((e) => `  ${e.domain} :: ${e.competency}`);
  console.error(`Unknown competency: ${target}\n\nValid competencies:\n${readable.join('\n')}`);
  process.exit(1);
}

const topics = dataset.topics.filter((t) => competencyKey(t.domain, t.competency) === key);
const blocks = assignBlocks(dataset);
const byId = new Map(dataset.topics.map((t) => [t.id, t]));
const waived = new Set(dataset.waivers?.waived ?? []);

console.log(`# Writing brief: ${entry.domain} :: ${entry.competency}`);
console.log(`\nFile: ${entry.path}`);
console.log(`Concepts: ${topics.length}`);
console.log(`Waived (no primary source): ${topics.filter((t) => waived.has(t.id)).length}`);

// These three lines exist so a writer never computes them by eye: the pilot
// file's orientation paragraph got the domain's weight rank and the LFS200
// coverage share wrong by doing exactly that. Take the weight from
// data/competencies.json, never hardcode it.
const domain = dataset.competencies.domains.find((d) => d.name === entry.domain);
const competencyMeta = domain?.competencies.find((c) => c.name === entry.competency);
const rankedDomains = [...dataset.competencies.domains].sort((a, b) => b.weight - a.weight);
const weightRank = rankedDomains.findIndex((d) => d.id === domain?.id) + 1;
console.log(
  `Domain weight: ${domain?.weight}% of the exam — ${ordinal(weightRank)} largest of ${rankedDomains.length} domains`,
);

console.log(`2025 status: ${competencyMeta?.sept_2025_status}`);
if (competencyMeta?.sept_2025_status === 'added') {
  console.log('  Consequence: this competency is new in the 2025 update — no pre-2025 material covers it.');
}

const coverageCounts = new Map();
for (const t of topics) {
  coverageCounts.set(t.coverage_status, (coverageCounts.get(t.coverage_status) ?? 0) + 1);
}
const notNotCovered = topics.length - (coverageCounts.get('NOT COVERED') ?? 0);
const coveredShare = topics.length ? Math.round((notNotCovered / topics.length) * 100) : 0;
const breakdown = [...coverageCounts.entries()].map(([status, count]) => `${count} ${status}`).join(', ');
console.log(
  `LFS200 coverage (which concepts LFS200 touches at all, not how deeply): ${breakdown} — ` +
    `${notNotCovered}/${topics.length} (${coveredShare}%) are not NOT COVERED`,
);

const sections = [...new Set(topics.map((t) => t.path[2]))];
for (const section of sections) {
  console.log(`\n## Section: ${section}`);
  for (const t of topics.filter((x) => x.path[2] === section)) {
    console.log(`\n### ${t.path.at(-1)}`);
    console.log(`  id: ${t.id}`);
    console.log(`  depth ${t.required_depth} · importance ${t.importance} · LFS200 ${t.coverage_status}`);
    console.log(`  description: ${t.description}`);
    if (t.notes) console.log(`  notes: ${t.notes}`);
    if (t.commands.length) console.log(`  commands (must appear verbatim): ${t.commands.join(' | ')}`);
    if (t.additional_sources.length) console.log(`  sources: ${t.additional_sources.join(', ')}`);
    if (waived.has(t.id)) console.log('  WAIVED: must carry the no-primary-source marker');
  }
}

console.log('\n## Comparison blocks this file owns');
const owned = [...blocks.values()].filter(
  (b) => byId.get(b.owner) && competencyKey(byId.get(b.owner).domain, byId.get(b.owner).competency) === key,
);
if (owned.length === 0) console.log('  none');
for (const b of owned) {
  console.log(`\n  anchor: ${b.anchor}`);
  console.log(`  compares (exact order): ${b.compares.map((id) => `\`${id}\``).join(', ')}`);
  for (const m of b.members) console.log(`    member ${m} — ${byId.get(m).description}`);
}

console.log('\n## Comparison blocks this file must point to');
let outbound = 0;
for (const t of topics) {
  for (const b of blocksMentioning(blocks, t.id)) {
    const link = relativeGuideLink(entry.path, guidePathFor(byId.get(b.owner), index), b.anchor);
    console.log(`  in ${t.id}: *Not to be confused with [${byId.get(b.owner).path.at(-1)}](${link}).*`);
    outbound += 1;
  }
}
if (outbound === 0) console.log('  none');
