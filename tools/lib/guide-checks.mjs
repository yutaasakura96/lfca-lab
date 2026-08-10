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

export function checkComparisonPointer(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const index = guideIndex(dataset);
  const byId = new Map(dataset.topics.map((t) => [t.id, t]));
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
      const have = pointersByConcept.get(topic.id) ?? [];
      if (!have.some((p) => p.href === wanted)) {
        out.push(finding('guide-comparison-pointer', 'error', topic.id,
          `${topic.id} is compared in cmp-${block.owner} but does not point to it; expected a line linking ${wanted}`));
      }
    }
  }
  return out;
}

// A command counts as shown only when it appears as a complete invocation,
// not as a prefix of a longer one: `blockText.includes('uname -r')` would be
// satisfied by a guide that only ever shows `uname -rV`, crediting a command
// that was never actually demonstrated. An occurrence is valid only when it
// is not immediately adjacent, on either side, to a character that would
// extend it into a different command or flag combination — a letter, digit,
// hyphen, underscore, equals sign or slash. Short-flag pairs like `ps` vs
// `ps aux` or `rm -r` vs `rm -rf` are exactly the case this guards against.
function commandShownVerbatim(blockText, command) {
  const boundary = '[A-Za-z0-9_=/-]';
  const re = new RegExp(`(?<!${boundary})${escapeRegExp(command)}(?!${boundary})`);
  return re.test(blockText);
}

export function checkCommandCoverage(dataset, files, options) {
  const defs = new Map(allDefinitions(files).filter((d) => d.kind === 'topic').map((d) => [d.id, d]));
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

export function checkVendorNeutrality(dataset, files) {
  const cloudNetworking = dataset.topics.filter(
    (t) => t.domain === 'Cloud Computing Fundamentals' && t.competency === 'Networking',
  );
  if (cloudNetworking.length === 0) return [];
  const index = guideIndex(dataset);
  const path = guidePathFor(cloudNetworking[0], index);
  const file = files.find((f) => f.path === path);
  if (!file) return [];
  const text = file.definitions.map((d) => d.blockText).join('\n');
  const hasMapping = /\|\s*AWS\s*\|/.test(text) || /\bAzure\b/.test(text);
  const used = AWS_ONLY_TERMS.filter((term) => text.includes(term));
  if (used.length > 0 && !hasMapping) {
    return [finding('guide-vendor-neutrality', 'warn', path,
      `${path} uses AWS-specific vocabulary (${used.join(', ')}) with no vendor mapping table; the exam is not AWS-specific`)];
  }
  return [];
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
