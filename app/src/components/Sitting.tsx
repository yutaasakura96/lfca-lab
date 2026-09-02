'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildNavigator, patch, stateFor, type RecordedState } from '../domain/navigator.ts';
import { put, type WriteFailure } from '../lib/writes.ts';
import { ExamBar } from './ExamBar.tsx';
import { NavigatorRail } from './NavigatorRail.tsx';
import { SittingQuestion, type SittingOption } from './SittingQuestion.tsx';
import { useClock } from './use-clock.ts';

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
}: SittingProps) {
  // Sorted once, so the array index and the navigator's own ordering cannot
  // drift apart. The query already orders by seq; this makes it not matter.
  const paper = useMemo(() => [...questions].sort((a, b) => a.seq - b.seq), [questions]);

  const [currentSeq, setCurrentSeq] = useState(0);
  const [recorded, setRecorded] = useState(initial);
  const [failure, setFailure] = useState<WriteFailure | null>(null);

  // What the server has actually confirmed, which is not what is on screen. A
  // rollback reads from here rather than from state, because state is the
  // optimistic value being disowned.
  const saved = useRef(initial);

  // Two clicks in quick succession are two requests, and they can land out of
  // order. A response may only speak for the screen if no later click on the
  // same question and the same lane has spoken since.
  const tickets = useRef(new Map<string, number>());

  const clock = useClock(deadline, serverNow);

  const question = paper[currentSeq];
  const model = buildNavigator(paper, recorded, currentSeq);

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

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') void resync();
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
    window.addEventListener('online', resync);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', resync);
      window.removeEventListener('online', resync);
    };
  }, [resync]);

  /**
   * One value that shows immediately and is written after.
   *
   * The rollback is the point. Until the outbox exists (#23), a failed write
   * leaves the screen showing something the database does not hold, and a
   * screen that claims a thing is recorded when it is not is the exact failure
   * this project is organised against. So the value goes back to whatever the
   * server last confirmed — for that lane only, since a failed flag must not
   * revoke an answer that saved.
   */
  async function commit(
    questionId: string,
    lane: 'answer' | 'flag',
    apply: (before: RecordedState) => RecordedState,
    send: () => Promise<WriteFailure | null>,
  ) {
    const key = `${questionId}:${lane}`;
    const ticket = (tickets.current.get(key) ?? 0) + 1;
    tickets.current.set(key, ticket);

    setRecorded((all) => patch(all, questionId, apply));

    const failed = await send();
    if (ticket !== tickets.current.get(key)) return;

    if (failed === null) {
      saved.current = patch(saved.current, questionId, apply);
      setFailure(null);
      return;
    }

    const confirmed = stateFor(saved.current, questionId);
    setRecorded((all) =>
      patch(all, questionId, (before) =>
        lane === 'answer'
          ? { ...before, optionRef: confirmed.optionRef }
          : { ...before, flagged: confirmed.flagged },
      ),
    );
    setFailure(failed);
  }

  function answerQuestion(questionId: string, optionRef: string | null) {
    if (clock.expired) return;
    void commit(
      questionId,
      'answer',
      (before) => ({ ...before, optionRef }),
      () => put(`/api/attempt/${attemptId}/answer`, { questionId, optionRef }),
    );
  }

  function flagQuestion(questionId: string, flagged: boolean) {
    if (clock.expired) return;
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

      // Past the deadline the arrows still move — the paper is readable, and
      // there is nothing to protect about looking at it. `1`–`4` and `F` are
      // refused here as well as in the handlers they call, so a held key
      // cannot spend the whole sitting posting writes the server will refuse.
      const choice = clock.expired ? -1 : CHOICE_KEYS.indexOf(event.key);
      if (choice !== -1) {
        const option = question.options[choice];
        if (option) {
          event.preventDefault();
          answerQuestion(question.id, option.ref);
        }
        return;
      }
      if (!clock.expired && (event.key === 'f' || event.key === 'F')) {
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
        band={clock.band}
        display={clock.display}
        onSelect={goTo}
      />

      <div className="sitting">
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <SittingQuestion
            question={question}
            number={currentSeq + 1}
            total={paper.length}
            answer={current.optionRef}
            flagged={current.flagged}
            failure={failure}
            expired={clock.expired}
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
