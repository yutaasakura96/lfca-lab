import { competencyKey } from './load.mjs';

export function finding(check, severity, id, message) {
  return { check, severity, id, message };
}

export function inScope(topic, options) {
  if (!options?.scope) return true;
  return competencyKey(topic.domain, topic.competency) === options.scope.replace(' :: ', '::');
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
    for (const s of f.sections) {
      if (s.definitionIds.length === 0) continue;
      if (!s.hasScenario) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Scenario`));
      }
      if (!s.hasKnowledgeCheck) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Knowledge check`));
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
    if (!topic || d.kind !== 'topic') continue;
    for (const label of LABELS_BY_DEPTH[topic.required_depth] ?? []) {
      if (!d.blockText.includes(`**${label}**`)) {
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
    if (topic.commands.length > 0 && !d.blockText.includes('**Commands**')) {
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
