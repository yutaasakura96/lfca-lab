'use client';

import { useEffect, useRef, useState } from 'react';
import { Stem } from './Stem.tsx';

export interface SittingOption {
  ref: string;
  text: string;
}

export interface SittingQuestionProps {
  attemptId: string;
  question: { id: string; seq: number; stem: string; options: SittingOption[] };
  total: number;
  /** What the database already holds for this question. The screen starts from it. */
  initial: { optionRef: string | null; flagged: boolean };
}

/** The four keys the footer advertises. A legend without behaviour would be a lie. */
const CHOICE_KEYS = ['1', '2', '3', '4'];

/**
 * Why a write did not land, and whether sending it again could ever help.
 *
 * `retryable` is the distinction the outbox (#23) will be built on, which is
 * why the error `code` is read here rather than collapsed into a boolean. A
 * transport failure or a 5xx is worth repeating; a sitting whose clock has run
 * out will refuse this request forever, and a queue that could not tell the
 * difference would retry it until the tab closed.
 */
interface WriteFailure {
  code: string;
  retryable: boolean;
}

async function put(url: string, body: unknown): Promise<WriteFailure | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { code: 'network', retryable: true };
  }

  if (response.ok) return null;
  if (response.status >= 500) return { code: 'internal_error', retryable: true };

  // Every non-2xx from this app carries `{ error: { code } }`. A body that does
  // not is a proxy or a framework page, not this app answering.
  const payload = (await response.json().catch(() => null)) as
    | { error?: { code?: string } }
    | null;
  return { code: payload?.error?.code ?? 'internal_error', retryable: false };
}

/**
 * One value that shows immediately and is written after.
 *
 * The rollback is the point. Until the outbox exists, a failed write leaves the
 * screen showing something the database does not hold, and a screen that claims
 * a thing is recorded when it is not is the exact failure this project is
 * organised against. So the value goes back to whatever the server last
 * confirmed — which is why `saved` is a ref rather than the rendered state:
 * reverting to state would revert to the optimistic value we are disowning.
 *
 * Ticket #23 replaces the rollback with a retry queue and the "Not saved —
 * retrying" chip, at which point a retryable failure keeps the value on screen
 * because it is genuinely still on its way.
 */
function useOptimisticWrite<T>(initial: T, send: (value: T) => Promise<WriteFailure | null>) {
  const [value, setValue] = useState(initial);
  const [failure, setFailure] = useState<WriteFailure | null>(null);
  const saved = useRef(initial);

  // Two clicks in quick succession are two requests, and they can land out of
  // order. A response may only speak for the screen if no later click has
  // spoken since — otherwise a slow first request could undo a fast second.
  const ticketCounter = useRef(0);

  async function write(next: T) {
    const ticket = (ticketCounter.current += 1);
    setValue(next);

    const failed = await send(next);
    if (ticket !== ticketCounter.current) return;

    if (failed === null) {
      saved.current = next;
      setFailure(null);
      return;
    }
    setValue(saved.current);
    setFailure(failed);
  }

  return { value, write, failure };
}

function failureMessage(failure: WriteFailure): string {
  switch (failure.code) {
    case 'attempt_expired':
      return "This sitting's time has run out — reload to see where it stands.";
    case 'attempt_already_submitted':
      return 'This sitting was already submitted.';
    default:
      return failure.retryable
        ? 'Not saved — put back as it was. Try again.'
        : 'Not saved — put back as it was.';
  }
}

/**
 * One question, answerable and flaggable.
 *
 * The screen updates the instant you click and the write follows — never the
 * other way round. Ninety minutes for sixty questions is fifteen seconds of
 * reading and one click, and a click that waits on a round trip spends a
 * noticeable part of that budget doing nothing.
 */
export function SittingQuestion({ attemptId, question, total, initial }: SittingQuestionProps) {
  const answer = useOptimisticWrite(initial.optionRef, (optionRef) =>
    put(`/api/attempt/${attemptId}/answer`, { questionId: question.id, optionRef }),
  );
  const flag = useOptimisticWrite(initial.flagged, (flagged) =>
    put(`/api/attempt/${attemptId}/flag`, { questionId: question.id, flagged }),
  );

  const failure = answer.failure ?? flag.failure;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      // Never steal a keystroke from something being typed into, and never from
      // a browser shortcut.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
        return;
      }

      const choice = CHOICE_KEYS.indexOf(event.key);
      if (choice !== -1) {
        const option = question.options[choice];
        if (option) {
          event.preventDefault();
          void answer.write(option.ref);
        }
        return;
      }
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        void flag.write(!flag.value);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // Deliberately no dependency array: the handler closes over the flag's
    // current value, so a listener registered once would go on toggling from
    // whatever the flag was when the question first rendered.
  });

  return (
    <div className="stack" style={{ gap: 'var(--space-5)' }}>
      <div className="qhead">
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1 className="eyebrow">
            Question {question.seq + 1} of {total}
          </h1>
          <span className="meta">No feedback until you submit</span>
        </div>

        <button
          type="button"
          className={flag.value ? 'btn btn--flag' : 'btn'}
          aria-pressed={flag.value}
          onClick={() => void flag.write(!flag.value)}
        >
          <svg
            className="ico"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill={flag.value ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.6 12.6V2.2h7.2L9.1 5.1l1.7 2.9H3.6" />
          </svg>
          {flag.value ? 'Flagged for review' : 'Flag for review'}
        </button>
      </div>

      <Stem text={question.stem} />

      <div className="opts">
        {question.options.map((option, index) => {
          const chosen = option.ref === answer.value;
          return (
            <button
              type="button"
              key={option.ref}
              className={chosen ? 'opt opt--interactive opt--selected' : 'opt opt--interactive'}
              aria-pressed={chosen}
              onClick={() => void answer.write(option.ref)}
            >
              <span className="opt__key">{String.fromCharCode(65 + index)}</span>
              <span className="opt__body">
                {/* Colour is never the only signal: the chosen option says so in
                    words and carries a glyph, so it survives greyscale. */}
                {chosen ? (
                  <span className="opt__verdict" style={{ color: 'var(--accent-ink)' }}>
                    <svg
                      className="ico"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="7" cy="7" r="4.2" fill="currentColor" />
                    </svg>
                    Selected
                  </span>
                ) : null}
                <span className="opt__text">{option.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      {failure === null ? null : (
        // The incorrect family, which is what doc 10 gives a save failure. It
        // says nothing about the answer — only about whether it was written.
        // Wrapped in a row so the chip hugs its text: a stack stretches its
        // children, and a pill the width of the page stops reading as a chip.
        <div className="row">
          <span className="chip chip--incorrect" role="status">
            {failureMessage(failure)}
          </span>
        </div>
      )}

      <div className="footer">
        <div className="row keys" style={{ gap: 'var(--space-3)' }}>
          {CHOICE_KEYS.map((key) => (
            <span className="kbd" key={key}>
              {key}
            </span>
          ))}
          <span className="meta">choose</span>
          <span className="kbd">F</span>
          <span className="meta">flag</span>
        </div>
        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn--quiet"
            disabled={answer.value === null}
            onClick={() => void answer.write(null)}
          >
            Clear answer
          </button>
        </div>
      </div>
    </div>
  );
}
