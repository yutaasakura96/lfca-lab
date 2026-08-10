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

function headingLevel(line) {
  const m = RE_HEADING.exec(line);
  return m ? m[1].length : 0;
}

function parseSources(raw) {
  const text = raw.trim();
  if (text === '' || text === 'none') return [];
  return text.split(',').map((s) => s.trim()).filter(Boolean);
}

export function parseGuideFile(path, text) {
  const lines = text.split('\n');
  const definitions = [];
  const comparisons = [];
  const pointers = [];
  const sections = [];
  const anchors = new Set();
  const links = [];
  const malformed = [];

  // Pass 1: anchors, definitions, comparisons.
  for (let i = 0; i < lines.length; i += 1) {
    const anchorMatch = RE_ANCHOR.exec(lines[i]);
    if (!anchorMatch) continue;
    const anchorId = anchorMatch[1];
    anchors.add(anchorId);

    if (anchorId.startsWith('c-')) {
      const headingLine = lines[i + 1] ?? '';
      const metaLine = lines[i + 2] ?? '';
      const heading = RE_HEADING.exec(headingLine);
      const meta = RE_META.exec(metaLine);
      if (!heading) {
        malformed.push({ line: i + 2, reason: `Anchor ${anchorId} is not followed by a heading` });
        continue;
      }
      if (!meta) {
        malformed.push({ line: i + 3, reason: `Anchor ${anchorId} is not followed by a metadata line` });
        continue;
      }
      // The block ends at the next anchor or at any heading of level 4 or shallower.
      // Level 4 must terminate too: a following "#### Quick reference" table would otherwise
      // be swallowed into this concept's blockText and could satisfy a command check by accident.
      let end = lines.length - 1;
      for (let j = i + 3; j < lines.length; j += 1) {
        const level = headingLevel(lines[j]);
        if (RE_ANCHOR.test(lines[j]) || (level > 0 && level <= 4)) {
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
      const headingLine = lines[i + 1] ?? '';
      const comparesLine = lines[i + 2] ?? '';
      const heading = RE_HEADING.exec(headingLine);
      const compares = RE_COMPARES.exec(comparesLine);
      if (!heading || !compares) {
        malformed.push({ line: i + 1, reason: `Comparison anchor ${anchorId} lacks a heading or a compares line` });
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

  // Pass 2: glossary rows, but only inside a Quick reference table.
  let currentH4 = null;
  for (let i = 0; i < lines.length; i += 1) {
    const level = headingLevel(lines[i]);
    if (level > 0 && level <= 4) currentH4 = level === 4 ? RE_HEADING.exec(lines[i])[2] : null;
    if (currentH4 !== 'Quick reference') continue;
    const row = RE_GLOSSARY_ROW.exec(lines[i]);
    if (!row || row[1] === 'Concept') continue;
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
  }

  // Pass 3: sections (h2), their contents and their apparatus.
  const h2Lines = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (headingLevel(lines[i]) === 2) h2Lines.push(i);
  }
  for (let s = 0; s < h2Lines.length; s += 1) {
    const start = h2Lines[s];
    const end = s + 1 < h2Lines.length ? h2Lines[s + 1] - 1 : lines.length - 1;
    const body = lines.slice(start, end + 1);
    sections.push({
      heading: RE_HEADING.exec(lines[start])[2],
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
    const pointer = RE_POINTER.exec(lines[i]);
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
    for (const m of lines[i].matchAll(RE_LINK)) links.push({ href: m[1], line: i + 1 });
  }

  return { path, definitions, comparisons, pointers, sections, anchors, links, malformed };
}

export async function loadGuide(rootDir) {
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
