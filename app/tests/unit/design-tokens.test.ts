import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// `design/tokens.css` is the source of truth for every visual value in this
// product, and the app's copy is exactly that — a copy. "Copied verbatim" is a
// claim that stays true right up until someone nudges one value in the app
// because it was closer to hand, at which point the design system quietly stops
// describing the thing that ships.
//
// So it is asserted rather than trusted. Divergence fails a suite here, in
// seconds, instead of being noticed months later by comparing screenshots.
//
// The same applies to `base.css`: it is the component layer — the buttons, the
// chips, the clock states, the sixty-tile grid — and every value in it already
// resolves to a token. Rewriting it in the app would be exactly the
// improvisation the design system exists to prevent.

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = join(here, '..', '..');
const repoRoot = join(appRoot, '..');

const COPIES = [
  { name: 'tokens.css', from: join(repoRoot, 'design'), to: join(appRoot, 'src', 'styles') },
  { name: 'base.css', from: join(repoRoot, 'design'), to: join(appRoot, 'src', 'styles') },
];

describe('the design system is copied, not reinterpreted', () => {
  it.each(COPIES)('$name is byte-identical to the one in design/', ({ name, from, to }) => {
    const source = readFileSync(join(from, name));
    const copy = readFileSync(join(to, name));

    // Compared as bytes, not as text: a stray line ending or a trimmed final
    // newline is drift too, and a text comparison would forgive it.
    expect(
      copy.equals(source),
      `app/src/styles/${name} has drifted from design/${name}. `
        + 'The design directory is the source of truth — copy it over, do not edit the copy.',
    ).toBe(true);
  });

  it('has something to compare — an empty or missing token file must not pass quietly', () => {
    for (const { name, to } of COPIES) {
      expect(readFileSync(join(to, name), 'utf8').length, name).toBeGreaterThan(1000);
    }
  });

  it('defines the dark theme by attribute, which is what the shell sets', () => {
    // The inline theme script sets `data-theme` on the document element. If the
    // token file ever moved to a different mechanism, that script would set an
    // attribute nothing reads and the toggle would silently stop working.
    const tokens = readFileSync(join(appRoot, 'src', 'styles', 'tokens.css'), 'utf8');
    expect(tokens).toContain('[data-theme="dark"]');
  });
});
