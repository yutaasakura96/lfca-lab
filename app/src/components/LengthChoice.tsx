'use client';

/**
 * How many questions a sitting asks — the segmented control doc 10 §3 draws.
 *
 * Generic over the value so practice's `20 | 40 | 60` and domain's
 * `20 | 40 | 'all'` each keep their own union. They are different types on
 * purpose (see `src/lib/requests.ts`): a weighted sitting's length is a number
 * the composer must hit exactly, while `'all'` is not a length at all — it is a
 * fact about the pool.
 *
 * A radio group rather than a row of buttons, because that is what it is: one
 * choice from a fixed set, arrow-key navigable, announced as a group with a
 * name. Buttons would need every one of those behaviours written by hand.
 */
export function LengthChoice<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  disabled = false,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="stack" style={{ gap: 'var(--space-2)', border: 0, padding: 0, margin: 0 }}>
      <legend className="eyebrow" style={{ padding: 0 }}>
        {legend}
      </legend>
      <div className="seg">
        {options.map((option) => {
          const on = option.value === value;
          return (
            <label key={String(option.value)} className={on ? 'seg__opt seg__opt--on' : 'seg__opt'}>
              {/*
                Visually replaced by the label, never removed from the page: the
                input is what carries the focus ring, the arrow keys and the
                announcement. `appearance: none` on a control that still
                occupies its box is why the ring lands where the label is.
              */}
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={on}
                disabled={disabled}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
