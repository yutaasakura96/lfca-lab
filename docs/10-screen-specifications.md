# 10 — Screen Specifications

**Status:** extracted from the Phase 2 prototype, 2026-08-29.
**Visual reference:** <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>
Board names below match the artboard titles on that canvas. Sources live in `design/parts/*.part`.

All values referenced here are defined in [`05-design-system.md`](05-design-system.md) and
[`design/tokens.css`](../design/tokens.css). This document says *what goes where*; that one says
*what it is made of*.

**Sample data warning for whoever builds this:** every score, timing and mastery percentage in the
prototype is invented. The one real figure is the per-domain split on the review screen — SysAdmin 18
/ Cloud 11 / Linux 10 / Security 8 / DevOps 7 / PM 6 per 60, which is this repo's measured partition.

**Eight screens. Desktop frame 1440px; phone frame 390px.**

---

## 1. Sign in

**Board:** `Sign in` (560×780)
**Purpose:** the only unauthenticated screen. Get one person into their own progress.

**Layout regions.** A single centred card, max-width 400px, on `--surface-page`. Top to bottom:
wordmark + mark; one-sentence headline; one-sentence description; the Google button; a one-line
data-retention note; a three-cell fact strip (`60` questions / `90` minutes / `45` to pass) above a
hairline; a provenance line naming the syllabus version.

**Components.** Brand mark (inline SVG, 4 bars, `--accent-solid`); Google sign-in button — full
width, `--control-h-lg`, `--radius-md`, 1px `--line-control`, official 4-colour G glyph at 18px;
`.eyebrow` + mono numerals for the fact strip.

**States.** *Empty* — n/a. *Loading* — button label swaps to "Opening Google…", button disabled,
`cursor: not-allowed`. *Error* — OAuth failure renders a message above the button using the
`incorrect` family (cross glyph + `--incorrect-surface` panel + a written reason); the button stays
enabled so it can be retried.

**Mobile.** Card goes full-width minus `--space-4` gutters. Nothing hides. The fact strip stays three
across.

---

## 2. Home — sixteen exams

**Boards:** `Home · sixteen exams` (1440×1500), `Home · phone` (390×1500)
**Purpose:** pick an exam and a mode; see best and first-attempt scores side by side.

**Layout regions.**
- **Top bar** — wordmark left; syllabus version, theme toggle and avatar right.
- **Page head** — "Practice exams" + one-line explainer, with three summary stats right-aligned:
  Sat `9/16`, Best average `46.1/60`, Passing `6/9`.
- **Two columns**, `1fr / 340px`, `--space-6` gap.
  - **Left, in a card:** a header row then sixteen exam rows. Row grid is
    `40px | 1fr | 150px | 150px | 232px`, `--space-5` gap, separated by 1px `--line-subtle`.
    - `40px` — exam number, mono, `--ink-faint`.
    - `1fr` — "Practice exam 04" + "60 questions · 90 min".
    - **Best** — score numeral `--text-lg` mono + a pass/short chip, over a 6px threshold bar with a
      2px tick at 75% (the 45/60 line). Bar fill is `--correct-solid` when ≥45, `--incorrect-solid`
      otherwise.
    - **First attempt** — same shape, `--ink-secondary` numeral, neutral `--line-control` fill, plus a
      delta (`+9`, or "first sitting" when equal).
    - **Actions** — `Review` (attempted only) · `Exam` · `Practice`, all `--control-h-md`.
  - **Right rail:** an *In progress* card (accent-tinted, showing exam, answered count, a warning
    clock and **Resume**), then a *Study by domain* card listing the six domains with weight, a
    mastery meter and a coverage line.

**Components.** Card, exam row, threshold bar, chip (`correct` / `incorrect` / `unanswered`), meter,
clock chip, avatar.

**States.**
- *Empty (no attempts yet)* — all sixteen rows show the `unanswered` chip "Not attempted" and an
  em-dash in both score columns; the summary stats read `0/16`, `—`, `0/0`; the *In progress* card is
  absent, and the page head gains one line: "Start with exam 01 — it is no harder than the others."
- *Loading* — sixteen skeleton rows at row height; the summary stats and rail cards render as blocks
  in `--surface-inset`. No spinner.
- *Error* — if progress fails to load, the sixteen rows still render (the exam list is static) with a
  banner above the card in the `incorrect` family: "Scores could not be loaded. You can still start an
  exam; results will be saved." Both mode buttons stay enabled.

**Mobile.** The two columns stack: *In progress* first, then the exam list, then *Study by domain*.
Each exam row becomes its own card — title + status chip on one line, Best and First attempt as a
two-column grid, then a three-up action row at `--control-h-lg`. The `#` column, the meta line and the
summary stats are dropped. The list paginates or lazy-loads; the phone board shows four rows and a
"Exams 05 to 16 below" marker.

---

## 3. Domain mode — setup

**Board:** `Domain mode` (1440×1100)
**Purpose:** choose one of six domains and start an untimed, domain-restricted practice run.

**Layout regions.**
- Top bar with a `Domain mode` chip and **Back to exams**.
- Page head: "Study by domain" + a lede noting the percentages are real exam weights.
- **A 3×2 grid of domain cards**, `--space-4` gap. Each card: domain name + "N% of exam" chip; its
  competencies as small outlined tags; then, pinned to the bottom, "X of Y seen", a mastery meter and
  "Last practised …". The selected card takes `--accent-solid` border, `--accent-surface` fill and the
  focus ring.
- **A setup strip** (full-width card): the selected domain, an availability chip, its competency list,
  then the controls — **Length** segmented control `20 / 40 / All N`, **Draw from** checkboxes
  (*Unseen questions*, *Previously missed*), and **Start domain practice** at `--control-h-lg`.
- A "Recent:" chip row of the last three domain sessions with their scores.

**Length default is 20.** (Decision 2026-08-29; closes the PRD §7 open assumption.)

**Components.** Card, chip, competency tag, meter, segmented control, checkbox, primary button.

**States.**
- *Empty* — a domain never practised shows "0 of N seen", an empty meter and "Last practised: not
  started". With both *Draw from* filters on and no matching questions, **Start** disables and a line
  under it reads "No unseen questions left in this domain — clear a filter to revise."
- *Loading* — six skeleton cards; the setup strip is hidden until a domain resolves.
- *Error* — bank load failure replaces the grid with an `incorrect`-family panel and a **Retry**
  button. No partial grid.

**Mobile.** Grid goes one column. The setup strip becomes a sticky bottom bar carrying only the domain
name and **Start**; Length and Draw-from move into the selected card. The "Recent:" row scrolls
horizontally.

---

## 4. Exam mode

**Boards:** `Exam mode · dark` (1440×900), `Exam mode · phone` (390×1400)
**Purpose:** sit a full 60-question exam under a 90-minute clock with free navigation and no feedback.

**Layout regions.**
- **Sticky top bar** (`--shadow-md`): left — exam name, `Exam mode` chip, "No feedback until you
  submit"; centre — **the clock**; right — answered count, flagged count, **Submit exam**.
- **Main column:** question counter + competency; a progress meter; a **Flag for review** toggle
  right-aligned; the stem; four option rows; a footer with keyboard hints (`1`–`4` choose, `F` flag,
  `←`/`→` move) and **Clear answer** · **Previous** · **Next**.
- **Right rail, 470px, in a card:** "Navigator" — the 60-tile grid (10 columns of `--tile-size`,
  `--space-2` gap), a legend (Unanswered / Answered / Current / Flagged), four counts (Answered,
  Unanswered, Flagged, **Needed to pass 45**), and a line stating that submitting reveals everything.

**Rail width is 470px and not negotiable at 1440.** Ten 34px tiles plus nine 8px gaps is 412px; the
card padding needs the rest. A narrower rail overflows.

**Components.** Sticky bar, clock (three states), option row (resting / selected), navigator tile
(five states), legend, meter, flag toggle, keyboard hint chips.

**States.**
- *Empty* — a question with nothing chosen: four resting option rows; its tile stays dashed. This is a
  normal state, not an error.
- *Loading* — questions are fetched once at start; the exam does not begin until all sixty are in
  hand, so there is no per-question loading state. The start transition shows the shell with skeleton
  stem and options.
- *Error* — **the important one.** Answers save as you go. If a save fails, a persistent chip appears
  in the top bar next to the counts, in the `incorrect` family: "Not saved — retrying". It must not be
  dismissible and must not block answering. The clock never pauses for it.

**Mobile.** The rail is gone. The navigator becomes a **sheet** pulled up from the question counter in
the top bar (`23/60` with a chevron); in the sheet the tiles are `--control-h-lg` (44px), seven per
row. Top bar keeps counter, clock and Submit. A fixed bottom action bar carries flag / Previous /
Next at 44px. Keyboard hints are dropped.

---

## 5. Submit confirmation

**Board:** `Exam mode · submit confirmation` (1440×900)
**Purpose:** make an irreversible submit deliberate, and make the cost of unanswered questions
arithmetically obvious.

**Layout regions.** The exam screen behind, dimmed with `--scrim`. A centred dialog, max-width 620px,
`--radius-lg`, `--shadow-lg`, `--space-6` padding:
1. Eyebrow "Before you submit" + "Submit practice exam 04?" + one paragraph stating it is final.
2. A four-cell tally: Answered / Unanswered / Flagged / Time left.
3. **The unanswered warning** — a panel using the *unanswered* treatment itself (dashed border, dashed
   ring glyph), not a colour: "22 questions have no answer", then the arithmetic: *"Blank answers are
   marked incorrect. With 38 answered you can reach at most 38 of the 45 needed to pass, so submitting
   now cannot pass this exam."* Then a jump row of unanswered tile numbers.
4. A flagged row: chip + the flagged numbers.
5. Actions right-aligned: **Keep working** (secondary) · **Submit and see score** (`--btn--danger`).

**States.** *Empty* — with zero unanswered, region 3 is removed entirely and the paragraph loses the
arithmetic sentence. *Loading* — on confirm, the destructive button disables and reads "Scoring…".
*Error* — if submission fails the dialog stays open with an `incorrect`-family line above the actions
and the button re-enabled. **The exam must not be lost.**

**Mobile.** Dialog becomes a bottom sheet, full width, actions stacked full-width with the destructive
action last. The jump row scrolls horizontally.

---

## 6. Time expired

**Board:** `Exam mode · time expired` (1440×900)
**Purpose:** tell someone the clock ran out, that it already submitted, and exactly what it cost.

**Layout regions.** Same scrim over the exam screen. Top bar clock reads `00:00` in the **critical**
state and **Submit exam** is disabled. The dialog has a 3px `--incorrect-solid` top border:
1. A critical clock chip at `00:00` beside the eyebrow "Time expired".
2. "Your exam was submitted automatically." + a paragraph: the ninety minutes are up, answers save as
   you go so everything chosen is recorded, and the unreached questions are marked incorrect.
3. Tally: Answered / Left blank / Flagged / Time used.
4. A dashed *unanswered*-treatment panel listing the blank question numbers, and a line saying the
   review still explains them.
5. **One** action: **See your score**.

**There is no cancel and no secondary action.** It already happened; offering a way out would be a
lie.

**States.** *Empty* — with zero left blank, region 4 is removed and the paragraph drops its final
clause. *Loading* — n/a; scoring completes before this renders. *Error* — if the auto-submit itself
failed, this dialog is replaced by an `incorrect`-family panel: "Time is up. Your exam could not be
submitted automatically." + **Retry submit**, and the answers stay in local storage.

**Mobile.** As screen 5 — bottom sheet, single full-width action.

---

## 7. Practice mode

**Board:** `Practice mode · answered` (1440×1620)
**Purpose:** sixty questions, no clock, graded immediately, every option explained.
**Domain mode reuses this screen unchanged** — only the header label and the question pool differ.

**Layout regions.**
- **Top bar:** exam name, `Practice mode` chip, "No time limit · answers revealed as you go"; right —
  a running `correct` chip and `incorrect` chip, and **Save and exit**. *No clock anywhere.*
- **Main column:** counter + competency + progress meter; **Flag for review**; the stem; then a
  **verdict bar** — a left-ruled `incorrect` panel reading "Not quite. The answer is A." with a second
  line noting every option is explained below; then the four option rows in their graded states, each
  carrying its explanation; then a sunken **"Why this is the answer"** panel with the main rationale,
  the concept id in mono, and a study-guide link; then a footer with `Enter` / `F` hints and
  **Previous** · **Next question**.
- **Right rail, 470px:** a *This session* card — the 60-tile grid in graded states (check / cross
  glyphs, current tile ringed, ungraded tiles plain) and Correct / Incorrect / Remaining counts; below
  it a *Weakest so far* card grouping misses by competency with a **Drill these after the run** button.

**All four options always show an explanation**, including the ones nobody chose ("Not correct" +
dash glyph + why it is tempting). This is the product's whole point; it is not optional.

**States.** *Empty* — before answering, the verdict bar and all four explanations are absent and the
options are interactive. *Loading* — as exam mode: whole set fetched up front. *Error* — a failed
progress save shows the same non-dismissible "Not saved — retrying" chip; grading is local so
feedback still appears.

**Mobile.** Rail drops below the question as two stacked cards. Verdict bar goes full width. The
option rows keep the 17px prose. Footer becomes a fixed bottom bar with **Next question** full width.

---

## 8. Review after submit

**Boards:** `Review · after submit` (1440×3480), `Review · phone` (390×2460)
**Purpose:** the reading-heavy screen. Score against 45, then every question with all four
explanations. **This screen sets the type spec; treat it as seriously as the exam screen.**

**Layout regions.**
- **Top bar:** exam name, `Review` chip, submission timestamp and attempt number; right —
  **Retake in practice mode** · **Back to exams**.
- **Result card**, `300px / 1fr`:
  - Left: eyebrow, `41 / 60` at `--text-3xl` mono, `68%`, a verdict chip ("Four short of the pass
    mark"), and a line comparing first attempt to best.
  - Right: **the pass bar** — a 14px track with the fill at the score and a 2px full-height tick at
    75%, labelled "Pass · 45"; then four stats: Time used, Left unanswered, Flagged, Slowest question.
- **By domain card** — a 2-column grid of the six domains with weight, `correct/total`, and a meter
  that is `--correct-solid` at ≥75% and `--incorrect-solid` below.
- **Filter row** — Incorrect *(selected by default)* · Correct · Flagged · All, plus a count of what
  is shown.
- **The question list** — one card per question: a status tile (check/cross, folded corner if
  flagged), question number, competency and item type, a flagged chip and time spent; the stem; the
  four option rows with explanations; and a sunken "Why this is the answer" panel with the concept id,
  a study-guide link and a **Drill this competency** link.
- **Right rail, 470px:** *All 60* — the graded tile grid with a glyph legend and Score / Needed / Gap;
  below it a *What to do next* card with **Drill the 19 missed** and **Retake exam 04**.

**Default filter is Incorrect.** Nobody opens this to admire the ones they got right.

**Components.** Result card, pass bar, domain meter, filter chips, question card, option row (four
graded states), navigator tile, legend.

**States.**
- *Empty* — a filter matching nothing shows a centred `--ink-muted` line inside the list region, e.g.
  "No flagged questions in this attempt." Filters stay visible.
- *Loading* — the result card and pass bar render first; question cards stream in as skeletons at
  approximate height so the scroll position does not jump.
- *Error* — if the attempt fails to load, the whole screen is replaced by an `incorrect`-family panel
  and **Back to exams**; a partial review is worse than none.

**Mobile.** Rail is dropped entirely — its Score/Needed/Gap moves into the result card and the drill
actions to the bottom of the list. The result card stacks: numerals, chip, pass bar, then the stats as
a 2×2 grid. Filter chips become a horizontal scroller (`overflow-x: auto`, 44px tall). Question cards
go full width with `--space-4` padding; **prose stays at 17px/1.65** — the measure is naturally ~40ch
at this width, which is within spec. The "By domain" grid goes one column.

---

## Cross-screen rules

1. **The clock appears only in exam mode.** Practice and domain mode must not show one, not even
   greyed.
2. **Flag state persists across modes and is orthogonal to answered state.**
3. **Every screen is reachable in both themes**; theme is a user preference, not a per-screen choice.
4. **Every list of questions uses the same navigator tile component** — five states, one implementation.
5. **Answers save as you go, in every mode.** A save failure is surfaced but never blocks answering,
   and never pauses the clock.
