// Rendering a stem's backticked code.
//
// Question stems are markdown-ish: prose with `commands` and `--flags` in
// backticks. They are rendered as text with inline code and **never** as HTML.
// The bank is trusted content, but "trusted" is a property of today's bank, and
// a renderer that interprets markup is a renderer that will one day interpret
// something it should not have.
//
// So this returns segments for React to render as elements, rather than a
// string for anything to inject.

export interface StemSegment {
  code: boolean;
  text: string;
}

/**
 * Split a stem on backtick pairs.
 *
 * An unmatched trailing backtick is kept as literal text rather than treated as
 * an opening delimiter with no close — a stem that ends mid-quote should look
 * slightly wrong, not swallow the rest of the question.
 */
export function splitInlineCode(stem: string): StemSegment[] {
  const segments: StemSegment[] = [];
  let rest = stem;

  while (rest.length > 0) {
    const open = rest.indexOf('`');
    if (open === -1) {
      segments.push({ code: false, text: rest });
      break;
    }

    const close = rest.indexOf('`', open + 1);
    if (close === -1) {
      segments.push({ code: false, text: rest });
      break;
    }

    if (open > 0) segments.push({ code: false, text: rest.slice(0, open) });
    segments.push({ code: true, text: rest.slice(open + 1, close) });
    rest = rest.slice(close + 1);
  }

  return segments.filter((segment) => segment.text.length > 0);
}
