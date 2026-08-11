// Determinism is a hard requirement, not a nicety: `npm run build-exams` must
// leave no diff on a second run, exactly as `npm run generate` does not. Every
// randomised decision in assembly is therefore seeded from a fixed string —
// never from Math.random, never from the clock.

// FNV-1a, 32-bit. Chosen for being short enough to read and verify by eye;
// nothing here needs cryptographic quality, only reproducibility.
export function hashSeed(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates, seeded. Returns a new array; the caller's list is untouched.
export function shuffled(list, seed) {
  const out = [...list];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// An exactly-balanced assignment of n slots across `buckets`, shuffled.
//
// This is how answer position is decided. Building the multiset first and
// shuffling it — rather than picking a bucket at random per slot — makes the
// balance exact by construction rather than probable, so
// `q-answer-position-balance` cannot fail. Shuffling is what stops the result
// being the giveaway cycle A, B, C, D, A, B, C, D.
export function balancedPositions(n, buckets, seed) {
  const pool = [];
  for (let i = 0; i < n; i += 1) pool.push(i % buckets);
  return shuffled(pool, seed);
}
