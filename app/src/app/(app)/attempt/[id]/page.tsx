import { notFound } from 'next/navigation';
import { db } from '../../../../db/client.ts';
import { getAttemptForUser } from '../../../../db/queries/attempt.ts';
import { getPaperQuestions } from '../../../../db/queries/paper.ts';
import { Stem } from '../../../../components/Stem.tsx';
import { requireSession } from '../../../../lib/session.ts';

export const metadata = { title: 'Sitting — LFCA Practice' };

/**
 * The sitting.
 *
 * A server component, and that is the security design rather than a
 * performance choice: the answer key lives in columns this page's query never
 * selects, so there is no payload for it to travel in. What reaches the browser
 * is a stem and four option texts.
 *
 * Navigation between questions and the clock arrive in their own slices; this
 * renders the first question of the paper.
 */
export default async function Sitting({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const attempt = await getAttemptForUser(db, session.user.id, id);

  // Not found, never forbidden. A 403 would confirm the row exists and belongs
  // to somebody, which is exactly what an attacker probing ids wants to learn.
  if (attempt === null) notFound();
  if (attempt.examId === null) notFound();

  const questions = await getPaperQuestions(db, attempt.examId);
  const question = questions[0];
  if (question === undefined) notFound();

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="stack" style={{ gap: 'var(--space-1)' }}>
          <span className="eyebrow">Exam {attempt.examId.replace('exam-', '')}</span>
          <h1 className="h2">
            Question {question.seq + 1}{' '}
            <span className="meta" style={{ fontWeight: 'var(--weight-regular)' }}>
              of {questions.length}
            </span>
          </h1>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-5)', padding: 'var(--space-6)' }}>
        <Stem text={question.stem} />

        <div className="stack" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
          {question.options.map((option, index) => (
            <div className="opt opt--interactive" key={option.ref}>
              <span className="mono" style={{ color: 'var(--ink-faint)' }}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="meta" style={{ marginTop: 'var(--space-4)' }}>
        Answering, flagging and the clock arrive next. Nothing is recorded yet.
      </p>
    </div>
  );
}
