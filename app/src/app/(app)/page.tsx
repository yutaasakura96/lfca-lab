import Link from 'next/link';
import { SignOutButton } from '../../components/SignOutButton.tsx';
import { db } from '../../db/client.ts';
import { listOpenSittings, type OpenSittingRow } from '../../db/queries/attempt.ts';
import { finaliseExpiredSittings } from '../../lib/auto-submit.ts';
import { requireSession } from '../../lib/session.ts';

export const metadata = { title: 'LFCA Practice' };

/**
 * Doc 03 §4's home: three modes, and the holdout that is sat last.
 *
 * **Listing open sittings is a touch, so this sweeps first**, exactly as the
 * exam list does. Without it a sitting whose ninety minutes ran out unattended
 * would go on offering to be resumed from the first screen after sign-in. The
 * sweep is the same one finalisation path — it calls `submitAttempt` — so the
 * score, the reason and the first-attempt flag are still decided in one place.
 */
export default async function Home() {
  const session = await requireSession();
  await finaliseExpiredSittings(db, session.user.id, new Date());
  const open = await listOpenSittings(db, session.user.id);

  return (
    <div className="page">
      <div
        className="row pagehead"
        style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-6)' }}
      >
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1 className="h1">LFCA Practice</h1>
          <p
            className="meta"
            style={{ fontSize: 'var(--text-sm)', maxWidth: 'var(--measure-prose)' }}
          >
            One bank of 1,150 questions, four ways to answer it. Signed in as {session.user.email}.
          </p>
        </div>
        <SignOutButton />
      </div>

      {open.length === 0 ? null : (
        <div className="stack" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <span className="eyebrow">In progress</span>
          {open.map((sitting) => (
            <ResumeCard key={sitting.id} sitting={sitting} />
          ))}
        </div>
      )}

      <div className="modes">
        <ModeCard
          title="Exam mode"
          href="/exams"
          action="The sixteen papers"
          lines={[
            'Sixty questions, ninety minutes, pass at 45.',
            'Free navigation and flagging. No feedback until you submit.',
            'Scored, with your best and first-attempt score kept side by side.',
          ]}
        />
        <ModeCard
          title="Practice mode"
          href="/practice"
          action="Start practice"
          lines={[
            'Twenty, forty or sixty, drawn in the exam’s own weights.',
            'The answer and all four explanations, the moment you commit to one.',
            'No clock, forward only, and nothing is scored.',
          ]}
        />
        <ModeCard
          title="Domain mode"
          href="/domain"
          action="Choose a domain"
          lines={[
            'One domain at a time — twenty, forty, or the whole pool.',
            'Same immediate feedback as practice.',
            'The short repeatable session for a weak area.',
          ]}
        />

        {/*
          Disabled rather than absent. The holdout is the project's answer to
          its riskiest assumption, and a candidate who does not know it is
          waiting cannot plan around it — but it is sat once, so an easy way in
          from the first screen after sign-in is precisely what must not exist.
        */}
        <div className="card modecard modecard--off" aria-labelledby="holdout-title">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="h2" id="holdout-title">
              The holdout
            </h2>
            <span className="chip chip--unanswered">Sat once, at the end</span>
          </div>
          <ul className="modelines">
            <li>Forty questions no exam, practice or domain sitting can ever serve.</li>
            <li>Timed and scored like an exam, pro rata: forty questions, sixty minutes.</li>
            <li>
              A readiness signal untainted by memory. Kept for the week before the retake, which is
              why it is not startable yet.
            </li>
          </ul>
          {/*
            A real disabled button, not a span dressed as one. It is announced
            as a disabled button, it cannot be focused or activated, and it
            needs no ARIA to say so — the earlier `aria-disabled` beside
            `role="presentation"` contradicted itself, since presentation
            strips the very semantics the attribute was decorating.
          */}
          <button type="button" className="btn" disabled>
            Not yet available
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  href,
  action,
  lines,
}: {
  title: string;
  href: string;
  action: string;
  lines: string[];
}) {
  return (
    <div className="card modecard">
      <h2 className="h2">{title}</h2>
      <ul className="modelines">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {/*
        A link, not a POST — these go to a setup screen, and nothing is started
        until a button there says so. `StartExamButton` is the POST, and it
        lives where the paper is chosen.
      */}
      <Link className="btn btn--primary" href={{ pathname: href }}>
        {action}
      </Link>
    </div>
  );
}

/**
 * One unfinished sitting, offered back.
 *
 * **No countdown here, deliberately.** This page is a server render, so a
 * countdown on it would be a snapshot that goes on reading "12:48 left" long
 * after it is false — and a silently wrong number is worse than none, on the
 * one card whose whole job is to say a clock is running. The live clock is one
 * click away, derived and resynced, where it can be right.
 */
function ResumeCard({ sitting }: { sitting: OpenSittingRow }) {
  const { title, mode } = describeSitting(sitting);

  const detail = [
    mode,
    `${sitting.answered} of ${sitting.questionCount} answered`,
    sitting.flagged > 0 ? `${sitting.flagged} flagged` : null,
    sitting.timed ? 'the clock is still running' : null,
  ].filter((part) => part !== null);

  return (
    <div className="card resume">
      <div className="stack" style={{ gap: 'var(--space-1)' }}>
        <span className="h2">{title}</span>
        <span className="meta">{detail.join(' · ')}</span>
      </div>
      <Link className="btn btn--primary" href={{ pathname: `/attempt/${sitting.id}` }}>
        Resume
      </Link>
    </div>
  );
}

/**
 * What to call one unfinished sitting, and what mode to say it is.
 *
 * One exhaustive switch rather than three cascades on `mode`. The exhaustive
 * part is the point: the holdout is a mode this product has and has not built,
 * and a chain of ternaries silently called it "Practice mode" — a switch that
 * must return makes the next mode a compile error instead.
 */
function describeSitting(sitting: OpenSittingRow): { title: string; mode: string } {
  switch (sitting.mode) {
    case 'exam':
      return {
        title: `Exam ${String(sitting.examNumber ?? 0).padStart(2, '0')}`,
        mode: 'Exam mode',
      };
    case 'domain':
      return { title: sitting.domainName ?? 'Domain practice', mode: 'Domain mode' };
    case 'practice':
      return { title: 'Practice', mode: 'Practice mode' };
    case 'holdout':
      return { title: 'The holdout', mode: 'Holdout' };
  }
}
