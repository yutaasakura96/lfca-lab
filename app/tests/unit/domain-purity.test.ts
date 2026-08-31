import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The pure layer's rule, asserted rather than trusted.
//
// "Anything that decides a number is a pure function" is the load-bearing
// convention of this app: it is what makes the numbers testable without
// standing up a database, and what keeps the one irreplaceable figure in this
// project — the first-attempt score — computable in a test.
//
// A convention that is only written down erodes. This is the same technique the
// bank's own suite uses to prove `validate` never reaches the 1,150-item
// loader: read the source, look at what it imports, and fail on the imports
// that would break the rule.
//
// The rule enforced here is stricter than a blocklist, and deliberately so. A
// list of forbidden packages only catches the violations someone thought of;
// the first review of this file found that `import { db } from '../db/client.ts'`
// sailed past every one of them. So the rule is an **allowlist**: a module in
// the pure layer may import its own siblings and nothing else. A type-only
// import is exempt, because `verbatimModuleSyntax` erases it and a type cannot
// perform I/O.

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = join(here, '..', '..');
const srcDir = join(appRoot, 'src');
const domainDir = join(srcDir, 'domain');

interface Module {
  /** Path relative to `app/`, for readable test names. */
  file: string;
  /** Source with comments removed, so prose about `Date.now()` is not a finding. */
  code: string;
  /** Every specifier the module imports for its *values*. */
  valueImports: string[];
}

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(path));
    else if (entry.isFile() && path.endsWith('.ts')) out.push(path);
  }
  return out;
}

/**
 * Strip comments before scanning. Without this the file's own explanation of
 * why `Date.now()` is banned reads as a call to `Date.now()`.
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/**
 * Specifiers imported for their values. `import type` is excluded: it is erased
 * at compile time and cannot execute anything.
 *
 * Covers the four forms that actually load a module — static, side-effect,
 * dynamic and `require` — because catching only the first would leave three
 * ways to break the rule while the suite stayed green.
 */
function valueImportsOf(code: string): string[] {
  const out: string[] = [];
  const push = (m: RegExpMatchArray) => out.push(m[1] as string);

  // import x from 'y' / import {x} from 'y' / export {x} from 'y' — but not `import type`.
  for (const m of code.matchAll(/\b(?:import|export)\s+(?!type\s)[^'";]*?from\s*['"]([^'"]+)['"]/g)) push(m);
  // import 'y'
  for (const m of code.matchAll(/\bimport\s*['"]([^'"]+)['"]/g)) push(m);
  // import('y')
  for (const m of code.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]/g)) push(m);
  // require('y')
  for (const m of code.matchAll(/\brequire\s*\(\s*['"]([^'"]+)['"]/g)) push(m);

  return out;
}

function read(dir: string): Module[] {
  return filesUnder(dir).map((path) => {
    const code = stripComments(readFileSync(path, 'utf8'));
    return { file: relative(appRoot, path), code, valueImports: valueImportsOf(code) };
  });
}

const domainModules = read(domainDir);
const srcModules = read(srcDir);

describe('src/domain is pure', () => {
  it('has something in it to check', () => {
    // Guards every assertion below: an empty directory would pass vacuously.
    expect(domainModules.length).toBeGreaterThan(0);
  });

  it.each(domainModules.map((m) => [m.file, m] as const))(
    '%s imports nothing but its own siblings',
    (_file, module) => {
      // An allowlist, not a blocklist. Anything that is not a relative sibling
      // — a package, a Node built-in, or a reach up into src/db — is a
      // violation, including the ones nobody has thought of yet.
      for (const specifier of module.valueImports) {
        expect(specifier, `${module.file} imports ${specifier} for its value`).toMatch(/^\.\//);
      }
    },
  );

  it.each(domainModules.map((m) => [m.file, m] as const))(
    '%s is deterministic — no clock, no randomness, no environment',
    (_file, module) => {
      // Same input, same output, forever. Time is a parameter; so is any
      // shuffle seed. `select.ts` is the module this exists for: its tie-break
      // is random by design, and that randomness belongs to its caller.
      const banned: [RegExp, string][] = [
        [/\bDate\s*\.\s*now\s*\(/, 'Date.now()'],
        [/\bnew\s+Date\s*\(\s*\)/, 'new Date() with no argument'],
        [/\bperformance\s*\.\s*now\s*\(/, 'performance.now()'],
        [/\bMath\s*\.\s*random\s*\(/, 'Math.random()'],
        [/\bcrypto\s*\.\s*randomUUID\s*\(/, 'crypto.randomUUID()'],
        [/\bprocess\s*\.\s*env\b/, 'process.env'],
      ];
      for (const [pattern, what] of banned) {
        expect(module.code, `${module.file} uses ${what}`).not.toMatch(pattern);
      }
    },
  );
});

describe('the app does not reach into the bank at runtime', () => {
  // Scoped to all of src/, not just src/domain — the criterion is about
  // everything the app runs, and this guard should grow as src/ does. Tests may
  // read the bank; the shipped code may not. Content reaches the app through
  // the seed and the database, never by importing the build tooling.
  it('has source to check', () => {
    expect(srcModules.length).toBeGreaterThan(0);
  });

  it.each(srcModules.map((m) => [m.file, m] as const))('%s stays inside app/', (_file, module) => {
    for (const specifier of module.valueImports) {
      expect(specifier, `${module.file} reaches the bank via ${specifier}`)
        .not.toMatch(/\.\.\/(?:\.\.\/)*(?:tools|questions|exams|data|drills)(?:\/|$)/);
    }
  });
});
