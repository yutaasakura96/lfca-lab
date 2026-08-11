import { posix } from 'node:path';
import { assignBlocks } from './comparisons.mjs';
import { competencyKey } from './load.mjs';
import { allocation } from './allocation.mjs';
import { allItems } from './question-load.mjs';
import { normalizeStem, tokens } from './similarity.mjs';

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

// A trailing clause added to the key is the oldest tell in multiple choice:
// the writer knows the right answer needs a qualifier and the wrong ones do
// not. Both thresholds are warn-severity because length is a heuristic, not
// a fact decidable against data/ — but this project's acceptance bar is 0
// errors AND 0 warnings, so a warning still has to be answered.
export const LENGTH_CUE_ITEM_RATIO = 1.6;
export const LENGTH_CUE_POPULATION_SHARE = 0.4;
export const LENGTH_CUE_MIN_POPULATION = 20;

const BANNED_OPTION_PATTERNS = [
  /\ball of the above\b/i,
  /\bnone of the above\b/i,
  /\bboth of the above\b/i,
  /\bnone of these\b/i,
  /\ball of these\b/i,
];

const MIN_RATIONALE_CHARS = 40;
const MIN_WHY_CHARS = 20;

function scopedItems(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  return ctx.items.filter((i) => {
    const t = ctx.topicIndex.get(i.concept_id);
    return t ? inScope(t, options) : true;
  });
}

// 7
export function checkOptionContract(ctx, options) {
  assertKnownScope(ctx.dataset, options);
  const out = [];
  const inScopePaths = new Set(scopedItems(ctx, options).map((i) => i.file));
  for (const file of ctx.bank) {
    if (options?.scope && !inScopePaths.has(file.path)) continue;
    for (const m of file.malformed) {
      out.push(finding('q-option-contract', 'error', file.path,
        `${file.path}[${m.index}]: ${m.reason}`));
    }
  }
  for (const item of scopedItems(ctx, options)) {
    for (const o of item.options ?? []) {
      for (const pattern of BANNED_OPTION_PATTERNS) {
        if (pattern.test(o?.text ?? '')) {
          out.push(finding('q-option-contract', 'error', item.id,
            `${item.id} option ${o.ref} is "${o.text}" — an all/none-of-the-above option tests reading, not knowledge`));
        }
      }
    }
  }
  return out;
}

// 8
export function checkDistractorProvenance(ctx, options) {
  const out = [];
  const guideByPath = new Map(ctx.guide.map((f) => [f.path, f]));
  for (const item of scopedItems(ctx, options)) {
    const distractors = (item.options ?? []).filter((o) => o?.correct !== true);
    const misconceptions = distractors.filter((o) => o?.provenance?.kind === 'misconception');
    if (misconceptions.length > 1) {
      out.push(finding('q-distractor-provenance', 'error', item.id,
        `${item.id} has ${misconceptions.length} misconception distractors; at most one is allowed, the rest must name a concept id or a real command`));
    }
    const topic = ctx.topicIndex.get(item.concept_id);
    for (const o of distractors) {
      const p = o?.provenance ?? {};
      if (p.concept_id !== undefined && !ctx.topicIndex.has(p.concept_id)) {
        out.push(finding('q-distractor-provenance', 'error', item.id,
          `${item.id} option ${o.ref} cites concept ${p.concept_id}, which is not in data/`));
      }
      if (p.kind === 'confusable' && topic && !(topic.confused_with ?? []).includes(p.concept_id)) {
        const reverse = ctx.topicIndex.get(p.concept_id)?.confused_with ?? [];
        if (!reverse.includes(item.concept_id)) {
          out.push(finding('q-distractor-provenance', 'error', item.id,
            `${item.id} option ${o.ref} is tagged confusable with ${p.concept_id}, but no confused_with edge joins them in either direction`));
        }
      }
      if (p.kind === 'variant') {
        const known = new Set(ctx.dataset.topics.flatMap((t) => t.commands ?? []));
        if (!known.has(p.command)) {
          out.push(finding('q-distractor-provenance', 'error', item.id,
            `${item.id} option ${o.ref} is tagged variant of "${p.command}", which is not a command string anywhere in data/`));
        }
      }
      if (p.kind === 'misconception') {
        const at = String(p.documented_at ?? '');
        const dataMatch = /^data:notes:(.+)$/.exec(at);
        const guideMatch = /^guide:(.+\.md)#(.+)$/.exec(at);
        if (dataMatch) {
          const t = ctx.topicIndex.get(dataMatch[1]);
          if (!t) {
            out.push(finding('q-distractor-provenance', 'error', item.id,
              `${item.id} option ${o.ref} documents its misconception at ${at}, but ${dataMatch[1]} is not in data/`));
          } else if (!String(t.notes ?? '').trim()) {
            out.push(finding('q-distractor-provenance', 'error', item.id,
              `${item.id} option ${o.ref} documents its misconception at ${at}, but that concept's notes field is empty`));
          }
        } else if (guideMatch) {
          const target = guideByPath.get(posix.join(ctx.guideRoot, guideMatch[1]));
          if (!target) {
            out.push(finding('q-distractor-provenance', 'error', item.id,
              `${item.id} option ${o.ref} documents its misconception in ${guideMatch[1]}, which is not a guide file`));
          } else if (!target.anchors.has(guideMatch[2])) {
            out.push(finding('q-distractor-provenance', 'error', item.id,
              `${item.id} option ${o.ref} documents its misconception at anchor #${guideMatch[2]}, which ${guideMatch[1]} does not define`));
          }
        } else {
          out.push(finding('q-distractor-provenance', 'error', item.id,
            `${item.id} option ${o.ref} has documented_at "${at}"; expected data:notes:<concept-id> or guide:<path>#<anchor>`));
        }
      }
    }
  }
  return out;
}

// 9
export function checkDistractorDistinct(ctx, options) {
  const out = [];
  for (const item of scopedItems(ctx, options)) {
    const opts = item.options ?? [];
    for (let i = 0; i < opts.length; i += 1) {
      for (let j = i + 1; j < opts.length; j += 1) {
        const a = tokens(opts[i]?.text ?? '').join(' ');
        const b = tokens(opts[j]?.text ?? '').join(' ');
        if (a === b) {
          out.push(finding('q-distractor-distinct', 'error', item.id,
            `${item.id} options ${opts[i].ref} and ${opts[j].ref} normalize identically, so one of them is not a real alternative. `
            + `This check does not check whether a distractor is also correct — that is a semantic judgement and belongs to the layer-2 verification pass.`));
        }
      }
    }
  }
  return out;
}

// 10
export function checkRationaleComplete(ctx, options) {
  const out = [];
  for (const item of scopedItems(ctx, options)) {
    if (String(item.rationale ?? '').trim().length < MIN_RATIONALE_CHARS) {
      out.push(finding('q-rationale-complete', 'error', item.id,
        `${item.id} has a rationale of ${String(item.rationale ?? '').trim().length} characters; at least ${MIN_RATIONALE_CHARS} are needed to say why the key is right`));
    }
    for (const o of item.options ?? []) {
      const why = String(o?.why ?? '').trim();
      if (why.length < MIN_WHY_CHARS) {
        out.push(finding('q-rationale-complete', 'error', item.id,
          `${item.id} option ${o?.ref} has a why of ${why.length} characters; at least ${MIN_WHY_CHARS} are needed`));
      }
      if (normalizeStem(why) === normalizeStem(o?.text ?? '')) {
        out.push(finding('q-rationale-complete', 'error', item.id,
          `${item.id} option ${o?.ref} restates its own text instead of saying why it is right or wrong`));
      }
    }
  }
  return out;
}

// 12
export function checkSourceIds(ctx, options) {
  const known = new Set(ctx.dataset.sources.sources.map((s) => s.id));
  const out = [];
  for (const item of scopedItems(ctx, options)) {
    const ids = item.source_ids ?? [];
    if (ids.length === 0) {
      out.push(finding('q-source-ids', 'error', item.id,
        `${item.id} cites no source; at least one registered source id is required`));
    }
    for (const id of ids) {
      if (!known.has(id)) {
        out.push(finding('q-source-ids', 'error', item.id,
          `${item.id} cites source "${id}", which is not in data/sources.json`));
      }
    }
  }
  return out;
}

// 13
export function checkGuideAnchor(ctx, options) {
  const byPath = new Map(ctx.guide.map((f) => [f.path, f]));
  const out = [];
  for (const item of scopedItems(ctx, options)) {
    const anchor = String(item.guide_anchor ?? '');
    if (!anchor.includes('#')) {
      out.push(finding('q-guide-anchor', 'error', item.id,
        `${item.id} has guide_anchor "${anchor}" with no # fragment; the form is <path>#c-<concept-id>`));
      continue;
    }
    const [rel, frag] = anchor.split('#');
    const target = byPath.get(posix.join(ctx.guideRoot, rel));
    if (!target) {
      out.push(finding('q-guide-anchor', 'error', item.id,
        `${item.id} points at ${rel}, which is not a guide file`));
      continue;
    }
    if (!target.anchors.has(frag)) {
      out.push(finding('q-guide-anchor', 'error', item.id,
        `${item.id} points at anchor #${frag}, which ${rel} does not define`));
    }
  }
  return out;
}

// 14
export function checkLengthCue(ctx, options) {
  const out = [];
  const items = scopedItems(ctx, options);
  let longestKeyCount = 0;
  let population = 0;

  for (const item of items) {
    const opts = item.options ?? [];
    const key = opts.find((o) => o?.correct === true);
    const distractors = opts.filter((o) => o?.correct !== true);
    if (!key || distractors.length === 0) continue;
    population += 1;
    const keyLen = String(key.text ?? '').length;
    const meanDistractor =
      distractors.reduce((a, o) => a + String(o?.text ?? '').length, 0) / distractors.length;
    if (meanDistractor > 0 && keyLen > meanDistractor * LENGTH_CUE_ITEM_RATIO) {
      out.push(finding('q-length-cue', 'warn', item.id,
        `${item.id}'s key is ${keyLen} characters against a ${Math.round(meanDistractor)}-character distractor mean — a reader can pick it on length alone`));
    }
    if (distractors.every((o) => String(o?.text ?? '').length < keyLen)) longestKeyCount += 1;
  }

  if (population >= LENGTH_CUE_MIN_POPULATION) {
    const share = longestKeyCount / population;
    if (share > LENGTH_CUE_POPULATION_SHARE) {
      out.push(finding('q-length-cue', 'warn', options?.scope ?? 'bank',
        `the key is the longest option in ${longestKeyCount} of ${population} items (${Math.round(share * 100)}%); chance is 25%`));
    }
  }
  return out;
}
