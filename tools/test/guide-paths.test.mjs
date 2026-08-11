import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  slugify,
  domainDir,
  guideIndex,
  guidePathFor,
  relativeGuideLink,
} from '../lib/guide-paths.mjs';

const competencies = {
  domains: [
    {
      id: 'sysadmin',
      name: 'System Administration Fundamentals',
      file: '02-system-administration.json',
      competencies: [{ name: 'Networking' }, { name: 'Best Practices' }],
    },
    {
      id: 'cloud',
      name: 'Cloud Computing Fundamentals',
      file: '03-cloud-computing.json',
      competencies: [{ name: 'Performance/Availability' }],
    },
  ],
};

test('slugify lowercases and replaces slashes and spaces', () => {
  assert.equal(slugify('Performance/Availability'), 'performance-availability');
  assert.equal(slugify('Open Source Software and Licensing'), 'open-source-software-and-licensing');
  assert.equal(slugify('Best Practices'), 'best-practices');
});

test('domainDir strips the .json extension from the dataset file name', () => {
  assert.equal(domainDir({ file: '02-system-administration.json' }), '02-system-administration');
});

test('guideIndex maps every competency key to its file paths', () => {
  const index = guideIndex({ competencies });
  assert.equal(index.size, 3);
  const entry = index.get('System Administration Fundamentals::Networking');
  assert.equal(entry.path, 'study-guide/02-system-administration/networking.md');
  assert.equal(entry.domainIndexPath, 'study-guide/02-system-administration.md');
});

test('the same competency name in two domains resolves to two different files', () => {
  const index = guideIndex({
    competencies: {
      domains: [
        { name: 'A', file: '02-a.json', competencies: [{ name: 'Best Practices' }] },
        { name: 'B', file: '03-b.json', competencies: [{ name: 'Best Practices' }] },
      ],
    },
  });
  assert.equal(index.get('A::Best Practices').path, 'study-guide/02-a/best-practices.md');
  assert.equal(index.get('B::Best Practices').path, 'study-guide/03-b/best-practices.md');
});

test('guidePathFor resolves a topic to its competency file', () => {
  const index = guideIndex({ competencies });
  const topic = {
    id: 'sysadmin.networking.dns',
    domain: 'System Administration Fundamentals',
    competency: 'Networking',
  };
  assert.equal(guidePathFor(topic, index), 'study-guide/02-system-administration/networking.md');
});

test('guidePathFor names the concept when the competency is unknown', () => {
  const index = guideIndex({ competencies });
  assert.throws(
    () => guidePathFor({ id: 'x.y.z', domain: 'Nope', competency: 'Nope' }, index),
    /x\.y\.z/,
  );
});

test('relativeGuideLink is bare within a directory and relative across one', () => {
  assert.equal(
    relativeGuideLink(
      'study-guide/02-system-administration/networking.md',
      'study-guide/02-system-administration/system-administration.md',
      'cmp-a.b.c',
    ),
    'system-administration.md#cmp-a.b.c',
  );
  assert.equal(
    relativeGuideLink(
      'study-guide/02-system-administration/networking.md',
      'study-guide/04-security/security.md',
      'cmp-a.b.c',
    ),
    '../04-security/security.md#cmp-a.b.c',
  );
  assert.equal(
    relativeGuideLink('study-guide/README.md', 'study-guide/01-linux-fundamentals.md', null),
    '01-linux-fundamentals.md',
  );
});
