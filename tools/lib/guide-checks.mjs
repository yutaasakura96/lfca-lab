import { competencyKey } from './load.mjs';

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
