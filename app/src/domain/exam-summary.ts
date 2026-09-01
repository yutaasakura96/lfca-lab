// The three figures across the top of the exam list.
//
// Pure, and typed structurally rather than against the query's row type, so
// this layer keeps importing nothing but its own siblings. What it needs is
// three numbers per paper, wherever they came from.

import { passMark } from './score.ts';

export interface PaperResult {
  bestScore: number | null;
  questionCount: number;
}

export interface ExamSummary {
  /** How many of the sixteen have a finished sitting. */
  sat: number;
  total: number;
  /**
   * Mean best score across the papers actually sat — `null` when none are.
   *
   * Averaged over sat papers only. Counting unsat papers as zero would make the
   * average a measure of how much is left to do rather than how well it is
   * going, and would drop every time a new paper appeared.
   */
  bestAverage: number | null;
  /** How many sat papers have a best score at or above their pass mark. */
  passing: number;
}

export function summariseExams(papers: readonly PaperResult[]): ExamSummary {
  const sat = papers.filter((p) => p.bestScore !== null);

  const passing = sat.filter((p) => (p.bestScore as number) >= passMark(p.questionCount)).length;

  const bestAverage =
    sat.length === 0
      ? null
      : Math.round((sat.reduce((total, p) => total + (p.bestScore as number), 0) / sat.length) * 10) / 10;

  return { sat: sat.length, total: papers.length, bestAverage, passing };
}
