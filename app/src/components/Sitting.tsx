'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildNavigator, patch, stateFor, type RecordedState } from '../domain/navigator.ts';
import { clockBand, formatRemaining } from '../domain/clock.ts';
import type { SubmitOutcome } from '../domain/submission.ts';
import { post, put, type WriteFailure } from '../lib/writes.ts';
import { ExamBar } from './ExamBar.tsx';
import { NavigatorRail } from './NavigatorRail.tsx';
import { SittingQuestion, type SittingOption } from './SittingQuestion.tsx';
import { SubmitDialog } from './SubmitDialog.tsx';
import { useClock } from './use-clock.ts';
import { useOutbox } from './use-outbox.ts';

export interface PaperQuestion {
  id: string;
  /** 0-based position on the paper. */
  seq: number;
  stem: string;
  options: SittingOption[];
}

export interface SittingProps {
  attemptId: string;
  /** `07`, for the bar's own name for this paper. */
  examNumber: string;
  passMark: number;
  /**
   * The instant this sitting closes, absolute and server-issued, or `null` for
   * a sitting with no clock. The browser counts down to it and never sends it
   * back — and there is no path anywhere in this component that replaces it.
   */
  deadline: string | null;
  /** The server's own `now` at render, which is what the countdown is anchored to. */
  serverNow: string;
  /** Every question on the paper, with nothing in it that gives an answer away. */
  questions: PaperQuestion[];
  /** What the database holds, keyed by question id — one entry per question. */
  initial: Record<string, RecordedState>;
  /**
   * The score, when this sitting was already finalised before the page loaded —
   * a reload after submitting, or a second tab. The sitting then opens showing
   * its outcome rather than pretending to be answerable, which is what the
   * server would refuse anyway.
   */
  finished: SubmitOutcome | null;
  /**
   * Seconds that were left when it closed, so the bar can hold the reading it
   * had rather than counting down over a sitting that is already scored.
   */
  remainingAtClose: number | null;
}

/** The four keys the footer advertises. A legend without behaviour would be a lie. */
const CHOICE_KEYS = ['1', '2', '3', '4'];

/**
 * The sitting: sixty questions, one on screen, all sixty reachable.
 *
 * **The whole paper is held here, in memory.** Doc 10 §4 is explicit that the
 * questions are fetched once at start and the exam does not begin until all
 * sixty are in hand, so there is no per-question loading state — and a
 * navigator that could only report on the question currently loaded would not
 * be a navigator. What crosses to the browser is a stem, four option texts and
 * this candidate's own choices; the answer key is never selected by the query
 * that feeds this, so there is no payload for it to travel in.
 *
 * Navigation is client-side state rather than a route. Sixty round trips over
 * ninety minutes would each be a chance to lose the in-flight write, and doc 03
 * §5 keeps attempt truth in exactly one place: Postgres, echoed optimistically
 * here. A second copy in the URL would be a second place it could be stale.
 */
export function Sitting({
  attemptId,
  examNumber,
  passMark,
  deadline,
  serverNow,
  questions,
  initial,
  finished,
  remainingAtClose,
}: SittingProps) {
  // Sorted once, so the array index and the navigator's own ordering cannot
  // drift apart. The query already orders by seq; this makes it not matter.
  const paper = useMemo(() => [...questions].sort((a, b) => a.seq - b.seq), [questions]);

  const [currentSeq, setCurrentSeq] = useState(0);
  const [recorded, setRecorded] = useState(initial);
  const [failure, setFailure] = useState<WriteFailure | null>(null);

  // Submitting is three states, not one flag: whether the dialog is open,
  // whether the request is in the air, and what came back. They are kept apart
  // because the dialog outlives the request — a failed submit leaves it open
  // with the button back, and a successful one leaves it open showing the
  // score.
  // A sitting that arrives already finalised opens on its own outcome. There is
  // nothing to confirm and nothing to answer; the dialog is the whole screen.
  const [confirming, setConfirming] = useState(finished !== null);
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(finished);
  /** Seconds left when the sitting closed. The clock holds this reading after. */
  const [stoppedAt, setStoppedAt] = useState<number | null>(remainingAtClose);

  // What the server has actually confirmed, which is not what is on screen. A
  // rollback reads from here rather than from state, because state is the
  // optimistic value being disowned.
  const saved = useRef(initial);

  // Two clicks in quick succession are two requests, and they can land out of
  // order. A response may only speak for the screen if no later click on the
  // same question and the same lane has spoken since.
  const tickets = useRef(new Map<string, number>());

  const clock = useClock(deadline, serverNow);

  // The queue of writes the server has not confirmed. It is created here rather
  // than per question for the same reason the answers are: a question that
  // owned its own retries would abandon them the moment the navigator moved on.
  const outbox = useOutbox();

  const question = paper[currentSeq];
  const model = buildNavigator(paper, recorded, currentSeq);

  // Two ways a sitting stops taking answers, and they freeze the screen
  // identically: the clock ran out, or it has been submitted. The server
  // refuses either independently — `attempt_expired` and
  // `attempt_already_submitted` — which is the actual guarantee. This is the
  // courtesy that stops the screen offering an action the server would refuse.
  const frozen = clock.expired || outcome !== null;

  // Whether the clock is the *reason* it stopped taking answers. A sitting the
  // candidate submitted with time to spare reads as expired to the resync —
  // doc 07 §6 has it treat `submitted` exactly as it treats `expired` — and
  // saying "your time has run out" over a sitting somebody chose to end would
  // be the wrong explanation for the right state.
  const ranOut = clock.expired && outcome?.reason !== 'user';

  /**
   * Put the countdown back on the server's clock.
   *
   * Called when the tab is looked at again and when the network comes back —
   * the two moments where the browser's own reckoning is most likely to have
   * drifted, because a background tab's timers are throttled and a sleeping
   * machine's are stopped altogether. Both are display problems: the sitting
   * closed when it closed, whatever this tab believed.
   *
   * A failed resync is silent. It leaves the countdown running on the last
   * anchor, which is the honest fallback — and the server refuses writes into
   * an expired sitting regardless of what this side thinks the time is.
   */
  const syncTo = clock.syncTo;
  const resync = useCallback(async () => {
    // Stamped before the request leaves, so the reply can be placed at the
    // midpoint of the journey rather than at the moment it landed.
    const sentAt = Date.now();
    try {
      const response = await fetch(`/api/attempt/${attemptId}/state`, { cache: 'no-store' });
      if (!response.ok) return;
      const state = (await response.json()) as { status?: string; serverNow?: string };
      if (typeof state.serverNow !== 'string') return;
      syncTo(
        state.serverNow,
        sentAt,
        state.status === 'expired' || state.status === 'submitted',
      );
    } catch {
      // Offline, most likely. The next `online` event tries again.
    }
    // `syncTo` rather than the whole clock: the clock is a fresh object every
    // tick, and depending on it would tear down and re-register both listeners
    // once a second for the length of the sitting.
  }, [attemptId, syncTo]);

  const flush = outbox.flush;
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') void resync();
    }
    function onOnline() {
      void resync();
      // The connection is demonstrably back, so serving out the rest of a
      // thirty-second backoff is pure cost — and thirty seconds is a long time
      // to go on telling someone their answer is not saved when it could be.
      flush();
    }
    // Once immediately, which replaces the render-time anchor — biased by the
    // page load — with one measured over a round trip.
    void resync();

    // Three events, not two. `visibilitychange` covers a backgrounded tab and
    // `online` covers a dropped connection, but switching to another
    // *application* with this tab still in front fires neither — and a laptop
    // that slept with the window in front is exactly the case the ticket is
    // about. `focus` is what covers it.
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', resync);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', resync);
      window.removeEventListener('online', onOnline);
    };
  }, [resync, flush]);

  /**
   * Closing the tab with writes still owed asks first.
   *
   * The queue is in memory and nowhere else (doc 03 §7), so closing the tab is
   * the one action that can actually lose an answer. The browser decides the
   * wording; all a page can do is say that there is something to lose.
   */
  const unsaved = outbox.pending > 0;
  useEffect(() => {
    if (!unsaved) return;
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved]);

  /**
   * One value that shows immediately and is written after.
   *
   * **The outbox is what makes keeping the value honest.** A failed write used
   * to be rolled back here, because a screen claiming a thing is recorded when
   * it is not is the exact failure this project is organised against. That is
   * still true of a write nothing will ever accept — so a refusal the server
   * will repeat forever still puts the value back to what was last confirmed,
   * for that lane only, since a failed flag must not revoke an answer that
   * saved. What changed is the ordinary case: a dropped connection is no longer
   * a reason to disown the answer, because the queue is still going to write it.
   */
  function commit(
    questionId: string,
    lane: 'answer' | 'flag',
    apply: (before: RecordedState) => RecordedState,
    send: () => Promise<WriteFailure | null>,
  ) {
    const key = `${questionId}:${lane}`;
    const ticket = (tickets.current.get(key) ?? 0) + 1;
    tickets.current.set(key, ticket);

    setRecorded((all) => patch(all, questionId, apply));

    outbox.send({
      key,
      send,
      settled: (failed) => {
        if (failed === null) {
          // Applied to what the server had confirmed rather than to the screen:
          // this write landed, whatever has been clicked since.
          saved.current = patch(saved.current, questionId, apply);
          setFailure(null);
          return;
        }

        // Only a permanent refusal reaches here — the queue keeps everything
        // else. A later click on the same lane has already spoken for the
        // screen, so a stale refusal must not pull it back.
        if (ticket !== tickets.current.get(key)) return;

        const confirmed = stateFor(saved.current, questionId);
        setRecorded((all) =>
          patch(all, questionId, (before) =>
            lane === 'answer'
              ? { ...before, optionRef: confirmed.optionRef }
              : { ...before, flagged: confirmed.flagged },
          ),
        );
        setFailure(failed);
      },
    });
  }

  function answerQuestion(questionId: string, optionRef: string | null) {
    if (frozen) return;
    void commit(
      questionId,
      'answer',
      (before) => ({ ...before, optionRef }),
      () => put(`/api/attempt/${attemptId}/answer`, { questionId, optionRef }),
    );
  }

  function flagQuestion(questionId: string, flagged: boolean) {
    if (frozen) return;
    void commit(
      questionId,
      'flag',
      (before) => ({ ...before, flagged }),
      () => put(`/api/attempt/${attemptId}/flag`, { questionId, flagged }),
    );
  }

  function goTo(seq: number) {
    if (seq < 0 || seq >= paper.length) return;
    setCurrentSeq(seq);
  }

  /**
   * Finalise the sitting.
   *
   * Deliberately **not** put through the outbox, though every other write here
   * is. The outbox exists to keep trying without being asked, and a submit that
   * retried itself would go on finalising a sitting somebody had walked away
   * from. A failure says so and offers the button again — doc 10 §5's error
   * state, whose first job is to say that the answers are safe, because they
   * are: every one of them was durable when it was made.
   *
   * A double submit is not defended against here beyond the in-flight guard.
   * It does not need to be: the endpoint answers the second caller with the
   * first one's score (doc 07 §5), so the worst a second press can do is show
   * the same number again.
   */
  async function submit() {
    if (submitting || outcome !== null) return;
    // Doc 03 §7: never while anything is owed. The button is already disabled;
    // this is the same rule stated where it cannot be got round.
    if (outbox.pending > 0) return;

    setSubmitting(true);
    setSubmitFailed(false);

    const result = await post<SubmitOutcome>(`/api/attempt/${attemptId}/submit`);

    setSubmitting(false);
    if (result.ok) {
      // The countdown is pinned at the instant the sitting closed. It is still
      // derived from the deadline — nothing here can move that — but a sitting
      // that is already scored has no time left to count, and a bar going on
      // counting behind the score would be saying otherwise.
      setStoppedAt(clock.remaining);
      setOutcome(result.data);
      return;
    }
    // The sitting is untouched — no navigation, no lost answers, and the dialog
    // stays where it is.
    setSubmitFailed(true);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      // Never steal a keystroke from something being typed into, and never from
      // a browser shortcut.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
        return;
      }
      if (question === undefined) return;
      // The dialog is modal, and it owns the keyboard while it is open — its
      // own Escape included. Answering a question you cannot see, from behind a
      // confirmation asking whether you are finished, is the one keystroke this
      // screen must not accept.
      if (confirming) return;

      // Past the deadline the arrows still move — the paper is readable, and
      // there is nothing to protect about looking at it. `1`–`4` and `F` are
      // refused here as well as in the handlers they call, so a held key
      // cannot spend the whole sitting posting writes the server will refuse.
      const choice = frozen ? -1 : CHOICE_KEYS.indexOf(event.key);
      if (choice !== -1) {
        const option = question.options[choice];
        if (option) {
          event.preventDefault();
          answerQuestion(question.id, option.ref);
        }
        return;
      }
      if (!frozen && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        flagQuestion(question.id, !stateFor(recorded, question.id).flagged);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(currentSeq - 1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(currentSeq + 1);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // Deliberately no dependency array: the handler closes over the current
    // question and its flag, so a listener registered once would go on
    // answering and toggling whatever was on screen when the sitting opened.
  });

  if (question === undefined) return null;

  const current = stateFor(recorded, question.id);

  return (
    <>
      <ExamBar
        examNumber={examNumber}
        model={model}
        total={paper.length}
        currentNumber={currentSeq + 1}
        band={stoppedAt === null ? clock.band : clockBand(stoppedAt)}
        display={stoppedAt === null ? clock.display : formatRemaining(stoppedAt)}
        retrying={outbox.retrying}
        unsaved={outbox.pending}
        submitting={submitting}
        submitted={outcome !== null}
        onSelect={goTo}
        onSubmit={() => setConfirming(true)}
      />

      {confirming ? (
        <SubmitDialog
          attemptId={attemptId}
          examNumber={examNumber}
          tiles={model.tiles}
          questionCount={paper.length}
          timeLeft={stoppedAt === null ? clock.display : formatRemaining(stoppedAt)}
          expired={ranOut}
          outcome={outcome}
          unsaved={outbox.pending}
          retrying={outbox.retrying}
          submitting={submitting}
          failed={submitFailed}
          onJump={(seq) => {
            goTo(seq);
            // You opened the review to get somewhere, not to read it twice.
            setConfirming(false);
          }}
          onSubmit={() => void submit()}
          onKeepWorking={() => setConfirming(false)}
        />
      ) : null}

      <div className="sitting">
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <SittingQuestion
            question={question}
            number={currentSeq + 1}
            total={paper.length}
            answer={current.optionRef}
            flagged={current.flagged}
            failure={failure}
            expired={ranOut}
            locked={frozen}
            onAnswer={(optionRef) => answerQuestion(question.id, optionRef)}
            onFlag={(flagged) => flagQuestion(question.id, flagged)}
            onPrevious={() => goTo(currentSeq - 1)}
            onNext={() => goTo(currentSeq + 1)}
            hasPrevious={currentSeq > 0}
            hasNext={currentSeq < paper.length - 1}
          />
        </div>

        <NavigatorRail model={model} passMark={passMark} onSelect={goTo} />
      </div>
    </>
  );
}
