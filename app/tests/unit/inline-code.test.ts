import { describe, expect, it } from 'vitest';
import { splitInlineCode } from '../../src/lib/inline-code.ts';

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
