import { splitInlineCode } from '../lib/inline-code.ts';

/**
 * A question stem: prose with inline code.
 *
 * Rendered as elements, never as HTML. There is no `dangerouslySetInnerHTML`
 * anywhere in this component and there should never be one — the bank is
 * trusted content today, and a renderer that interprets markup is one that will
 * eventually interpret something it should not have.
 */
export function Stem({ text }: { text: string }) {
  return (
    <p className="stem">
      {splitInlineCode(text).map((segment, i) =>
        segment.code ? (
          <code className="mono" key={i}>
            {segment.text}
          </code>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
