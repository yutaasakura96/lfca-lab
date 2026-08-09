import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function readJson(path) {
  let raw;
  try {
    raw = await readFile(path, 'utf8');
  } catch (cause) {
    throw new Error(`Could not read dataset file: ${path}`, { cause });
  }
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new Error(`Malformed JSON in dataset file: ${path}`, { cause });
  }
}

export function competencyKey(domainName, competencyName) {
  return `${domainName}::${competencyName}`;
}

export function sourceIndex(sources) {
  return new Map(sources.sources.map((s) => [s.id, s]));
}

export async function loadDataset(rootDir) {
  const competencies = await readJson(join(rootDir, 'competencies.json'));
  const sources = await readJson(join(rootDir, 'sources.json'));
  // Optional: absent in the fixtures, present in the real dataset.
  let waivers = { waived: [] };
  try { waivers = await readJson(join(rootDir, 'sourcing-waivers.json')); } catch { /* none */ }

  const topics = [];
  for (const domain of competencies.domains) {
    const doc = await readJson(join(rootDir, 'topics', domain.file));
    for (const topic of doc.topics) {
      topics.push({ ...topic, _file: domain.file });
    }
  }

  return { competencies, sources, topics, waivers };
}
