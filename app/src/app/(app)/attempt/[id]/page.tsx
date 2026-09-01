import { notFound } from 'next/navigation';
import { db } from '../../../../db/client.ts';
import { getAttemptAnswers } from '../../../../db/queries/answer.ts';
import { getAttemptForUser } from '../../../../db/queries/attempt.ts';
import { getPaperQuestions } from '../../../../db/queries/paper.ts';
import { SittingQuestion } from '../../../../components/SittingQuestion.tsx';
import { requireSession } from '../../../../lib/session.ts';

export const metadata = { title: 'Sitting — LFCA Practice' };

/**
 * The sitting.
 *
 * A server component, and that is the security design rather than a
 * performance choice: the answer key lives in columns this page's queries never
 * select, so there is no payload for it to travel in. What reaches the browser
 * is a stem, four option texts, and which option this candidate already chose.
 *
 * Answers and flags are read back from the database on every load, which is
 * what makes a reload restore the sitting rather than reset it. Reaching the
 * other fifty-nine questions, and the clock, arrive in their own slices.
 */
export default async function Sitting({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const attempt = await getAttemptForUser(db, session.user.id, id);

  // Not found, never forbidden. A 403 would confirm the row exists and belongs
  // to somebody, which is exactly what an attacker probing ids wants to learn.
  if (attempt === null) notFound();
  if (attempt.examId === null) notFound();

  const [questions, answers] = await Promise.all([
    getPaperQuestions(db, attempt.examId),
    getAttemptAnswers(db, session.user.id, attempt.id),
  ]);

  const question = questions[0];
  if (question === undefined) notFound();

  const recorded = answers.find((a) => a.questionId === question.id);

  return (
    <div className="page">
      <span className="eyebrow">Exam {attempt.examId.replace('exam-', '')}</span>

      <div className="card" style={{ marginTop: 'var(--space-5)', padding: 'var(--space-6)' }}>
        <SittingQuestion
          attemptId={attempt.id}
          question={question}
          total={questions.length}
          initial={{
            optionRef: recorded?.optionRef ?? null,
            flagged: recorded?.flagged ?? false,
          }}
        />
      </div>

      <p className="meta" style={{ marginTop: 'var(--space-4)' }}>
        Answers and flags are saved as you make them. Reaching the other questions and the clock
        arrive next.
      </p>
    </div>
  );
}
