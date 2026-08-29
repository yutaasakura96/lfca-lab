# LFCA Practice — design system

The canvas: <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>

## Source of truth

- **`tokens.css`** — every colour, space, radius, font size, leading, measure,
  control height, duration and clock threshold. Both themes. Nothing in the
  design uses a value that is not defined here.
- **`base.css`** — the component layer (buttons, options, tiles, clock, meters,
  interaction states). Every value resolves to a token.
- **`parts/*.part`** — one artboard each: `[CSS] [PROPS] [BODY] [LOGIC]`.

`*.dc.html` and `lfca-practice-design-system.html` are **generated**. Edit the
parts, never the output.

## Commands

```bash
node build.mjs                    # parts + tokens + base -> *.dc.html
node tools/render-for-measure.mjs # render each artboard standalone into .measure/
```

Then serve `design/` and open `.measure/measure.html` to check every artboard
for vertical clipping and horizontal overflow. `.claude/launch.json` defines a
`design-preview` server for this.

## Verified

- 40 colour pairs checked against WCAG 2.1 AA (4.5:1 text, 3:1 non-text) in both
  themes — all pass.
- All 14 artboards measured: none clips, none scrolls horizontally.
- Every one of the twelve neutral ramp steps feeds an alias; no alias invents a grey.
