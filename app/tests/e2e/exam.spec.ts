import { expect, test, type Page } from '@playwright/test';
import { pool } from '../../src/db/client.ts';
import {
  ageSitting,
  assertSeeded,
  countAnswers,
  createE2EUser,
  deleteAllE2EUsers,
  hasDatabase,
  readAttempt,
  signIn,
} from './support.ts';

// The one browser run (doc 11 §2).
//
// It walks the path nothing else in the repo can reach: a sitting started,
// answered, abandoned with the browser closed, resumed with time genuinely
// gone, left to run out, finalised by the app itself, and read back. That is
// doc 09's Flow B — the hardest thing in the app, and the only place a bug
// costs a first-attempt score, which is the one number here that cannot be
// regenerated.
//
// **One test, deliberately.** Splitting it into steps would need each step to
// rebuild the state the last one left, and the state *is* what is under test.
// `test.step` gives the same reporting without the same lie.
//
// Everything it asserts about a number, it asserts against the database rather
// than against the screen. The screen is checked for what only a browser can
// check — that the restored sitting shows the answer, that the review really
// prints four explanations — and the row is checked for what the screen can
// only claim.

test.describe.configure({ mode: 'serial' });

test.skip(
  !hasDatabase,
  'DATABASE_URL is not set; the browser run has no database to drive. The unit suite is the one that runs anywhere.',
);

/** Locators, gathered so the markup they depend on is named in one place. */
const optionButtons = (page: Page) => page.locator('.opts button');
const clock = (page: Page) => page.getByRole('timer');
const flagButton = (page: Page) => page.getByRole('button', { name: /Flag(ged)? for review/ });

/** The countdown, in whole seconds, read off the screen. */
async function remainingSeconds(page: Page): Promise<number> {
  const text = (await clock(page).textContent()) ?? '';
  const match = /(\d+):(\d{2})/.exec(text);
  if (!match) throw new Error(`The clock did not read as a time: ${JSON.stringify(text)}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

/** The sitting's id, from the URL the start button navigated to. */
function attemptIdFrom(url: string): string {
  const match = /\/attempt\/([0-9a-f-]{36})/.exec(url);
  if (!match?.[1]) throw new Error(`No attempt id in ${url}`);
  return match[1];
}

/** Which question the sitting is showing, 1-based, as its heading states it. */
async function questionNumber(page: Page): Promise<number> {
  const text = (await page.getByRole('heading', { level: 1 }).textContent()) ?? '';
  const match = /Question (\d+) of/.exec(text);
  if (!match) throw new Error(`No question heading: ${JSON.stringify(text)}`);
  return Number(match[1]);
}

test.beforeAll(async () => {
  if (!hasDatabase) return;
  await assertSeeded();
  await deleteAllE2EUsers();
  await createE2EUser();
});

test.afterAll(async () => {
  if (!hasDatabase) return;
  await deleteAllE2EUsers();
  await pool.end();
});

test('a sitting survives the browser closing, runs out, and scores once', async ({
  browser,
  baseURL,
}) => {
  // From the config, never restated — the port lives in one place.
  if (!baseURL) throw new Error('No baseURL; playwright.config.ts sets it.');
  const origin = baseURL;

  // ---------------------------------------------------------------- start ---
  const first = await browser.newContext();
  await signIn(first, origin);
  const page = await first.newPage();

  await page.goto('/exams');
  await expect(page.getByRole('heading', { name: 'Practice exams' })).toBeVisible();

  const paper = page.locator('.erow').filter({ hasText: 'Exam 07' });
  await paper.getByRole('button', { name: /^(Start|Sit again)$/ }).click();

  await page.waitForURL(/\/attempt\/[0-9a-f-]{36}$/);
  const attemptId = attemptIdFrom(page.url());

  // Ninety minutes, near enough — the sitting has only just been created, and
  // an exact 90:00 would be asserting that no time passed at all.
  expect(await remainingSeconds(page)).toBeGreaterThan(89 * 60);

  // ------------------------------------------------- answer six, flag two ---
  // The first option every time. Which ones that makes correct is not this
  // test's business: the score is checked against the rows, below.
  for (let n = 1; n <= 6; n += 1) {
    expect(await questionNumber(page)).toBe(n);

    await optionButtons(page).first().click();
    await expect(optionButtons(page).first()).toHaveAttribute('aria-pressed', 'true');

    if (n === 2 || n === 4) {
      await flagButton(page).click();
      await expect(flagButton(page)).toHaveAttribute('aria-pressed', 'true');
    }

    if (n < 6) await page.getByRole('button', { name: 'Next' }).click();
  }

  // Durable when made (PRD E5) — asked of the database, because "the screen
  // shows it" is the claim the outbox exists to make untrue.
  await expect
    .poll(() => countAnswers(attemptId), { message: 'six answers and two flags to land' })
    .toMatchObject({ answered: 6, flagged: 2 });

  const beforeClosing = await remainingSeconds(page);

  // ----------------------------------------- close the browser, lose time ---
  await first.close();

  // Twenty minutes pass with nothing watching. This is the whole of time
  // travel: the deadline is derived from `started_at`, so moving the start is
  // moving the clock, and there is no countdown anywhere to move with it.
  const AWAY_SECONDS = 20 * 60;
  await ageSitting(attemptId, AWAY_SECONDS);

  // -------------------------------------------------------------- resume ---
  const second = await browser.newContext();
  await signIn(second, origin);
  const resumed = await second.newPage();

  await resumed.goto(`/attempt/${attemptId}`);

  // Position restored by derivation: the question whose answer row was written
  // most recently is the sixth (doc 03 §6 / the decision log, 2026-09-04).
  expect(await questionNumber(resumed)).toBe(6);

  // The answer is on the screen, not merely in the database.
  await expect(optionButtons(resumed).first()).toHaveAttribute('aria-pressed', 'true');

  // Both flags survived, and the bar says so.
  await expect(resumed.getByText(/2\s*flagged/)).toBeVisible();
  await expect(resumed.getByText(/6\s*of 60 answered/)).toBeVisible();

  // **Genuinely reduced, not merely present.** Twenty minutes were away, so at
  // least twenty minutes are gone — and no more than a minute beyond, or
  // something other than elapsed time is moving the clock.
  const afterResuming = await remainingSeconds(resumed);
  expect(afterResuming).toBeLessThanOrEqual(beforeClosing - AWAY_SECONDS);
  expect(afterResuming).toBeGreaterThan(beforeClosing - AWAY_SECONDS - 60);

  // ------------------------------------------------ travel past the clock ---
  // **Leave the sitting before closing the browser, and this is not tidiness.**
  // The sitting resyncs on `visibilitychange`, and `GET /api/attempt/:id/state`
  // finalises an expired sitting (doc 07 §6) — while Node goes on serving a
  // request whose client has gone. Closing the context straight from the paper
  // therefore leaves that request in flight, and if the clock is wound forward
  // while it is, the **resync** closes the sitting rather than the page read
  // this test exists to check. Measured: it landed ~110ms after the `UPDATE`.
  //
  // Navigating away unmounts the sitting, which removes the listeners, so no
  // resync is ever issued — and `goto` is awaited, so the one request this line
  // does make is finished before the next line runs. Deterministic, where a
  // sleep would only have been likely.
  await resumed.goto('/exams');
  await second.close();

  // Past ninety minutes in total. Nothing has finalised the sitting: doc 03 §6
  // permits it to sit expired-but-unfinalised indefinitely, and the point of
  // what follows is to watch the app close it on the next read.
  await ageSitting(attemptId, 90 * 60);
  // The guard for the wait above. If this ever fails, something touched the
  // sitting between the clock moving and the page opening, and the assertions
  // below would otherwise fail somewhere far less informative.
  expect((await readAttempt(attemptId)).submittedAt).toBeNull();

  const third = await browser.newContext();
  await signIn(third, origin);
  const back = await third.newPage();

  await back.goto(`/attempt/${attemptId}`);

  // Opening an expired sitting finalises it and lands on its review (PRD §5:
  // submit it as it stood and go straight to review).
  //
  // A regex rather than a glob: Playwright's URL globs do not let `*` cross a
  // `/`, so a `**/attempt/…` pattern never matches an absolute URL.
  await expect(back).toHaveURL(new RegExp(`/attempt/${attemptId}/review$`));

  const finalised = await readAttempt(attemptId);
  const rows = await countAnswers(attemptId);

  expect(finalised.submittedAt).not.toBeNull();
  // Not "user" — nobody pressed anything. PRD E6 must not conflate the two.
  expect(finalised.submitReason).toBe('expired');
  // The score against the bank's own answer key — `countAnswers` joins
  // `question_option` rather than re-reading `answer.is_correct`, so this is an
  // oracle for the write-time denormalisation and not an echo of it. A literal
  // would only restate whichever options exam-07 happens to put first.
  expect(finalised.score).toBe(rows.correct);
  // Set when the attempt was created, and untouched by finalisation.
  expect(finalised.isFirstAttempt).toBe(true);
  // Submitted **as it stood**: nothing was answered on the way past the clock.
  expect(rows).toMatchObject({ answered: 6, flagged: 2 });

  // ----------------------------------- the review shows all four why texts ---
  await expect(back.getByRole('heading', { name: /Practice exam 07/ })).toBeVisible();

  // Doc 10 §8 opens on Incorrect. All sixty are reachable from All.
  await back.getByRole('button', { name: 'All' }).click();
  await expect(back.locator('.qcard:visible')).toHaveCount(60);

  // PRD E4, and the reason the bank was written the way it was: the `why` for
  // **all four** options, not only the correct one.
  //
  // Counted across the whole paper rather than sampled at either end. Sixty
  // cards × four explanations, so the six that were answered and the fifty-four
  // that never were are all covered — and the assertion cannot quietly land on
  // two answered cards if the order ever changes.
  await expect(back.locator('.qcard:visible .opt__why')).toHaveCount(240);

  // ------------------------------------------- a second submit is a no-op ---
  // There is no Submit on a finished sitting, which is correct — so this asks
  // the endpoint directly, which is what a second tab or a double click would
  // have done. PRD §5: scored exactly once.
  const again = await back.request.post(`/api/attempt/${attemptId}/submit`);
  expect(again.ok()).toBe(true);
  expect(await again.json()).toMatchObject({ submitted: true, score: finalised.score });

  const afterSecondSubmit = await readAttempt(attemptId);
  expect(afterSecondSubmit.score).toBe(finalised.score);
  // The instant itself is unchanged — the conditional `UPDATE` matched no row,
  // so nothing was rescored and nothing was restamped.
  expect(afterSecondSubmit.submittedAt?.getTime()).toBe(finalised.submittedAt?.getTime());
  expect(afterSecondSubmit.submitReason).toBe('expired');
  // And it did not quietly become a `user` submit, nor claim the flag again.
  expect(afterSecondSubmit.isFirstAttempt).toBe(true);

  await third.close();
});
