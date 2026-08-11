import { competencyKey } from './load.mjs';

export const EXAM_POOL_TOTAL = 1000;
export const EXAM_COUNT = 16;
export const EXAM_SIZE = 60;

// Question count is driven by domain weight and required_depth only.
//
// `importance` is deliberately absent. computeImportance() derives it from
// domain weight and a competencyRefs term that is uniform across this
// dataset, so the stored value is constant within every domain: Linux 2,
// SysAdmin 4, Cloud 2, Security 2, DevOps 1, PM 1 — 151 concepts at 1, 213 at
// 2, 173 at 4, and none at 3 or 5. It is a coarsened restatement of the
// weight it derives from (18%, 16% and 14% all collapse to 2), so using it
// alongside the weight would double-count the weight and add rounding noise.
// See docs/superpowers/specs/2026-08-11-lfca-question-bank-design.md,
// "importance is degenerate".
export const DEPTH_WEIGHT = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 9 };

// A linear 1-2-3-4-5 curve was computed first and rejected: it gave a depth-1
// Cloud concept 2 items while a depth-3 IT Project Management concept got 1.
// That is arithmetically correct — Cloud's 18% over 82 concepts really does
// buy more per concept than PM's 10% over 80 — and it reads as broken. This
// curve makes a depth-1 concept receive exactly one item in every domain,
// which is a property worth being able to state.

export const SUPPLEMENT_WEIGHT = { 1: 0, 2: 1, 3: 2, 4: 2, 5: 2 };

// The owner's two declared weak areas. The supplement is excluded from the
// ten practice exams so those stay exact miniatures of the weight table; it
// is reachable through the drills.
export const WEAK_COMPETENCIES = [
  'System Administration Fundamentals::Networking',
  'Cloud Computing Fundamentals::Networking',
  'DevOps Fundamentals::Containers',
];

// `poolTotal` and `weakCompetencies` are overridable for one reason only:
// a test fixture with a handful of concepts cannot be handed a 1,000-item
// pool, and a fixture carrying 1,000 items is not a fixture. Nothing on the
// production path passes them — the CLIs and every check call these
// functions with no options — so there is no configuration surface here for
// a run to differ on.
export function domainBudget(weight, poolTotal = EXAM_POOL_TOTAL) {
  return weight * (poolTotal / 100);
}

// Hare-quota largest remainder over `weightOf`, with a hard floor of one per
// item. The floor is the coverage proof: every concept is examinable, so
// every concept gets at least one question, and no weighting can drop one to
// zero.
//
// Determinism matters more here than anywhere else in this cycle, because the
// checker re-derives these counts and compares them to what an author wrote.
// Inputs are sorted by id before anything else, and the remainder order
// breaks ties on (fractional part, depth weight, id) so the result never
// depends on the order the caller happened to pass items in.
export function largestRemainder(items, budget, weightOf) {
  const n = items.length;
  if (n === 0) return [];
  if (budget < n) {
    throw new Error(
      `Budget ${budget} is below the floor of one per concept for ${n} concepts`,
    );
  }
  const sorted = [...items].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const weights = sorted.map(weightOf);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const extra = budget - n;
  if (extra === 0 || totalWeight === 0) {
    return sorted.map((it) => ({ id: it.id, count: 1 }));
  }
  const quota = weights.map((w) => (extra * w) / totalWeight);
  const whole = quota.map((q) => Math.floor(q));
  const remaining = extra - whole.reduce((a, b) => a + b, 0);
  const order = quota
    .map((q, i) => ({ frac: q - whole[i], weight: weights[i], id: sorted[i].id, i }))
    .sort((a, b) => b.frac - a.frac || b.weight - a.weight || (a.id < b.id ? -1 : 1));
  for (let k = 0; k < remaining; k += 1) whole[order[k].i] += 1;
  return sorted.map((it, i) => ({ id: it.id, count: 1 + whole[i] }));
}

export function allocateExamPool(dataset, { poolTotal = EXAM_POOL_TOTAL } = {}) {
  const weightSum = dataset.competencies.domains.reduce((a, d) => a + d.weight, 0);
  if (weightSum !== 100) {
    throw new Error(
      `Domain weights sum to ${weightSum}, not 100 — the exam pool would not total ${poolTotal}`,
    );
  }
  const out = new Map();
  for (const domain of dataset.competencies.domains) {
    const concepts = dataset.topics.filter((t) => t.domain === domain.name);
    const allocated = largestRemainder(
      concepts,
      domainBudget(domain.weight, poolTotal),
      (c) => DEPTH_WEIGHT[c.required_depth],
    );
    for (const { id, count } of allocated) out.set(id, count);
  }
  return out;
}

export function allocateSupplement(dataset, { weakCompetencies = WEAK_COMPETENCIES } = {}) {
  const out = new Map();
  for (const t of dataset.topics) {
    const weak = weakCompetencies.includes(competencyKey(t.domain, t.competency));
    out.set(t.id, weak ? SUPPLEMENT_WEIGHT[t.required_depth] : 0);
  }
  return out;
}

// The per-exam composition: how many of each domain's slots make up a single
// 60-question exam. This is the largest-remainder rounding of
// `weight × EXAM_SIZE / 100`, ties broken by higher weight then by the
// domain's order in competencies.domains.
//
// Deliberately does NOT call largestRemainder above, even though both are
// "largest remainder" in spirit and largestRemainder's items need only an
// `id` (domains pass through as `{id: name, weight}`, which would satisfy
// its signature). largestRemainder bakes in a floor of one per item by
// computing `1 + largestRemainderOf(budget - n)` over the *item* weights —
// harmless for per-concept allocation, where the floor is the coverage
// guarantee this cycle depends on, but NOT harmless here: shifting the quota
// by `weight × n / 100` before flooring changes the result. Checked directly
// for this table — reusing largestRemainder(domains, 60, d => d.weight)
// yields System Administration 17 and Security 9, not the pinned 18 and 8 —
// so it is a different, wrong algorithm for this case, not a cosmetic
// difference. examComposition therefore reimplements the floorless
// largest-remainder rounding directly: floor(weight × EXAM_SIZE / 100) for
// every domain, then hand out the EXAM_SIZE-minus-that-sum remainder to the
// domains with the largest fractional part, ties broken by higher weight
// then by domains.indexOf.
export function examComposition(dataset) {
  const domains = dataset.competencies.domains;
  const quotas = domains.map((d) => (d.weight * EXAM_SIZE) / 100);
  const whole = quotas.map((q) => Math.floor(q));
  const remainder = EXAM_SIZE - whole.reduce((a, b) => a + b, 0);
  const order = quotas
    .map((q, i) => ({ frac: q - whole[i], weight: domains[i].weight, i }))
    .sort((a, b) => b.frac - a.frac || b.weight - a.weight || a.i - b.i);
  for (let k = 0; k < remainder; k += 1) whole[order[k].i] += 1;
  return new Map(domains.map((d, i) => [d.name, whole[i]]));
}

export function allocation(dataset, blocks, options = {}) {
  const exam = allocateExamPool(dataset, options);
  const supplement = allocateSupplement(dataset, options);
  const out = new Map();
  for (const t of dataset.topics) {
    const owned = [];
    const member = [];
    for (const b of blocks.values()) {
      if (b.owner === t.id) owned.push(b.anchor);
      else if (b.members.includes(t.id)) member.push(b.anchor);
    }
    out.set(t.id, {
      exam: exam.get(t.id),
      supplement: supplement.get(t.id),
      total: exam.get(t.id) + supplement.get(t.id),
      difficulty: t.required_depth,
      defaultType: t.required_depth <= 2 ? 'recall' : 'application',
      needsDiagnostic: t.required_depth >= 4,
      commandStrings: [...(t.commands ?? [])],
      ownedBlocks: owned,
      memberBlocks: member,
    });
  }
  return out;
}
