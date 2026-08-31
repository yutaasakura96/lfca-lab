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
// that would break the rule. Asserted over the text rather than by running
// anything, so it cannot pass by accident.

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = join(here, '..', '..');
const domainDir = join(appRoot, 'src', 'domain');

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(path));
    else if (entry.isFile() && path.endsWith('.ts')) out.push(path);
  }
  return out;
}

function importsOf(source: string): string[] {
  return [...source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)]
    .map((match) => match[1] as string);
}

const domainFiles = filesUnder(domainDir);

describe('src/domain is pure', () => {
  it('has something in it to check', () => {
    // Guards the rest of this file: an empty directory would make every
    // assertion below pass vacuously.
    expect(domainFiles.length).toBeGreaterThan(0);
  });

  it.each(domainFiles.map((f) => relative(appRoot, f)))('%s imports no I/O', (file) => {
    const forbidden = /^(drizzle|drizzle-orm|pg|postgres|@neondatabase|@vercel\/postgres|node:fs|node:net|node:http)/;
    for (const specifier of importsOf(readFileSync(join(appRoot, file), 'utf8'))) {
      expect(specifier, `${file} reaches for I/O via ${specifier}`).not.toMatch(forbidden);
    }
  });

  it.each(domainFiles.map((f) => relative(appRoot, f)))('%s imports no React', (file) => {
    for (const specifier of importsOf(readFileSync(join(appRoot, file), 'utf8'))) {
      expect(specifier, `${file} imports ${specifier}`).not.toMatch(/^react/);
    }
  });

  it.each(domainFiles.map((f) => relative(appRoot, f)))('%s never reads the clock', (file) => {
    // Time is a parameter. This is what makes "the tab was closed for ninety
    // minutes" a test that runs in a millisecond rather than ninety minutes.
    const source = readFileSync(join(appRoot, file), 'utf8');
    expect(source, `${file} calls Date.now()`).not.toMatch(/\bDate\s*\.\s*now\s*\(/);
    expect(source, `${file} constructs a Date with no argument`).not.toMatch(/\bnew\s+Date\s*\(\s*\)/);
    expect(source, `${file} calls performance.now()`).not.toMatch(/\bperformance\s*\.\s*now\s*\(/);
  });

  it.each(domainFiles.map((f) => relative(appRoot, f)))('%s stays inside the app', (file) => {
    // The bank's tooling is a sibling of this directory, and reaching into it
    // at runtime would make the simulator depend on the build scripts rather
    // than on the database they populate. Tests may read the bank; the domain
    // layer may not.
    for (const specifier of importsOf(readFileSync(join(appRoot, file), 'utf8'))) {
      expect(specifier, `${file} reaches out of app/ via ${specifier}`)
        .not.toMatch(/(^|\/)\.\.\/\.\.\/(tools|questions|exams|data|drills)/);
    }
  });
});
