import { sourceIndex, competencyKey } from './load.mjs';

const DEFAULTS = { inferredWarnRatio: 0.6 };

function finding(check, severity, id, message) {
  return { check, severity, id, message };
}

function allSourceRefs(topic) {
  return [
    ...(topic.official_sources ?? []),
    ...(topic.additional_sources ?? []),
    ...(topic.candidate_evidence ?? []),
  ];
}

export function checkDuplicateIds({ topics }) {
  const seen = new Set();
  const out = [];
  for (const t of topics) {
    if (seen.has(t.id)) {
      out.push(finding('duplicate-id', 'error', t.id, `Duplicate concept id: ${t.id}`));
    }
    seen.add(t.id);
  }
  return out;
}

export function checkMissingSources({ topics }) {
  return topics
    .filter((t) => allSourceRefs(t).length === 0)
    .map((t) => finding('missing-sources', 'error', t.id, `No sources cited for ${t.id}`));
}

export function checkOnlyTier4Sources({ topics, sources }) {
  const idx = sourceIndex(sources);
  const out = [];
  for (const t of topics) {
    const refs = allSourceRefs(t);
    if (refs.length === 0) continue;
    const tiers = refs.map((id) => idx.get(id)?.authority_tier).filter((n) => n != null);
    if (tiers.length > 0 && !tiers.some((tier) => tier <= 2)) {
      out.push(finding('weak-sources', 'error', t.id,
        `${t.id} has no tier 1 or tier 2 source (only tier ${[...new Set(tiers)].join(', ')})`));
    }
  }
  return out;
}

export function checkMissingDepth({ topics }) {
  return topics
    .filter((t) => !Number.isInteger(t.required_depth) || t.required_depth < 1 || t.required_depth > 5)
    .map((t) => finding('missing-depth', 'error', t.id,
      `${t.id} has invalid required_depth: ${t.required_depth}`));
}

export function checkMissingVerbatim({ topics }) {
  return topics
    .filter((t) => !t.objective_verbatim || t.objective_verbatim.trim() === '')
    .map((t) => finding('missing-verbatim', 'error', t.id,
      `${t.id} has no objective_verbatim`));
}

export function checkEmptyCompetencies({ competencies, topics }) {
  const populated = new Set(topics.map((t) => competencyKey(t.domain, t.competency)));
  const out = [];
  for (const domain of competencies.domains) {
    for (const comp of domain.competencies) {
      const key = competencyKey(domain.name, comp.name);
      if (!populated.has(key)) {
        out.push(finding('empty-competency', 'error', key,
          `Official competency has zero concepts: ${domain.name} / ${comp.name}`));
      }
    }
  }
  return out;
}

export function checkDanglingSourceRefs({ topics, sources }) {
  const idx = sourceIndex(sources);
  const out = [];
  for (const t of topics) {
    for (const ref of allSourceRefs(t)) {
      if (!idx.has(ref)) {
        out.push(finding('dangling-source', 'error', t.id,
          `${t.id} cites unknown source id: ${ref}`));
      }
    }
  }
  return out;
}

export function checkOrphanSources({ topics, sources }) {
  const cited = new Set(topics.flatMap(allSourceRefs));
  return sources.sources
    .filter((s) => !cited.has(s.id))
    .map((s) => finding('orphan-source', 'warn', s.id,
      `Source cited by no concept: ${s.id}`));
}

export function checkUnknownCurrency({ topics }) {
  const unknown = topics.filter((t) => t.sept_2025_status === 'unknown');
  if (unknown.length === 0) return [];
  return [finding('unknown-currency', 'warn', null,
    `${unknown.length} concept(s) with sept_2025_status "unknown"`)];
}

export function checkInferredRatio({ competencies, topics }, options = {}) {
  const { inferredWarnRatio } = { ...DEFAULTS, ...options };
  const out = [];
  for (const domain of competencies.domains) {
    const inDomain = topics.filter((t) => t.domain === domain.name);
    if (inDomain.length === 0) continue;
    const ratio = inDomain.filter((t) => t.inferred).length / inDomain.length;
    if (ratio > inferredWarnRatio) {
      out.push(finding('inferred-ratio', 'warn', domain.name,
        `${domain.name}: ${Math.round(ratio * 100)}% of concepts are inferred ` +
        `(threshold ${Math.round(inferredWarnRatio * 100)}%) — expansion may have outrun evidence`));
    }
  }
  return out;
}

function checkIdLinks({ topics }, field, checkName) {
  const ids = new Set(topics.map((t) => t.id));
  const out = [];
  for (const t of topics) {
    for (const ref of t[field] ?? []) {
      if (ref === t.id) {
        out.push(finding(checkName, 'error', t.id,
          `${t.id} lists itself in ${field}`));
      } else if (!ids.has(ref)) {
        out.push(finding(checkName, 'error', t.id,
          `${t.id} ${field} references unknown concept id: ${ref}`));
      }
    }
  }
  return out;
}

export function checkDanglingRelatedTopics(dataset) {
  return checkIdLinks(dataset, 'related_topics', 'dangling-related-topic');
}

/**
 * confused_with must hold concept ids, not free-text names. A free-text name
 * simply fails the id lookup, so this catches both dangling ids and the older
 * name-based form in one rule.
 */
export function checkDanglingConfusedWith(dataset) {
  return checkIdLinks(dataset, 'confused_with', 'dangling-confused-with');
}

const REQUIRED_SOURCE_FIELDS = ['id', 'title', 'url', 'organization', 'accessed', 'category'];

export function checkSourceSchema({ sources }) {
  const out = [];
  for (const src of sources.sources) {
    for (const field of REQUIRED_SOURCE_FIELDS) {
      if (!src[field] || String(src[field]).trim() === '') {
        out.push(finding('source-schema', 'error', src.id ?? '(no id)',
          `Source ${src.id ?? '(no id)'} is missing required field: ${field}`));
      }
    }
    if (!Number.isInteger(src.authority_tier) || src.authority_tier < 1 || src.authority_tier > 4) {
      out.push(finding('source-schema', 'error', src.id ?? '(no id)',
        `Source ${src.id ?? '(no id)'} has invalid authority_tier: ${src.authority_tier}. ` +
        `Must be an integer 1-4. Without it, checkOnlyTier4Sources cannot judge the source ` +
        `and a concept citing only this source would pass unsourced.`));
    }
  }
  return out;
}

export function runAllChecks(dataset, options = {}) {
  return [
    ...checkDuplicateIds(dataset),
    ...checkMissingSources(dataset),
    ...checkOnlyTier4Sources(dataset),
    ...checkMissingDepth(dataset),
    ...checkMissingVerbatim(dataset),
    ...checkEmptyCompetencies(dataset),
    ...checkDanglingSourceRefs(dataset),
    ...checkOrphanSources(dataset),
    ...checkUnknownCurrency(dataset),
    ...checkInferredRatio(dataset, options),
    ...checkDanglingRelatedTopics(dataset),
    ...checkDanglingConfusedWith(dataset),
    ...checkSourceSchema(dataset),
  ];
}
