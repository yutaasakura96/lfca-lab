import { posix } from 'node:path';
import { competencyKey } from './load.mjs';

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[/\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function domainDir(domain) {
  return domain.file.replace(/\.json$/, '');
}

export function guideIndex({ competencies }) {
  const index = new Map();
  for (const domain of competencies.domains) {
    const dir = domainDir(domain);
    for (const competency of domain.competencies) {
      const slug = slugify(competency.name);
      index.set(competencyKey(domain.name, competency.name), {
        domain: domain.name,
        competency: competency.name,
        dir,
        slug,
        path: `study-guide/${dir}/${slug}.md`,
        domainIndexPath: `study-guide/${dir}.md`,
      });
    }
  }
  return index;
}

export function guidePathFor(topic, index) {
  const entry = index.get(competencyKey(topic.domain, topic.competency));
  if (!entry) {
    throw new Error(
      `No guide file for concept ${topic.id}: unknown competency ${topic.domain}::${topic.competency}`,
    );
  }
  return entry.path;
}

export function relativeGuideLink(fromPath, toPath, anchor) {
  const rel = posix.relative(posix.dirname(fromPath), toPath);
  return anchor ? `${rel}#${anchor}` : rel;
}
