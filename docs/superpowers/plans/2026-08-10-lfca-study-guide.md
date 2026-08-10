# LFCA Study Guide (Cycle 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn cycle 1's 537-concept dataset into `study-guide/` — 31 hand-written documents that teach every concept — plus a harness that proves the prose covers the dataset.

**Architecture:** Four new library modules and two CLIs under `tools/` compute the writing plan from `data/` and verify the written guide against it. `npm run guide-plan` hands each writer a deterministic brief; `npm run check-guide` is the gate. The prose itself is hand-written by one subagent per competency file, reviewed independently, then fact-checked adversarially over commands and over the 57 unsourced concepts.

**Tech Stack:** Plain Node ESM, zero dependencies, `node:test`. Matches cycle 1's `tools/lib/*.mjs` + `tools/test/*.test.mjs` structure exactly.

**Spec:** `docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

- **`npm test` and `npm run validate` must exit 0 at the end of every task.** Baseline at plan time: 49 tests passing, validate exit 0 with 16 expected warnings (10 `orphan-source`, 6 `inferred-ratio`).
- **`tools/validate.mjs` and its 18 data checks are not modified.** The guide is a separate artifact with separate invariants in a separate script.
- **`research/**` and `coverage-matrix.md` are generated. Never hand-edit them.** Two hand-written exceptions, both marked in their own headers: `research/exam-mechanics.md` and `research/lfs200-notes/00-course-map.md`.
- **When `data/` changes, run `npm run generate` in the same task** so generated views follow, and record the change in `PROGRESS.md`.
- **No exam dumps.** Never search for, open, or source from one. The cycle-1 exclusion list stands; any new site encountered is excluded on sight and logged in `PROGRESS.md`.
- **LFS200 is copyrighted.** No course prose is reproduced. The guide may cite `research/lfs200-notes/00-course-map.md` and may state that a lesson covers a topic.
- **No question count.** The Linux Foundation publishes none. Never state or imply one.
- **`candidate_evidence` stays empty on all 537 concepts.** No public post-2025 candidate evidence exists; none is invented.
- **Exam facts, fixed:** effective 2025-09-16; weights Linux 16 / SysAdmin 30 / Cloud 18 / Security 14 / DevOps 12 / PM 10; 90 minutes; multiple choice; 75% to pass; no practical component; certification valid 2 years.
- **Commit style:** subject line only, `<type>: <short imperative>`. No heredocs, no `Co-Authored-By` trailers.
- **Each task ends with an independent review** before the next task starts.

---

## File Structure

**New library modules** (`tools/lib/`), each with one responsibility:

| File | Responsibility |
| --- | --- |
| `guide-paths.mjs` | Competency → guide file path, slugs, relative links between guide files |
| `comparisons.mjs` | The `confused_with` graph read undirected: edges, deterministic block assignment |
| `guide-parse.mjs` | Read and parse `study-guide/**.md` into structured records |
| `guide-checks.mjs` | The 14 guide checks over (dataset, parsed guide) |

**New CLIs** (`tools/`): `guide-plan.mjs`, `check-guide.mjs`.

**New tests** (`tools/test/`): `guide-paths.test.mjs`, `comparisons.test.mjs`, `guide-parse.test.mjs`, `guide-checks.test.mjs`.

**New fixtures** (`tools/test/fixtures/guide/`): a self-contained dataset for guide tests. The existing `tools/test/fixtures/` set is **not** modified — the 49 existing tests assert against it.

**New content** (`study-guide/`): 1 README + 6 domain indexes + 22 competency files + 2 appendices.

---

## Writing Task Protocol

**Normative.** Tasks 8–29 each write one competency file. They differ only in the parameters stated in the task. This protocol is the full procedure for all of them; it is not a summary.

**Step A — get the brief.**

```bash
node tools/guide-plan.mjs "<Domain> :: <Competency>"
```

The brief lists, from `data/`: every concept with its `required_depth`, `importance`, `commands`, `notes`, `coverage_status`, `additional_sources`, `description` and `confused_with`, grouped by `path[2]` section; every comparison block this file **owns**, with full membership; every block this file must **point to**, with the exact relative path and anchor. Do not compute any of this by hand.

**Step B — read the inputs.** The spec (`docs/superpowers/specs/2026-08-10-lfca-study-guide-design.md`), the style guide (`study-guide/STYLE.md`), and the pilot file (`study-guide/01-linux-fundamentals/linux-operating-system.md`) as the worked reference for tone and formatting.

**Step C — write the file.** Structure:

```markdown
# <Competency>

<one-paragraph orientation: what this competency is, its domain's exam weight,
whether it is new in 2025, and its LFS200 coverage position from cycle 1>

<a id="s-<slug>-<section-slug>"></a>
## <path[2] section name>

<a id="c-<concept-id>"></a>
### <Term>
*id: `<concept-id>` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-4632-cidr*

**What it is** ...
**Why it matters** ...
**How it works** ...
**Key terms** ...
**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |

**Traps** ...
**What the exam may test** ...

<a id="cmp-<owner-id>"></a>
#### Not to be confused with: <A> vs <B>
*compares: `<owner-id>`, `<member-id>`*

<comparison table, then a sentence naming the one axis that separates them>

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `<depth-1-concept-id>` | ... | ... | ... |

#### Scenario

<one worked situation covering this section's concepts together>

#### Knowledge check

<3-6 recall/discrimination prompts, then their answers>
```

**Rules, all machine-checked:**

1. Every concept in the brief gets exactly one definition site — a `### ` topic for depth ≥ 2, a Quick reference row for depth 1.
2. Body labels by depth: depth 2 needs What it is / Why it matters / How it works / Key terms. Depth 3+ adds Traps and What the exam may test, plus a Commands table where the concept has a non-empty `commands` array. Depth 4 adds `**Symptoms and diagnostic order**`. Depth 5 adds `**Syntax worth memorising**`.
3. Every string in a concept's `commands` array appears **verbatim** inside a code span or fence in that concept's block.
4. Every owned comparison block is written once, with `compares:` exactly as the brief gives it, owner first. Every block the file must point to gets a one-line `*Not to be confused with [X](path#cmp-id).*` inside the relevant concept's block.
5. Every section containing a definition site has a `#### Scenario` and a `#### Knowledge check`.
6. **Knowledge checks are never multiple choice.** Recall and discrimination prompts with answers. Cycle 3 owns MCQs.
7. Concepts named in `data/sourcing-waivers.json` carry, inside their block, verbatim:
   `*No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*`
8. The metadata line's depth, importance and LFS200 status must match `data/` exactly. Source ids must exist in `data/sources.json`.
9. **Teach the distinction, not the definition.** The dataset writes "monitoring observes; alerting interrupts"; carry that voice. A topic that only defines its term has failed. The `notes` field frequently names the exam trap outright — it is a primary input to Traps and What the exam may test, not decoration.
10. Word targets: depth 1 ~40, depth 2 ~200, depth 3 ~450, depth 4 ~650, depth 5 ~800. These are targets, not limits; clarity wins.
11. No emojis.

**Step D — check.**

```bash
node tools/check-guide.mjs --scope "<Domain> :: <Competency>"
```

Expected: `0 error(s)`. Fix and re-run until clean.

**Step E — full gates.**

```bash
npm test && npm run validate
```

Expected: both exit 0.

**Step F — commit.**

```bash
git add study-guide/<path>
git commit -m "docs: write <competency> study guide"
```

**If the dataset looks wrong**, do not work around it in prose. Stop, record the concept id, the claim, and the primary source that contradicts it, and report it in the task report. Task 34 applies write-backs centrally.

---

## Task 1: Guide path and slug helpers

**Files:**
- Create: `tools/lib/guide-paths.mjs`
- Create: `tools/test/guide-paths.test.mjs`

**Interfaces:**
- Consumes: `competencyKey(domainName, competencyName)` from `tools/lib/load.mjs`, which returns `` `${domain}::${competency}` ``.
- Produces: `slugify(name) -> string`, `domainDir(domain) -> string`, `guideIndex({competencies}) -> Map<string, GuideEntry>`, `guidePathFor(topic, index) -> string`, `relativeGuideLink(fromPath, toPath, anchor) -> string`. `GuideEntry` is `{domain, competency, dir, slug, path, domainIndexPath}`.

- [ ] **Step 1: Write the failing test**

Create `tools/test/guide-paths.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/guide-paths.test.mjs`
Expected: FAIL — `Cannot find module '../lib/guide-paths.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/lib/guide-paths.mjs`:

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/test/guide-paths.test.mjs`
Expected: PASS, 7 tests.

- [ ] **Step 5: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; test count rises from 49 to 56.

- [ ] **Step 6: Commit**

```bash
git add tools/lib/guide-paths.mjs tools/test/guide-paths.test.mjs
git commit -m "feat: add guide path and slug helpers"
```

---

## Task 2: The confusable graph read undirected

**Files:**
- Create: `tools/lib/comparisons.mjs`
- Create: `tools/test/comparisons.test.mjs`

**Interfaces:**
- Consumes: a dataset `{topics}` where each topic has `id`, `importance`, `required_depth`, `confused_with`.
- Produces: `undirectedEdges({topics}) -> Array<[string, string]>` (each pair sorted, deduped, sorted overall); `ownerOf(idA, idB, topicIndex) -> string`; `assignBlocks({topics}) -> Map<ownerId, Block>` where `Block` is `{owner, members: string[], compares: string[], edges: Array<[string,string]>, anchor: string}` with `compares = [owner, ...members]` and `anchor = 'cmp-' + owner`; `blocksMentioning(blocks, conceptId) -> Block[]` returning blocks that list `conceptId` as a **member**, not as owner.

- [ ] **Step 1: Write the failing test**

Create `tools/test/comparisons.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  undirectedEdges,
  ownerOf,
  assignBlocks,
  blocksMentioning,
} from '../lib/comparisons.mjs';

function topic(id, importance, depth, confusedWith = []) {
  return { id, importance, required_depth: depth, confused_with: confusedWith };
}

test('a reciprocal pair yields one undirected edge, not two', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.b']), topic('d.c.b', 3, 3, ['d.c.a'])];
  assert.deepEqual(undirectedEdges({ topics }), [['d.c.a', 'd.c.b']]);
});

test('an edge naming a concept that does not exist is dropped', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.ghost'])];
  assert.deepEqual(undirectedEdges({ topics }), []);
});

test('a concept that is only ever a target still gets an edge', () => {
  const topics = [topic('d.c.a', 3, 3, ['d.c.b']), topic('d.c.b', 3, 3, [])];
  assert.deepEqual(undirectedEdges({ topics }), [['d.c.a', 'd.c.b']]);
});

test('a leaf id containing -vs- wins ownership over higher importance', () => {
  const index = new Map([
    ['d.c.thing-vs-other', topic('d.c.thing-vs-other', 1, 1)],
    ['d.c.other', topic('d.c.other', 5, 3)],
  ]);
  assert.equal(ownerOf('d.c.thing-vs-other', 'd.c.other', index), 'd.c.thing-vs-other');
  assert.equal(ownerOf('d.c.other', 'd.c.thing-vs-other', index), 'd.c.thing-vs-other');
});

test('otherwise the higher importance wins, then the higher depth, then the lower id', () => {
  const index = new Map([
    ['d.c.a', topic('d.c.a', 5, 2)],
    ['d.c.b', topic('d.c.b', 3, 3)],
    ['d.c.c', topic('d.c.c', 3, 3)],
    ['d.c.d', topic('d.c.d', 3, 2)],
  ]);
  assert.equal(ownerOf('d.c.a', 'd.c.b', index), 'd.c.a');
  assert.equal(ownerOf('d.c.d', 'd.c.b', index), 'd.c.b');
  assert.equal(ownerOf('d.c.c', 'd.c.b', index), 'd.c.b');
});

test('ownership does not depend on argument order', () => {
  const index = new Map([
    ['d.c.a', topic('d.c.a', 5, 2)],
    ['d.c.b', topic('d.c.b', 3, 3)],
  ]);
  assert.equal(ownerOf('d.c.a', 'd.c.b', index), ownerOf('d.c.b', 'd.c.a', index));
});

test('every edge lands in exactly one block, and compares lists the owner first', () => {
  const topics = [
    topic('d.c.hub', 5, 3, ['d.c.x', 'd.c.y']),
    topic('d.c.x', 2, 3, []),
    topic('d.c.y', 2, 3, []),
  ];
  const blocks = assignBlocks({ topics });
  assert.equal(blocks.size, 1);
  const block = blocks.get('d.c.hub');
  assert.deepEqual(block.compares, ['d.c.hub', 'd.c.x', 'd.c.y']);
  assert.equal(block.anchor, 'cmp-d.c.hub');
  assert.equal(block.edges.length, 2);
});

test('a chain becomes several blocks, never one table', () => {
  const topics = [
    topic('d.c.a', 5, 3, ['d.c.b']),
    topic('d.c.b', 4, 3, ['d.c.c']),
    topic('d.c.c', 3, 3, []),
  ];
  const blocks = assignBlocks({ topics });
  assert.deepEqual([...blocks.keys()].sort(), ['d.c.a', 'd.c.b']);
  assert.deepEqual(blocks.get('d.c.a').compares, ['d.c.a', 'd.c.b']);
  assert.deepEqual(blocks.get('d.c.b').compares, ['d.c.b', 'd.c.c']);
});

test('blocksMentioning finds the blocks a concept must point to, excluding its own', () => {
  const topics = [
    topic('d.c.hub', 5, 3, ['d.c.x']),
    topic('d.c.x', 2, 3, []),
    topic('d.c.other', 4, 3, ['d.c.x']),
  ];
  const blocks = assignBlocks({ topics });
  const forX = blocksMentioning(blocks, 'd.c.x').map((b) => b.owner).sort();
  assert.deepEqual(forX, ['d.c.hub', 'd.c.other']);
  assert.deepEqual(blocksMentioning(blocks, 'd.c.hub'), []);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/comparisons.test.mjs`
Expected: FAIL — `Cannot find module '../lib/comparisons.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/lib/comparisons.mjs`:

```js
function leafOf(id) {
  return id.slice(id.lastIndexOf('.') + 1);
}

export function undirectedEdges({ topics }) {
  const known = new Set(topics.map((t) => t.id));
  const seen = new Set();
  const edges = [];
  for (const t of topics) {
    for (const other of t.confused_with ?? []) {
      if (other === t.id || !known.has(other)) continue;
      const pair = [t.id, other].sort();
      const key = pair.join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(pair);
    }
  }
  edges.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  return edges;
}

// Ownership rank, highest wins, compared left to right:
//   1. the dataset already names this concept as a comparison ("container-vs-virtual-machine")
//   2. importance
//   3. required_depth
// Ties break on the lexicographically lower id, so the result never depends on argument order.
function rank(id, topicIndex) {
  const t = topicIndex.get(id);
  if (!t) throw new Error(`Cannot rank unknown concept id: ${id}`);
  return [leafOf(id).includes('-vs-') ? 1 : 0, t.importance, t.required_depth];
}

export function ownerOf(idA, idB, topicIndex) {
  const a = rank(idA, topicIndex);
  const b = rank(idB, topicIndex);
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i] ? idA : idB;
  }
  return idA < idB ? idA : idB;
}

export function assignBlocks({ topics }) {
  const topicIndex = new Map(topics.map((t) => [t.id, t]));
  const blocks = new Map();
  for (const [a, b] of undirectedEdges({ topics })) {
    const owner = ownerOf(a, b, topicIndex);
    const member = owner === a ? b : a;
    if (!blocks.has(owner)) {
      blocks.set(owner, { owner, members: [], compares: [], edges: [], anchor: `cmp-${owner}` });
    }
    const block = blocks.get(owner);
    block.members.push(member);
    block.edges.push([a, b]);
  }
  for (const block of blocks.values()) {
    block.members.sort();
    block.compares = [block.owner, ...block.members];
  }
  return new Map([...blocks.entries()].sort((x, y) => x[0].localeCompare(y[0])));
}

export function blocksMentioning(blocks, conceptId) {
  return [...blocks.values()].filter((b) => b.members.includes(conceptId));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/test/comparisons.test.mjs`
Expected: PASS, 9 tests.

- [ ] **Step 5: Verify against the real dataset**

Run:

```bash
node -e "import('./tools/lib/load.mjs').then(async (l) => { const d = await l.loadDataset('data'); const c = await import('./tools/lib/comparisons.mjs'); const e = c.undirectedEdges(d); const b = c.assignBlocks(d); const covered = [...b.values()].reduce((s, x) => s + x.edges.length, 0); console.log('edges', e.length, 'blocks', b.size, 'covered', covered, 'max', Math.max(...[...b.values()].map(x => x.compares.length))); })"
```

Expected output exactly: `edges 156 blocks 129 covered 156 max 6`

- [ ] **Step 6: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; 65 tests.

- [ ] **Step 7: Commit**

```bash
git add tools/lib/comparisons.mjs tools/test/comparisons.test.mjs
git commit -m "feat: read the confused_with graph undirected and assign comparison blocks"
```

---

## Task 3: Guide markdown parser

**Files:**
- Create: `tools/lib/guide-parse.mjs`
- Create: `tools/test/guide-parse.test.mjs`

**Interfaces:**
- Produces: `parseGuideFile(path, text) -> ParsedFile` and `loadGuide(rootDir) -> Promise<ParsedFile[]>` (recursive over `*.md`, sorted by path; returns `[]` if `rootDir` does not exist; throws if `rootDir` is absolute, since the returned paths are only repo-relative when `rootDir` is relative to the process cwd).

`ParsedFile` is:

```js
{
  path,                 // as given, e.g. 'study-guide/02-system-administration/networking.md'
  definitions: [{ id, kind: 'topic' | 'glossary', line, term, meta, blockStart, blockEnd, blockText }],
  comparisons: [{ owner, anchor, line, compares: string[], heading }],
  pointers: [{ href, targetPath, targetAnchor, line, conceptId }],
  sections: [{ heading, line, endLine, definitionIds: string[], hasScenario, hasKnowledgeCheck }],
  anchors: Set<string>, // every id from <a id="..."></a>
  links: [{ href, line }],
  malformed: [{ line, reason }],
}
```

`meta` on a `kind: 'topic'` definition is `{ depth, importance, coverage, sources: string[] }`; on a glossary row it is `null`. `blockText` runs from the anchor line to `blockEnd` inclusive. `conceptId` on a pointer is the concept whose block contains it, or `null`.

- [ ] **Step 1: Write the failing test**

Create `tools/test/guide-parse.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGuideFile } from '../lib/guide-parse.mjs';

const SAMPLE = [
  '# Networking',
  '',
  '<a id="s-networking-dns"></a>',
  '## DNS',
  '',
  '<a id="c-sysadmin.networking.dns"></a>',
  '### DNS',
  '*id: `sysadmin.networking.dns` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: rfc-1035, man-dig-1*',
  '',
  '**What it is** Name to address resolution.',
  '**Commands**',
  '',
  '| Command | Purpose |',
  '| --- | --- |',
  '| `dig +short example.com` | Query an A record |',
  '',
  '*Not to be confused with [hosts file](system-administration.md#cmp-sysadmin.system-administration.etc-hosts).*',
  '',
  '<a id="cmp-sysadmin.networking.dns"></a>',
  '#### Not to be confused with: DNS vs DHCP',
  '*compares: `sysadmin.networking.dns`, `sysadmin.networking.dhcp`*',
  '',
  '| Axis | DNS | DHCP |',
  '| --- | --- | --- |',
  '',
  '#### Quick reference',
  '',
  '| Concept | Term | In one sentence | Why it is examinable |',
  '| --- | --- | --- | --- |',
  '| `sysadmin.networking.whois` | whois | Registry lookup. | Confused with dig. |',
  '',
  '#### Scenario',
  '',
  'A host resolves example.com.',
  '',
  '#### Knowledge check',
  '',
  '1. State the difference between DNS and DHCP.',
  '',
].join('\n');

test('a topic definition is parsed with its metadata', () => {
  const f = parseGuideFile('study-guide/02-system-administration/networking.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.dns');
  assert.equal(def.kind, 'topic');
  assert.equal(def.term, 'DNS');
  assert.deepEqual(def.meta, {
    depth: 3,
    importance: 4,
    coverage: 'PARTIALLY COVERED',
    sources: ['rfc-1035', 'man-dig-1'],
  });
});

test('a quick reference row is parsed as a glossary definition', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.whois');
  assert.equal(def.kind, 'glossary');
  assert.equal(def.meta, null);
});

test('a concept block ends at the next anchor', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  const def = f.definitions.find((d) => d.id === 'sysadmin.networking.dns');
  assert.match(def.blockText, /dig \+short example\.com/);
  assert.doesNotMatch(def.blockText, /Quick reference/);
});

test('a comparison block is parsed with its compares list in order', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.equal(f.comparisons.length, 1);
  assert.equal(f.comparisons[0].owner, 'sysadmin.networking.dns');
  assert.deepEqual(f.comparisons[0].compares, [
    'sysadmin.networking.dns',
    'sysadmin.networking.dhcp',
  ]);
});

test('a pointer records its target file, anchor and containing concept', () => {
  const f = parseGuideFile('study-guide/02-system-administration/networking.md', SAMPLE);
  assert.equal(f.pointers.length, 1);
  assert.equal(f.pointers[0].targetPath, 'study-guide/02-system-administration/system-administration.md');
  assert.equal(f.pointers[0].targetAnchor, 'cmp-sysadmin.system-administration.etc-hosts');
  assert.equal(f.pointers[0].conceptId, 'sysadmin.networking.dns');
});

test('a section records its definitions and its apparatus', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.equal(f.sections.length, 1);
  assert.equal(f.sections[0].heading, 'DNS');
  assert.deepEqual(f.sections[0].definitionIds.sort(), [
    'sysadmin.networking.dns',
    'sysadmin.networking.whois',
  ]);
  assert.equal(f.sections[0].hasScenario, true);
  assert.equal(f.sections[0].hasKnowledgeCheck, true);
});

test('a missing apparatus heading is reported as absent, not as an error', () => {
  const f = parseGuideFile('x.md', ['<a id="s-a"></a>', '## A', '', 'text'].join('\n'));
  assert.equal(f.sections[0].hasScenario, false);
  assert.equal(f.sections[0].hasKnowledgeCheck, false);
});

test('a topic anchor with no metadata line is recorded as malformed', () => {
  const f = parseGuideFile('x.md', ['<a id="c-a.b.c"></a>', '### Thing', '', 'body'].join('\n'));
  assert.equal(f.definitions.length, 0);
  assert.equal(f.malformed.length, 1);
  assert.match(f.malformed[0].reason, /metadata/);
});

test('every markdown link is collected', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.ok(f.links.some((l) => l.href.includes('#cmp-sysadmin.system-administration.etc-hosts')));
});

test('anchors are collected for cross-reference resolution', () => {
  const f = parseGuideFile('x.md', SAMPLE);
  assert.ok(f.anchors.has('c-sysadmin.networking.dns'));
  assert.ok(f.anchors.has('cmp-sysadmin.networking.dns'));
  assert.ok(f.anchors.has('s-networking-dns'));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/guide-parse.test.mjs`
Expected: FAIL — `Cannot find module '../lib/guide-parse.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/lib/guide-parse.mjs`:

```js
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
      //
      // The scan itself must skip fenced lines: a `#` shell comment inside a
      // fenced Commands example (e.g. "# show the running kernel") matches
      // RE_HEADING and would otherwise be mistaken for a real terminator,
      // truncating the block before content that legitimately follows the
      // fence (more commands, **Traps**, **What the exam may test**). This
      // is purely a question of where the scan is allowed to *terminate* —
      // `blockText` below still captures `lines.slice(i, end + 1)` verbatim,
      // fenced content included, once the real end is found.
      let end = lines.length - 1;
      for (let j = i + 3; j < lines.length; j += 1) {
        if (inFence[j]) continue;
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
  //
  // Both the h2 scan and the apparatus detection below must consult
  // `inFence`, the same array every other pass already uses: a fenced
  // "## Something" is a style-guide example, not a real section boundary,
  // and would otherwise create a phantom section (or split a real one); a
  // fenced "#### Scenario" / "#### Knowledge check" inside a real section is
  // likewise just documentation of the marker grammar and must not satisfy
  // that section's apparatus check.
  const h2Lines = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!inFence[i] && headingLevel(matchLines[i]) === 2) h2Lines.push(i);
  }
  for (let s = 0; s < h2Lines.length; s += 1) {
    const start = h2Lines[s];
    const end = s + 1 < h2Lines.length ? h2Lines[s + 1] - 1 : lines.length - 1;
    const body = matchLines.slice(start, end + 1);
    const bodyFence = inFence.slice(start, end + 1);
    sections.push({
      heading: RE_HEADING.exec(matchLines[start])[2],
      line: start + 1,
      endLine: end + 1,
      definitionIds: definitions
        .filter((d) => d.blockStart >= start && d.blockStart <= end)
        .map((d) => d.id),
      hasScenario: body.some((l, k) => !bodyFence[k] && /^#### +Scenario\s*$/.test(l)),
      hasKnowledgeCheck: body.some((l, k) => !bodyFence[k] && /^#### +Knowledge check\s*$/.test(l)),
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
```

Also add, to `tools/test/guide-parse.test.mjs`, tests for the seven review findings fixed above: CRLF and trailing-whitespace anchor lines still parse (Critical 1, 2); a `Quick reference` heading at the wrong level and an un-backticked glossary row both surface in `malformed` with the correct line (Important 3, 4); the metadata-line malformed message names the offending text (Minor 5); a `cmp-` anchor missing its heading vs. its compares line is reported at the actual offending line, not the anchor line (Minor 6); an absolute `rootDir` makes `loadGuide` throw (Minor 7).

Also add, for the two fix-round-2 findings on the Quick reference glossary scanner: an indented but otherwise valid glossary row still parses as a definition, and an indented un-backticked row still surfaces in `malformed` with the correct line (Important 1); a second table under the same `Quick reference` heading, separated from the first by a blank line, produces no `malformed` entries for its header, separator, or data rows (Minor 2).

Fix round 3 replaces the round-2 "first contiguous run of table rows" rule outright, because it could not distinguish a genuinely separate second table from the *same* table interrupted by a blank line, an HTML comment, or a whitespace-only line — any of those silently dropped a well-formed row after the interruption. `tools/test/guide-parse.test.mjs` grew from 21 to 26 tests: the round-2 `Minor 2` test asserting "no malformed entries" for a second table is replaced (that was exactly the reversed behaviour), and five new tests are added — a row after a blank-line interruption still parses; the same after an HTML comment and after a whitespace-only line; a second table's rows are now reported malformed rather than dropped; a `#### Quick Reference` heading with wrong capitalisation is reported malformed (matched case-insensitively so the typo is recognised, then reported exact-mismatch); header and separator rows alone still produce no entries.

Fix round 4 closes two gaps. First, no pass had any fenced-code-block awareness: a documentation example of the marker grammar — a `<a id="c-...">` block, a `cmp-` comparison block, a `*Not to be confused with...*` pointer, or a glossary row — shown inside a ` ``` ` or `~~~` fence was parsed as if it were real, which matters because `study-guide/STYLE.md` exists specifically to show such fenced examples and a fenced example naming a real concept id could satisfy the "every concept has a definition site" coverage check for a concept never actually written up. `computeFenceLines` now computes fence membership once, over the whole file, and every marker-recognition pass (anchors/definitions/comparisons, Quick reference rows, pointers/links) checks it before recognising anything; `blockText` and block extent are deliberately left reading `lines`/`matchLines` exactly as before, so a command shown inside a fence inside a concept's own body still appears in that concept's `blockText` verbatim. Second, a Quick reference row prefixed by a blockquote or list marker (`> | ... |`, `- | ... |`) was silently dropped — `trimStart()` strips only whitespace, not those characters — while the comment directly above the code claimed such a row "is still recognised as a row instead of being silently skipped." That comment was false and has been corrected; the row itself now reports `malformed`, naming the offending prefix. `tools/test/guide-parse.test.mjs` grew from 26 to 36 tests: a fenced concept-anchor example, a fenced comparison block, a fenced pointer, and a fenced glossary row each produce no definition/comparison/pointer/anchor and no `malformed` entry; a `~~~` fence behaves like a ` ``` ` fence; a fence opened with four backticks is not closed by three; an unterminated fence swallows to end of file; a command inside a fence still appears in the enclosing concept's `blockText`; and a blockquote-prefixed and a list-prefixed glossary row each report `malformed` naming the prefix.

Fix round 4 made marker *recognition* fence-aware but left two structural *computations* fence-blind, and round 5 closes both. First, the concept-block terminator scan (Pass 1) treated any line matching the heading regex as a terminator regardless of fence status, so a `#` shell comment inside a fenced Commands example (e.g. `# show the running kernel`) was mistaken for the block's real end, truncating `blockText` before content that legitimately follows the fence (more commands, `**Traps**`, `**What the exam may test**`) — a near-universal failure mode, since most Commands examples are fenced bash blocks with comments. The scan now skips lines where `inFence` is true when looking for the terminator, while `blockText` still captures `lines.slice(blockStart, blockEnd + 1)` verbatim, fenced content included, exactly as before. Second, Pass 3 (section detection) was left fence-blind: a fenced `## Something` created a phantom section, and a fenced `#### Scenario` / `#### Knowledge check` inside a real section falsely satisfied that section's apparatus check. Both the h2 scan and the apparatus detection now consult `inFence`. `tools/test/guide-parse.test.mjs` grew from 36 to 40 tests: a `#` comment inside a fenced Commands block no longer truncates the concept block, and `blockText` still contains both the command and the `**Traps**` label that follows the fence; a fenced `## heading` creates no section; a fenced `#### Scenario` does not satisfy a real section's apparatus; and a real `#### Scenario` outside a fence still sets `hasScenario` true.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/test/guide-parse.test.mjs`
Expected: PASS, 40 tests.

- [ ] **Step 5: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; 105 tests.

- [ ] **Step 6: Commit**

```bash
git add tools/lib/guide-parse.mjs tools/test/guide-parse.test.mjs
git commit -m "feat: add study guide markdown parser"
```

---

## Task 4: Guide fixtures and the seven structural checks

**Files:**
- Create: `tools/test/fixtures/guide/competencies.json`
- Create: `tools/test/fixtures/guide/sources.json`
- Create: `tools/test/fixtures/guide/sourcing-waivers.json`
- Create: `tools/test/fixtures/guide/topics/01-fixture-domain.json`
- Create: `tools/lib/guide-checks.mjs`
- Create: `tools/test/guide-checks.test.mjs`

The existing `tools/test/fixtures/` set is **not** touched — the 49 pre-existing tests assert against it.

**Interfaces:**
- Consumes: `loadDataset` from `tools/lib/load.mjs`; `parseGuideFile` from `tools/lib/guide-parse.mjs`; `guideIndex`, `guidePathFor` from `tools/lib/guide-paths.mjs`.
- Produces, all with signature `(dataset, files, options) => Finding[]` where `files` is `ParsedFile[]`, `options` is `{scope?: string}` and `Finding` is `{check, severity, id, message}` matching `tools/lib/checks.mjs`: `checkMissingConcept`, `checkDuplicateDefinition`, `checkUnknownConcept`, `checkSectionApparatus`, `checkDepthTreatment`, `checkMetadataAccuracy`, `checkSourceIds`.

- [ ] **Step 1: Write the fixture dataset**

Create `tools/test/fixtures/guide/competencies.json`:

```json
{
  "exam_version": "fixture",
  "domains": [
    {
      "id": "fx",
      "name": "Fixture Domain",
      "weight": 100,
      "file": "01-fixture-domain.json",
      "competencies": [
        { "name": "Fixture Competency", "sept_2025_status": "unchanged" },
        { "name": "Second Competency", "sept_2025_status": "unchanged" }
      ]
    }
  ]
}
```

`Second Competency` exists solely so the scope tests (Step 2, "Fix round 1" below) can tell working scoping from `inScope` stubbed to `return false` or `return true`: a scope naming it must exclude the other competency's concepts, and a scope naming the fixture's actual competency must still report them.

Create `tools/test/fixtures/guide/sources.json`:

```json
{
  "sources": [
    {
      "id": "fx-source",
      "title": "Fixture Source",
      "url": "https://example.invalid/",
      "organization": "Fixture",
      "published": "2025-01",
      "updated": null,
      "accessed": "2026-08-10",
      "category": "primary-documentation",
      "authority_tier": 2,
      "notes": ""
    }
  ]
}
```

Create `tools/test/fixtures/guide/sourcing-waivers.json`:

```json
{
  "reason": "Fixture waiver.",
  "established": "2026-08-10",
  "by_competency": { "Fixture Domain :: Fixture Competency": 1 },
  "waived": ["fx.fixture.waived"]
}
```

Create `tools/test/fixtures/guide/topics/01-fixture-domain.json`:

```json
{
  "topics": [
    {
      "id": "fx.fixture.deep",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "deep"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A depth 3 concept with a command.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 3,
      "importance": 4,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": ["uname -r"],
      "related_topics": [],
      "confused_with": ["fx.fixture.shallow"],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.shallow",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "shallow"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A depth 2 concept.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 2,
      "importance": 2,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.tiny",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "tiny"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A depth 1 concept.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 1,
      "importance": 1,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.waived",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "waived"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A concept with no independent primary source.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "MEDIUM",
      "required_depth": 2,
      "importance": 2,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": [],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.other",
      "path": ["Fixture Domain", "Second Competency", "Section One", "other"],
      "domain": "Fixture Domain",
      "competency": "Second Competency",
      "description": "A depth 1 concept belonging to a different competency, used to test scoping.",
      "objective_verbatim": "Second Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 1,
      "importance": 1,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.diagnostic",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "diagnostic"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A depth 4 concept, used to exercise the Symptoms and diagnostic order label.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 4,
      "importance": 3,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    },
    {
      "id": "fx.fixture.advanced",
      "path": ["Fixture Domain", "Fixture Competency", "Section One", "advanced"],
      "domain": "Fixture Domain",
      "competency": "Fixture Competency",
      "description": "A depth 5 concept, used to exercise the Syntax worth memorising label.",
      "objective_verbatim": "Fixture Competency",
      "sept_2025_status": "unchanged",
      "inferred": true,
      "confidence": "HIGH",
      "required_depth": 5,
      "importance": 5,
      "official_sources": ["fx-source"],
      "lfs200_sources": [],
      "additional_sources": ["fx-source"],
      "candidate_evidence": [],
      "commands": [],
      "related_topics": [],
      "confused_with": [],
      "coverage_status": "NOT COVERED",
      "notes": ""
    }
  ]
}
```

`fx.fixture.other`, `fx.fixture.diagnostic` and `fx.fixture.advanced` were added in "Fix round 1" (see below): the first to make scoping testable against a second real competency, the other two so the depth-4 (`Symptoms and diagnostic order`) and depth-5 (`Syntax worth memorising`) label requirements are exercised at all.

- [ ] **Step 2: Write the failing test**

Create `tools/test/guide-checks.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDataset } from '../lib/load.mjs';
import { parseGuideFile } from '../lib/guide-parse.mjs';
import {
  checkMissingConcept,
  checkDuplicateDefinition,
  checkUnknownConcept,
  checkSectionApparatus,
  checkDepthTreatment,
  checkMetadataAccuracy,
  checkSourceIds,
  inScope,
  assertKnownScope,
} from '../lib/guide-checks.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = join(here, 'fixtures', 'guide');
const GUIDE_PATH = 'study-guide/01-fixture-domain/fixture-competency.md';

const dataset = await loadDataset(fixtureRoot);

const COMPLETE = [
  '# Fixture Competency',
  '',
  '<a id="s-fixture-competency-section-one"></a>',
  '## Section One',
  '',
  '<a id="c-fx.fixture.deep"></a>',
  '### Deep',
  '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Commands**',
  '',
  '| Command | Purpose |',
  '| --- | --- |',
  '| `uname -r` | Show the running kernel release |',
  '',
  '**Traps** ...',
  '**What the exam may test** ...',
  '',
  '<a id="c-fx.fixture.shallow"></a>',
  '### Shallow',
  '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '',
  '<a id="c-fx.fixture.waived"></a>',
  '### Waived',
  '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '',
  '<a id="c-fx.fixture.diagnostic"></a>',
  '### Diagnostic',
  '*id: `fx.fixture.diagnostic` · depth 4 · importance 3 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Traps** ...',
  '**What the exam may test** ...',
  '**Symptoms and diagnostic order** ...',
  '',
  '<a id="c-fx.fixture.advanced"></a>',
  '### Advanced',
  '*id: `fx.fixture.advanced` · depth 5 · importance 5 · LFS200: NOT COVERED · sources: fx-source*',
  '',
  '**What it is** ...',
  '**Why it matters** ...',
  '**How it works** ...',
  '**Key terms** ...',
  '**Traps** ...',
  '**What the exam may test** ...',
  '**Symptoms and diagnostic order** ...',
  '**Syntax worth memorising** ...',
  '',
  '#### Quick reference',
  '',
  '| Concept | Term | In one sentence | Why it is examinable |',
  '| --- | --- | --- | --- |',
  '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |',
  '| `fx.fixture.other` | Other | A concept from a different competency. | It anchors the scope tests. |',
  '',
  '#### Scenario',
  '',
  'Something happens.',
  '',
  '#### Knowledge check',
  '',
  '1. State the difference between Deep and Shallow.',
  '',
].join('\n');

const complete = () => [parseGuideFile(GUIDE_PATH, COMPLETE)];

test('a complete guide reports no structural findings', () => {
  const files = complete();
  for (const check of [
    checkMissingConcept,
    checkDuplicateDefinition,
    checkUnknownConcept,
    checkSectionApparatus,
    checkDepthTreatment,
    checkMetadataAccuracy,
    checkSourceIds,
  ]) {
    assert.deepEqual(check(dataset, files, {}), [], `${check.name} produced findings`);
  }
});

test('a concept with no definition site anywhere is an error', () => {
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
  assert.equal(found[0].severity, 'error');
});

test('a concept defined twice is an error', () => {
  const files = [parseGuideFile(GUIDE_PATH, COMPLETE), parseGuideFile('study-guide/other.md', COMPLETE)];
  const found = checkDuplicateDefinition(dataset, files, {});
  assert.ok(found.length >= 1);
  assert.equal(found[0].severity, 'error');
});

test('a definition site naming an unknown id is an error', () => {
  const text = COMPLETE.replace(/fx\.fixture\.shallow/g, 'fx.fixture.ghost');
  const found = checkUnknownConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.ghost/);
});

test('a section with definitions but no knowledge check is an error', () => {
  const text = COMPLETE.replace('#### Knowledge check', '#### Notes');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Knowledge check/);
});

test('a section with definitions but no Scenario is an error', () => {
  const text = COMPLETE.replace('#### Scenario', '#### Setup');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Scenario/);
});

test('a definition anchored outside any section is an error', () => {
  const text = [
    '# Fixture Competency',
    '',
    '<a id="c-fx.fixture.shallow"></a>',
    '### Shallow',
    '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
    '',
    '**What it is** ...',
    '**Why it matters** ...',
    '**How it works** ...',
    '**Key terms** ...',
    '',
  ].join('\n');
  const found = checkSectionApparatus(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.shallow/);
  assert.match(found[0].message, /outside any section/);
});

test('a depth 3 concept missing Traps is an error', () => {
  const text = COMPLETE.replace('**Traps** ...', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /Traps/);
});

test('a depth 2 concept is not required to carry Traps', () => {
  const found = checkDepthTreatment(dataset, complete(), {});
  assert.deepEqual(found, []);
});

test('a depth 4 concept missing Symptoms and diagnostic order is an error', () => {
  // Non-global replace hits the first occurrence only, which is Diagnostic's
  // (it appears before Advanced's identical line in file order).
  const text = COMPLETE.replace('**Symptoms and diagnostic order** ...\n', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.diagnostic');
  assert.match(found[0].message, /Symptoms and diagnostic order/);
});

test('a depth 5 concept missing Syntax worth memorising is an error', () => {
  const text = COMPLETE.replace('**Syntax worth memorising** ...', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.advanced');
  assert.match(found[0].message, /Syntax worth memorising/);
});

test('a concept with commands in data/ but no Commands section is an error', () => {
  const text = COMPLETE.replace('**Commands**', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.deep');
  assert.match(found[0].message, /Commands/);
});

test('a depth 1 concept stubbed as a topic instead of a glossary row is an error', () => {
  const text = [
    '# Fixture Competency',
    '',
    '<a id="s-fixture-competency-section-one"></a>',
    '## Section One',
    '',
    '<a id="c-fx.fixture.tiny"></a>',
    '### Tiny',
    '*id: `fx.fixture.tiny` · depth 1 · importance 1 · LFS200: NOT COVERED · sources: fx-source*',
    '',
    '**What it is** ...',
    '',
    '#### Scenario',
    '',
    'Something happens.',
    '',
    '#### Knowledge check',
    '',
    '1. Question.',
    '',
  ].join('\n');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
  assert.match(found[0].message, /depth 1/);
  assert.match(found[0].message, /glossary/);
  assert.match(found[0].message, /topic/);
});

test('a depth 2+ concept stubbed as a glossary row instead of a topic is an error', () => {
  const text = COMPLETE
    .replace(
      [
        '<a id="c-fx.fixture.deep"></a>',
        '### Deep',
        '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fx-source*',
        '',
        '**What it is** ...',
        '**Why it matters** ...',
        '**How it works** ...',
        '**Key terms** ...',
        '**Commands**',
        '',
        '| Command | Purpose |',
        '| --- | --- |',
        '| `uname -r` | Show the running kernel release |',
        '',
        '**Traps** ...',
        '**What the exam may test** ...',
        '',
      ].join('\n'),
      '',
    )
    .replace(
      '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |',
      '| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |\n| `fx.fixture.deep` | Deep | A stubbed row. | It should be a topic. |',
    );
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.deep');
  assert.match(found[0].message, /depth 3/);
  assert.match(found[0].message, /glossary/);
  assert.match(found[0].message, /topic/);
});

test('a body label mentioned incidentally inside a Commands cell does not satisfy the check', () => {
  const text = COMPLETE.replace(
    '| `uname -r` | Show the running kernel release |',
    '| `uname -r` | Show the running kernel release (see **Traps** and **What the exam may test**) |',
  ).replace('**Traps** ...\n**What the exam may test** ...\n', '');
  const found = checkDepthTreatment(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 2);
  assert.ok(found.every((f) => f.id === 'fx.fixture.deep'));
  assert.ok(found.some((f) => /Traps/.test(f.message)));
  assert.ok(found.some((f) => /What the exam may test/.test(f.message)));
});

test('a metadata line disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace('depth 3 · importance 4', 'depth 2 · importance 4');
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /depth/);
});

test('an importance value disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace('depth 3 · importance 4', 'depth 3 · importance 3');
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /importance/);
});

test('an LFS200 coverage value disagreeing with the dataset is an error', () => {
  const text = COMPLETE.replace(
    '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fx-source*',
    '*id: `fx.fixture.deep` · depth 3 · importance 4 · LFS200: COVERED · sources: fx-source*',
  );
  const found = checkMetadataAccuracy(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /LFS200/);
});

test('a metadata line citing an unregistered source is an error', () => {
  const text = COMPLETE.replace('sources: fx-source*', 'sources: fx-ghost*');
  const found = checkSourceIds(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.ok(found.length >= 1);
  assert.match(found[0].message, /fx-ghost/);
});

test('scope restricts missing-concept reporting to one competency', () => {
  const found = checkMissingConcept(dataset, [], { scope: 'Other Domain :: Other Competency' });
  assert.deepEqual(found, []);
});

test('a scope naming the fixture\'s actual competency still reports a genuinely missing concept', () => {
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {
    scope: 'Fixture Domain :: Fixture Competency',
  });
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.tiny');
});

test('a scope naming a different real competency excludes concepts outside it', () => {
  // fx.fixture.tiny (Fixture Competency) is missing here, and fx.fixture.other
  // (Second Competency) is fully defined. A scope of "Second Competency" must
  // report neither the excluded missing concept nor a false positive for the
  // in-scope, already-defined one — proving the scope genuinely filters
  // rather than passing everything through (or nothing, per the mutation
  // this guards against: `inScope` stubbed to always return false or true).
  const text = COMPLETE.replace('| `fx.fixture.tiny` | Tiny | A small thing. | It is confused with Deep. |', '');
  const found = checkMissingConcept(dataset, [parseGuideFile(GUIDE_PATH, text)], {
    scope: 'Fixture Domain :: Second Competency',
  });
  assert.deepEqual(found, []);
});

test('inScope matches only the named competency', () => {
  const topic = { domain: 'Fixture Domain', competency: 'Fixture Competency' };
  assert.equal(inScope(topic, { scope: 'Fixture Domain :: Fixture Competency' }), true);
  assert.equal(inScope(topic, { scope: 'Fixture Domain :: Second Competency' }), false);
  assert.equal(inScope(topic, {}), true);
});

test('assertKnownScope throws on a scope naming an unknown competency', () => {
  assert.throws(
    () => assertKnownScope(dataset, { scope: 'Other Domain :: Other Competency' }),
    /Unknown scope "Other Domain :: Other Competency"/,
  );
  try {
    assertKnownScope(dataset, { scope: 'Other Domain :: Other Competency' });
  } catch (err) {
    assert.match(err.message, /Fixture Domain :: Fixture Competency/);
    assert.match(err.message, /Fixture Domain :: Second Competency/);
  }
});

test('assertKnownScope does not throw for a known scope or no scope', () => {
  assert.doesNotThrow(() => assertKnownScope(dataset, { scope: 'Fixture Domain :: Fixture Competency' }));
  assert.doesNotThrow(() => assertKnownScope(dataset, { scope: 'Fixture Domain :: Second Competency' }));
  assert.doesNotThrow(() => assertKnownScope(dataset, {}));
  assert.doesNotThrow(() => assertKnownScope(dataset, undefined));
});
```

The block above is the shipped state after "Fix round 1" (see the note at the end of this task). The tests from `'a section with definitions but no Scenario is an error'` onward, `inScope`/`assertKnownScope` in the import list, and the `Diagnostic`/`Advanced` concepts and second Quick reference row in `COMPLETE`, were not part of the original Step 2 draft — they were added to close the gaps a branch review found in the first cut of these checks.

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test tools/test/guide-checks.test.mjs`
Expected: FAIL — `Cannot find module '../lib/guide-checks.mjs'`.

- [ ] **Step 4: Write the implementation**

Create `tools/lib/guide-checks.mjs`:

```js
import { competencyKey } from './load.mjs';

export function finding(check, severity, id, message) {
  return { check, severity, id, message };
}

export function inScope(topic, options) {
  if (!options?.scope) return true;
  return competencyKey(topic.domain, topic.competency) === options.scope.replace(' :: ', '::');
}

// Throws when `options.scope` names a competency that does not exist anywhere
// in the dataset. A scoped check run that silently matches nothing (typo'd
// domain, renamed competency, stale scope string left over from a previous
// cycle) reports zero errors over zero concepts — a green light that means
// nothing. This turns that silent no-op into an explicit failure, naming the
// bad scope and listing every valid competency key so the caller can fix it.
export function assertKnownScope(dataset, options) {
  if (!options?.scope) return;
  const validKeys = dataset.competencies.domains.flatMap((domain) =>
    domain.competencies.map((c) => competencyKey(domain.name, c.name)),
  );
  const normalizedScope = options.scope.replace(' :: ', '::');
  if (!validKeys.includes(normalizedScope)) {
    const readable = validKeys.map((k) => k.replace('::', ' :: '));
    throw new Error(
      `Unknown scope "${options.scope}". Valid competencies: ${readable.join(', ')}`,
    );
  }
}

export function allDefinitions(files) {
  return files.flatMap((f) => f.definitions.map((d) => ({ ...d, file: f.path })));
}

const LABELS_BY_DEPTH = {
  2: ['What it is', 'Why it matters', 'How it works', 'Key terms'],
  3: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test'],
  4: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test', 'Symptoms and diagnostic order'],
  5: ['What it is', 'Why it matters', 'How it works', 'Key terms', 'Traps', 'What the exam may test', 'Symptoms and diagnostic order', 'Syntax worth memorising'],
};

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A body label (e.g. "**Traps**") only counts if it begins a line. The naive
// `blockText.includes('**' + label + '**')` also matched an incidental
// mention anywhere in the block, including inside a Commands-table cell
// (which always starts with "|"), so a label string could be satisfied by
// accident. Anchoring to line-start closes that: a markdown table row always
// begins with "|", never with the label markup itself.
function blockHasLabel(blockText, label) {
  return new RegExp(`^\\*\\*${escapeRegExp(label)}\\*\\*`, 'm').test(blockText);
}

export function checkMissingConcept({ topics }, files, options) {
  const defined = new Set(allDefinitions(files).map((d) => d.id));
  return topics
    .filter((t) => inScope(t, options) && !defined.has(t.id))
    .map((t) =>
      finding('guide-missing-concept', 'error', t.id, `${t.id} has no definition site in study-guide/`),
    );
}

export function checkDuplicateDefinition(dataset, files) {
  const seen = new Map();
  const out = [];
  for (const d of allDefinitions(files)) {
    if (seen.has(d.id)) {
      out.push(
        finding(
          'guide-duplicate-definition',
          'error',
          d.id,
          `${d.id} is defined twice: ${seen.get(d.id)} and ${d.file}:${d.line}`,
        ),
      );
      continue;
    }
    seen.set(d.id, `${d.file}:${d.line}`);
  }
  return out;
}

export function checkUnknownConcept({ topics }, files) {
  const known = new Set(topics.map((t) => t.id));
  return allDefinitions(files)
    .filter((d) => !known.has(d.id))
    .map((d) =>
      finding(
        'guide-unknown-concept',
        'error',
        d.id,
        `${d.file}:${d.line} defines ${d.id}, which is not in data/`,
      ),
    );
}

export function checkSectionApparatus(dataset, files) {
  const out = [];
  for (const f of files) {
    const coveredIds = new Set(f.sections.flatMap((s) => s.definitionIds));
    for (const s of f.sections) {
      if (s.definitionIds.length === 0) continue;
      if (!s.hasScenario) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Scenario`));
      }
      if (!s.hasKnowledgeCheck) {
        out.push(finding('guide-section-apparatus', 'error', s.heading, `${f.path}:${s.line} section "${s.heading}" has no Knowledge check`));
      }
    }
    // A definition anchored directly under the H1 title, with no enclosing
    // `##` section, never appears in any section's `definitionIds` — the
    // loop above can't see it, so it silently skipped Scenario/Knowledge
    // check verification entirely. Report it explicitly instead.
    for (const d of f.definitions) {
      if (!coveredIds.has(d.id)) {
        out.push(
          finding(
            'guide-section-apparatus',
            'error',
            d.id,
            `${f.path}:${d.line} ${d.id} is defined outside any section, so it cannot be checked for Scenario or Knowledge check apparatus`,
          ),
        );
      }
    }
  }
  return out;
}

export function checkDepthTreatment({ topics }, files) {
  const index = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const d of allDefinitions(files)) {
    const topic = index.get(d.id);
    if (!topic) continue;

    // A concept's definition kind must match its required depth: depth 1 is
    // written as a single Quick reference row (kind 'glossary'); depth 2+
    // must be written as a full topic (kind 'topic'). Without this, any
    // concept — regardless of depth — could be stubbed as a one-line
    // glossary row and every check below, which only looks at 'topic'
    // definitions, would have nothing left to complain about.
    const expectedKind = topic.required_depth === 1 ? 'glossary' : 'topic';
    if (d.kind !== expectedKind) {
      out.push(
        finding(
          'guide-depth-treatment',
          'error',
          d.id,
          `${d.file}:${d.line} ${d.id} is depth ${topic.required_depth} and must be defined as a ${expectedKind}, but is defined as a ${d.kind}`,
        ),
      );
      continue;
    }
    if (d.kind !== 'topic') continue;

    for (const label of LABELS_BY_DEPTH[topic.required_depth] ?? []) {
      if (!blockHasLabel(d.blockText, label)) {
        out.push(
          finding(
            'guide-depth-treatment',
            'error',
            d.id,
            `${d.file}:${d.line} ${d.id} is depth ${topic.required_depth} and is missing the ${label} section`,
          ),
        );
      }
    }
    if (topic.commands.length > 0 && !blockHasLabel(d.blockText, 'Commands')) {
      out.push(
        finding('guide-depth-treatment', 'error', d.id, `${d.file}:${d.line} ${d.id} has commands in data/ but no Commands section`),
      );
    }
  }
  return out;
}

export function checkMetadataAccuracy({ topics }, files) {
  const index = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const d of allDefinitions(files)) {
    if (d.kind !== 'topic') continue;
    const topic = index.get(d.id);
    if (!topic) continue;
    if (d.meta.depth !== topic.required_depth) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states depth ${d.meta.depth}, data/ says ${topic.required_depth}`));
    }
    if (d.meta.importance !== topic.importance) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states importance ${d.meta.importance}, data/ says ${topic.importance}`));
    }
    if (d.meta.coverage !== topic.coverage_status) {
      out.push(finding('guide-metadata-accuracy', 'error', d.id, `${d.file}:${d.line} ${d.id} states LFS200 ${d.meta.coverage}, data/ says ${topic.coverage_status}`));
    }
  }
  return out;
}

export function checkSourceIds({ sources }, files) {
  const known = new Set(sources.sources.map((s) => s.id));
  const out = [];
  for (const d of allDefinitions(files)) {
    if (d.kind !== 'topic') continue;
    for (const ref of d.meta.sources) {
      if (!known.has(ref)) {
        out.push(finding('guide-source-ids', 'error', d.id, `${d.file}:${d.line} ${d.id} cites unknown source id: ${ref}`));
      }
    }
  }
  return out;
}
```

The block above is the shipped state after "Fix round 1": `assertKnownScope`, the `blockHasLabel`/`escapeRegExp` line-anchored label matcher, the kind-vs-depth check inside `checkDepthTreatment`, and the outside-any-section branch inside `checkSectionApparatus` were not part of the original Step 4 draft. See "Fix round 1" below for why.

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tools/test/guide-checks.test.mjs`
Expected: PASS, 25 tests (10 from the original Step 2 draft, 15 added in "Fix round 1").

- [ ] **Step 6: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; `npm test` 130 tests; `npm run validate` 537 concepts checked, 0 errors.

- [ ] **Step 7: Commit**

```bash
git add tools/lib/guide-checks.mjs tools/test/guide-checks.test.mjs tools/test/fixtures/guide
git commit -m "feat: add structural study guide checks"
```

### Fix round 1

A branch review of the shipped Task 4 code found three critical and two important gaps, all in `tools/lib/guide-checks.mjs` / `tools/test/guide-checks.test.mjs`:

1. **Depth vs. kind was never checked.** `checkDepthTreatment` and `checkMetadataAccuracy` both skipped any definition whose `kind !== 'topic'`, so any concept — regardless of `required_depth` — could be stubbed as a one-line Quick reference row and pass every check. Fixed inside `checkDepthTreatment`: depth 1 must be `kind: 'glossary'`, depth 2+ must be `kind: 'topic'`, and a mismatch in either direction is now an error naming the depth and both kinds.
2. **Body-label matching was a naive substring match.** `blockText.includes('**Traps**')` was satisfied by an incidental mention anywhere in the block, including inside a Commands-table cell. Fixed with `blockHasLabel`, which anchors the label to the start of a line (a table row always starts with `|`), applied to both the per-depth label loop and the `**Commands**` check.
3. **The only scope test couldn't distinguish working scoping from `inScope` stubbed to `return false`.** Fixed in two parts: (a) the fixture dataset gained a second competency (`Second Competency`, concept `fx.fixture.other`) so a scope naming the fixture's actual competency can be asserted to still report a genuinely missing concept, and a scope naming the other competency can be asserted to exclude it; (b) `assertKnownScope(dataset, options)` is now exported — it throws when `options.scope` names a competency absent from the dataset, rather than silently matching nothing. Task 5 must call it from `runAllGuideChecks` and the CLI before running the scoped checks.
4. **`checkSectionApparatus` couldn't see a definition outside every section.** It only iterated over parsed sections, so a concept anchored directly under the H1 title (no enclosing `##`) was silently never checked for Scenario/Knowledge check apparatus. Fixed by tracking every definition id covered by some section and reporting the ones that aren't, naming the concept and file.
5. **Coverage gaps.** Added tests for: `checkSectionApparatus`'s missing-Scenario branch on its own; `checkDepthTreatment`'s missing-`**Commands**` branch; `checkMetadataAccuracy`'s importance-mismatch and coverage-mismatch branches; and two new fixture concepts (`fx.fixture.diagnostic`, depth 4; `fx.fixture.advanced`, depth 5) so the `Symptoms and diagnostic order` and `Syntax worth memorising` labels are exercised at all.

Verification for the fix round: `node --test tools/test/guide-checks.test.mjs` (25 pass), `npm test` (130 pass, was 115 before the fixture additions), `npm run validate` (exit 0, 537 concepts, 0 errors). A mutation check — stubbing `inScope` to `return false` — turned 3 tests red (`a concept with no definition site anywhere is an error`, `a scope naming the fixture's actual competency still reports a genuinely missing concept`, `inScope matches only the named competency`), confirming the scope tests actually exercise `inScope` rather than passing by construction.

Full report: `.superpowers/sdd/task-4-report.md`, under "Fix round 1".

---

## Task 5: Comparison, command, waiver, cross-reference and vendor checks

**Files:**
- Modify: `tools/lib/guide-checks.mjs` (append)
- Modify: `tools/test/guide-checks.test.mjs` (append)

**Interfaces:**
- Consumes: `assignBlocks`, `blocksMentioning` from `tools/lib/comparisons.mjs`; `guideIndex`, `guidePathFor`, `relativeGuideLink` from `tools/lib/guide-paths.mjs`; the helpers `finding`, `inScope`, `allDefinitions`, `assertKnownScope` exported by Task 4.
- Produces: `checkComparisonCoverage`, `checkComparisonMembership`, `checkComparisonPointer`, `checkCommandCoverage`, `checkWaiverMarker`, `checkDanglingXref`, `checkVendorNeutrality`, and `runAllGuideChecks(dataset, files, options) -> Finding[]` running all fourteen in the spec's order.
- `runAllGuideChecks` must call `assertKnownScope(dataset, options)` before running any check (it throws on an unknown `options.scope`, so an unrecognised scope aborts the run instead of silently reporting zero findings over zero concepts). The CLI entry point that calls `runAllGuideChecks` with a user-supplied `--scope` must let that error surface as a hard failure, not a swallowed warning.

- [ ] **Step 1: Write the failing test**

Append to `tools/test/guide-checks.test.mjs`:

```js
import {
  checkComparisonCoverage,
  checkComparisonMembership,
  checkComparisonPointer,
  checkCommandCoverage,
  checkWaiverMarker,
  checkDanglingXref,
  checkVendorNeutrality,
  runAllGuideChecks,
} from '../lib/guide-checks.mjs';

const WAIVER_MARKER =
  '*No primary documentation source. The authoritative references are paywalled (see `data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*';

// COMPLETE plus the comparison block the fixture requires and the waiver marker.
const FULL = COMPLETE
  .replace(
    '**What the exam may test** ...',
    [
      '**What the exam may test** ...',
      '',
      '<a id="cmp-fx.fixture.deep"></a>',
      '#### Not to be confused with: Deep vs Shallow',
      '*compares: `fx.fixture.deep`, `fx.fixture.shallow`*',
      '',
      '| Axis | Deep | Shallow |',
      '| --- | --- | --- |',
    ].join('\n'),
  )
  .replace(
    '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
    [
      '*id: `fx.fixture.shallow` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: fx-source*',
      '',
      '*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).*',
    ].join('\n'),
  )
  .replace(
    '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
    [
      '*id: `fx.fixture.waived` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: none*',
      '',
      WAIVER_MARKER,
    ].join('\n'),
  );

const full = () => [parseGuideFile(GUIDE_PATH, FULL)];

test('a fully written fixture guide passes all fourteen checks', () => {
  const found = runAllGuideChecks(dataset, full(), {});
  assert.deepEqual(found.filter((f) => f.severity === 'error'), []);
});

test('an uncovered edge is an error', () => {
  const text = FULL.replace('<a id="cmp-fx.fixture.deep"></a>', '<a id="x-none"></a>');
  const found = checkComparisonCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /fx\.fixture\.deep/);
});

test('an edge covered by two blocks is an error', () => {
  const files = [parseGuideFile(GUIDE_PATH, FULL), parseGuideFile('study-guide/dup.md', FULL)];
  const found = checkComparisonCoverage(dataset, files, {});
  assert.ok(found.some((f) => /twice|more than once/.test(f.message)));
});

test('a compares list that does not match the computed assignment is an error', () => {
  const text = FULL.replace(
    '*compares: `fx.fixture.deep`, `fx.fixture.shallow`*',
    '*compares: `fx.fixture.deep`, `fx.fixture.tiny`*',
  );
  const found = checkComparisonMembership(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
});

test('a member with no pointer to its block is an error', () => {
  const text = FULL.replace('*Not to be confused with [Deep](fixture-competency.md#cmp-fx.fixture.deep).*', '');
  const found = checkComparisonPointer(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.shallow');
});

test('a command string absent from its concept block is an error', () => {
  const text = FULL.replace('| `uname -r` | Show the running kernel release |', '| `uname` | Show the kernel |');
  const found = checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.match(found[0].message, /uname -r/);
});

test('a command string in a fenced block counts', () => {
  const text = FULL.replace(
    '| `uname -r` | Show the running kernel release |',
    ['| `uname` | Show the kernel |', '', '```bash', 'uname -r', '```'].join('\n'),
  );
  assert.deepEqual(checkCommandCoverage(dataset, [parseGuideFile(GUIDE_PATH, text)], {}), []);
});

test('a waived concept without the marker is an error', () => {
  const text = FULL.replace(WAIVER_MARKER, '');
  const found = checkWaiverMarker(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 'fx.fixture.waived');
});

test('a link to a file that does not exist is an error in full mode and a warning in scoped mode', () => {
  const text = FULL.replace('fixture-competency.md#cmp-fx.fixture.deep', 'ghost.md#cmp-fx.fixture.deep');
  const files = [parseGuideFile(GUIDE_PATH, text)];
  const fullMode = checkDanglingXref(dataset, files, {});
  assert.ok(fullMode.some((f) => f.severity === 'error' && /ghost\.md/.test(f.message)));
  const scoped = checkDanglingXref(dataset, files, { scope: 'Fixture Domain :: Fixture Competency' });
  assert.ok(scoped.every((f) => f.severity === 'warn'));
});

test('a link to an anchor that is not defined in the target file is an error', () => {
  const text = FULL.replace('#cmp-fx.fixture.deep).*', '#cmp-fx.fixture.ghost).*');
  const found = checkDanglingXref(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.ok(found.some((f) => /cmp-fx\.fixture\.ghost/.test(f.message)));
});

test('vendor neutrality warns only on cloud networking files', () => {
  const text = FULL.replace('**What it is** ...', '**What it is** A VPC with a Security Group.');
  const found = checkVendorNeutrality(dataset, [parseGuideFile(GUIDE_PATH, text)], {});
  assert.deepEqual(found, []);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/guide-checks.test.mjs`
Expected: FAIL — the newly imported functions are not exported.

- [ ] **Step 3: Write the implementation**

Append to `tools/lib/guide-checks.mjs`:

```js
import { posix } from 'node:path';
import { assignBlocks, blocksMentioning } from './comparisons.mjs';
import { guideIndex, guidePathFor, relativeGuideLink } from './guide-paths.mjs';

const WAIVER_MARKER = 'No primary documentation source.';

const AWS_ONLY_TERMS = ['VPC', 'Security Group', 'Route 53', 'Elastic Load Balancer', 'Direct Connect', 'NACL'];

function ownedInScope(dataset, block, options) {
  const topic = dataset.topics.find((t) => t.id === block.owner);
  return topic ? inScope(topic, options) : true;
}

export function checkComparisonCoverage(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const written = new Map();
  const out = [];
  for (const f of files) {
    for (const c of f.comparisons) {
      if (written.has(c.owner)) {
        out.push(
          finding('guide-comparison-coverage', 'error', c.owner,
            `Comparison block cmp-${c.owner} is written more than once: ${written.get(c.owner)} and ${f.path}:${c.line}`),
        );
        continue;
      }
      written.set(c.owner, `${f.path}:${c.line}`);
    }
  }
  for (const block of expected.values()) {
    if (!ownedInScope(dataset, block, options)) continue;
    if (!written.has(block.owner)) {
      out.push(
        finding('guide-comparison-coverage', 'error', block.owner,
          `No comparison block for ${block.owner}, which must distinguish it from ${block.members.join(', ')}`),
      );
    }
  }
  return out;
}

export function checkComparisonMembership(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const out = [];
  for (const f of files) {
    for (const c of f.comparisons) {
      const block = expected.get(c.owner);
      if (!block) {
        out.push(finding('guide-comparison-membership', 'error', c.owner,
          `${f.path}:${c.line} defines cmp-${c.owner}, which is not an assigned comparison owner`));
        continue;
      }
      if (!ownedInScope(dataset, block, options)) continue;
      if (c.compares.join('|') !== block.compares.join('|')) {
        out.push(finding('guide-comparison-membership', 'error', c.owner,
          `${f.path}:${c.line} compares [${c.compares.join(', ')}] but the assignment is [${block.compares.join(', ')}]`));
      }
    }
  }
  return out;
}

export function checkComparisonPointer(dataset, files, options) {
  const expected = assignBlocks(dataset);
  const index = guideIndex(dataset);
  const byId = new Map(dataset.topics.map((t) => [t.id, t]));
  const pointersByConcept = new Map();
  for (const f of files) {
    for (const p of f.pointers) {
      if (!p.conceptId) continue;
      if (!pointersByConcept.has(p.conceptId)) pointersByConcept.set(p.conceptId, []);
      pointersByConcept.get(p.conceptId).push(p);
    }
  }
  const out = [];
  for (const topic of dataset.topics) {
    if (!inScope(topic, options)) continue;
    for (const block of blocksMentioning(expected, topic.id)) {
      const ownerTopic = byId.get(block.owner);
      const wanted = relativeGuideLink(
        guidePathFor(topic, index),
        guidePathFor(ownerTopic, index),
        block.anchor,
      );
      const have = pointersByConcept.get(topic.id) ?? [];
      if (!have.some((p) => p.href === wanted)) {
        out.push(finding('guide-comparison-pointer', 'error', topic.id,
          `${topic.id} is compared in cmp-${block.owner} but does not point to it; expected a line linking ${wanted}`));
      }
    }
  }
  return out;
}

export function checkCommandCoverage(dataset, files, options) {
  const defs = new Map(allDefinitions(files).filter((d) => d.kind === 'topic').map((d) => [d.id, d]));
  const out = [];
  for (const topic of dataset.topics) {
    if (!inScope(topic, options)) continue;
    const def = defs.get(topic.id);
    if (!def) continue;
    for (const command of topic.commands) {
      if (!def.blockText.includes(command)) {
        out.push(finding('guide-command-coverage', 'error', topic.id,
          `${def.file}:${def.line} ${topic.id} does not show its dataset command verbatim: ${command}`));
      }
    }
  }
  return out;
}

export function checkWaiverMarker({ topics, waivers }, files, options) {
  const waived = new Set(waivers?.waived ?? []);
  const defs = new Map(allDefinitions(files).map((d) => [d.id, d]));
  const byId = new Map(topics.map((t) => [t.id, t]));
  const out = [];
  for (const id of waived) {
    const topic = byId.get(id);
    if (topic && !inScope(topic, options)) continue;
    const def = defs.get(id);
    if (!def) continue;
    if (!def.blockText.includes(WAIVER_MARKER)) {
      out.push(finding('guide-waiver-marker', 'error', id,
        `${def.file}:${def.line} ${id} is waived in data/sourcing-waivers.json but carries no no-primary-source marker`));
    }
  }
  return out;
}

export function checkDanglingXref(dataset, files, options) {
  const severity = options?.scope ? 'warn' : 'error';
  const byPath = new Map(files.map((f) => [f.path, f]));
  const out = [];
  for (const f of files) {
    for (const link of f.links) {
      if (/^[a-z]+:/i.test(link.href) || link.href.startsWith('#')) continue;
      const [rel, anchor] = link.href.split('#');
      const target = rel === '' ? f.path : posix.normalize(posix.join(posix.dirname(f.path), rel));
      const targetFile = byPath.get(target);
      if (!targetFile) {
        out.push(finding('guide-dangling-xref', severity, f.path,
          `${f.path}:${link.line} links to ${target}, which is not a guide file`));
        continue;
      }
      if (anchor && !targetFile.anchors.has(anchor)) {
        out.push(finding('guide-dangling-xref', severity, f.path,
          `${f.path}:${link.line} links to anchor #${anchor}, which ${target} does not define`));
      }
    }
  }
  return out;
}

export function checkVendorNeutrality(dataset, files) {
  const cloudNetworking = dataset.topics.filter(
    (t) => t.domain === 'Cloud Computing Fundamentals' && t.competency === 'Networking',
  );
  if (cloudNetworking.length === 0) return [];
  const index = guideIndex(dataset);
  const path = guidePathFor(cloudNetworking[0], index);
  const file = files.find((f) => f.path === path);
  if (!file) return [];
  const text = file.definitions.map((d) => d.blockText).join('\n');
  const hasMapping = /\|\s*AWS\s*\|/.test(text) || /\bAzure\b/.test(text);
  const used = AWS_ONLY_TERMS.filter((term) => text.includes(term));
  if (used.length > 0 && !hasMapping) {
    return [finding('guide-vendor-neutrality', 'warn', path,
      `${path} uses AWS-specific vocabulary (${used.join(', ')}) with no vendor mapping table; the exam is not AWS-specific`)];
  }
  return [];
}

export function runAllGuideChecks(dataset, files, options = {}) {
  assertKnownScope(dataset, options);
  return [
    ...checkMissingConcept(dataset, files, options),
    ...checkDuplicateDefinition(dataset, files, options),
    ...checkUnknownConcept(dataset, files, options),
    ...checkComparisonCoverage(dataset, files, options),
    ...checkComparisonMembership(dataset, files, options),
    ...checkComparisonPointer(dataset, files, options),
    ...checkCommandCoverage(dataset, files, options),
    ...checkSectionApparatus(dataset, files, options),
    ...checkDepthTreatment(dataset, files, options),
    ...checkWaiverMarker(dataset, files, options),
    ...checkMetadataAccuracy(dataset, files, options),
    ...checkDanglingXref(dataset, files, options),
    ...checkSourceIds(dataset, files, options),
    ...checkVendorNeutrality(dataset, files, options),
  ];
}
```

Move the three `import` lines to the top of the file, alongside the existing `competencyKey` import.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/test/guide-checks.test.mjs`
Expected: PASS, 49 tests in that file (25 from Task 4 plus 12 new — the 11 above plus one
covering that `runAllGuideChecks` calls `assertKnownScope` before running any check — plus 12
more added in "Fix round 1" below).

**Note (post-implementation):** Task 4 went through a fix round after this task was drafted,
which changed the actual test count (25, not 10) and added a second competency plus depth-4/5
concepts to the fixture. The `FULL` sample string above was re-verified against the fixture as
it now stands — the `.replace()` targets (the metadata lines for `fx.fixture.shallow` and
`fx.fixture.waived`, and the first occurrence of `**What the exam may test** ...`, which is
Deep's) still match verbatim, so no adaptation to the sample text itself was needed. This task
also calls `assertKnownScope(dataset, options)` as the first line of `runAllGuideChecks`, per
the interface note above.

**Note (Fix round 1):** A mutation-testing review of the seven checks this task adds found the
test suite green under mutations that should have failed it: `checkVendorNeutrality`'s only
trigger condition (`used.length > 0 && !hasMapping`) was exercised by no test, since the one
test naming it only hits the early-return path; the scope gates in
`checkComparisonCoverage`, `checkComparisonMembership`, `checkComparisonPointer`,
`checkCommandCoverage` and `checkWaiverMarker` were never exercised with a real `scope` value;
`checkCommandCoverage` credited a substring match (`uname -r` satisfied by a guide that only
ever showed `uname -rV`); `checkDanglingXref` skipped every anchor-only href unconditionally,
so a same-file link to a nonexistent anchor passed unconditionally; and `checkWaiverMarker`
matched only the waiver disclaimer's opening sentence, letting a truncated marker pass. Fixed by
tightening `checkCommandCoverage` to require a complete invocation (not immediately adjacent, on
either side, to a letter, digit, hyphen, underscore, `=` or `/`), resolving anchor-only links in
`checkDanglingXref` against the containing file's own anchors, and requiring both the opening
sentence and the phrase `not citable fact` in `checkWaiverMarker` — plus twelve new tests: three
building a synthetic Cloud Computing Fundamentals :: Networking dataset to exercise
`checkVendorNeutrality`'s real trigger in both directions; five, one per under-tested check,
each building a small local dataset (not the shared fixture, to avoid rippling into every other
test that reads `dataset.topics` unscoped) with an equivalent violation in two real competencies
and proving scope filtering both reports the in-scope one and excludes the other; two for the
command-boundary fix (`uname -r` vs `uname -rV`, and a fenced command followed by a pipe still
counting); one for the anchor-only dangling-link fix; and one for the truncated-waiver-marker
fix. `tools/test/guide-checks.test.mjs` grew from 37 to 49 tests.

- [ ] **Step 5: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; 154 tests.

- [ ] **Step 6: Commit**

```bash
git add tools/lib/guide-checks.mjs tools/test/guide-checks.test.mjs
git commit -m "feat: add comparison, command, waiver and cross-reference guide checks"
```

---

## Task 6: The two CLIs

**Files:**
- Create: `tools/check-guide.mjs`
- Create: `tools/guide-plan.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `loadDataset`, `loadGuide`, `runAllGuideChecks`, `assignBlocks`, `blocksMentioning`, `guideIndex`, `guidePathFor`, `relativeGuideLink`.
- Produces: `npm run check-guide` and `npm run guide-plan "<Domain> :: <Competency>"`.

- [ ] **Step 1: Write `tools/check-guide.mjs`**

```js
#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { loadGuide } from './lib/guide-parse.mjs';
import { runAllGuideChecks } from './lib/guide-checks.mjs';

const args = process.argv.slice(2);
const scopeAt = args.indexOf('--scope');
const scope = scopeAt >= 0 ? args[scopeAt + 1] : undefined;

const dataset = await loadDataset('data');
const files = await loadGuide('study-guide');

for (const f of files) {
  for (const m of f.malformed) console.error(`ERROR  [guide-malformed] ${f.path}:${m.line} ${m.reason}`);
}
const malformed = files.reduce((n, f) => n + f.malformed.length, 0);

const findings = runAllGuideChecks(dataset, files, { scope });
const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warn');

for (const f of errors) console.error(`ERROR  [${f.check}] ${f.message}`);
for (const f of warnings) console.warn(`WARN   [${f.check}] ${f.message}`);

console.log(
  `\n${files.length} guide file(s), ${dataset.topics.length} concept(s)` +
  `${scope ? `, scope ${scope}` : ''} — ` +
  `${errors.length + malformed} error(s), ${warnings.length} warning(s)`,
);

process.exit(errors.length + malformed > 0 ? 1 : 0);
```

- [ ] **Step 2: Write `tools/guide-plan.mjs`**

```js
#!/usr/bin/env node
import { loadDataset } from './lib/load.mjs';
import { assignBlocks, blocksMentioning } from './lib/comparisons.mjs';
import { guideIndex, guidePathFor, relativeGuideLink } from './lib/guide-paths.mjs';
import { competencyKey } from './lib/load.mjs';

const target = process.argv[2];
const dataset = await loadDataset('data');
const index = guideIndex(dataset);

if (!target) {
  console.log('Usage: node tools/guide-plan.mjs "<Domain> :: <Competency>"\n\nAvailable:');
  for (const entry of index.values()) console.log(`  ${entry.domain} :: ${entry.competency}`);
  process.exit(1);
}

const key = target.replace(' :: ', '::');
const entry = index.get(key);
if (!entry) {
  console.error(`Unknown competency: ${target}`);
  process.exit(1);
}

const topics = dataset.topics.filter((t) => competencyKey(t.domain, t.competency) === key);
const blocks = assignBlocks(dataset);
const byId = new Map(dataset.topics.map((t) => [t.id, t]));
const waived = new Set(dataset.waivers?.waived ?? []);

console.log(`# Writing brief: ${entry.domain} :: ${entry.competency}`);
console.log(`\nFile: ${entry.path}`);
console.log(`Concepts: ${topics.length}`);
console.log(`Waived (no primary source): ${topics.filter((t) => waived.has(t.id)).length}`);

const sections = [...new Set(topics.map((t) => t.path[2]))];
for (const section of sections) {
  console.log(`\n## Section: ${section}`);
  for (const t of topics.filter((x) => x.path[2] === section)) {
    console.log(`\n### ${t.path.at(-1)}`);
    console.log(`  id: ${t.id}`);
    console.log(`  depth ${t.required_depth} · importance ${t.importance} · LFS200 ${t.coverage_status}`);
    console.log(`  description: ${t.description}`);
    if (t.notes) console.log(`  notes: ${t.notes}`);
    if (t.commands.length) console.log(`  commands (must appear verbatim): ${t.commands.join(' | ')}`);
    if (t.additional_sources.length) console.log(`  sources: ${t.additional_sources.join(', ')}`);
    if (waived.has(t.id)) console.log('  WAIVED: must carry the no-primary-source marker');
  }
}

console.log('\n## Comparison blocks this file owns');
const owned = [...blocks.values()].filter((b) => byId.get(b.owner) && competencyKey(byId.get(b.owner).domain, byId.get(b.owner).competency) === key);
if (owned.length === 0) console.log('  none');
for (const b of owned) {
  console.log(`\n  anchor: ${b.anchor}`);
  console.log(`  compares (exact order): ${b.compares.map((id) => `\`${id}\``).join(', ')}`);
  for (const m of b.members) console.log(`    member ${m} — ${byId.get(m).description}`);
}

console.log('\n## Comparison blocks this file must point to');
let outbound = 0;
for (const t of topics) {
  for (const b of blocksMentioning(blocks, t.id)) {
    const link = relativeGuideLink(entry.path, guidePathFor(byId.get(b.owner), index), b.anchor);
    console.log(`  in ${t.id}: *Not to be confused with [${byId.get(b.owner).path.at(-1)}](${link}).*`);
    outbound += 1;
  }
}
if (outbound === 0) console.log('  none');
```

- [ ] **Step 3: Add the npm scripts**

In `package.json`, the `scripts` block becomes:

```json
  "scripts": {
    "test": "node --test",
    "validate": "node tools/validate.mjs",
    "generate": "node tools/generate-views.mjs",
    "check-guide": "node tools/check-guide.mjs",
    "guide-plan": "node tools/guide-plan.mjs"
  }
```

- [ ] **Step 4: Verify both CLIs against the real dataset**

Run: `npm run guide-plan -- "System Administration Fundamentals :: Networking" | head -40`
Expected: a brief naming 49 concepts across 10 sections, with 13 owned blocks.

Run: `npm run check-guide`
Expected: exit 1, with 537 `guide-missing-concept` errors — correct, because `study-guide/` does not exist yet.

Run: `npm run check-guide -- --scope "System Administration Fundamentals :: Networking"`
Expected: exit 1, with 49 `guide-missing-concept` errors and none from other competencies.

- [ ] **Step 5: Run the full gates**

Run: `npm test && npm run validate`
Expected: both exit 0; 96 tests.

- [ ] **Step 6: Commit**

```bash
git add tools/check-guide.mjs tools/guide-plan.mjs package.json
git commit -m "feat: add check-guide and guide-plan CLIs"
```

---

## Task 7: Dataset write-backs that must precede writing

Two problems in `data/` are known before any prose is written. Both are fixed here so that no writer has to work around them.

**Files:**
- Modify: `data/topics/02-system-administration.json` (concept `sysadmin.system-administration.home`)
- Modify: `data/topics/05-devops.json` (concept `devops.git-concepts.push`)
- Modify: `data/topics/03-cloud-computing.json` (the 14 `cloud.networking.*` concepts)
- Modify: `data/sources.json` if a new primary source is cited
- Modify: `PROGRESS.md`

- [ ] **Step 1: Enrich the two concepts that are too thin to teach**

`sysadmin.system-administration.home` and `devops.git-concepts.push` currently carry descriptions too thin to build a topic from. Rewrite each `description` so it states what the thing is, what it is contrasted with, and what an exam question would turn on — matching the density of neighbouring concepts in the same file. Add `commands` where the concept is command-bearing (`git push`, `git push -u origin main`), and `confused_with` only where a genuine confusable exists. Cite a primary source in `additional_sources`: `git-scm` documentation for push, `hier(7)` or the FHS for the home directory. Register any new source id in `data/sources.json` with an `authority_tier`.

- [ ] **Step 2: Make `cloud.networking.*` vendor-neutral**

All 14 concepts under `Cloud Computing Fundamentals :: Networking` currently use AWS vocabulary as though it were vendor-neutral. The LFCA is not an AWS exam. For each, rewrite the `description` to name the vendor-neutral concept first (virtual network, subnet, network access control list, managed load balancer, private connectivity), keeping vendor names only as examples and only where all three major providers are named or none are. Do not delete the AWS term — a candidate will meet it — but demote it from the definition to an example.

- [ ] **Step 3: Verify the dataset still validates**

Run: `npm run validate`
Expected: exit 0, 16 warnings, no new errors. In particular `derived-importance` and `invalid-enum` must stay clean.

- [ ] **Step 4: Regenerate the views**

Run: `npm run generate && npm run validate && npm test`
Expected: all exit 0. `research/**` and `coverage-matrix.md` show a diff; that diff is generated output, not a hand edit.

- [ ] **Step 5: Record the changes in PROGRESS.md**

Add a `## Cycle 2` section with a `### Dataset corrections` subsection. For each concept changed, record: the id, what it said, what it says now, and the primary source that settles it. State plainly that the AWS-vocabulary problem was a cycle-1 defect found in cycle 2.

- [ ] **Step 6: Commit**

```bash
git add data PROGRESS.md research coverage-matrix.md
git commit -m "fix: enrich two thin concepts and make cloud networking vendor-neutral"
```

---

## Task 8: Pilot — Linux Operating System, and the style guide

This is the pilot. It sets the house style every later file follows, so it is written and reviewed before any other prose task starts.

**Files:**
- Create: `study-guide/STYLE.md`
- Create: `study-guide/01-linux-fundamentals/linux-operating-system.md`

**Parameters:** 27 concepts · depths 4/6/17/0/0 · 6 sections · 11 concepts with commands · owns 8 comparison blocks (0 cross-file) · 9 outbound pointer lines · 0 waived · competency unchanged in 2025.

- [ ] **Step 1: Get the brief**

Run: `npm run guide-plan -- "Linux Fundamentals :: Linux Operating System"`

- [ ] **Step 2: Write `study-guide/STYLE.md`**

A short normative style guide, derived from the spec, covering: the marker grammar; the body labels required at each depth; the word targets; the distinction-first voice with worked examples of good and bad topic openings; the rule that `notes` feeds Traps; the ban on multiple choice in knowledge checks; the ban on emojis; how to write a comparison table (one axis per row, the separating axis named in a sentence beneath); how to write a Commands table; and the exact waived-source marker text.

- [ ] **Step 3: Write the competency file**

Follow the Writing Task Protocol above, steps C through E.

- [ ] **Step 4: Check**

Run: `npm run check-guide -- --scope "Linux Fundamentals :: Linux Operating System"`
Expected: `0 error(s)`.

- [ ] **Step 5: Full gates**

Run: `npm test && npm run validate`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add study-guide/STYLE.md study-guide/01-linux-fundamentals/linux-operating-system.md
git commit -m "docs: add study guide style guide and Linux Operating System pilot"
```

**Review gate:** this task's review is the strictest of the cycle. It approves the house style, not just the file. Reject on: definitions that do not teach a distinction, filler in depth-1 rows, comparison tables without a named separating axis, or any invented command option.

---

## Tasks 9–29: The remaining 21 competency files

Each follows the **Writing Task Protocol** in full. The parameters below are the complete per-task specification; everything else is in the protocol.

| Task | File | Concepts | Depths 1/2/3/4/5 | Sections | Cmd concepts | Blocks owned (cross-file) | Outbound ptr lines | Waived | Notes |
| ---: | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 9 | `study-guide/01-linux-fundamentals/command-line.md` | 39 | 0/5/33/0/1 | 11 | 33 | 4 (0) | 8 | 0 | Competency **new in 2025**; LFS200 8% coverage. The command-heaviest file — every option shown must exist. |
| 10 | `study-guide/02-system-administration/system-administration.md` | 71 | 2/6/57/2/4 | 9 | 54 | 23 (3) | 28 | 0 | Largest file, ~30k words. 4 of the 6 depth-5 concepts live here. |
| 11 | `study-guide/02-system-administration/best-practices.md` | 20 | 2/11/7/0/0 | 1 | 0 | 5 (3) | 3 | 7 | **New in 2025, zero LFS200 lessons.** 7 waived concepts. One section, so one scenario and one knowledge check covering all 20. |
| 12 | `study-guide/02-system-administration/networking.md` | 49 | 1/5/38/5/0 | 10 | 30 | 13 (1) | 15 | 2 | **Weak area — write denser.** 5 depth-4 concepts. Feeds Appendix A. |
| 13 | `study-guide/02-system-administration/troubleshooting.md` | 15 | 0/0/7/8/0 | 2 | 10 | 1 (0) | 1 | 4 | 8 of the corpus's 15 depth-4 concepts. Every topic needs Symptoms and diagnostic order. |
| 14 | `study-guide/02-system-administration/disaster-recovery.md` | 18 | 1/5/12/0/0 | 2 | 1 | 6 (1) | 8 | 2 | **New in 2025.** LFS200's Backup lesson is one character. Respect the cycle-1 correction: a warm site is partially equipped and data must be restored (NIST SP 800-34r1). |
| 15 | `study-guide/03-cloud-computing/cloud-computing.md` | 23 | 0/7/16/0/0 | 7 | 0 | 11 (3) | 10 | 0 | Respect the cycle-1 correction: console work leaves no *reproducible artifact*; it is audited by CloudTrail / Activity Log / Cloud Audit Logs. |
| 16 | `study-guide/03-cloud-computing/performance-availability.md` | 17 | 1/5/11/0/0 | 3 | 0 | 6 (1) | 8 | 0 | **Zero LFS200 lessons.** |
| 17 | `study-guide/03-cloud-computing/budgeting.md` | 13 | 2/4/7/0/0 | 2 | 0 | 4 (1) | 3 | 0 | Zero LFS200 coverage. |
| 18 | `study-guide/03-cloud-computing/best-practices.md` | 15 | 0/13/2/0/0 | 3 | 0 | 1 (0) | 1 | 0 | **New in 2025, zero LFS200 lessons.** AWS has six Well-Architected pillars since December 2021, not five. |
| 19 | `study-guide/03-cloud-computing/networking.md` | 14 | 0/7/7/0/0 | 1 | 0 | 4 (1) | 3 | 0 | **New in 2025, zero LFS200 lessons. Weak area.** Must carry the AWS / Azure / Google Cloud mapping table — check 14 warns without it. |
| 20 | `study-guide/04-security/security.md` | 38 | 0/14/23/0/1 | 5 | 5 | 10 (1) | 12 | 0 | Respect the cycle-1 correction: phishing is not the single most common initial access route (DBIR 2025 ranks credential abuse higher). |
| 21 | `study-guide/04-security/sensitive-data.md` | 13 | 0/9/4/0/0 | 3 | 0 | 1 (0) | 3 | 0 | Zero LFS200 coverage. |
| 22 | `study-guide/04-security/compliance.md` | 14 | 2/6/6/0/0 | 3 | 0 | 4 (2) | 2 | 0 | **New in 2025, zero LFS200 lessons.** GDPR, HIPAA, ISO 27001 and SOC 2 appear zero times in the course. |
| 23 | `study-guide/05-devops/devops-basics.md` | 25 | 2/14/9/0/0 | 5 | 0 | 3 (0) | 8 | 1 | Carry the dataset's own distinction voice: monitoring observes, alerting interrupts. |
| 24 | `study-guide/05-devops/git-concepts.md` | 22 | 3/3/16/0/0 | 4 | 16 | 3 (1) | 5 | 1 | Respect the cycle-1 correction: a fast-forward merge creates no merge commit. Uses the `push` concept enriched in Task 7. |
| 25 | `study-guide/05-devops/containers.md` | 24 | 0/10/14/0/0 | 5 | 10 | 4 (0) | 9 | 0 | **Weak area — write denser.** LFS200's Containers lesson never mentions Docker, images, registries or orchestration. Kubernetes is *hosted by* the CNCF as a graduated project and governed by its own Steering Committee. Only RUN, COPY and ADD create layers. Feeds Appendix B. |
| 26 | `study-guide/06-it-project-management/project-management.md` | 29 | 3/12/14/0/0 | 5 | 0 | 7 (0) | 8 | 19 | **19 waived concepts** — the highest in the corpus. Every one needs the marker and hedged language. |
| 27 | `study-guide/06-it-project-management/software-application-architecture.md` | 17 | 5/3/9/0/0 | 5 | 1 | 4 (0) | 4 | 9 | 9 waived. Respect the cycle-1 correction on PUT versus PATCH. |
| 28 | `study-guide/06-it-project-management/functional-analysis.md` | 12 | 2/7/3/0/0 | 3 | 0 | 2 (1) | 1 | 12 | **All 12 concepts waived** — BABOK and ISO/IEC/IEEE 29148 are paywalled. Write nothing that implies a citable standard. |
| 29 | `study-guide/06-it-project-management/open-source-software-and-licensing.md` | 22 | 9/4/9/0/0 | 5 | 0 | 5 (0) | 7 | 0 | 9 depth-1 concepts, the most in the corpus — most of this file is a Quick reference table. Avoid the copyleft "viral" framing corrected in cycle 1. |

Each task's steps are exactly the protocol's Steps A–F, with `--scope "<Domain> :: <Competency>"` set to that row's competency, and the commit message `docs: write <competency> study guide`.

---

## Task 30: The six domain index files and the README

**Files:**
- Create: `study-guide/README.md`
- Create: `study-guide/01-linux-fundamentals.md` … `study-guide/06-it-project-management.md`

Runs after Tasks 8–29 so every link target exists.

- [ ] **Step 1: Write the six domain index files**

Each contains: the domain's exam weight and its pre-2025 weight, from `data/competencies.json`; which competencies are `added` or `reworded` in 2025, and the consequence (no pre-2025 material covers an added competency); the domain's LFS200 coverage position from `research/lfs200-notes/00-course-map.md`; a section map linking every competency file and every `## ` section anchor within it; a suggested study order with a rationale; and the domain's comparison blocks with links.

- [ ] **Step 2: Write `study-guide/README.md`**

Contains: what the guide is and what it is built from; the exam facts from Global Constraints; the six domains in weight order with links; how to use the depth ratings; what the guide does **not** claim — that objectives below competency level are inferred, that `candidate_evidence` is empty, that 57 concepts have no primary-documentation citation, and that no question count is published; and how to verify the guide with `npm run check-guide`.

- [ ] **Step 3: Check**

Run: `npm run check-guide`
Expected: `0 error(s)`. This is the first full-corpus run that should be clean — all 537 definition sites, all 129 comparison blocks, all cross-file links.

- [ ] **Step 4: Full gates**

Run: `npm test && npm run validate`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add study-guide/README.md study-guide/0*.md
git commit -m "docs: add study guide domain indexes and README"
```

---

## Task 31: Appendix A — a packet's life

**Files:**
- Create: `study-guide/appendix-a-packet-life.md`

One narrative from `curl https://example.com` to a rendered response: name resolution (resolver, `/etc/hosts`, `/etc/resolv.conf`, recursive versus authoritative, record types, caching and TTL), ARP and the local segment, routing and the default gateway, NAT, the TCP three-way handshake, source and destination ports, TLS negotiation, and firewall traversal in both directions. Each step links to its concept anchor in `02-system-administration/networking.md` and `04-security/security.md`.

**It defines no concepts.** It links to them. Check 2 fails if it creates a second definition site — use `[term](path#c-id)` links, never `<a id="c-id">` anchors.

At each step, name what breaks if that step fails and what the symptom looks like, so the appendix doubles as a troubleshooting order.

- [ ] **Step 1: Write the appendix**
- [ ] **Step 2: Run `npm run check-guide`** — expected `0 error(s)`
- [ ] **Step 3: Run `npm test && npm run validate`** — expected both exit 0
- [ ] **Step 4: Commit**

```bash
git add study-guide/appendix-a-packet-life.md
git commit -m "docs: add packet life deep dive appendix"
```

---

## Task 32: Appendix B — container to cluster

**Files:**
- Create: `study-guide/appendix-b-container-to-cluster.md`

One narrative from a Dockerfile to a running, load-balanced workload: build context and layers (only RUN, COPY and ADD create layers), image and tag, registry push and pull, container runtime and namespaces/cgroups, container versus virtual machine, pod, deployment and replica management, service and cluster networking, and where orchestration takes over from the runtime. Each step links to its concept anchor in `05-devops/containers.md` and `03-cloud-computing/cloud-computing.md`.

Same rule: **links, not definition sites.**

- [ ] **Step 1: Write the appendix**
- [ ] **Step 2: Run `npm run check-guide`** — expected `0 error(s)`
- [ ] **Step 3: Run `npm test && npm run validate`** — expected both exit 0
- [ ] **Step 4: Commit**

```bash
git add study-guide/appendix-b-container-to-cluster.md
git commit -m "docs: add container to cluster deep dive appendix"
```

---

## Task 33: Adversarial fact-check — every command

**Files:**
- Create: `docs/verification/cycle2-factcheck-commands.json`
- Modify: any `study-guide/**` file with a confirmed error

Every command, option, flag and example in the guide is checked against its man page or official documentation. 171 concepts carry 379 dataset command strings, and writers will have added options and examples beyond those.

- [ ] **Step 1: Extract every claim**

Extract one claim record per command invocation and per option shown, across all 22 competency files, as `{claim_id, file, line, concept_id, command, claim}`.

- [ ] **Step 2: Check each claim against primary documentation**

Fan out across agents, one per competency file that has commands. Each agent verifies against the man page or the project's official documentation — never a blog, never memory. `git-scm.com` for Git, `kubernetes.io` for Kubernetes, `docs.docker.com` for Docker, the man pages for everything POSIX.

- [ ] **Step 3: Record every verdict, keyed by agent label**

Write `docs/verification/cycle2-factcheck-commands.json` as an array of `{claim_id, agent_label, verdict, reasoning, source}` where `verdict` is `confirmed` or `refuted`.

**A claim with no verdict from a named agent is an error, not a pass.** This is the cycle-1 defect being fixed: a controller keyed verdicts off a content hash, the pairing was lost, and eight findings defaulted to "rejected" — which read as eight confident refutations when only three had reasoning. Assert before continuing that every extracted `claim_id` appears exactly once in the results file with a non-empty `agent_label` and non-empty `reasoning`.

- [ ] **Step 4: Fix every refuted claim**

Correct the prose. If the error originates in `data/`, note the concept id for Task 34 rather than editing `data/` here.

- [ ] **Step 5: Re-check and commit**

Run: `npm run check-guide && npm test && npm run validate`
Expected: all exit 0.

```bash
git add study-guide docs/verification/cycle2-factcheck-commands.json
git commit -m "fix: correct command errors found by adversarial fact-check"
```

---

## Task 34: Adversarial fact-check — the 57 unsourced concepts, then write-back

**Files:**
- Create: `docs/verification/cycle2-factcheck-waived.json`
- Modify: `study-guide/**` where a claim is refuted
- Modify: `data/**` where a dataset error was found during Tasks 8–33
- Modify: `PROGRESS.md`

- [ ] **Step 1: Check the 57 waived concepts**

For each concept in `data/sourcing-waivers.json`, an agent checks that the prose: carries the marker verbatim; makes no claim that a specific standard says a specific thing without a citable source; and hedges where the field genuinely disagrees. 40 are in Project Management, where PMBOK, PMI Lexicon, ISO 21500/21502, BABOK and ISO/IEC/IEEE 12207 and 29148 are paywalled.

- [ ] **Step 2: Record every verdict**

Same format and the same completeness assertion as Task 33. `docs/verification/cycle2-factcheck-waived.json`.

These files live under `docs/` rather than `.superpowers/sdd/`, whose `.gitignore` is `*`. Cycle 1 wrote its verdicts to the ignored directory and `PROGRESS.md` cites `stage5-results.json`, a file that was never committed — the evidence for a verdict claim must be in the repository that makes the claim.

- [ ] **Step 3: Apply dataset write-backs**

Apply every dataset correction accumulated during Tasks 8–33. For each: fix `data/topics/*.json`, and record in `PROGRESS.md` the concept id, what it said, what it says now, and the primary source that settles it.

- [ ] **Step 4: Regenerate and re-check**

Run: `npm run generate && npm run validate && npm test && npm run check-guide`
Expected: all exit 0. Check 11 will fail if a write-back changed a depth, importance or coverage status without the guide's metadata line following — fix the guide, not the check.

- [ ] **Step 5: Commit**

```bash
git add data study-guide research coverage-matrix.md PROGRESS.md docs/verification/cycle2-factcheck-waived.json
git commit -m "fix: apply dataset write-backs found while writing the study guide"
```

---

## Task 35: Close the cycle

**Files:**
- Modify: `PROGRESS.md`
- Modify: `README.md`

- [ ] **Step 1: Write the cycle 2 section of PROGRESS.md**

Record: what was built, with counts (files, words, concepts covered, comparison blocks); every dataset correction with its settling source; the fact-check results as **the count of verdicts actually returned**, never a default; every gap that remains, including the 57 unsourced concepts and any claim that could not be verified; and any braindump site encountered and excluded.

State plainly what the guide does not establish: objectives below competency level are inferred; `candidate_evidence` is empty; no question count is published.

- [ ] **Step 2: Update the repository README**

Add `study-guide/` to the repository layout, and `npm run check-guide` and `npm run guide-plan` to the tooling section.

- [ ] **Step 3: Final gates**

Run: `npm test && npm run validate && npm run check-guide && npm run generate && git diff --stat`
Expected: all exit 0, and `git diff --stat` is empty — regeneration is idempotent.

- [ ] **Step 4: Commit**

```bash
git add PROGRESS.md README.md
git commit -m "docs: close cycle 2 in progress and README"
```

---

## Task 36: Final adversarial whole-branch review

Cycle 1's final whole-branch review found one Critical defect and a place where the project had overstated its own results, both missed by the per-task reviews. This task repeats it.

- [ ] **Step 1: Review the whole branch**

Dispatch an independent reviewer over `git diff main...HEAD` with the spec and this plan, instructed to find defects rather than to approve. Priorities in order: factual errors that would teach a misconception; claims of authority the sourcing does not support; any place `PROGRESS.md` overstates what the process achieved; comparisons that contradict each other across files; commands or options that do not exist; and any drift toward LFCS/CKA/RHCSA depth.

- [ ] **Step 2: Verify each finding before acting on it**

Reviewer findings are evidence, not instructions. Check each against primary documentation before changing anything, and record rejected findings with the reasoning.

- [ ] **Step 3: Fix, re-run the gates, commit**

Run: `npm test && npm run validate && npm run check-guide`
Expected: all exit 0.

- [ ] **Step 4: Record the review outcome in PROGRESS.md**

Including findings that were rejected and why.

```bash
git add -A
git commit -m "docs: record cycle 2 final review findings and fixes"
```

---

## Definition of done

1. All 537 concepts have exactly one definition site.
2. All 156 confusable edges are covered by the 129 computed blocks, each exactly once, with pointers from every non-owning member.
3. Every section has a scenario and a knowledge check, and no knowledge check is multiple choice.
4. Every dataset command string appears verbatim in its topic and has a recorded fact-check verdict from a named agent.
5. All 57 waived concepts carry the no-primary-source marker.
6. `npm run check-guide` exits 0.
7. `npm test` and `npm run validate` exit 0.
8. `npm run generate` produces no diff.
9. Every `data/` correction is in `PROGRESS.md` with its settling source.
10. The final adversarial review has run and its findings are resolved or recorded.
