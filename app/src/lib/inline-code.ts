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

/**
 * Separators a path, a URL or a flag may be broken after.
 *
 * Deliberately not `_`: `ip_local_port_range` reads as one name, and the CSS
 * backstop already covers a run that genuinely has nowhere to break.
 */
const SEPARATORS = new Set(['/', ':', '.', '-']);

/**
 * Split a code span into the runs a line may be broken between.
 *
 * Mono code does not wrap on its own — there is no space in
 * `/proc/sys/net/ipv4/ip_local_port_range` for a browser to break at — so at
 * 375px a long path spills past the right edge of its option card. Rendering
 * `<wbr>` between these runs gives the browser somewhere to break that a reader
 * of commands would have chosen anyway: after a separator, never inside a
 * segment.
 *
 * A run of separators stays whole, so `https://` breaks as a unit rather than
 * leaving `https:` at the end of a line looking like a different URL. Each run
 * carries its own trailing separators, which is what puts the break *after*
 * them.
 *
 * This is not the whole fix. An identifier with no separator at all —
 * `KbdInteractiveAuthentication` — comes back as one run, and `overflow-wrap:
 * anywhere` on `code` in the design system's `base.css` is what catches it.
 * CSS only breaks mid-token when no other opportunity exists, so wherever a
 * separator is present these runs win and the arbitrary break never happens.
 */
export function splitOnSeparators(code: string): string[] {
  const runs: string[] = [];
  let run = '';
  let i = 0;

  while (i < code.length) {
    const char = code[i]!;
    run += char;
    i += 1;
    if (!SEPARATORS.has(char)) continue;

    while (i < code.length && SEPARATORS.has(code[i]!)) {
      run += code[i]!;
      i += 1;
    }
    runs.push(run);
    run = '';
  }

  if (run.length > 0) runs.push(run);
  return runs;
}
