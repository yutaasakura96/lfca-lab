// Renders each part standalone (holes + sc-for + sc-if resolved) so its real
// content height can be measured in a browser. Measurement only — not shipped.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
import { mkdirSync, cpSync } from 'node:fs';
mkdirSync(join(root,'.measure'), { recursive: true });
const tokens = readFileSync(join(root,'tokens.css'),'utf8');
const base   = readFileSync(join(root,'base.css'),'utf8');

const section = (src, tag) => {
  const open = `[${tag}]\n`; const i = src.indexOf(open);
  if (i === -1) return '';
  const rest = src.slice(i + open.length);
  const next = rest.search(/^\[[A-Z]+\]$/m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
};

const get = (scope, path) => {
  if (path === 'true') return true;
  if (path === 'false') return false;
  return path.split('.').reduce((o,k) => (o == null ? undefined : o[k]), scope);
};

// find the matching close for an <sc-for>/<sc-if> starting at openStart
const matchEnd = (s, tag, from) => {
  const openRe = new RegExp(`<${tag}\\b`, 'g');
  const closeRe = new RegExp(`</${tag}>`, 'g');
  let depth = 0, i = from;
  while (i < s.length) {
    openRe.lastIndex = i; closeRe.lastIndex = i;
    const o = openRe.exec(s), c = closeRe.exec(s);
    if (!c) throw new Error('unclosed ' + tag);
    if (o && o.index < c.index) { depth++; i = o.index + 1; }
    else { if (depth === 0) return { start: c.index, end: c.index + tag.length + 3 }; depth--; i = c.index + 1; }
  }
  throw new Error('unclosed ' + tag);
};

const render = (tpl, scope) => {
  // sc-for / sc-if, outermost first, recursively
  const m = /<sc-(for|if)\b([^>]*)>/.exec(tpl);
  if (m) {
    const tag = 'sc-' + m[1];
    const attrs = m[2];
    const bodyStart = m.index + m[0].length;
    const { start, end } = matchEnd(tpl, tag, bodyStart);
    const inner = tpl.slice(bodyStart, start);
    const before = render(tpl.slice(0, m.index), scope);
    const after  = render(tpl.slice(end), scope);
    if (m[1] === 'for') {
      const list = get(scope, /list="\{\{\s*([^}\s]+)\s*\}\}"/.exec(attrs)[1]) || [];
      const as = /as="([^"]+)"/.exec(attrs)[1];
      const out = list.map((item, i) => render(inner, { ...scope, [as]: item, $index: i })).join('');
      return before + out + after;
    }
    const cond = get(scope, /value="\{\{\s*([^}\s]+)\s*\}\}"/.exec(attrs)[1]);
    return before + (cond ? render(inner, scope) : '') + after;
  }
  return tpl.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, p) => {
    const v = get(scope, p);
    return v === undefined || v === null ? '' : String(v);
  });
};

class DCLogic { constructor(props){ this.props = props; this.state = {}; } setState(){} }
globalThis.DCLogic = DCLogic;

const out = [];
for (const f of readdirSync(join(root,'parts')).sort()) {
  if (!f.endsWith('.part')) continue;
  const name = f.replace(/\.part$/,'');
  const src = readFileSync(join(root,'parts',f),'utf8');
  const props = JSON.parse(section(src,'PROPS') || '{}');
  const defaults = {};
  for (const [k,v] of Object.entries(props)) if (k !== '$preview') defaults[k] = v.default;
  const Cls = new Function('DCLogic', 'return class Component extends DCLogic {\n' + section(src,'LOGIC') + '\n}')(DCLogic);
  const vals = new Cls(defaults).renderVals();
  const html = render(section(src,'BODY'), vals);
  const w = props.$preview?.width ?? 1440, h = props.$preview?.height ?? 900;
  writeFileSync(join(root,'.measure',name + '.html'),
`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap">
<style>${tokens}\n${base}\n${section(src,'CSS')}
html,body{height:auto!important;width:${w}px!important;overflow:visible!important}
.app{min-height:0!important}
</style></head><body>${html}</body></html>`);
  out.push({ name, w, h });
}
writeFileSync(join(root,'.measure','index.json'), JSON.stringify(out));
cpSync(join(root,'tools','measure.html'), join(root,'.measure','measure.html'));
console.log(out.map(o => o.name + ' ' + o.w + 'x' + o.h).join('\n'));
