import { readdir, readFile } from 'node:fs/promises';
import { posix } from 'node:path';

const RE_ANCHOR = /^<a id="([^"]+)"><\/a>$/;
const RE_HEADING = /^(#{1,6}) +(.+?)\s*$/;
const RE_META =
  /^\*id: `([^`]+)` · depth (\d) · importance (\d) · LFS200: ([A-Z][A-Z ]*[A-Z]) · sources: (.*)\*$/;
const RE_COMPARES = /^\*compares: (.+)\*$/;
const RE_GLOSSARY_ROW = /^\| *`([^`]+)` *\|/;
const RE_POINTER = /^\*Not to be confused with \[[^\]]*\]\(([^)]+)\)\.\*$/;
const RE_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;
// A row that trims to a blockquote or list marker directly followed by a
// pipe — e.g. "> | `id` | Term |" or "- | `id` | Term |" — is an attempted
// Quick reference row that `RE_GLOSSARY_ROW` cannot see, because it never
// reaches the leading "|". Captured group 1 is the offending prefix, used
// to name it in the `malformed` entry.
const RE_ROW_PREFIX = /^(>|[-*+]|\d+\.) *\|/;
// A fence opener/closer: up to three leading spaces, then a run of three or
// more backticks or tildes, then the rest of the line (an info string on an
// opener, or nothing but whitespace on a genuine closer — checked by the
// caller, not by this regex, since the same shape matches both roles).
const RE_FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

function headingLevel(line) {
  const m = RE_HEADING.exec(line);
  return m ? m[1].length : 0;
}

function parseSources(raw) {
  const text = raw.trim();
  if (text === '' || text === 'none') return [];
  return text.split(',').map((s) => s.trim()).filter(Boolean);
}

// Fence membership is computed once, up front, over the whole file, so
// every pass consults the same answer instead of each re-deriving (or
// forgetting to derive) it. A line is "in fence" if it is a fence
// delimiter line itself, or falls strictly between an opening and a
// matching closing delimiter.
//
// A closing delimiter must use the same character as the opener (backtick
// closes only backtick, tilde only tilde), must be at least as long as the
// opener (four backticks are not closed by three), and must have nothing
// but whitespace after the delimiter run (so an opener's info string, e.g.
// "```bash", is accepted on open but a line that merely starts with a
// matching-length run followed by other text does not close the fence). A
// fence that is opened but never validly closed stays open to end of file.
function computeFenceLines(matchLines) {
  const inFence = new Array(matchLines.length).fill(false);
  let openChar = null;
  let openLen = 0;
  for (let i = 0; i < matchLines.length; i += 1) {
    const m = RE_FENCE.exec(matchLines[i]);
    if (openChar === null) {
      if (!m) continue;
      inFence[i] = true;
      openChar = m[1][0];
      openLen = m[1].length;
      continue;
    }
    inFence[i] = true;
    if (m && m[1][0] === openChar && m[1].length >= openLen && m[2].trim() === '') {
      openChar = null;
      openLen = 0;
    }
  }
  return inFence;
}

export function parseGuideFile(path, text) {
  // Split on \r?\n so a CRLF-saved file does not leave a trailing \r on every
  // line (which would otherwise defeat every $-anchored regex below). Marker
  // regexes match against `matchLines` (right-trimmed) rather than `lines`
  // (verbatim) so trailing whitespace on a marker line cannot silently drop
  // it either. This is the single normalisation point for both: a regex
  // added later that forgets to handle CRLF/trailing-whitespace on its own
  // still benefits from it, because it should be written against
  // `matchLines`. `blockText` and other captured prose still read from
  // `lines` so it keeps its exact original bytes.
  //
  // `inFence` is the same kind of shared, once-computed answer, for a
  // different question: whether marker recognition should even look at a
  // given line. A fenced code block is where the guide's own style
  // documentation shows worked examples of the marker grammar — an anchor,
  // a compares line, a pointer sentence, a glossary row — and those
  // examples must never be mistaken for the real thing. Every pass that
  // recognises a marker checks `inFence` first, so a pass added later
  // cannot forget to. Fence status never affects `blockText`: block extent
  // and text capture read `lines`/`matchLines` exactly as before, so a
  // command shown inside a fence inside a concept's own body still appears
  // in that concept's `blockText` verbatim.
  const lines = text.split(/\r?\n/);
  const matchLines = lines.map((l) => l.replace(/[ \t]+$/, ''));
  const inFence = computeFenceLines(matchLines);
  const definitions = [];
  const comparisons = [];
  const pointers = [];
  const sections = [];
  const anchors = new Set();
  const links = [];
  const malformed = [];

  // Pass 1: anchors, definitions, comparisons.
  for (let i = 0; i < lines.length; i += 1) {
    // A fenced anchor line is a documentation example, not a real marker:
    // skip it before it can register in `anchors`, become a definition or
    // comparison, or even generate a `malformed` entry — an example that
    // deliberately shows the malformed form is still just an example.
    if (inFence[i]) continue;
    const anchorMatch = RE_ANCHOR.exec(matchLines[i]);
    if (!anchorMatch) continue;
    const anchorId = anchorMatch[1];
    anchors.add(anchorId);

    if (anchorId.startsWith('c-')) {
      const headingLine = matchLines[i + 1] ?? '';
      const metaLine = matchLines[i + 2] ?? '';
      const heading = RE_HEADING.exec(headingLine);
      const meta = RE_META.exec(metaLine);
      if (!heading) {
        malformed.push({ line: i + 2, reason: `Anchor ${anchorId} is not followed by a heading` });
        continue;
      }
      if (!meta) {
        malformed.push({
          line: i + 3,
          reason: `Anchor ${anchorId} is not followed by a metadata line that matches the required form: "${lines[i + 2] ?? ''}"`,
        });
        continue;
      }
      // The block ends at the next anchor or at any heading of level 4 or shallower.
      // Level 4 must terminate too: a following "#### Quick reference" table would otherwise
      // be swallowed into this concept's blockText and could satisfy a command check by accident.
      let end = lines.length - 1;
      for (let j = i + 3; j < lines.length; j += 1) {
        const level = headingLevel(matchLines[j]);
        if (RE_ANCHOR.test(matchLines[j]) || (level > 0 && level <= 4)) {
          end = j - 1;
          break;
        }
      }
      definitions.push({
        id: meta[1],
        kind: 'topic',
        line: i + 1,
        term: heading[2],
        meta: {
          depth: Number(meta[2]),
          importance: Number(meta[3]),
          coverage: meta[4],
          sources: parseSources(meta[5]),
        },
        blockStart: i,
        blockEnd: end,
        blockText: lines.slice(i, end + 1).join('\n'),
      });
      continue;
    }

    if (anchorId.startsWith('cmp-')) {
      const headingLine = matchLines[i + 1] ?? '';
      const comparesLine = matchLines[i + 2] ?? '';
      const heading = RE_HEADING.exec(headingLine);
      const compares = RE_COMPARES.exec(comparesLine);
      if (!heading) {
        malformed.push({
          line: i + 2,
          reason: `Comparison anchor ${anchorId} is not followed by a heading`,
        });
        continue;
      }
      if (!compares) {
        malformed.push({
          line: i + 3,
          reason: `Comparison anchor ${anchorId} is not followed by a compares line that matches the required form: "${lines[i + 2] ?? ''}"`,
        });
        continue;
      }
      comparisons.push({
        owner: anchorId.slice('cmp-'.length),
        anchor: anchorId,
        line: i + 1,
        heading: heading[2],
        compares: compares[1].split(',').map((s) => s.trim().replace(/^`|`$/g, '')).filter(Boolean),
      });
    }
  }

  // Pass 2: glossary rows, but only inside a Quick reference section.
  //
  // Round 3 replaces the round-2 "first contiguous run of table rows" state
  // machine outright. That rule could not tell a genuinely separate second
  // table from the *same* table interrupted by a blank line, an HTML
  // comment, or a whitespace-only line: any of those ended the run, so a
  // well-formed backticked row after the interruption was dropped with no
  // definition and no `malformed` entry.
  //
  // There is no run state and no positional adjacency test now. Membership
  // is decided purely by (a) which section a line sits in — a Quick
  // reference section runs from its heading to the next heading of any
  // level — and (b) the line's own shape:
  //   - the header row (first cell "Concept") is skipped;
  //   - a separator row (first cell only dashes/colons) is skipped;
  //   - a row whose first cell is a backticked concept id becomes a
  //     glossary definition;
  //   - every other table row is reported as malformed — including a row
  //     belonging to a second table under the same heading, since this
  //     guide's format holds exactly one glossary table per section and a
  //     second one is itself a format violation, not a false positive.
  //
  // Whether a line "is a table row" is judged after stripping leading
  // whitespace only: `trimStart()` removes indentation added by
  // hand-editing, so an indented row is still recognised as one. It does
  // NOT remove a leading blockquote or list marker (`>`, `-`, `*`, `+`, an
  // ordered `1.`) — those are real characters, not whitespace, so a row
  // nested in a list or blockquote still fails the "starts with |" test
  // after trimming and is not, on its own, recognised as a row. That case
  // is not silently dropped, though: a line that trims to one of those
  // prefixes directly followed by a pipe is recognised as an attempted row
  // and reported in `malformed`, naming the offending prefix, rather than
  // vanishing with no trace. Blank lines, HTML comments and whitespace-only
  // lines are simply not table rows: they are ignored without ending or
  // interrupting anything. A marker the parser fails to recognise must
  // always surface in `malformed` — never vanish silently.
  let inQuickReference = false;
  for (let i = 0; i < lines.length; i += 1) {
    // A fenced line is inert here too: it cannot open, close, or belong to
    // a Quick reference section, and a backticked row shown inside a fence
    // as a style example produces neither a definition nor a `malformed`
    // entry.
    if (inFence[i]) continue;
    const level = headingLevel(matchLines[i]);
    if (level > 0) {
      const headingText = RE_HEADING.exec(matchLines[i])[2];
      // Matched case-insensitively so a capitalisation typo (e.g. "Quick
      // Reference") is still recognised as an attempted Quick reference
      // heading and reported, rather than silently setting no section and
      // dropping every row beneath it.
      const isQuickReferenceHeading = headingText.toLowerCase() === 'quick reference';
      if (isQuickReferenceHeading) {
        const isWellFormed = headingText === 'Quick reference' && level === 4;
        if (!isWellFormed) {
          malformed.push({
            line: i + 1,
            reason: `"Quick reference" heading must read exactly "Quick reference" at level 4, found "${headingText}" at level ${level}: "${matchLines[i]}"`,
          });
        }
        inQuickReference = isWellFormed;
      } else {
        inQuickReference = false;
      }
      continue;
    }
    if (!inQuickReference) continue;
    const trimmed = matchLines[i].trimStart();
    if (!trimmed.startsWith('|')) {
      // Whitespace-only indentation was already stripped above, so if the
      // line still doesn't start with "|" it's either genuinely unrelated
      // content (blank, prose, an HTML comment — ignored) or a row wrapped
      // in a blockquote/list marker, which must be reported rather than
      // dropped.
      const prefixed = RE_ROW_PREFIX.exec(trimmed);
      if (prefixed) {
        malformed.push({
          line: i + 1,
          reason: `Quick reference row is prefixed by "${prefixed[1]}" (a blockquote or list marker), which is not recognised as part of the table row: "${matchLines[i]}"`,
        });
      }
      continue;
    }
    const row = RE_GLOSSARY_ROW.exec(trimmed);
    if (row) {
      definitions.push({
        id: row[1],
        kind: 'glossary',
        line: i + 1,
        term: (lines[i].split('|')[2] ?? '').trim(),
        meta: null,
        blockStart: i,
        blockEnd: i,
        blockText: lines[i],
      });
      continue;
    }
    // Not header ("| Concept | ..."), not the "| --- |" separator, and not a
    // backticked id: a data row the parser cannot recognise. Report it
    // rather than silently dropping the concept it would have defined.
    const firstCell = (trimmed.split('|')[1] ?? '').trim();
    if (firstCell === 'Concept' || /^:?-{1,}:?$/.test(firstCell)) continue;
    malformed.push({
      line: i + 1,
      reason: `Quick reference row's first cell is not a backticked concept id: "${matchLines[i]}"`,
    });
  }

  // Pass 3: sections (h2), their contents and their apparatus.
  const h2Lines = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (headingLevel(matchLines[i]) === 2) h2Lines.push(i);
  }
  for (let s = 0; s < h2Lines.length; s += 1) {
    const start = h2Lines[s];
    const end = s + 1 < h2Lines.length ? h2Lines[s + 1] - 1 : lines.length - 1;
    const body = matchLines.slice(start, end + 1);
    sections.push({
      heading: RE_HEADING.exec(matchLines[start])[2],
      line: start + 1,
      endLine: end + 1,
      definitionIds: definitions
        .filter((d) => d.blockStart >= start && d.blockStart <= end)
        .map((d) => d.id),
      hasScenario: body.some((l) => /^#### +Scenario\s*$/.test(l)),
      hasKnowledgeCheck: body.some((l) => /^#### +Knowledge check\s*$/.test(l)),
    });
  }

  // Pass 4: pointers and links.
  const dir = posix.dirname(path);
  for (let i = 0; i < lines.length; i += 1) {
    // A fenced pointer sentence is a style-guide example, not a real
    // cross-reference: skip the whole line so it registers neither as a
    // pointer nor as a generic link.
    if (inFence[i]) continue;
    const pointer = RE_POINTER.exec(matchLines[i]);
    if (pointer) {
      const [rel, anchor] = pointer[1].split('#');
      const owner = definitions.find(
        (d) => d.kind === 'topic' && i >= d.blockStart && i <= d.blockEnd,
      );
      pointers.push({
        href: pointer[1],
        targetPath: rel === '' ? path : posix.normalize(posix.join(dir, rel)),
        targetAnchor: anchor ?? null,
        line: i + 1,
        conceptId: owner ? owner.id : null,
      });
    }
    for (const m of matchLines[i].matchAll(RE_LINK)) links.push({ href: m[1], line: i + 1 });
  }

  return { path, definitions, comparisons, pointers, sections, anchors, links, malformed };
}

export async function loadGuide(rootDir) {
  // Paths are built with posix.relative('.', ...), so the returned paths are
  // only repo-relative — the shape downstream checks compare by string
  // equality — when rootDir is itself relative to the process cwd. An
  // absolute rootDir would silently produce paths in the wrong shape, so
  // reject it outright instead of returning nonsense.
  if (posix.isAbsolute(rootDir)) {
    throw new Error(
      `loadGuide(rootDir) requires a path relative to the process cwd; got an absolute path: ${rootDir}`,
    );
  }
  let entries;
  try {
    entries = await readdir(rootDir, { withFileTypes: true, recursive: true });
  } catch {
    return [];
  }
  const paths = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => posix.join(posix.relative('.', e.parentPath ?? e.path), e.name))
    .sort();
  const out = [];
  for (const p of paths) {
    out.push(parseGuideFile(p, await readFile(p, 'utf8')));
  }
  return out;
}
