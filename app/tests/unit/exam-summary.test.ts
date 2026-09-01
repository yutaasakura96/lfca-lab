import { describe, expect, it } from 'vitest';
import { summariseExams } from '../../src/domain/exam-summary.ts';

const paper = (bestScore: number | null, questionCount = 60) => ({ bestScore, questionCount });

describe('summarising the sixteen', () => {
  it('reports nothing on a first sign-in rather than zeros', () => {
    // The zero-data state. An average of 0 would read as "you are failing
    // everything" when the truth is "you have not started".
    const summary = summariseExams(Array.from({ length: 16 }, () => paper(null)));

    expect(summary).toEqual({ sat: 0, total: 16, bestAverage: null, passing: 0 });
  });

  it('counts only papers with a finished sitting as sat', () => {
    const summary = summariseExams([paper(50), paper(null), paper(40), paper(null)]);
    expect(summary.sat).toBe(2);
    expect(summary.total).toBe(4);
  });

  // Averaging over all sixteen would make the number drop every time a paper is
  // added and would read as progress-through-the-set rather than how well the
  // sittings are going.
  it('averages over papers sat, not over all papers', () => {
    const summary = summariseExams([paper(50), paper(40), paper(null), paper(null)]);
    expect(summary.bestAverage).toBe(45);
  });

  it('rounds the average to one decimal place', () => {
    expect(summariseExams([paper(50), paper(45), paper(44)]).bestAverage).toBe(46.3);
  });

  it('counts a paper as passing at exactly the pass mark', () => {
    expect(summariseExams([paper(45)]).passing).toBe(1);
    expect(summariseExams([paper(44)]).passing).toBe(0);
    expect(summariseExams([paper(46)]).passing).toBe(1);
  });

  it('judges a shorter paper against its own pro-rata mark', () => {
    // A 40-question paper passes at 30, not at 45.
    expect(summariseExams([paper(30, 40)]).passing).toBe(1);
    expect(summariseExams([paper(29, 40)]).passing).toBe(0);
  });

  it('never counts an unsat paper as passing', () => {
    expect(summariseExams([paper(null), paper(null)]).passing).toBe(0);
  });

  it('handles a zero score as sat but not passing', () => {
    // Distinct from `null`: a sitting that scored nothing is still a sitting,
    // and must not be mistaken for one that never happened.
    const summary = summariseExams([paper(0)]);
    expect(summary.sat).toBe(1);
    expect(summary.passing).toBe(0);
    expect(summary.bestAverage).toBe(0);
  });

  it('copes with no papers at all without dividing by zero', () => {
    expect(summariseExams([])).toEqual({ sat: 0, total: 0, bestAverage: null, passing: 0 });
  });
});
