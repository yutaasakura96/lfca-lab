'use client';

import { useState } from 'react';
import { LengthChoice } from './LengthChoice.tsx';
import { useStartSitting } from './use-start-sitting.ts';
import { DEFAULT_DOMAIN_LENGTH, DOMAIN_SITTING_LENGTHS, type DomainLength } from '../domain/select.ts';
import type { Domain } from '../domain/weights.ts';

/**
 * One domain's card, as the server hands it over.
 *
 * `lastPractised` arrives as the finished words rather than an instant, because
 * the label is a pure function of a date and a `now` — and `now` belongs on the
 * server, where the rest of this screen's numbers are decided. Sending the
 * instant instead would put a second clock in the browser for a soft label.
 */
/**
 * At least one card. The six domains are a fact about the bank, so an empty
 * grid means a broken seed rather than an empty state — stated in the type so
 * the component needs no `!` and no defensive branch for a case that would be
 * a bug rather than a condition.
 */
export type NonEmptyDomains = readonly [DomainCard, ...DomainCard[]];

export interface DomainCard {
  domain: Domain;
  name: string;
  weightPercent: number;
  competencies: string[];
  available: number;
  seen: number;
  lastPractised: string;
}

/**
 * Doc 10 §3's grid and setup strip: pick a domain, pick a length, start.
 *
 * A radio group, not a row of buttons. It is one choice from six, so the
 * browser's own arrow-key navigation and group announcement are the right
 * behaviour, and a `<label>` may contain the heading a `<button>` may not.
 *
 * **Selection is client state, not a URL parameter.** All six cards' figures
 * are already rendered, so choosing between them changes nothing the server
 * knows — and nothing links to a pre-selected domain.
 */
export function DomainSetup({ domains }: { domains: NonEmptyDomains }) {
  const [selected, setSelected] = useState<Domain>(domains[0].domain);
  const [length, setLength] = useState<DomainLength>(DEFAULT_DOMAIN_LENGTH);
  const { busy, start } = useStartSitting();

  // Falls back rather than asserting: `selected` starts as the first card's
  // domain and only ever moves to another card's, so the find cannot miss —
  // and a `!` here would turn a future bug into a blank screen.
  const chosen = domains.find((d) => d.domain === selected) ?? domains[0];

  return (
    <>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="eyebrow" style={{ padding: 0, marginBottom: 'var(--space-3)' }}>
          Domain
        </legend>

        <div className="domgrid">
          {domains.map((d) => {
            const on = d.domain === selected;
            return (
              <label key={d.domain} className={on ? 'card domcard domcard--on' : 'card domcard'}>
                <input
                  type="radio"
                  name="domain"
                  value={d.domain}
                  checked={on}
                  disabled={busy}
                  onChange={() => setSelected(d.domain)}
                />

                <div
                  className="row"
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                  }}
                >
                  <h2 className="h2" style={{ fontSize: 'var(--text-base)' }}>
                    {d.name}
                  </h2>
                  <span className="chip dchip">{d.weightPercent}% of exam</span>
                </div>

                <div className="comps">
                  {d.competencies.map((c) => (
                    <span className="comp" key={c}>
                      {c}
                    </span>
                  ))}
                </div>

                <div
                  className="stack"
                  style={{
                    gap: 'var(--space-2)',
                    marginTop: 'auto',
                    paddingTop: 'var(--space-3)',
                  }}
                >
                  {/*
                    Coverage, not mastery: how much of this domain has been
                    answered, never how well it went. The meter doc 10 §3 draws
                    is cut — see the decision log, 2026-09-06.
                  */}
                  <span className="meta">
                    {d.seen} of {d.available} seen
                  </span>
                  <span className="meta">Last practised {d.lastPractised}</span>
                </div>

                {/*
                  Selected is said as well as tinted. The accent border and fill
                  would be the state carried by colour alone, which doc 05's
                  rule 4 forbids — and this grid has to be usable in grayscale
                  like everything else.
                */}
                <span className="dpick" aria-hidden="true">
                  {on ? <span className="chip chip--accent dchip">Selected</span> : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="card setup setup--sticky">
        <div className="stack setup__id" style={{ gap: 'var(--space-2)' }}>
          <span className="eyebrow">Selected</span>
          <div className="row" style={{ gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="h2">{chosen.name}</span>
            <span className="chip chip--accent setup__avail">{chosen.available} questions available</span>
          </div>
          <span className="meta">
            {chosen.competencies.join(' · ')} · {chosen.seen} of {chosen.available} seen
          </span>
        </div>

        <div className="row setup__controls" style={{ gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <LengthChoice
            legend="Length"
            name="domain-length"
            value={length}
            onChange={setLength}
            disabled={busy}
            // Read from the one list the request schema also validates
            // against. `all` shows the real availability rather than a round
            // number: it is what a sitting of `all` actually produces, holdout
            // already excluded.
            options={DOMAIN_SITTING_LENGTHS.map((value) => ({
              value,
              label: value === 'all' ? `All ${chosen.available}` : String(value),
            }))}
          />

          <button
            type="button"
            className="btn btn--primary btn--lg"
            disabled={busy}
            onClick={() => void start({ mode: 'domain', domain: selected, length })}
          >
            {busy ? (
              'Starting…'
            ) : (
              <>
                {/* Both labels are in the markup, and CSS shows whichever the
                    width can carry — the same device `.score__label` uses. At
                    375 the long label pushes the length control onto its own
                    line and the sticky bar swallows the card behind it. */}
                <span className="wideonly">Start domain practice</span>
                <span className="narrowonly">Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
