import { sourceIndex } from './load.mjs';

const BANNER =
  '<!-- Generated file — do not edit. Run `npm run generate` to rebuild from data/. -->\n';

function esc(text) {
  return String(text ?? '').replace(/\|/g, '\\|');
}

function domainOf(competencies, name) {
  return competencies.domains.find((d) => d.name === name);
}

export function renderObjectives({ competencies }) {
  const lines = [BANNER, '# Official LFCA Objectives', '',
    `Exam version: **${competencies.exam_version}**`, '',
    competencies.objective_granularity_note ?? '', ''];
  for (const d of competencies.domains) {
    const shift = d.previous_weight != null && d.previous_weight !== d.weight
      ? ` (was ${d.previous_weight}%)` : '';
    lines.push(`## ${d.name} — ${d.weight}%${shift}`, '');
    if (d.changes_2025?.renamed_from) {
      lines.push(`Renamed from **${d.changes_2025.renamed_from}**.`, '');
    }
    lines.push('| Competency | 2025 status | Previously |', '| --- | --- | --- |');
    for (const c of d.competencies) {
      const status = c.rewording_significance
        ? `${c.sept_2025_status} (${c.rewording_significance})`
        : c.sept_2025_status;
      lines.push(`| ${esc(c.name)} | ${esc(status)} | ${esc(c.previous_name ?? '—')} |`);
    }
    lines.push('');
    const removed = d.changes_2025?.removed_competencies ?? [];
    if (removed.length > 0) {
      lines.push(`Removed in 2025: ${removed.map((r) => `**${r}**`).join(', ')}.`, '');
    }
    if (d.changes_2025?.note) lines.push(d.changes_2025.note, '');
  }
  return lines.join('\n');
}

export function renderLfs200Map({ topics }) {
  const covered = topics.filter((t) => (t.lfs200_sources ?? []).length > 0);
  const lines = [BANNER, '# LFS200 Coverage Map', '',
    `${covered.length} of ${topics.length} concepts have LFS200 coverage.`, '',
    '| Concept | Domain | Competency | LFS200 lessons | Status |',
    '| --- | --- | --- | --- | --- |'];
  for (const t of covered) {
    lines.push(`| ${esc(t.id)} | ${esc(t.domain)} | ${esc(t.competency)} | ` +
      `${esc((t.lfs200_sources ?? []).join(', '))} | ${esc(t.coverage_status)} |`);
  }
  return lines.join('\n');
}

export function renderGapAnalysis({ topics }) {
  const gaps = topics.filter((t) => t.coverage_status !== 'FULLY COVERED');
  const lines = [BANNER, '# LFCA / LFS200 Gap Analysis', '',
    `${gaps.length} of ${topics.length} concepts are not fully covered by LFS200.`, '',
    '| Concept | Domain | Competency | Status | Depth | Importance |',
    '| --- | --- | --- | --- | --- | --- |'];
  const order = { 'NOT COVERED': 0, 'MENTIONED ONLY': 1, 'PARTIALLY COVERED': 2, 'POSSIBLY OUTDATED': 3 };
  for (const t of [...gaps].sort((a, b) =>
    (order[a.coverage_status] ?? 9) - (order[b.coverage_status] ?? 9) ||
    (b.importance ?? 0) - (a.importance ?? 0))) {
    lines.push(`| ${esc(t.id)} | ${esc(t.domain)} | ${esc(t.competency)} | ` +
      `${esc(t.coverage_status)} | ${esc(t.required_depth)} | ${esc(t.importance)} |`);
  }
  return lines.join('\n');
}

export function renderCandidateExperience({ topics, sources }) {
  const idx = sourceIndex(sources);
  const withEvidence = topics.filter((t) => (t.candidate_evidence ?? []).length > 0);
  const lines = [BANNER, '# Candidate Experience Evidence', '',
    'All entries below are **anecdotal**. They indicate perceived emphasis, not official scope.',
    '',
    '| Concept | Domain | Evidence | Published |',
    '| --- | --- | --- | --- |'];
  for (const t of withEvidence) {
    for (const ref of t.candidate_evidence) {
      const s = idx.get(ref);
      lines.push(`| ${esc(t.id)} | ${esc(t.domain)} | ${esc(s?.title ?? ref)} | ` +
        `${esc(s?.published ?? 'unknown')} |`);
    }
  }
  return lines.join('\n');
}

export function renderSources({ sources }) {
  const lines = [BANNER, '# Sources', '',
    '| ID | Title | Organization | Tier | Published | Accessed | URL |',
    '| --- | --- | --- | --- | --- | --- | --- |'];
  for (const s of [...sources.sources].sort((a, b) =>
    a.authority_tier - b.authority_tier || a.id.localeCompare(b.id))) {
    lines.push(`| ${esc(s.id)} | ${esc(s.title)} | ${esc(s.organization)} | ` +
      `${esc(s.authority_tier)} | ${esc(s.published ?? '—')} | ${esc(s.accessed)} | ${esc(s.url)} |`);
  }
  return lines.join('\n');
}

export function renderCoverageMatrix({ competencies, topics, sources }) {
  const idx = sourceIndex(sources);
  const lines = [BANNER, '# Coverage Matrix', '',
    '| Concept | Domain | Weight | Competency | Objective | LFS200 | External docs | Candidate | Depth | Confidence |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const t of topics) {
    const d = domainOf(competencies, t.domain);
    const external = (t.additional_sources ?? [])
      .filter((r) => (idx.get(r)?.authority_tier ?? 9) <= 3).length;
    lines.push(`| ${esc(t.id)} | ${esc(t.domain)} | ${esc(d?.weight ?? '—')}% | ` +
      `${esc(t.competency)} | ${esc(t.objective_verbatim)} | ${esc(t.coverage_status)} | ` +
      `${external} | ${(t.candidate_evidence ?? []).length} | ${esc(t.required_depth)} | ` +
      `${esc(t.confidence)} |`);
  }
  return lines.join('\n');
}
