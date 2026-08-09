#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { loadDataset } from './lib/load.mjs';
import {
  renderObjectives, renderLfs200Map, renderGapAnalysis,
  renderCandidateExperience, renderSources, renderCoverageMatrix,
} from './lib/views.mjs';

const dataset = await loadDataset('data');
await mkdir('research', { recursive: true });

const outputs = [
  ['research/official-lfca-objectives.md', renderObjectives(dataset)],
  ['research/lfs200-map.md', renderLfs200Map(dataset)],
  ['research/lfca-lfs200-gap-analysis.md', renderGapAnalysis(dataset)],
  ['research/candidate-experience.md', renderCandidateExperience(dataset)],
  ['research/sources.md', renderSources(dataset)],
  ['coverage-matrix.md', renderCoverageMatrix(dataset)],
];

for (const [path, content] of outputs) {
  await writeFile(path, content.endsWith('\n') ? content : `${content}\n`);
  console.log(`wrote ${path}`);
}
