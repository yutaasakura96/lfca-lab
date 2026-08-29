// Assembles design/parts/<Name>.part into design/<Name>.dc.html,
// splicing in tokens.css + base.css so every artboard is self-contained.
// tokens.css is the single source of truth — edit it, never the output.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const tokens = readFileSync(join(root, 'tokens.css'), 'utf8');
const base = readFileSync(join(root, 'base.css'), 'utf8');

const section = (src, tag) => {
  const open = `[${tag}]\n`;
  const i = src.indexOf(open);
  if (i === -1) return '';
  const rest = src.slice(i + open.length);
  const next = rest.search(/^\[[A-Z]+\]$/m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
};

// data-props rides in a single-quoted HTML attribute: entities decode first.
const attrEscape = (s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;');

let built = 0;
for (const f of readdirSync(join(root, 'parts')).sort()) {
  if (!f.endsWith('.part')) continue;
  const name = f.replace(/\.part$/, '');
  const src = readFileSync(join(root, 'parts', f), 'utf8');
  const css = section(src, 'CSS');
  const props = section(src, 'PROPS');
  const body = section(src, 'BODY');
  const logic = section(src, 'LOGIC');
  if (!body) throw new Error(`${f}: no [BODY]`);
  JSON.parse(props || '{}'); // fail loudly on malformed props

  const script = props || logic
    ? `<script data-dc-script data-props='${attrEscape(props || '{}')}'>\nclass Component extends DCLogic {\n${logic}\n}\n</script>`
    : '';

  const out = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap">
  <style>
${tokens}
${base}
${css}
  </style>
</helmet>
${body}
</x-dc>
${script}
</body>
</html>
`;
  writeFileSync(join(root, `${name}.dc.html`), out);
  built++;
  console.log(`built ${name}.dc.html  ${(out.length / 1024).toFixed(1)} KiB`);
}
console.log(`${built} artboard(s)`);
