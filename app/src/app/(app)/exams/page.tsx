import Link from 'next/link';
import { StartExamButton } from '../../../components/StartExamButton.tsx';
import { db } from '../../../db/client.ts';
import { listExams } from '../../../db/queries/exams.ts';
import { summariseExams } from '../../../domain/exam-summary.ts';
import { passMark } from '../../../domain/score.ts';
import { requireSession } from '../../../lib/session.ts';

export const metadata = { title: 'Practice exams — LFCA Practice' };

/**
 * The sixteen papers, with both numbers against each.
 *
 * A server component: the query runs here, and only the rendered figures cross
 * to the browser. Scores are read, never computed on the client.
 */
export default async function Exams() {
  const session = await requireSession('/exams');
  const papers = await listExams(db, session.user.id);
  const summary = summariseExams(papers);

  return (
    <div className="page">
      <div
        className="row pagehead"
        style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-6)' }}
      >
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1 className="h1">Practice exams</h1>
          <p className="meta" style={{ fontSize: 'var(--text-sm)', maxWidth: 'var(--measure-prose)' }}>
            Sixteen papers, sixty questions each, drawn from the same bank as the syllabus. The pass
            mark is <strong style={{ color: 'var(--ink-primary)' }}>45 of 60</strong>, and the real
            exam gives you 90 minutes.
          </p>
        </div>

        <div className="row" style={{ gap: 'var(--space-5)' }}>
          <Stat label="Sat" value={String(summary.sat)} of={String(summary.total)} />
          <Stat
            label="Best average"
            value={summary.bestAverage === null ? '—' : summary.bestAverage.toFixed(1)}
            of={summary.bestAverage === null ? undefined : '60'}
          />
          <Stat
            label="Passing"
            value={String(summary.passing)}
            of={summary.sat === 0 ? undefined : String(summary.sat)}
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div className="list">
          <div className="erow erow--head">
            <span className="eyebrow" />
            <span className="eyebrow">Paper</span>
            <span className="eyebrow">Best</span>
            <span className="eyebrow">First attempt</span>
            <span className="eyebrow" style={{ textAlign: 'right' }}>
              Attempts
            </span>
          </div>

          {papers.map((paper) => {
            const mark = passMark(paper.questionCount);
            const attempted = paper.attempts > 0;

            return (
              <div className="erow" key={paper.id}>
                <div className="enum">{String(paper.number).padStart(2, '0')}</div>

                <div className="stack" style={{ gap: 'var(--space-0)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    Exam {String(paper.number).padStart(2, '0')}
                  </span>
                  <span className="meta">
                    {paper.questionCount} questions · pass at {mark}
                  </span>
                </div>

                {/*
                  Never sat reads as words, not as a zero. A score of 0 is a real
                  and different thing — it means a sitting happened and went
                  badly — and showing it for an untouched paper would be a lie
                  that looks like a failure.
                */}
                <Score value={paper.bestScore} of={paper.questionCount} mark={mark} />
                <Score value={paper.firstAttemptScore} of={paper.questionCount} mark={mark} first />

                <div className="actions">
                  <span className="meta" style={{ marginRight: 'auto' }}>
                    {attempted ? `${paper.attempts} attempt${paper.attempts === 1 ? '' : 's'}` : ''}
                  </span>

                  {paper.openAttemptId === null ? (
                    <StartExamButton
                      examId={paper.id}
                      label={attempted ? 'Sit again' : 'Start'}
                      className="btn btn--sm"
                    />
                  ) : (
                    /*
                      A paper with a sitting still running offers to resume it,
                      never to start another. Starting a second sitting from
                      here would be an easy way to abandon one by accident —
                      and an abandoned sitting still counts.
                    */
                    <Link
                      className="btn btn--primary btn--sm"
                      href={{ pathname: `/attempt/${paper.openAttemptId}` }}
                    >
                      Resume
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, of }: { label: string; value: string; of?: string | undefined }) {
  return (
    <div className="stack" style={{ gap: 'var(--space-1)' }}>
      <span className="eyebrow">{label}</span>
      <span
        className="mono"
        style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-medium)' }}
      >
        {value}
        {of === undefined ? null : (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)' }}>/{of}</span>
        )}
      </span>
    </div>
  );
}

function Score({
  value,
  of,
  mark,
  first = false,
}: {
  value: number | null;
  of: number;
  mark: number;
  first?: boolean;
}) {
  if (value === null) {
    return (
      <span className="meta">
        <span className="score__label">{first ? 'First attempt' : 'Best'}</span>
        {first ? '—' : 'Not yet attempted'}
      </span>
    );
  }

  const passed = value >= mark;

  return (
    <span className={first ? 'score score--first' : 'score'}>
      {/*
        Carried in the markup rather than only in a column header, because on a
        narrow screen the header is gone and the two numbers sit one above the
        other. Hidden by CSS wherever the header is doing the job.
      */}
      <span className="score__label">{first ? 'First attempt' : 'Best'}</span>
      <span className="score__num">{value}</span>
      <span className="score__den">/{of}</span>
      {/*
        Pass and fail are marked with a word as well as a colour. The review
        screens are almost entirely red and green, and this is the same reader
        who has to be able to use them in grayscale.
      */}
      <span
        className={passed ? 'chip chip--correct' : 'chip chip--incorrect'}
        style={{
          height: 'var(--control-h-xs)',
          padding: '0 var(--space-2)',
          fontSize: 'var(--text-2xs)',
          marginLeft: 'var(--space-2)',
        }}
      >
        {passed ? 'Pass' : 'No pass'}
      </span>
    </span>
  );
}
