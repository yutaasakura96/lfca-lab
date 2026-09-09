import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { splitInlineCode, splitOnSeparators } from '../../src/lib/inline-code.ts';
import { loadItems, repoRoot } from '../bank.ts';

describe('splitting a stem into prose and code', () => {
  it('leaves plain prose alone', () => {
    expect(splitInlineCode('Which command lists files?')).toEqual([
      { code: false, text: 'Which command lists files?' },
    ]);
  });

  it('marks a backticked span as code', () => {
    expect(splitInlineCode('Run `ls -la` to list.')).toEqual([
      { code: false, text: 'Run ' },
      { code: true, text: 'ls -la' },
      { code: false, text: ' to list.' },
    ]);
  });

  it('handles several spans', () => {
    expect(splitInlineCode('`-l` and `-a` together').map((s) => s.text))
      .toEqual(['-l', ' and ', '-a', ' together']);
  });

  it('handles a stem that is entirely code', () => {
    expect(splitInlineCode('`systemctl status`')).toEqual([
      { code: true, text: 'systemctl status' },
    ]);
  });

  // A stem ending mid-quote should look slightly wrong, not swallow the rest of
  // the question into a code span that never closes.
  it('keeps an unmatched backtick as literal text', () => {
    expect(splitInlineCode('What does ` do?')).toEqual([
      { code: false, text: 'What does ` do?' },
    ]);
  });

  it('drops empty segments rather than rendering empty elements', () => {
    expect(splitInlineCode('``')).toEqual([]);
    expect(splitInlineCode('`ls`')).toEqual([{ code: true, text: 'ls' }]);
  });

  it('never interprets markup — angle brackets stay text', () => {
    // The output is segments for React to render as elements, so this can only
    // ever become text. Asserted so nobody later "improves" it into HTML.
    const segments = splitInlineCode('Compare <b>bold</b> and `<script>`');
    expect(segments.some((s) => !s.code && s.text.includes('<b>bold</b>'))).toBe(true);
    expect(segments.some((s) => s.code && s.text === '<script>')).toBe(true);
  });

  it('round-trips every character of the original stem', () => {
    for (const stem of ['a `b` c', 'no code', '`only`', 'trailing `', '`a` `b`']) {
      const rebuilt = splitInlineCode(stem)
        .map((s) => (s.code ? `\`${s.text}\`` : s.text))
        .join('');
      expect(rebuilt, stem).toBe(stem);
    }
  });
});

// ---------------------------------------------------------------------------

describe('offering break opportunities inside a code span', () => {
  it('breaks a path after each separator, not inside a segment', () => {
    expect(splitOnSeparators('/proc/sys/net/ipv4/ip_local_port_range')).toEqual([
      '/',
      'proc/',
      'sys/',
      'net/',
      'ipv4/',
      'ip_local_port_range',
    ]);
  });

  // A run of separators is one opportunity, not several. Breaking between the
  // `:` and the `/` of a scheme would put `https:` at the end of a line, which
  // reads as a different URL rather than as a wrapped one.
  it('keeps a run of separators together', () => {
    expect(splitOnSeparators('https://example.com/orders/42')).toEqual([
      'https://',
      'example.',
      'com/',
      'orders/',
      '42',
    ]);
  });

  it('breaks a bind mount at its colon as well as its slashes', () => {
    expect(splitOnSeparators('/host/path:/path/in/container')).toEqual([
      '/',
      'host/',
      'path:/',
      'path/',
      'in/',
      'container',
    ]);
  });

  // The case the CSS backstop exists for: no separator anywhere, so this
  // function has nothing to offer and `overflow-wrap` is the only thing that
  // keeps it inside its card.
  it('returns a separator-free identifier whole', () => {
    expect(splitOnSeparators('KbdInteractiveAuthentication')).toEqual([
      'KbdInteractiveAuthentication',
    ]);
  });

  it('does not strip a trailing separator or invent an empty run after it', () => {
    expect(splitOnSeparators('/etc/')).toEqual(['/', 'etc/']);
    expect(splitOnSeparators('-')).toEqual(['-']);
  });

  it('leaves short code alone', () => {
    expect(splitOnSeparators('ls')).toEqual(['ls']);
    expect(splitOnSeparators('')).toEqual([]);
  });

  // The runs are rendered with `<wbr>` between them and nothing else, so
  // anything lost here is a character lost from a command on screen.
  it('round-trips every character it was given', () => {
    for (const code of [
      '/usr/lib/systemd/system/nginx.service',
      'https://example.com/orders/42',
      'docker run -v pgdata:/var/lib/postgresql/data',
      'ls -la',
      '--dry-run',
      'a',
      '...',
    ]) {
      expect(splitOnSeparators(code).join(''), code).toBe(code);
    }
  });
});

// ---------------------------------------------------------------------------

// The two halves of the fix, checked against the real bank rather than against
// the five questions the ticket happened to list — a sixth turned up here,
// `/run/systemd/resolve/io.systemd.Resolve` at 39 characters, longer than any
// of them.
//
// `<wbr>` handles anything with a separator in it. What is left over is a
// genuine identifier with nowhere to break, and the CSS backstop is the only
// thing that keeps one of those inside a 375px option card. Both are asserted,
// because either alone leaves a real question in the bank overflowing.
describe('the bank against the way its code is broken', () => {
  const words = loadItems().flatMap((item) =>
    [item.stem, ...item.options.flatMap((option) => [option.text, option.why])]
      .flatMap((text) => splitInlineCode(text).filter((s) => s.code))
      .flatMap((segment) => segment.text.split(/\s+/))
      .filter((word) => word.length > 0)
      .map((word) => ({ id: item.id, word })),
  );

  it('has code to measure', () => {
    expect(words.length).toBeGreaterThan(5000);
  });

  // Every break opportunity a separator offers is taken. A run left holding one
  // is a path that would break in the middle of a segment instead of at its
  // slash — which is the readability cost the ticket weighed the fix against.
  it('leaves no unused break opportunity inside any code run', () => {
    const unused = words
      .flatMap(({ id, word }) => splitOnSeparators(word).map((run) => ({ id, run })))
      .filter(({ run }) => /[/:.-]/.test(run.replace(/[/:.-]+$/, '')))
      .map(({ id, run }) => `${id}: ${run}`);

    expect(unused).toEqual([]);
  });

  // If this ever finds nothing, the CSS rule below has stopped being
  // load-bearing and the next person to read it deserves to know that.
  it('still contains a separator-free identifier long enough to need the backstop', () => {
    const unbreakable = words
      .flatMap(({ word }) => splitOnSeparators(word))
      .filter((run) => run.length >= 20);

    expect(unbreakable).toContain('KbdInteractiveAuthentication');
  });

  it('gives code a wrapping backstop in the stylesheet', () => {
    const base = readFileSync(join(repoRoot, 'app', 'src', 'styles', 'base.css'), 'utf8');
    const rule = base.slice(base.indexOf('code, .code {'));

    expect(rule.slice(0, rule.indexOf('}'))).toContain('overflow-wrap: anywhere');
  });
});
