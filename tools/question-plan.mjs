#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { assignBlocks } from './lib/comparisons.mjs';
import { guideIndex, slugify } from './lib/guide-paths.mjs';
import { competencyKey } from './lib/load.mjs';
import { allocation, domainBudget } from './lib/allocation.mjs';

const args = process.argv.slice(2);
const scopeAt = args.indexOf('--scope');
if (scopeAt < 0 || !args[scopeAt + 1] || args[scopeAt + 1].startsWith('--')) {
  console.error('ERROR  --scope "<Domain> :: <Competency>" is required');
  process.exit(1);
}
for (const arg of args) {
  if (arg.startsWith('--') && arg !== '--scope') {
    console.error(`ERROR  unrecognized argument: ${arg}`);
    process.exit(1);
  }
}
const scope = args[scopeAt + 1].replace(' :: ', '::');

const dataset = await loadDataset('data');
const blocks = assignBlocks(dataset);
const alloc = allocation(dataset, blocks);
const paths = guideIndex(dataset);
const index = new Map(dataset.topics.map((t) => [t.id, t]));
const waived = new Set(dataset.waivers.waived ?? []);

const concepts = dataset.topics.filter((t) => competencyKey(t.domain, t.competency) === scope);
if (concepts.length === 0) {
  const valid = [...paths.keys()].map((k) => k.replace('::', ' :: '));
  console.error(`ERROR  Unknown scope "${args[scopeAt + 1]}". Valid competencies: ${valid.join(', ')}`);
  process.exit(1);
}

const domain = dataset.competencies.domains.find((d) => d.name === concepts[0].domain);
const entry = paths.get(scope);
const guideRel = entry.path.replace('study-guide/', '');
const bankPath = `questions/${entry.dir}/${entry.slug}.json`;

const totalExam = concepts.reduce((a, c) => a + alloc.get(c.id).exam, 0);
const totalSupp = concepts.reduce((a, c) => a + alloc.get(c.id).supplement, 0);
const ownedBlocks = [...blocks.values()].filter((b) => index.get(b.owner)
  && competencyKey(index.get(b.owner).domain, index.get(b.owner).competency) === scope);
const commandStrings = concepts.reduce((a, c) => a + (c.commands ?? []).length, 0);
const waivedHere = concepts.filter((c) => waived.has(c.id));

console.log(`# Authoring brief — ${concepts[0].domain} :: ${concepts[0].competency}`);
console.log('');
console.log(`Write to:            ${bankPath}`);
console.log(`Read the guide at:   study-guide/${guideRel}`);
console.log(`Domain exam weight:  ${domain.weight}%  (domain budget ${domainBudget(domain.weight)} items)`);
console.log(`Concepts:            ${concepts.length}`);
console.log(`Items to write:      ${totalExam} exam + ${totalSupp} supplement = ${totalExam + totalSupp}`);
console.log(`Comparison blocks:   ${ownedBlocks.length} owned by this competency, each needs >= 1 item`);
console.log(`Command strings:     ${commandStrings}, each must appear verbatim in a code span`);
console.log(`Waived concepts:     ${waivedHere.length}${waivedHere.length ? ` (${waivedHere.map((c) => c.id).join(', ')})` : ''}`);
console.log('');

const sections = [...new Set(concepts.map((c) => c.path[2]))];
for (const section of sections) {
  console.log(`## Section: ${section}`);
  console.log('');
  for (const c of concepts.filter((x) => x.path[2] === section)) {
    const a = alloc.get(c.id);
    console.log(`### ${c.path[3]}`);
    console.log(`- id:            ${c.id}`);
    console.log(`- depth:         ${c.required_depth}   difficulty: ${a.difficulty}   default type: ${a.defaultType}`);
    console.log(`- items:         ${a.exam} exam + ${a.supplement} supplement`);
    if (a.needsDiagnostic) console.log('- REQUIRED:      at least one item of type "diagnostic"');
    // A depth-1 concept has no `c-` anchor to point at. Its only definition
    // site is one Quick reference table row (STYLE.md section 2), and a table
    // row cannot carry an HTML anchor of its own — so the guide defines
    // `c-<id>` for all 498 depth-2+ concepts and for none of the 39 depth-1
    // ones. Emitting `#c-<id>` regardless would hand every depth-1 author an
    // anchor that check 13 then rejects, 39 concepts over. Point at the
    // enclosing section instead: it resolves, and it lands the reader on the
    // table that actually defines the term.
    const anchor = c.required_depth === 1
      ? `s-${slugify(c.competency)}-${slugify(c.path[2])}`
      : `c-${c.id}`;
    console.log(`- guide_anchor:  ${guideRel}#${anchor}`);
    if (c.required_depth === 1) {
      console.log('                 (section anchor: a depth-1 concept is defined by a Quick reference row, which has no anchor of its own)');
    }
    console.log(`- coverage:      ${c.coverage_status}`);
    console.log(`- source_ids:    ${[...c.official_sources, ...c.additional_sources].join(', ') || 'none'}`);
    console.log(`- waived:        ${waived.has(c.id) ? 'YES — set waived_source: true, consensus definitions only' : 'no'}`);
    console.log(`- description:   ${c.description}`);
    console.log(`- notes:         ${c.notes ?? ''}`);
    if ((c.commands ?? []).length) {
      console.log(`- commands:      ${c.commands.map((x) => `\`${x}\``).join(', ')}`);
    }
    for (const anchor of a.ownedBlocks) {
      const b = [...blocks.values()].find((x) => x.anchor === anchor);
      console.log(`- OWNS BLOCK ${anchor} — needs >= 1 item naming it`);
      for (const id of b.compares) {
        console.log(`    - ${id}: ${index.get(id).description}`);
      }
    }
    for (const anchor of a.memberBlocks) console.log(`- member of block ${anchor}`);
    for (const other of c.confused_with ?? []) {
      console.log(`- confusable distractor source: ${other} — ${index.get(other)?.description ?? '(unknown)'}`);
    }
    console.log('');
  }
}
