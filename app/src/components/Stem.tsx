import type { ReactNode } from 'react';
import { splitInlineCode } from '../lib/inline-code.ts';

/**
 * Bank prose with its backticked code rendered as code.
 *
 * Rendered as elements, never as HTML. There is no `dangerouslySetInnerHTML`
 * anywhere in this component and there should never be one — the bank is
 * trusted content today, and a renderer that interprets markup is one that will
 * eventually interpret something it should not have.
 *
 * Split out from {@link Stem} for the review, where option texts and all four
 * explanations are the same markdown-ish prose the stems are. Rendering those
 * raw leaves literal backticks around every command and flag on the screen the
 * ticket calls the longest reading in the product.
 */
export function BankText({ text }: { text: string }): ReactNode {
  return splitInlineCode(text).map((segment, i) =>
    segment.code ? (
      <code className="mono" key={i}>
        {segment.text}
      </code>
    ) : (
      <span key={i}>{segment.text}</span>
    ),
  );
}

/** A question stem: prose with inline code. */
export function Stem({ text }: { text: string }) {
  return (
    <p className="stem">
      <BankText text={text} />
    </p>
  );
}
