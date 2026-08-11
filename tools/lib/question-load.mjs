import { readFile, readdir } from 'node:fs/promises';
import { posix } from 'node:path';

export const ITEM_TYPES = ['recall', 'application', 'command', 'diagnostic', 'discrimination'];
export const PROVENANCE_KINDS = ['key', 'confusable', 'sibling', 'lookalike', 'variant', 'misconception'];
export const POOLS = ['exam', 'supplement'];

const REQUIRED_STRING = ['id', 'concept_id', 'pool', 'type', 'stem', 'rationale', 'guide_anchor'];
const OPTION_REFS = ['o1', 'o2', 'o3', 'o4'];

// Shape only. Whether the concept id exists, whether the anchor resolves,
// whether the count matches the allocation — all of that is a check in
// question-checks.mjs, because it needs the dataset and the guide. This
// function needs nothing but the item, so it can run before anything is
// loaded and give an author a fast, complete list of what is structurally
// wrong.
//
// It returns every problem it finds rather than the first. An author fixing
// forty items one run at a time is the failure mode this avoids.
export function validateItem(item, index) {
  const out = [];
  const where = item?.id ? `item ${item.id}` : `item at index ${index}`;
  if (!item || typeof item !== 'object') return [`${where} is not an object`];

  for (const field of REQUIRED_STRING) {
    if (typeof item[field] !== 'string' || item[field].length === 0) {
      out.push(`${where} is missing a non-empty ${field}`);
    }
  }
  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 5) {
    out.push(`${where} has difficulty ${item.difficulty}, expected an integer 1-5`);
  }
  if (typeof item.pool === 'string' && !POOLS.includes(item.pool)) {
    out.push(`${where} has unknown pool "${item.pool}", expected one of ${POOLS.join(', ')}`);
  }
  if (typeof item.type === 'string' && !ITEM_TYPES.includes(item.type)) {
    out.push(`${where} has unknown type "${item.type}", expected one of ${ITEM_TYPES.join(', ')}`);
  }
  if (typeof item.concept_id === 'string' && typeof item.id === 'string') {
    if (!new RegExp(`^q\\.${item.concept_id.replace(/\./g, '\\.')}\\.\\d{2}$`).test(item.id)) {
      out.push(`${where} has an id that is not q.<concept_id>.<NN> for ${item.concept_id}`);
    }
  }
  if (!Array.isArray(item.source_ids)) out.push(`${where} is missing a source_ids array`);
  if (!Array.isArray(item.commands_covered)) out.push(`${where} is missing a commands_covered array`);
  if (typeof item.waived_source !== 'boolean') out.push(`${where} is missing a boolean waived_source`);
  if (item.comparison_block !== null && typeof item.comparison_block !== 'string') {
    out.push(`${where} has a comparison_block that is neither a string nor null`);
  }
  if (item.verification !== null && (typeof item.verification !== 'object' || item.verification === null)) {
    out.push(`${where} has a verification that is neither an object nor null`);
  }

  if (!Array.isArray(item.options) || item.options.length !== 4) {
    out.push(`${where} must have exactly 4 options, found ${item.options?.length ?? 0}`);
    return out;
  }
  const refs = item.options.map((o) => o?.ref);
  if (refs.join(',') !== OPTION_REFS.join(',')) {
    out.push(`${where} must have option refs ${OPTION_REFS.join(', ')} in order, found ${refs.join(', ')}`);
  }
  const keys = item.options.filter((o) => o?.correct === true);
  if (keys.length !== 1) {
    out.push(`${where} must have exactly one option with correct: true, found ${keys.length}`);
  }
  item.options.forEach((o, i) => {
    const oWhere = `${where} option ${o?.ref ?? i}`;
    if (typeof o?.text !== 'string' || !o.text) out.push(`${oWhere} is missing text`);
    if (typeof o?.why !== 'string' || !o.why) out.push(`${oWhere} is missing why`);
    const kind = o?.provenance?.kind;
    if (!PROVENANCE_KINDS.includes(kind)) {
      out.push(`${oWhere} has unknown provenance kind "${kind}"`);
      return;
    }
    if (o.correct === true && kind !== 'key') out.push(`${oWhere} is the key but its provenance kind is "${kind}"`);
    if (o.correct !== true && kind === 'key') out.push(`${oWhere} is a distractor with provenance kind "key"`);
    if (kind === 'confusable' || kind === 'sibling' || kind === 'lookalike') {
      if (typeof o.provenance.concept_id !== 'string') out.push(`${oWhere} kind ${kind} needs a concept_id`);
    }
    if (kind === 'variant' && typeof o.provenance.command !== 'string') {
      out.push(`${oWhere} kind variant needs a command`);
    }
    if (kind === 'misconception' && typeof o.provenance.documented_at !== 'string') {
      out.push(`${oWhere} kind misconception needs a documented_at`);
    }
  });
  return out;
}

export async function loadBank(rootDir) {
  if (posix.isAbsolute(rootDir)) {
    throw new Error(
      `loadBank(rootDir) requires a path relative to the process cwd; got an absolute path: ${rootDir}`,
    );
  }
  let entries;
  try {
    entries = await readdir(rootDir, { withFileTypes: true, recursive: true });
  } catch {
    return [];
  }
  const paths = entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => posix.join(posix.relative('.', e.parentPath ?? e.path), e.name))
    .sort();

  const out = [];
  for (const path of paths) {
    const raw = await readFile(path, 'utf8');
    let doc;
    try {
      doc = JSON.parse(raw);
    } catch (cause) {
      out.push({ path, competency: null, items: [], malformed: [{ index: -1, reason: `Malformed JSON: ${cause.message}` }] });
      continue;
    }
    const items = Array.isArray(doc.items) ? doc.items : [];
    const malformed = [];
    if (typeof doc.competency !== 'string') {
      malformed.push({ index: -1, reason: 'File is missing a competency string' });
    }
    if (!Array.isArray(doc.items)) {
      malformed.push({ index: -1, reason: 'File is missing an items array' });
    }
    items.forEach((item, index) => {
      for (const reason of validateItem(item, index)) malformed.push({ index, reason });
    });
    out.push({ path, competency: doc.competency ?? null, items, malformed });
  }
  return out;
}

export function allItems(files) {
  return files.flatMap((f) => f.items.map((i) => ({ ...i, file: f.path })));
}
