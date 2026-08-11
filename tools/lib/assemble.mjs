import { EXAM_COUNT, EXAM_SIZE, examComposition } from './allocation.mjs';
import { balancedPositions, hashSeed } from './rng.mjs';
import { EXAM_HEADER_NOTICE } from './question-checks.mjs';

const DEPTH_TOLERANCE = 2;

const GENERATED_HEADER = [
  '<!-- GENERATED FILE — do not edit.',
  '     Rebuilt by `npm run build-exams` from questions/**.',
  '     Editing this file by hand will be overwritten on the next build. -->',
].join('\n');

// Domains are partitioned independently. Each exam's per-domain count is
// fixed by the per-exam composition table (examComposition, in
// allocation.mjs — the largest-remainder rounding of weight × EXAM_SIZE /
// 100), and no item ever moves between domains, so the hard problem
// decomposes into six smaller ones.

function conflictKeys(item) {
  const keys = [`concept:${item.concept_id}`];
  if (item.comparison_block) keys.push(`block:${item.comparison_block}`);
  return keys;
}

// Deterministic greedy placement, most-constrained item first, into the
// emptiest exam whose depth budget still wants this depth. There is no
// randomness: ordering is by (conflict-group size desc, depth desc, id asc),
// and ties among candidate exams break on index.
function placeDomain(items, slots, depthTargets) {
  const exams = Array.from({ length: EXAM_COUNT }, () => ({ items: [], keys: new Set(), depths: new Map() }));

  const groupSize = new Map();
  for (const item of items) {
    for (const key of conflictKeys(item)) {
      groupSize.set(key, (groupSize.get(key) ?? 0) + 1);
    }
  }
  const pressure = (item) => Math.max(...conflictKeys(item).map((k) => groupSize.get(k)));

  const ordered = [...items].sort(
    (a, b) => pressure(b) - pressure(a)
      || b.difficulty - a.difficulty
      || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );

  for (const item of ordered) {
    const keys = conflictKeys(item);
    const candidates = exams
      .map((exam, index) => ({ exam, index }))
      .filter(({ exam }) => exam.items.length < slots)
      .filter(({ exam }) => keys.every((k) => !exam.keys.has(k)));

    if (candidates.length === 0) {
      throw new Error(
        `Assembler could not place ${item.id}: every exam is either full or already carries `
        + `${keys.join(' or ')}. This is a real infeasibility, not a tuning problem — the bank `
        + `cannot be partitioned under the stated constraints.`,
      );
    }

    // Prefer an exam that is still under its depth target for this depth,
    // then the emptiest, then the lowest index.
    const wants = ({ exam }) => (exam.depths.get(item.difficulty) ?? 0) < (depthTargets.get(item.difficulty) ?? 0);
    const pool = candidates.some(wants) ? candidates.filter(wants) : candidates;
    pool.sort((a, b) => a.exam.items.length - b.exam.items.length || a.index - b.index);

    const chosen = pool[0].exam;
    chosen.items.push(item);
    for (const k of keys) chosen.keys.add(k);
    chosen.depths.set(item.difficulty, (chosen.depths.get(item.difficulty) ?? 0) + 1);
  }

  for (const [depth, target] of depthTargets) {
    for (let e = 0; e < exams.length; e += 1) {
      const got = exams[e].depths.get(depth) ?? 0;
      if (Math.abs(got - target) > DEPTH_TOLERANCE) {
        throw new Error(
          `Assembler produced exam ${e + 1} with ${got} depth-${depth} items against a target of `
          + `${target}, outside the tolerance of ${DEPTH_TOLERANCE}. Widening DEPTH_TOLERANCE is a `
          + `reviewed change to a tested constant, not something to do to make a build pass.`,
        );
      }
    }
  }

  return exams.map((e) => e.items);
}

export function partitionIntoExams(ctx) {
  const byId = new Map(ctx.dataset.topics.map((t) => [t.id, t]));
  const composition = examComposition(ctx.dataset);
  const pool = ctx.items.filter((i) => i.pool === 'exam');
  const perExam = Array.from({ length: EXAM_COUNT }, () => []);
  const unused = [];

  for (const domain of ctx.dataset.competencies.domains) {
    const slots = composition.get(domain.name);
    const need = slots * EXAM_COUNT;
    const domainItems = pool
      .filter((i) => byId.get(i.concept_id)?.domain === domain.name)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

    if (domainItems.length < need) {
      throw new Error(
        `${domain.name} holds ${domainItems.length} exam-pool items but ${EXAM_COUNT} exams need `
        + `${need} (${slots} per exam); run npm run check-bank and fix q-domain-distribution first.`,
      );
    }

    // 60 does not divide the weight table into integers, so the per-exam
    // composition is a rounding and EXAM_SIZE * EXAM_COUNT (960) is
    // deliberately less than the 1,000-item pool. Some items therefore sit
    // out every paper.
    //
    // Which ones has to be deterministic AND unbiased. Taking the first
    // `need` by id would make every sit-out come from the same tail of the
    // alphabet, so one stretch of concepts would be silently unexaminable. A
    // strided selection spreads the sit-outs evenly across the sorted range.
    const skip = domainItems.length - need;
    const sitOut = new Set();
    if (skip > 0) {
      const stride = domainItems.length / skip;
      for (let k = 0; k < skip; k += 1) {
        sitOut.add(Math.min(domainItems.length - 1, Math.floor((k + 0.5) * stride)));
      }
      // Floor collisions can leave the set short. Fill deterministically from
      // the end so the count is exact regardless.
      for (let j = domainItems.length - 1; sitOut.size < skip && j >= 0; j -= 1) sitOut.add(j);
    }

    const selected = [];
    domainItems.forEach((item, index) => {
      if (sitOut.has(index)) unused.push(item);
      else selected.push(item);
    });

    const depthTargets = new Map();
    for (const depth of [1, 2, 3, 4, 5]) {
      const share = selected.filter((i) => i.difficulty === depth).length / selected.length;
      depthTargets.set(depth, Math.round(slots * share));
    }
    const placed = placeDomain(selected, slots, depthTargets);
    placed.forEach((items, e) => perExam[e].push(...items));
  }

  const exams = perExam.map((items, e) => ({
    name: `exam-${String(e + 1).padStart(2, '0')}`,
    // Presentation order is deterministic and does not follow the domain
    // grouping the partition happened to build, so an exam does not read as
    // six blocks by subject.
    items: [...items].sort((a, b) => (a.id < b.id ? -1 : 1)),
  }));

  return { exams, unused: unused.sort((a, b) => (a.id < b.id ? -1 : 1)) };
}

export function assignPositions(items, seedText) {
  const positions = balancedPositions(items.length, 4, hashSeed(seedText));
  return items.map((item, n) => ({ id: item.id, position: positions[n] }));
}

function letter(n) {
  return ['A', 'B', 'C', 'D'][n];
}

// The key's display position comes from `position`; the three distractors
// fill the remaining slots in their bank order. Authors never choose a
// position, so the bank carries no positional bias for the assembler to
// inherit.
function orderedOptions(item, position) {
  const key = item.options.find((o) => o.correct === true);
  const distractors = item.options.filter((o) => o.correct !== true);
  const out = [];
  let d = 0;
  for (let slot = 0; slot < 4; slot += 1) {
    out.push(slot === position ? key : distractors[d++]);
  }
  return out;
}

export function renderExam(exam, ctx, positions) {
  const posById = new Map(positions.map((p) => [p.id, p.position]));
  const lines = [GENERATED_HEADER, '', `# LFCA practice exam ${exam.name.slice(-2)}`, ''];
  lines.push(EXAM_HEADER_NOTICE, '');
  lines.push(`Answers: [${exam.name}-answers.md](${exam.name}-answers.md)`, '');
  lines.push('---', '');
  exam.items.forEach((item, n) => {
    lines.push(`### ${n + 1}.`, '', item.stem, '');
    orderedOptions(item, posById.get(item.id)).forEach((o, slot) => {
      lines.push(`- **${letter(slot)}.** ${o.text}`);
    });
    lines.push('');
  });
  return `${lines.join('\n')}\n`;
}

export function renderAnswerKey(exam, ctx, positions) {
  const posById = new Map(positions.map((p) => [p.id, p.position]));
  const byId = new Map(ctx.dataset.topics.map((t) => [t.id, t]));
  const lines = [GENERATED_HEADER, '', `# LFCA practice exam ${exam.name.slice(-2)} — answers`, ''];
  exam.items.forEach((item, n) => {
    const position = posById.get(item.id);
    const ordered = orderedOptions(item, position);
    const topic = byId.get(item.concept_id);
    lines.push(`### ${n + 1}. ${letter(position)}`, '');
    lines.push(`*${item.concept_id} · ${topic.domain} :: ${topic.competency} · depth ${item.difficulty} · ${item.type}*`, '');
    if (item.waived_source) {
      lines.push('*No primary documentation source for this concept — the answer reflects consensus practice, not citable fact.*', '');
    }
    lines.push(item.rationale, '');
    ordered.forEach((o, slot) => {
      lines.push(`- **${letter(slot)}.** ${o.correct ? 'Correct. ' : ''}${o.why}`);
    });
    lines.push('');
    lines.push(`Study it: [${item.guide_anchor}](../study-guide/${item.guide_anchor})`, '');
  });
  return `${lines.join('\n')}\n`;
}

export function renderDrill(drill, ctx, positions) {
  const posById = new Map(positions.map((p) => [p.id, p.position]));
  const lines = [GENERATED_HEADER, '', `# Drill — ${drill.title}`, ''];
  lines.push(`${drill.items.length} question(s), every question in the bank for this scope, in concept order.`, '');
  lines.push('Answers follow each question, so this is study material rather than a timed test.', '');
  lines.push('---', '');
  drill.items.forEach((item, n) => {
    const position = posById.get(item.id);
    const ordered = orderedOptions(item, position);
    lines.push(`### ${n + 1}.`, '', item.stem, '');
    ordered.forEach((o, slot) => lines.push(`- **${letter(slot)}.** ${o.text}`));
    lines.push('', `**Answer: ${letter(position)}.** ${item.rationale}`, '');
    ordered.forEach((o, slot) => {
      if (!o.correct) lines.push(`- ${letter(slot)} is wrong: ${o.why}`);
    });
    lines.push('');
  });
  return `${lines.join('\n')}\n`;
}

export function buildAll(ctx) {
  const byId = new Map(ctx.dataset.topics.map((t) => [t.id, t]));
  const { exams, unused } = partitionIntoExams(ctx);
  const documents = [];
  const examIndex = [];

  for (const exam of exams) {
    const positions = assignPositions(exam.items, exam.name);
    examIndex.push({ name: exam.name, items: positions });
    documents.push({ name: `exams/${exam.name}.md`, kind: 'exam', text: renderExam(exam, ctx, positions) });
    documents.push({ name: `exams/${exam.name}-answers.md`, kind: 'answers', text: renderAnswerKey(exam, ctx, positions) });
  }

  const drillSpecs = [];
  for (const domain of ctx.dataset.competencies.domains) {
    for (const competency of domain.competencies) {
      const items = ctx.items.filter((i) => {
        const t = byId.get(i.concept_id);
        return t && t.domain === domain.name && t.competency === competency.name;
      });
      if (items.length === 0) continue;
      drillSpecs.push({
        name: `by-competency/${domain.file.replace(/\.json$/, '')}-${competency.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        title: `${domain.name} :: ${competency.name}`,
        items,
      });
    }
    const domainItems = ctx.items.filter((i) => byId.get(i.concept_id)?.domain === domain.name);
    drillSpecs.push({
      name: `by-domain/${domain.file.replace(/\.json$/, '')}`,
      title: domain.name,
      items: domainItems,
    });
  }
  const weakItems = ctx.items.filter((i) => {
    const t = byId.get(i.concept_id);
    return t && ['System Administration Fundamentals::Networking',
      'Cloud Computing Fundamentals::Networking',
      'DevOps Fundamentals::Containers'].includes(`${t.domain}::${t.competency}`);
  });
  drillSpecs.push({ name: 'weak-areas', title: 'Networking and containers', items: weakItems });

  const drillIndex = [];
  for (const spec of drillSpecs) {
    const items = [...spec.items].sort((a, b) => (a.id < b.id ? -1 : 1));
    const positions = assignPositions(items, `drill-${spec.name}`);
    drillIndex.push({ name: spec.name, items: positions });
    documents.push({
      name: `drills/${spec.name}.md`,
      kind: 'drill',
      text: renderDrill({ ...spec, items }, ctx, positions),
    });
  }

  return { exams: examIndex, drills: drillIndex, documents, unused: unused.map((i) => i.id) };
}
