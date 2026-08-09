import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
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

  const topics = [];
  for (const domain of competencies.domains) {
    const doc = await readJson(join(rootDir, 'topics', domain.file));
    for (const topic of doc.topics) {
      topics.push({ ...topic, _file: domain.file });
    }
  }

  return { competencies, sources, topics };
}
