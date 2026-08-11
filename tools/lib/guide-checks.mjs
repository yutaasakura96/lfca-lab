import { posix } from 'node:path';
import { competencyKey } from './load.mjs';
import { assignBlocks, blocksMentioning } from './comparisons.mjs';
import { guideIndex, guidePathFor, relativeGuideLink } from './guide-paths.mjs';

export function finding(check, severity, id, message) {
  return { check, severity, id, message };
}

export function inScope(topic, options) {
  if (!options?.scope) return true;
  return competencyKey(topic.domain, topic.competency) === options.scope.replace(' :: ', '::');
}

// Throws when `options.scope` names a competency that does not exist anywhere
// in the dataset. A scoped check run that silently matches nothing (typo'd
// domain, renamed competency, stale scope string left over from a previous
// cycle) reports zero errors over zero concepts — a green light that means
// nothing. This turns that silent no-op into an explicit failure, naming the
// bad scope and listing every valid competency key so the caller can fix it.
export function assertKnownScope(dataset, options) {
  if (!options?.scope) return;
  const validKeys = dataset.competencies.domains.flatMap((domain) =>
    domain.competencies.map((c) => competencyKey(domain.name, c.name)),
  );
  const normalizedScope = options.scope.replace(' :: ', '::');
  if (!validKeys.includes(normalizedScope)) {
    const readable = validKeys.map((k) => k.replace('::', ' :: '));
    throw new Error(
      `Unknown scope "${options.scope}". Valid competencies: ${readable.join(', ')}`,
    );
  }
}

export function allDefinitions(files) {
  return files.flatMap((f) => f.definitions.map((d) => ({ ...d, file: f.path })));
}

const LABELS_BY_DEPTH = {
  2: ['What it is', 'Why it matters', 'How it works', 'Key terms'],
  3: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test'],
  4: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test', 'Symptoms and diagnostic order'],
  5: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test', 'Symptoms and diagnostic order', 'Syntax worth memorising'],
};

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A body label (e.g. "**Traps**") only counts if it begins a line. The naive
// `blockText.includes('**' + label + '**')` also matched an incidental
// mention anywhere in the block, including inside a Commands-table cell
// (which always starts with "|"), so a label string could be satisfied by
// accident. Anchoring to line-start closes that: a markdown table row always
// begins with "|", never with the label markup itself.
function blockHasLabel(blockText, label) {
  return new RegExp(`^\\*\\*${escapeRegExp(label)}\\*\\*`, 'm').test(blockText);
}

export function checkMissingConcept({ topics }, files, options) {
  const defined = new Set(allDefinitions(files).map((d) => d.id));
  return topics
    .filter((t) => inScope(t, options) && !defined.has(t.id))
    .map((t) =>
      finding('guide-missing-concept', 'error', t.id, `${t.id} has no definition site in study-guide/`),
    );
}

export function checkDuplicateDefinition(dataset, files) {
  const seen = new Map();
  const out = [];
  for (const d of allDefinitions(files)) {
    if (seen.has(d.id)) {
      out.push(
        finding(
          'guide-duplicate-definition',
          'error',
          d.id,
          `${d.id} is defined twice: ${seen.get(d.id)} and ${d.file}:${d.line}`,
        ),
      );
      continue;
    }
    seen.set(d.id, `${d.file}:${d.line}`);
  }
  return out;
}

export function checkUnknownConcept({ topics }, files) {
  const known = new Set(topics.map((t) => t.id));
  return allDefinitions(files)
    .filter((d) => !known.has(d.id))
    .map((d) =>
      finding(
        'guide-unknown-concept',
        'error',
        d.id,
        `${d.file}:${d.line} defines ${d.id}, which is not in data/`,
      ),
    );
}

// STYLE.md section 7: "3 to 6 prompts per section". Fewer than 3 under-tests
// a section with multiple definition sites; more than 6 stops being a check
// and starts being a second pass through the material.
const KNOWLEDGE_CHECK_MIN_PROMPTS = 3;
const KNOWLEDGE_CHECK_MAX_PROMPTS = 6;

export function checkSectionApparatus(dataset, files) {
  const out = [];
  for (const f of files) {
    const coveredIds = new Set(f.sections.flatMap((s) => s.definitionIds));
    for (const s of f.sections) {
      if (s.definitionIds.length === 0) continue;
      if (!s.hasScenario) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Scenario`));
      }
      if (!s.hasKnowledgeCheck) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Knowledge check`));
        continue;
      }
      // STYLE.md section 7 is normative: "3 to 6 prompts per section, each a
      // recall or discrimination question with its answer written directly
      // beneath it." Confirming only that the heading exists let a section
      // ship one prompt, or twelve, or a list of questions with no answers —
      // every one of which the style guide forbids and nothing rejected.
      const prompts = s.knowledgeCheck?.prompts ?? [];
      if (prompts.length < KNOWLEDGE_CHECK_MIN_PROMPTS || prompts.length > KNOWLEDGE_CHECK_MAX_PROMPTS) {
        out.push(
          finding(
            'guide-section-apparatus',
            'error',
            s.heading,
            `${f.path}:${s.knowledgeCheck.line} section "${s.heading}" has ${prompts.length} Knowledge check prompt(s); STYLE.md section 7 requires ${KNOWLEDGE_CHECK_MIN_PROMPTS} to ${KNOWLEDGE_CHECK_MAX_PROMPTS}`,
          ),
        );
      }
      for (const p of prompts) {
        if (p.hasAnswer) continue;
        out.push(
          finding(
            'guide-section-apparatus',
            'error',
            s.heading,
            `${f.path}:${p.line} section "${s.heading}" Knowledge check prompt ${p.number} has no answer written beneath it`,
          ),
        );
      }
    }
    // A definition anchored directly under the H1 title, with no enclosing
    // `##` section, never appears in any section's `definitionIds` — the
    // loop above can't see it, so it silently skipped Scenario/Knowledge
    // check verification entirely. Report it explicitly instead.
    for (const d of f.definitions) {
      if (!coveredIds.has(d.id)) {
        out.push(
          finding(
            'guide-section-apparatus',
            'error',
            d.id,
            `${f.path}:${d.line} ${d.id} is defined outside any section, so it cannot be checked for Scenario or Knowledge check apparatus`,
          ),
        );
      }
    }
  }
  return out;
}

export function checkDepthTreatment({ topics }, files) {
  const index = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const d of allDefinitions(files)) {
    const topic = index.get(d.id);
    if (!topic) continue;

    // A concept's definition kind must match its required depth: depth 1 is
    // written as a single Quick reference row (kind 'glossary'); depth 2+
    // must be written as a full topic (kind 'topic'). Without this, any
    // concept — regardless of depth — could be stubbed as a one-line
    // glossary row and every check below, which only looks at 'topic'
    // definitions, would have nothing left to complain about.
    const expectedKind = topic.required_depth === 1 ? 'glossary' : 'topic';
    if (d.kind !== expectedKind) {
      out.push(
        finding(
          'guide-depth-treatment',
          'error',
          d.id,
          `${d.file}:${d.line} ${d.id} is depth ${topic.required_depth} and must be defined as a ${expectedKind}, but is defined as a ${d.kind}`,
        ),
      );
      continue;
    }
    if (d.kind !== 'topic') continue;

    for (const label of LABELS_BY_DEPTH[topic.required_depth] ?? []) {
      if (!blockHasLabel(d.blockText, label)) {
        out.push(
          finding(
            'guide-depth-treatment',
            'error',
            d.id,
            `${d.file}:${d.line} ${d.id} is depth ${topic.required_depth} and is missing the ${label} section`,
          ),
        );
      }
    }
    if (topic.commands.length > 0 && !blockHasLabel(d.blockText, 'Commands')) {
      out.push(
        finding('guide-depth-treatment', 'error', d.id, `${d.file}:${d.line} ${d.id} has commands in data/ but no Commands section`),
      );
    }
  }
  return out;
}

export function checkMetadataAccuracy({ topics }, files) {
  const index = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const d of allDefinitions(files)) {
    if (d.kind !== 'topic') continue;
    const topic = index.get(d.id);
    if (!topic) continue;
    if (d.meta.depth !== topic.required_depth) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states depth ${d.meta.depth}, data/ says ${topic.required_depth}`));
    }
    if (d.meta.importance !== topic.importance) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states importance ${d.meta.importance}, data/ says ${topic.importance}`));
    }
    if (d.meta.coverage !== topic.coverage_status) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states LFS200 ${d.meta.coverage}, data/ says ${topic.coverage_status}`));
    }
  }
  return out;
}

export function checkSourceIds({ sources }, files) {
  const known = new Set(sources.sources.map((s) => s.id));
  const out = [];
  for (const d of allDefinitions(files)) {
    if (d.kind !== 'topic') continue;
    for (const ref of d.meta.sources) {
      if (!known.has(ref)) {
        out.push(finding('guide-source-ids', 'error', d.id, `${d.file}:${d.line} ${d.id} cites unknown source id: ${ref}`));
      }
    }
  }
  return out;
}

// The full disclaimer is a three-clause sentence ending in "not citable
// fact". Matching only the opening clause let a truncated marker (opening
// sentence present, the rest silently dropped) pass. Both pieces must be
// present in the concept's block; exact whole-sentence equality is not
// required, since the marker contains a path and may be line-wrapped by an
// author.
const WAIVER_OPENING = 'No primary documentation source.';
const WAIVER_CLOSING_PHRASE = 'not citable fact';

const AWS_ONLY_TERMS = ['VPC', 'Security Group', 'Route 53', 'Elastic Load Balancer', 'Direct Connect', 'NACL'];

// A comparison block's owner may fall outside `options.scope` while some of
// its members are inside it (or vice versa). Coverage and membership are
// properties of the block itself, so both are gated on the *owner's* scope
// membership, not the member being iterated — a scoped run must neither
// demand a block it has no mandate to see written, nor silently accept a
// wrong one just because the file in view belongs to a different competency.
function ownedInScope(dataset, block, options) {
  const topic = dataset.topics.find((t) => t.id === block.owner);
  return topic ? inScope(topic, options) : true;
}

export function checkComparisonCoverage(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const written = new Map();
  const out = [];
  for (const f of files) {
    for (const c of f.comparisons) {
      if (written.has(c.owner)) {
        out.push(
          finding('guide-comparison-coverage', 'error', c.owner,
            `Comparison block cmp-${c.owner} is written more than once: ${written.get(c.owner)} and ${f.path}:${c.line}`),
        );
        continue;
      }
      written.set(c.owner, `${f.path}:${c.line}`);
    }
  }
  for (const block of expected.values()) {
    if (!ownedInScope(dataset, block, options)) continue;
    if (!written.has(block.owner)) {
      out.push(
        finding('guide-comparison-coverage', 'error', block.owner,
          `No comparison block for ${block.owner}, which must distinguish it from ${block.members.join(', ')}`),
      );
    }
  }
  return out;
}

export function checkComparisonMembership(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const out = [];
  for (const f of files) {
    for (const c of f.comparisons) {
      const block = expected.get(c.owner);
      if (!block) {
        out.push(finding('guide-comparison-membership', 'error', c.owner,
          `${f.path}:${c.line} defines cmp-${c.owner}, which is not an assigned comparison owner`));
        continue;
      }
      if (!ownedInScope(dataset, block, options)) continue;
      if (c.compares.join('|') !== block.compares.join('|')) {
        out.push(finding('guide-comparison-membership', 'error', c.owner,
          `${f.path}:${c.line} compares [${c.compares.join(', ')}] but the assignment is [${block.compares.join(', ')}]`));
      }
    }
  }
  return out;
}

// A depth-1 concept's only definition site is a single Quick reference table
// row (kind 'glossary') — there is no enclosing block for a standalone
// `*Not to be confused with [X](path#cmp-id).*` line to live in, and
// `guide-parse.mjs` only ever attributes such a line to an enclosing
// `kind: 'topic'` definition (`RE_POINTER`'s owner lookup filters on
// `d.kind === 'topic'`). For a glossary-defined concept the pointer instead
// lives as a markdown link inside the row itself — the row's last column
// ("Why it is examinable") is its natural home — and `blockText` on a
// glossary definition is exactly that row's own line, so the link is found
// by scanning the row text directly rather than by consulting `f.pointers`.
// The match must still be the exact expected href, never merely "a link is
// present": `RE_ROW_LINK` extracts every markdown link target in the row,
// and only an exact hit against `wanted` satisfies the requirement, so a
// row linking the wrong path or the wrong anchor still fails. A concept
// with no definition at all is left alone here — `checkMissingConcept`
// already reports that, and this check has nothing to look inside.
const RE_ROW_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;

function rowLinkHrefs(text) {
  return [...text.matchAll(RE_ROW_LINK)].map((m) => m[1]);
}

export function checkComparisonPointer(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const index = guideIndex(dataset);
  const byId = new Map(dataset.topics.map((t) => [t.id, t]));
  const definitionsById = new Map(allDefinitions(files).map((d) => [d.id, d]));
  const pointersByConcept = new Map();
  for (const f of files) {
    for (const p of f.pointers) {
      if (!p.conceptId) continue;
      if (!pointersByConcept.has(p.conceptId)) pointersByConcept.set(p.conceptId, []);
      pointersByConcept.get(p.conceptId).push(p);
    }
  }
  const out = [];
  for (const topic of dataset.topics) {
    if (!inScope(topic, options)) continue;
    for (const block of blocksMentioning(expected, topic.id)) {
      const ownerTopic = byId.get(block.owner);
      const wanted = relativeGuideLink(
        guidePathFor(topic, index),
        guidePathFor(ownerTopic, index),
        block.anchor,
      );
      const def = definitionsById.get(topic.id);
      if (def && def.kind === 'glossary') {
        if (!rowLinkHrefs(def.blockText).includes(wanted)) {
          out.push(finding('guide-comparison-pointer', 'error', topic.id,
            `${topic.id} is compared in cmp-${block.owner} but its Quick reference row does not link to it; expected a link to ${wanted}`));
        }
        continue;
      }
      const have = pointersByConcept.get(topic.id) ?? [];
      if (!have.some((p) => p.href === wanted)) {
        out.push(finding('guide-comparison-pointer', 'error', topic.id,
          `${topic.id} is compared in cmp-${block.owner} but does not point to it; expected a line linking ${wanted}`));
      }
    }
  }
  return out;
}

// A command counts as shown only if it appears verbatim inside a code span
// or a fenced code block — never by searching the block's raw prose. Two
// failures forced this design, and both are failures of *where* the search
// looked, not of how forgiving its boundary rule was:
//
//   - The dataset records concepts whose command is itself markdown table
//     syntax (`linux.command-line.pipes` requires `|`; `.command-chaining`
//     requires `||`). Every Commands table row is delimited by `|`, and
//     every commands-bearing concept is required to render one — so a raw
//     `blockText` search was satisfied by the table's own markup, with no
//     genuine pipe example ever needed.
//   - A concept that lists both a bare command and a flagged variant (`man`
//     and `man -k`, `sed` and `sed 's/a/b/g'`, `kill` and `kill -9`, and
//     others) could show only the longer form and still credit the shorter
//     one, because nothing in raw prose marks where one command ends and
//     unrelated surrounding text begins.
//
// Restricting the search to code spans and fenced lines, and requiring an
// exact match rather than a substring, closes both gaps at once: a table
// cell's pipe characters are markup, not a code span's content, and `man`
// only matches literal `man`, never `man -k`. This is also, by construction,
// exactly what a writer's Commands table already gives them: its first
// column holds each command as its own inline code span, verbatim.
const RE_FENCE_LINE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const RE_INLINE_CODE_SPAN = /`([^`]+)`/g;

// Walks `blockText` once, tracking fence open/close state the same way
// `guide-parse.mjs` does (matching fence character and length, closer must
// carry no trailing content), and buckets every line into either inline code
// span contents (outside any fence) or raw fenced lines (inside one). A line
// that opens or closes a fence contributes neither.
function collectCodeSpansAndFencedLines(blockText) {
  const spans = [];
  const fencedLines = [];
  let openChar = null;
  let openLen = 0;
  for (const line of blockText.split('\n')) {
    const fenceMatch = RE_FENCE_LINE.exec(line);
    if (openChar === null) {
      if (fenceMatch) {
        openChar = fenceMatch[1][0];
        openLen = fenceMatch[1].length;
        continue;
      }
      for (const m of line.matchAll(RE_INLINE_CODE_SPAN)) spans.push(m[1]);
      continue;
    }
    if (fenceMatch && fenceMatch[1][0] === openChar && fenceMatch[1].length >= openLen && fenceMatch[2].trim() === '') {
      openChar = null;
      openLen = 0;
      continue;
    }
    fencedLines.push(line);
  }
  return { spans, fencedLines };
}

function stripShellPrompt(line) {
  return line.trim().replace(/^\$\s*/, '').trim();
}

function commandShownVerbatim(blockText, command) {
  const { spans, fencedLines } = collectCodeSpansAndFencedLines(blockText);
  if (spans.some((span) => span.trim() === command)) return true;
  return fencedLines.some((line) => stripShellPrompt(line) === command);
}

// Every definition site is checked, glossary rows included — not just
// `kind: 'topic'` blocks. Filtering to topics made five depth-1 concepts
// permanently exempt: a concept whose only definition site is a Quick
// reference row was never required to show the commands `data/` records for
// it, so the dataset could name `tcpdump -i` or `git stash` and the guide
// could omit it with nothing to say so. A glossary definition's `blockText`
// is its own row, and `commandShownVerbatim` reads inline code spans, which
// is exactly how a row shows a command — so the same rule applies unchanged.
// `allDefinitions` is taken whole (no kind filter), matching
// `checkWaiverMarker`; if an id were defined twice the last site wins, and
// `checkDuplicateDefinition` reports the duplication itself.
export function checkCommandCoverage(dataset, files, options) {
  const defs = new Map(allDefinitions(files).map((d) => [d.id, d]));
  const out = [];
  for (const topic of dataset.topics) {
    if (!inScope(topic, options)) continue;
    const def = defs.get(topic.id);
    if (!def) continue;
    for (const command of topic.commands) {
      if (!commandShownVerbatim(def.blockText, command)) {
        out.push(finding('guide-command-coverage', 'error', topic.id,
          `${def.file}:${def.line} ${topic.id} does not show its dataset command verbatim: ${command}`));
      }
    }
  }
  return out;
}

export function checkWaiverMarker({ topics, waivers }, files, options) {
  const waived = new Set(waivers?.waived ?? []);
  const defs = new Map(allDefinitions(files).map((d) => [d.id, d]));
  const byId = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const id of waived) {
    const topic = byId.get(id);
    if (topic && !inScope(topic, options)) continue;
    const def = defs.get(id);
    if (!def) continue;
    if (!def.blockText.includes(WAIVER_OPENING) || !def.blockText.includes(WAIVER_CLOSING_PHRASE)) {
      out.push(finding('guide-waiver-marker', 'error', id,
        `${def.file}:${def.line} ${id} is waived in data/sourcing-waivers.json but carries no no-primary-source marker`));
    }
  }
  return out;
}

export function checkDanglingXref(dataset, files, options) {
  // A dangling link is an error in a full-corpus run, but only a warning
  // when `options.scope` is set: a scoped run is exactly one writing task's
  // output, and that file's cross-references legitimately point at sibling
  // competency files a later task has not written yet. Treating those as
  // errors would make every mid-cycle scoped check fail on links that are
  // correct, just early.
  const severity = options?.scope ? 'warn' : 'error';
  const byPath = new Map(files.map((f) => [f.path, f]));
  const out = [];
  for (const f of files) {
    for (const link of f.links) {
      if (/^[a-z]+:/i.test(link.href)) continue;
      // An anchor-only href (`#c-some-id`) is a same-file link. It was
      // previously skipped outright, which let a same-file link to a
      // nonexistent anchor pass unconditionally. Resolve it against the
      // containing file's own anchors instead, and report it exactly like
      // any other dangling anchor.
      if (link.href.startsWith('#')) {
        const anchor = link.href.slice(1);
        if (anchor && !f.anchors.has(anchor)) {
          out.push(finding('guide-dangling-xref', severity, f.path,
            `${f.path}:${link.line} links to anchor #${anchor}, which ${f.path} does not define`));
        }
        continue;
      }
      const [rel, anchor] = link.href.split('#');
      const target = rel === '' ? f.path : posix.normalize(posix.join(posix.dirname(f.path), rel));
      const targetFile = byPath.get(target);
      if (!targetFile) {
        out.push(finding('guide-dangling-xref', severity, f.path,
          `${f.path}:${link.line} links to ${target}, which is not a guide file`));
        continue;
      }
      if (anchor && !targetFile.anchors.has(anchor)) {
        out.push(finding('guide-dangling-xref', severity, f.path,
          `${f.path}:${link.line} links to anchor #${anchor}, which ${target} does not define`));
      }
    }
  }
  return out;
}

// Scans every guide file, over the file's whole text.
//
// It used to read one file — the Cloud Computing :: Networking competency
// file — and, inside it, only the concatenated `blockText` of its definition
// blocks. That made it nearly blind in two directions at once. Vertically, a
// comparison table, a Scenario, a Knowledge check, an orientation paragraph
// and a Quick reference table all sit outside every definition block, so
// AWS-only vocabulary in any of them was invisible. Horizontally, the other
// 31 files were never looked at, even though AWS product names appear in
// several of them (performance and availability discusses managed DNS
// failover; the cloud domain index summarises the networking file).
//
// The dataset gate stays: if the corpus has no Cloud Computing Fundamentals
// :: Networking competency, there is no multi-cloud exam surface to be
// neutral about and the check has nothing to say. That gate is about the
// *dataset*, not about which file is read — once it passes, every file is
// scanned.
//
// Severity stays `warn`, deliberately. Errors in this harness are reserved
// for facts decidable against `data/`: a concept with no definition site, a
// metadata line contradicting the dataset, a command not shown verbatim.
// Vendor neutrality is not that kind of fact — it is a fixed list of six
// vendor strings matched against free prose, exempted by an equally coarse
// "does this file mention a second vendor" test. Widening the scan from one
// file's definition blocks to 32 whole files multiplies both the reach and
// the false-positive surface of those heuristics, and a heuristic that can be
// wrong should not be able to fail a build on its own. It is not toothless:
// the project's acceptance bar for this harness is 0 errors *and* 0 warnings,
// so a warning still has to be answered — by adding the mapping table or by a
// human deciding the vocabulary is right — before the corpus is considered
// clean.
export function checkVendorNeutrality(dataset, files) {
  const cloudNetworking = dataset.topics.filter(
    (t) => t.domain === 'Cloud Computing Fundamentals' && t.competency === 'Networking',
  );
  if (cloudNetworking.length === 0) return [];
  const out = [];
  for (const file of files) {
    // `text` is the parser's verbatim file content. The `blockText` join is a
    // fallback for a synthetic file object built without it.
    const text = file.text ?? (file.definitions ?? []).map((d) => d.blockText).join('\n');
    const hasMapping = /\|\s*AWS\s*\|/.test(text) || /\bAzure\b/.test(text);
    const used = AWS_ONLY_TERMS.filter((term) => text.includes(term));
    if (used.length > 0 && !hasMapping) {
      out.push(finding('guide-vendor-neutrality', 'warn', file.path,
        `${file.path} uses AWS-specific vocabulary (${used.join(', ')}) with no vendor mapping table; the exam is not AWS-specific`));
    }
  }
  return out;
}

export function runAllGuideChecks(dataset, files, options = {}) {
  assertKnownScope(dataset, options);
  return [
    ...checkMissingConcept(dataset, files, options),
    ...checkDuplicateDefinition(dataset, files, options),
    ...checkUnknownConcept(dataset, files, options),
    ...checkComparisonCoverage(dataset, files, options),
    ...checkComparisonMembership(dataset, files, options),
    ...checkComparisonPointer(dataset, files, options),
    ...checkCommandCoverage(dataset, files, options),
    ...checkSectionApparatus(dataset, files, options),
    ...checkDepthTreatment(dataset, files, options),
    ...checkWaiverMarker(dataset, files, options),
    ...checkMetadataAccuracy(dataset, files, options),
    ...checkDanglingXref(dataset, files, options),
    ...checkSourceIds(dataset, files, options),
    ...checkVendorNeutrality(dataset, files, options),
  ];
}
