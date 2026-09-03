import { describe, expect, it } from 'vitest';
import {
  OPTION_ROLE_LABEL,
  REVIEW_FILTERS,
  countByFilter,
  domainBreakdown,
  formatElapsed,
  matchesFilter,
  optionRole,
  passBar,
  timeUsedSeconds,
  verdictOf,
  verdictSummary,
  type ReviewedQuestion,
} from '../../src/domain/review.ts';
import { PASS_RATIO, passMark } from '../../src/domain/score.ts';
import { DOMAINS } from '../../src/domain/weights.ts';

function q(over: Partial<ReviewedQuestion> = {}): ReviewedQuestion {
  return { domain: 'linux', verdict: 'correct', flagged: false, ...over };
}

describe('what one question scored', () => {
  it('is correct only when the sitting recorded it correct', () => {
    expect(verdictOf({ optionRef: 'o2', isCorrect: true })).toBe('correct');
  });

  it('is incorrect when an option was chosen and it was wrong', () => {
    expect(verdictOf({ optionRef: 'o2', isCorrect: false })).toBe('incorrect');
  });

  it('is unanswered when no option was chosen, flag or no flag', () => {
    expect(verdictOf({ optionRef: null, isCorrect: null })).toBe('unanswered');
  });

  it('agrees with the submit statement on a row that recorded no correctness', () => {
    // `count(*) WHERE a.is_correct` counts neither false nor null. A row with an
    // option but no recorded correctness should not exist, and if one ever does
    // it must read here exactly as it was scored — not correct.
    expect(verdictOf({ optionRef: 'o2', isCorrect: null })).toBe('incorrect');
  });
});

describe('the filter row', () => {
  const sitting: ReviewedQuestion[] = [
    q({ verdict: 'correct' }),
    q({ verdict: 'correct', flagged: true }),
    q({ verdict: 'incorrect' }),
    q({ verdict: 'unanswered', flagged: true }),
  ];

  it('counts incorrect as everything that did not earn the mark', () => {
    // The decision this screen turns on: a blank cost a mark exactly as a wrong
    // answer did, so hiding it from the default view would hide a miss.
    expect(countByFilter(sitting).incorrect).toBe(2);
  });

  it('leaves correct and incorrect summing to the whole sitting', () => {
    const counts = countByFilter(sitting);
    expect(counts.correct + counts.incorrect).toBe(sitting.length);
    expect(counts.all).toBe(sitting.length);
  });

  it('counts flagged across every verdict, because flagging is orthogonal', () => {
    expect(countByFilter(sitting).flagged).toBe(2);
  });

  it('shows a question under exactly the filters that claim it', () => {
    const blank = q({ verdict: 'unanswered', flagged: true });
    expect(REVIEW_FILTERS.filter((f) => matchesFilter(blank, f))).toEqual([
      'incorrect',
      'flagged',
      'all',
    ]);
  });

  it('counts nothing in an empty sitting rather than failing', () => {
    expect(countByFilter([])).toEqual({ incorrect: 0, correct: 0, flagged: 0, all: 0 });
  });
});

describe('the by-domain breakdown', () => {
  const sitting: ReviewedQuestion[] = [
    q({ domain: 'sysadmin', verdict: 'correct' }),
    q({ domain: 'sysadmin', verdict: 'correct' }),
    q({ domain: 'sysadmin', verdict: 'incorrect' }),
    q({ domain: 'sysadmin', verdict: 'unanswered' }),
    q({ domain: 'linux', verdict: 'correct' }),
  ];

  it('reports correct against total, per domain', () => {
    const rows = domainBreakdown(sitting);
    expect(rows.find((r) => r.domain === 'sysadmin')).toMatchObject({ correct: 2, total: 4 });
  });

  it('counts a blank against the domain, never out of its total', () => {
    // The alternative — dropping unanswered from the denominator — would make a
    // domain look stronger the more of it was skipped.
    expect(domainBreakdown(sitting).find((r) => r.domain === 'sysadmin')?.total).toBe(4);
  });

  it('orders the domains heaviest first, as every other screen does', () => {
    const all = DOMAINS.map((domain) => q({ domain }));
    expect(domainBreakdown(all).map((r) => r.domain)).toEqual([...DOMAINS]);
  });

  it('omits a domain the paper never asked, rather than showing it as 0 of 0', () => {
    expect(domainBreakdown(sitting).map((r) => r.domain)).toEqual(['sysadmin', 'linux']);
  });

  it('meets the mark at exactly the pass ratio and not below it', () => {
    const four = (correct: number) =>
      domainBreakdown([
        ...Array.from({ length: correct }, () => q({ domain: 'pm', verdict: 'correct' })),
        ...Array.from({ length: 4 - correct }, () => q({ domain: 'pm', verdict: 'incorrect' })),
      ])[0];

    expect(four(3)?.meetsMark, '3 of 4 is exactly 75%').toBe(true);
    expect(four(2)?.meetsMark, '2 of 4 is below').toBe(false);
  });

  it('carries the exam weight so the card can say what the domain is worth', () => {
    expect(domainBreakdown(sitting).find((r) => r.domain === 'sysadmin')?.weightPercent).toBe(30);
  });
});

describe('the pass bar', () => {
  it('fills to the score and ticks at the pass ratio', () => {
    const bar = passBar(45, 60);
    expect(bar.fillPercent).toBe(75);
    expect(bar.tickPercent).toBe(PASS_RATIO * 100);
  });

  it('puts the tick where the pass mark actually is, at every length', () => {
    for (const length of [40, 60]) {
      const bar = passBar(0, length);
      // The tick claims to mark the pass. If it drifts from `passMark`, it is
      // drawing a line the score is not compared against.
      expect(Math.ceil((bar.tickPercent / 100) * length), `length ${length}`).toBe(
        passMark(length),
      );
    }
  });

  it('never draws outside the track', () => {
    expect(passBar(0, 60).fillPercent).toBe(0);
    expect(passBar(60, 60).fillPercent).toBe(100);
  });
});

describe('the verdict chip', () => {
  it('says how far short a failing sitting fell', () => {
    expect(verdictSummary(41, 60)).toEqual({ tone: 'incorrect', text: '4 short of the pass mark' });
  });

  it('reads singular when it fell one short', () => {
    expect(verdictSummary(44, 60).text).toBe('1 short of the pass mark');
  });

  it('says so plainly on the mark itself', () => {
    expect(verdictSummary(45, 60)).toEqual({ tone: 'correct', text: 'Passed, on the mark' });
  });

  it('says how much was to spare above it', () => {
    expect(verdictSummary(46, 60)).toEqual({ tone: 'correct', text: 'Passed with 1 to spare' });
  });

  it('refuses a score that did not come from this sitting', () => {
    expect(() => verdictSummary(61, 60)).toThrow();
  });
});

describe('how long the sitting took', () => {
  it('reads mm:ss under an hour', () => {
    expect(formatElapsed(0)).toBe('00:00');
    expect(formatElapsed(61)).toBe('01:01');
    expect(formatElapsed(3599)).toBe('59:59');
  });

  it('grows an hours field rather than counting past sixty minutes', () => {
    expect(formatElapsed(3600)).toBe('1:00:00');
    expect(formatElapsed(4582)).toBe('1:16:22');
  });

  it('never reads negative, whatever two timestamps say', () => {
    // Clock skew between the row's `started_at` and `submitted_at` is the
    // server's own, so this should not arise — but a negative duration on a
    // score card would be believed as readily as a positive one.
    expect(formatElapsed(-5)).toBe('00:00');
  });
});

describe('one option row', () => {
  const right = { ref: 'o2', correct: true };
  const wrong = { ref: 'o3', correct: false };

  it('says when the correct option is also the one chosen', () => {
    expect(optionRole(right, 'o2')).toBe('correct-chosen');
    expect(OPTION_ROLE_LABEL[optionRole(right, 'o2')]).toBe('Correct · your answer');
  });

  it('names the correct option on a question answered wrongly', () => {
    expect(optionRole(right, 'o3')).toBe('correct');
  });

  it('names the chosen option on a question answered wrongly', () => {
    expect(optionRole(wrong, 'o3')).toBe('chosen-wrong');
    expect(OPTION_ROLE_LABEL[optionRole(wrong, 'o3')]).toBe('Your answer');
  });

  it('claims nothing about the ones nobody chose', () => {
    expect(optionRole(wrong, 'o2')).toBe('not-correct');
    expect(OPTION_ROLE_LABEL[optionRole(wrong, 'o2')]).toBe('Not correct');
  });

  it('leaves an unanswered question with a correct option and three neutrals', () => {
    // The ticket's rule, at the level it is actually enforced: with nothing
    // chosen, no row may claim to be anybody's answer.
    expect(optionRole(right, null)).toBe('correct');
    expect(optionRole(wrong, null)).toBe('not-correct');
  });

  it('states every role in words, so greyscale loses nothing', () => {
    for (const role of Object.values(OPTION_ROLE_LABEL)) {
      expect(role.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('how long the sitting was sat', () => {
  const start = new Date('2026-09-03T10:00:00Z');
  const at = (minutes: number) => new Date(start.getTime() + minutes * 60_000);

  it('is the gap between starting and submitting, inside the limit', () => {
    expect(timeUsedSeconds(start, at(76), 5400)).toBe(76 * 60);
  });

  it('never exceeds the limit, however late an expired sitting was finalised', () => {
    // The case that produced this function: an expired sitting is finalised
    // whenever somebody next presses the button, so the raw gap measures when
    // they came back rather than the sitting. Measured on a real one: 25:01:20
    // on a ninety-minute paper.
    expect(timeUsedSeconds(start, at(1501), 5400)).toBe(5400);
  });

  it('reports the whole gap in a mode with no clock to cap against', () => {
    expect(timeUsedSeconds(start, at(200), null)).toBe(200 * 60);
  });

  it('never reads negative', () => {
    expect(timeUsedSeconds(at(10), start, 5400)).toBe(0);
  });
});
