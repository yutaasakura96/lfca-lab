'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildGradedNavigator,
  firstUnansweredSeq,
  gradedStateFor,
  patchGraded,
  type GradedRecord,
} from '../domain/navigator.ts';
import { putReading, type WriteFailure } from '../lib/writes.ts';
import { ComposedBar } from './ComposedBar.tsx';
import { ComposedQuestion, type AnswerFeedback } from './ComposedQuestion.tsx';
import { SessionRail } from './SessionRail.tsx';
import type { SittingOption } from './SittingQuestion.tsx';
import { useOutbox } from './use-outbox.ts';

export interface ComposedSittingQuestion {
  id: string;
  /** 0-based position in this sitting — `attempt_question.seq`. */
  seq: number;
  stem: string;
  competency: string;
  conceptId: string;
  options: SittingOption[];
}

export interface ComposedSittingProps {
  attemptId: string;
  /** `Practice` or the domain's own name, read from the bank rather than mapped. */
  title: string;
  modeLabel: string;
  /** Every question this sitting froze, with nothing in it that gives an answer away. */
  questions: ComposedSittingQuestion[];
  /** What the database holds — one entry per question, verdicts included. */
  initial: Record<string, GradedRecord>;
  /**
   * The key for the question this sitting reopens on, when that question is
   * already answered — and which question that is, stated rather than
   * recomputed here.
   *
   * Only one question can ever need it, and only in one case: resume opens on
   * the first unanswered question, so an answered question is on screen at load
   * exactly when every question has been answered and there is none to open on.
   * Fetching the key for all sixty instead would put the whole answer key on
   * the wire for a screen that renders one question at a time and cannot
   * navigate back to the rest.
   */
  resumed: { questionId: string; feedback: AnswerFeedback } | null;
}

/** The keys that choose an option. A legend without behaviour would be a lie. */
const CHOICE_KEYS = ['1', '2', '3', '4'];

/**
 * A practice or domain sitting: forward only, no clock, marked as you go.
 *
 * **Its own component rather than the timed sitting with flags set.** The two
 * screens share the outbox, the writes, the tile and the bank's prose
 * rendering, and differ in everything that decides what is on screen: a clock,
 * free navigation, flagging and a submit dialog against none of those and
 * grading instead. Doc 10's first cross-screen rule is that no clock renders
 * here at all — not stopped, not greyed — and that is worth being structural
 * rather than a prop that must never be true.
 *
 * The whole sitting is held here, in memory, for the reason the timed one is:
 * the session card reports on all of them, not on whichever is rendered.
 *
 * **Correctness is never decided on this side.** The endpoint answers a graded
 * mode with the verdict, the key and all four explanations (doc 07 §3), and
 * that reply is the only source of any of it — there is no answer key in this
 * component's props to re-derive one from, which is what makes PRD E3's
 * enforcement a fact about the payload rather than about this file's
 * discipline.
 */
export function ComposedSitting({
  attemptId,
  title,
  modeLabel,
  questions,
  initial,
  resumed,
}: ComposedSittingProps) {
  // Sorted once, so the array index and the navigator's own ordering cannot
  // drift apart. The query already orders by seq; this makes it not matter.
  const sitting = useMemo(() => [...questions].sort((a, b) => a.seq - b.seq), [questions]);

  const [graded, setGraded] = useState(initial);
  const [currentSeq, setCurrentSeq] = useState(() => firstUnansweredSeq(questions, initial));
  const [failure, setFailure] = useState<Record<string, WriteFailure>>({});

  /**
   * The key and the four explanations, per question, as they arrive.
   *
   * Only ever read for the question on screen — strictly forward means the
   * others are behind you — but kept as a map rather than a single slot so that
   * nothing has to be discarded on a move, and so the one restored at load and
   * the ones that arrive from clicks are held the same way.
   */
  const [keys, setKeys] = useState<Record<string, AnswerFeedback>>(
    resumed === null ? {} : { [resumed.questionId]: resumed.feedback },
  );

  const outbox = useOutbox();

  const question = sitting[currentSeq];
  const model = buildGradedNavigator(sitting, graded, currentSeq);

  /**
   * Closing the tab with writes still owed asks first.
   *
   * The queue is in memory and nowhere else (doc 03 §7), so closing the tab is
   * the one action that can actually lose an answer.
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

  const flush = outbox.flush;
  useEffect(() => {
    // No resync here, and nothing to resync to: there is no clock to re-anchor
    // and no deadline that could pass while the tab was away. What a restored
    // connection is worth is the owed writes going now rather than serving out
    // the rest of a thirty-second backoff.
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, [flush]);

  /**
   * Answer one question, once.
   *
   * The choice shows immediately and locks; the verdict follows from the reply,
   * because it is the reply. A question already answered is refused here as
   * well as by the screen that no longer offers the control — a held key must
   * not be able to re-answer what has been marked.
   *
   * **The write goes through the outbox like every other**, so a dropped
   * connection is retried rather than lost, and the identical retry is safe
   * because the endpoint is an idempotent upsert (doc 07 §3). The feedback is
   * captured from whichever attempt lands: a retry re-sends the same option to
   * the same question, so it can only come back with the same verdict.
   */
  function answerQuestion(questionId: string, optionRef: string) {
    if (gradedStateFor(graded, questionId).optionRef !== null) return;

    setGraded((all) => patchGraded(all, questionId, (before) => ({ ...before, optionRef })));
    setFailure((all) => {
      if (all[questionId] === undefined) return all;
      const rest = { ...all };
      delete rest[questionId];
      return rest;
    });

    let landed: AnswerFeedback | null = null;

    outbox.send({
      key: `${questionId}:answer`,
      send: async () => {
        const result = await putReading<{ isCorrect?: boolean; correctRef?: string; why?: unknown }>(
          `/api/attempt/${attemptId}/answer`,
          { questionId, optionRef },
        );
        if (!result.ok) return result.failure;

        // An unscored mode always answers with all three (doc 07 §3). A reply
        // missing any of them is this app answering something else, so it is
        // treated as a failure rather than rendered as a question with no
        // explanations — and it is not retryable, because sending the same
        // request again would produce the same reply.
        const { isCorrect, correctRef, why } = result.data;
        if (
          typeof isCorrect !== 'boolean' ||
          typeof correctRef !== 'string' ||
          why === null ||
          typeof why !== 'object'
        ) {
          return { code: 'internal_error', retryable: false };
        }
        landed = { isCorrect, correctRef, why: why as Record<string, string> };
        return null;
      },
      settled: (failed) => {
        if (failed === null) {
          // Unreachable: `send` only reports success after setting this. The
          // guard is the type's, not a case — and returning leaves the answer
          // on screen without a verdict, which is the honest reading of a
          // write that landed while saying nothing about what it scored.
          if (landed === null) return;
          const feedback = landed;
          setGraded((all) =>
            patchGraded(all, questionId, (before) => ({ ...before, isCorrect: feedback.isCorrect })),
          );
          setKeys((all) => ({ ...all, [questionId]: feedback }));
          return;
        }

        // Only a refusal repeating cannot fix reaches here; everything else is
        // still queued. The answer is put back so the question can be answered
        // again — a screen holding a choice the database refused is the exact
        // failure this project is organised against.
        setGraded((all) =>
          patchGraded(all, questionId, () => ({ optionRef: null, isCorrect: null })),
        );
        setFailure((all) => ({ ...all, [questionId]: failed }));
      },
    });
  }

  function goNext() {
    setCurrentSeq((seq) => (seq + 1 < sitting.length ? seq + 1 : seq));
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

      const answered = gradedStateFor(graded, question.id).optionRef !== null;

      const choice = CHOICE_KEYS.indexOf(event.key);
      if (choice !== -1) {
        if (answered) return;
        const option = question.options[choice];
        if (option) {
          event.preventDefault();
          answerQuestion(question.id, option.ref);
        }
        return;
      }

      // Enter and the right arrow both advance, and neither does anything
      // before an answer exists. There is no left arrow: strictly forward is
      // the rule, and a key that silently did nothing would read as a bug.
      if (event.key === 'Enter' || event.key === 'ArrowRight') {
        if (!answered) return;
        // Enter on a focused control belongs to that control, not to this.
        if (event.key === 'Enter' && target?.tagName === 'BUTTON') return;
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // Deliberately no dependency array: the handler closes over the current
    // question and what is recorded against it, so a listener registered once
    // would go on answering whatever was on screen when the sitting opened.
  });

  if (question === undefined) return null;

  const state = gradedStateFor(graded, question.id);

  return (
    <>
      <ComposedBar
        title={title}
        modeLabel={modeLabel}
        model={model}
        total={sitting.length}
        currentNumber={currentSeq + 1}
        retrying={outbox.retrying}
      />

      <div className="sitting sitting--composed">
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <ComposedQuestion
            question={question}
            number={currentSeq + 1}
            total={sitting.length}
            correct={model.correct}
            incorrect={model.incorrect}
            answer={state.optionRef}
            feedback={state.optionRef === null ? null : (keys[question.id] ?? null)}
            failure={failure[question.id] ?? null}
            onAnswer={(optionRef) => answerQuestion(question.id, optionRef)}
            onNext={goNext}
            hasNext={currentSeq < sitting.length - 1}
          />
        </div>

        <SessionRail model={model} />
      </div>
    </>
  );
}
