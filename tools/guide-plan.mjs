#!/usr/bin/env node
import { loadDataset, competencyKey } from './lib/load.mjs';
import { assignBlocks, blocksMentioning } from './lib/comparisons.mjs';
import { guideIndex, guidePathFor, relativeGuideLink } from './lib/guide-paths.mjs';

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
