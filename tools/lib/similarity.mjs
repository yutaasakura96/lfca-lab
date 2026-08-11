// Thresholds are named constants with a test asserting their values, not
// magic numbers buried in a check. Changing one is then a reviewed change to
// a tested constant rather than an edit nobody notices.
export const NEAR_DUPLICATE_ERROR = 0.85;
export const NEAR_DUPLICATE_WARN = 0.7;

// A code span is replaced wholesale rather than tokenised, so two items that
// differ only in which command they name still read as structurally the same
// question. That is the point: "which option of X lists addresses" asked
// twice about two commands is two items, but "which option of X does Y"
// asked twice about the same command with a synonym swapped is one.
const CODE_TOKEN = 'xcodespanx';

export const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this',
  'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'do', 'does', 'did', 'doing', 'of', 'in', 'on', 'at', 'to', 'for', 'from',
  'with', 'by', 'as', 'into', 'over', 'under', 'which', 'what', 'who', 'whom',
  'whose', 'when', 'where', 'why', 'how', 'you', 'your', 'it', 'its', 'they',
  'their', 'he', 'she', 'him', 'her', 'will', 'would', 'can', 'could',
  'should', 'may', 'might', 'must', 'shall', 'not', 'no', 'so', 'such',
  'only', 'also', 'most', 'more', 'least', 'less', 'following', 'best',
  'describes', 'statement', 'statements', 'true', 'false', 'correct',
]);

export function normalizeStem(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ` ${CODE_TOKEN} `)
    .replace(/`[^`]*`/g, ` ${CODE_TOKEN} `)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// The trailing-s rule is deliberately conservative: it only fires on words
// longer than three characters, so `dns`, `ips` and `os` survive intact.
export function tokens(text) {
  return normalizeStem(text)
    .split(' ')
    .filter((w) => w && !STOPWORDS.has(w))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
}

export function shingles(list, n = 3) {
  const out = new Set();
  for (let i = 0; i + n <= list.length; i += 1) out.add(list.slice(i, i + n).join(' '));
  return out;
}

export function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const x of a) if (b.has(x)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

// Two measures, because each misses what the other catches. Token-set
// Jaccard sees a reworded question with the same vocabulary and is blind to
// word order; 3-gram shingles see a copied phrase and are blind to a
// reordered but otherwise identical stem. Taking the max means either
// signal alone is enough to flag a pair for a human to look at.
export function similarity(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  return Math.max(
    jaccard(new Set(ta), new Set(tb)),
    jaccard(shingles(ta), shingles(tb)),
  );
}
