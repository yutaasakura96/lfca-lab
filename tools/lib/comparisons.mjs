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
