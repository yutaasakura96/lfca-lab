'use client';

import { useState } from 'react';
import { LengthChoice } from './LengthChoice.tsx';
import { useStartSitting } from './use-start-sitting.ts';
import {
  DEFAULT_PRACTICE_LENGTH,
  WEIGHTED_SITTING_LENGTHS,
  type WeightedSittingLength,
} from '../domain/weights.ts';

/**
 * Choose a practice length and start.
 *
 * The three lengths and the default are read from `src/domain/weights.ts`, not
 * retyped: the default is decided in one place, and the selector the candidate
 * goes through is the one that must not hold a fourth opinion about it.
 *
 * No domain grid here. A practice sitting draws on all six by the official
 * weights, which is a fact about the mode rather than something to choose — the
 * page states it in prose above.
 */
export function PracticeSetup() {
  const [length, setLength] = useState<WeightedSittingLength>(DEFAULT_PRACTICE_LENGTH);
  const { busy, start } = useStartSitting();

  return (
    <div className="setup">
      <LengthChoice
        legend="Length"
        name="practice-length"
        value={length}
        onChange={setLength}
        disabled={busy}
        options={WEIGHTED_SITTING_LENGTHS.map((n) => ({ value: n, label: String(n) }))}
      />

      <div className="stack" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          disabled={busy}
          onClick={() => void start({ mode: 'practice', length })}
        >
          {busy ? 'Starting…' : 'Start practice'}
        </button>
      </div>
    </div>
  );
}
