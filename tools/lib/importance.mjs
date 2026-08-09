const MIN_WEIGHT = 10;
const MAX_WEIGHT = 30;

/**
 * Importance is derived, never hand-set, so it stays reproducible and auditable.
 * normalize(weight) maps the 10..30 domain-weight range onto 0..1.
 */
export function computeImportance(domainWeight, competencyRefs) {
  const normalized = (domainWeight - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT);
  const raw = normalized * 3 + Math.min(competencyRefs, 2);
  return Math.min(5, Math.max(1, Math.round(raw)));
}
