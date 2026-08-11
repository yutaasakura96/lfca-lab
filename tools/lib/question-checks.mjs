import { assignBlocks } from './comparisons.mjs';
import { competencyKey } from './load.mjs';
import { allocation } from './allocation.mjs';
import { allItems } from './question-load.mjs';

// `finding`, `inScope` and `assertKnownScope` are imported from the guide
// harness rather than reimplemented. They are already exported, and two
// copies of "what a finding looks like" would drift the moment one harness
// gained a field. guide-checks.mjs is not modified by this cycle.
import { assertKnownScope, finding, inScope } from './guide-checks.mjs';

export { assertKnownScope, finding, inScope };

export function bankContext({
  dataset,
  bank,
  guide = [],
  guideRoot = 'study-guide',
  generated = null,
  allocationOptions = {},
}) {
  const blocks = assignBlocks(dataset);
  return {
    dataset,
    bank,
    items: allItems(bank),
    guide,
    // loadGuide returns paths already prefixed with its root, while an item's
    // guide_anchor is relative to the guide tree. The root is what joins them.
    guideRoot,
    generated,
    blocks,
    alloc: allocation(dataset, blocks, allocationOptions),
    topicIndex: new Map(dataset.topics.map((t) => [t.id, t])),
  };
}

// Everything an item's command strings may hide in: the stem, every option's
// text and every option's why, and the rationale. Deliberately wider than
// "the options", because a concept can carry more command strings than it
// has option slots — sysadmin.system-administration.user-account has five
// strings and one allocated question — so requiring one string per option
// would be unsatisfiable by construction.
export function searchableText(item) {
  const parts = [item.stem ?? '', item.rationale ?? ''];
  for (const o of item.options ?? []) {
    parts.push(o?.text ?? '', o?.why ?? '');
  }
  return parts.join('\n');
}

// Fenced blocks are consumed first and removed, so their contents are not
// then re-scanned as inline spans. A leading `$ ` prompt is stripped from a
// fenced line, matching what check-guide already credits.
export function codeSpansIn(text) {
  const str = String(text ?? '');
  const out = [];
  let remainder = str;
  for (const fence of str.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    for (const line of fence[1].split('\n')) {
      const trimmed = line.trim().replace(/^\$\s+/, '');
      if (trimmed) out.push(trimmed);
    }
    remainder = remainder.replace(fence[0], ' ');
  }
  for (const m of remainder.matchAll(/`([^`\n]+)`/g)) out.push(m[1].trim());
  return out;
}

function scopedTopics(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  return ctx.dataset.topics.filter((t) => inScope(t, options));
}

function itemsByConcept(ctx) {
  const map = new Map();
  for (const item of ctx.items) {
    if (!map.has(item.concept_id)) map.set(item.concept_id, []);
    map.get(item.concept_id).push(item);
  }
  return map;
}

// 1
export function checkUnknownConcept(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  return ctx.items
    .filter((i) => !ctx.topicIndex.has(i.concept_id))
    .map((i) =>
      finding('q-unknown-concept', 'error', i.id,
        `${i.file}: ${i.id} names concept ${i.concept_id}, which is not in data/`));
}

// 2 — the coverage proof.
export function checkConceptCoverage(ctx, options) {
  const covered = new Set(ctx.items.map((i) => i.concept_id));
  return scopedTopics(ctx, options)
    .filter((t) => !covered.has(t.id))
    .map((t) => finding('q-concept-coverage', 'error', t.id, `${t.id} has no question in questions/`));
}

// 3
export function checkCountDerived(ctx, options) {
  const byConcept = itemsByConcept(ctx);
  const out = [];
  for (const t of scopedTopics(ctx, options)) {
    const want = ctx.alloc.get(t.id);
    const got = byConcept.get(t.id) ?? [];
    for (const pool of ['exam', 'supplement']) {
      const n = got.filter((i) => i.pool === pool).length;
      const expected = pool === 'exam' ? want.exam : want.supplement;
      if (n !== expected) {
        out.push(finding('q-count-derived', 'error', t.id,
          `${t.id} has ${n} ${pool}-pool item(s), expected ${expected} from the derived allocation`));
      }
    }
  }
  return out;
}

// 4
export function checkComparisonCoverage(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  const out = [];
  const named = new Set(ctx.items.map((i) => i.comparison_block).filter(Boolean));
  const known = new Set([...ctx.blocks.values()].map((b) => b.anchor));

  for (const i of ctx.items) {
    if (i.comparison_block && !known.has(i.comparison_block)) {
      out.push(finding('q-comparison-coverage', 'error', i.id,
        `${i.file}: ${i.id} names comparison block ${i.comparison_block}, which comparisons.mjs does not compute`));
    }
  }
  for (const b of ctx.blocks.values()) {
    const ownerTopic = ctx.topicIndex.get(b.owner);
    if (!ownerTopic || !inScope(ownerTopic, options)) continue;
    if (!named.has(b.anchor)) {
      out.push(finding('q-comparison-coverage', 'error', b.owner,
        `comparison block ${b.anchor} (${b.compares.join(', ')}) is named by no question`));
    }
  }
  return out;
}

// 5
export function checkCommandCoverage(ctx, options) {
  const byConcept = itemsByConcept(ctx);
  const out = [];
  for (const t of scopedTopics(ctx, options)) {
    const required = t.commands ?? [];
    if (required.length === 0) continue;
    const spans = new Set(
      (byConcept.get(t.id) ?? []).flatMap((i) => codeSpansIn(searchableText(i))),
    );
    for (const cmd of required) {
      if (!spans.has(cmd)) {
        out.push(finding('q-command-coverage', 'error', t.id,
          `${t.id} records the command "${cmd}", which appears verbatim as a code span in none of its questions`));
      }
    }
  }
  return out;
}

// 6
export function checkDiagnosticCoverage(ctx, options) {
  const byConcept = itemsByConcept(ctx);
  return scopedTopics(ctx, options)
    .filter((t) => t.required_depth >= 4)
    .filter((t) => !(byConcept.get(t.id) ?? []).some((i) => i.type === 'diagnostic'))
    .map((t) => finding('q-diagnostic-coverage', 'error', t.id,
      `${t.id} is depth ${t.required_depth} and has no question of type "diagnostic"`));
}

// 11
export function checkDifficultyDerived(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  const out = [];
  for (const i of ctx.items) {
    const t = ctx.topicIndex.get(i.concept_id);
    if (!t || !inScope(t, options)) continue;
    if (i.difficulty !== t.required_depth) {
      out.push(finding('q-difficulty-derived', 'error', i.id,
        `${i.id} has difficulty ${i.difficulty}, but ${t.id} has required_depth ${t.required_depth}`));
    }
  }
  return out;
}
