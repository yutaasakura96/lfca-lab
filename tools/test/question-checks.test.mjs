import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDataset } from '../lib/load.mjs';
import { loadGuide } from '../lib/guide-parse.mjs';
import { loadBank } from '../lib/question-load.mjs';
import {
  bankContext,
  checkCommandCoverage,
  checkComparisonCoverage,
  checkConceptCoverage,
  checkCountDerived,
  checkDiagnosticCoverage,
  checkDifficultyDerived,
  checkDistractorDistinct,
  checkDistractorProvenance,
  checkGuideAnchor,
  checkLengthCue,
  checkOptionContract,
  checkRationaleComplete,
  checkSourceIds,
  checkUnknownConcept,
  codeSpansIn,
  searchableText,
} from '../lib/question-checks.mjs';

const ALLOC = { poolTotal: 40, weakCompetencies: ['Beta Domain::Stuff'] };

async function fixture() {
  const dataset = await loadDataset('tools/test/fixtures/bank');
  const bank = await loadBank('tools/test/fixtures/bank/questions');
  const guide = await loadGuide('tools/test/fixtures/bank/guide');
  return bankContext({
    dataset, bank, guide,
    guideRoot: 'tools/test/fixtures/bank/guide',
    allocationOptions: ALLOC,
  });
}

// Rebuild a context from a mutated copy of the bank, so each test starts
// from the clean fixture rather than from the previous test's damage.
async function mutated(mutate) {
  const dataset = await loadDataset('tools/test/fixtures/bank');
  const bank = structuredClone(await loadBank('tools/test/fixtures/bank/questions'));
  const guide = await loadGuide('tools/test/fixtures/bank/guide');
  mutate(bank, dataset);
  return bankContext({
    dataset, bank, guide,
    guideRoot: 'tools/test/fixtures/bank/guide',
    allocationOptions: ALLOC,
  });
}

test('the fixture bank passes every check in this task', async () => {
  const ctx = await fixture();
  for (const check of [
    checkUnknownConcept, checkConceptCoverage, checkCountDerived,
    checkComparisonCoverage, checkCommandCoverage, checkDiagnosticCoverage,
    checkDifficultyDerived,
  ]) {
    assert.deepEqual(check(ctx, {}), [], check.name);
  }
});

test('codeSpansIn extracts inline spans and fenced lines', () => {
  assert.deepEqual(codeSpansIn('run `ip addr` then `ss -tulpn`'), ['ip addr', 'ss -tulpn']);
  assert.deepEqual(codeSpansIn('```\n$ uname -r\n```'), ['uname -r']);
  assert.deepEqual(codeSpansIn('no code here'), []);
});

test('codeSpansIn does not rescan fenced content as inline spans', () => {
  assert.deepEqual(codeSpansIn('```\nuname -r\n```'), ['uname -r']);
});

test('searchableText spans the stem, both option fields and the rationale', () => {
  const item = {
    stem: 'STEM', rationale: 'RATIONALE',
    options: [{ text: 'TEXT', why: 'WHY' }],
  };
  const text = searchableText(item);
  for (const part of ['STEM', 'RATIONALE', 'TEXT', 'WHY']) assert.ok(text.includes(part), part);
});

test('q-unknown-concept fires on a concept id absent from data/', async () => {
  const ctx = await mutated((bank) => { bank[0].items[0].concept_id = 'alpha.things.imaginary'; });
  const out = checkUnknownConcept(ctx, {});
  assert.equal(out.length, 1);
  assert.equal(out[0].check, 'q-unknown-concept');
  assert.equal(out[0].severity, 'error');
  assert.match(out[0].message, /imaginary/);
});

test('q-concept-coverage fires when a concept has no item at all', async () => {
  const ctx = await mutated((bank) => {
    bank[1].items = bank[1].items.filter((i) => i.concept_id !== 'beta.stuff.thing');
  });
  const out = checkConceptCoverage(ctx, {});
  assert.ok(out.some((f) => f.id === 'beta.stuff.thing'), 'the dropped concept is reported');
  assert.equal(out[0].check, 'q-concept-coverage');
});

test('q-concept-coverage respects --scope', async () => {
  const ctx = await mutated((bank) => { bank[1].items = []; });
  assert.equal(checkConceptCoverage(ctx, { scope: 'Alpha Domain :: Things' }).length, 0);
  assert.ok(checkConceptCoverage(ctx, { scope: 'Beta Domain :: Stuff' }).length > 0);
});

test('q-count-derived fires when a concept has too many or too few items', async () => {
  const tooMany = await mutated((bank) => {
    const extra = structuredClone(bank[0].items[0]);
    extra.id = extra.id.replace(/\d{2}$/, '99');
    extra.stem = 'A different stem so the duplicate checks are not what fires.';
    bank[0].items.push(extra);
  });
  const out = checkCountDerived(tooMany, {});
  assert.ok(out.length >= 1);
  assert.equal(out[0].check, 'q-count-derived');
  assert.match(out[0].message, /expected/);

  const tooFew = await mutated((bank) => { bank[0].items.shift(); });
  assert.ok(checkCountDerived(tooFew, {}).length >= 1);
});

test('q-count-derived counts the two pools separately', async () => {
  const ctx = await mutated((bank) => {
    const supplementItem = bank.flatMap((f) => f.items).find((i) => i.pool === 'supplement');
    if (supplementItem) supplementItem.pool = 'exam';
  });
  const out = checkCountDerived(ctx, {});
  assert.ok(out.length >= 1, 'moving an item between pools breaks both pools');
});

test('q-comparison-coverage fires when a block is named by no item', async () => {
  const ctx = await mutated((bank) => {
    for (const f of bank) for (const i of f.items) i.comparison_block = null;
  });
  const out = checkComparisonCoverage(ctx, {});
  assert.ok(out.some((f) => f.message.includes('cmp-alpha.things.widget')));
});

test('q-comparison-coverage fires on an item naming a block that does not exist', async () => {
  const ctx = await mutated((bank) => { bank[0].items[0].comparison_block = 'cmp-nope'; });
  assert.ok(checkComparisonCoverage(ctx, {}).some((f) => f.message.includes('cmp-nope')));
});

test('q-command-coverage fires when a command string appears nowhere as a code span', async () => {
  const ctx = await mutated((bank) => {
    for (const f of bank) {
      for (const i of f.items) {
        i.rationale = i.rationale.replace(/`widgetctl list`/g, 'widgetctl list');
      }
    }
  });
  const out = checkCommandCoverage(ctx, {});
  assert.ok(out.some((f) => f.message.includes('widgetctl list')),
    'a command in prose but outside backticks does not count');
});

test('q-command-coverage credits a code span anywhere in the item, not only an option', async () => {
  const ctx = await fixture();
  assert.deepEqual(checkCommandCoverage(ctx, {}), [],
    'the fixture carries its commands in the rationale and that is sufficient');
});

test('q-command-coverage requires an exact match, not a substring', async () => {
  const ctx = await mutated((bank) => {
    for (const f of bank) {
      for (const i of f.items) {
        i.rationale = i.rationale.replace(/`widgetctl show`/g, '`widgetctl show --all`');
      }
    }
  });
  assert.ok(checkCommandCoverage(ctx, {}).some((f) => f.message.includes('widgetctl show')));
});

test('q-diagnostic-coverage fires when a depth-4 concept has no diagnostic item', async () => {
  const ctx = await mutated((bank) => {
    for (const f of bank) {
      for (const i of f.items) if (i.type === 'diagnostic') i.type = 'application';
    }
  });
  const out = checkDiagnosticCoverage(ctx, {});
  assert.ok(out.some((f) => f.id === 'alpha.things.doohickey'));
});

test('q-difficulty-derived fires when difficulty does not equal required_depth', async () => {
  const ctx = await mutated((bank) => { bank[0].items[0].difficulty = 1; });
  const out = checkDifficultyDerived(ctx, {});
  assert.equal(out.length, 1);
  assert.match(out[0].message, /difficulty 1/);
});

test('an unknown scope throws rather than silently matching nothing', async () => {
  const ctx = await fixture();
  assert.throws(() => checkConceptCoverage(ctx, { scope: 'Nope :: Nothing' }), /Unknown scope/);
});

test('the fixture bank passes every integrity check', async () => {
  const ctx = await fixture();
  for (const check of [
    checkOptionContract, checkDistractorProvenance, checkDistractorDistinct,
    checkRationaleComplete, checkSourceIds, checkGuideAnchor,
  ]) {
    assert.deepEqual(check(ctx, {}), [], check.name);
  }
  assert.deepEqual(checkLengthCue(ctx, {}), [], 'checkLengthCue');
});

test('q-option-contract surfaces the loader malformed entries', async () => {
  const ctx = await mutated((bank) => {
    bank[0].malformed.push({ index: 0, reason: 'invented problem for the test' });
  });
  const out = checkOptionContract(ctx, {});
  assert.ok(out.some((f) => f.message.includes('invented problem')));
  assert.equal(out[0].check, 'q-option-contract');
});

test('q-option-contract rejects all-of-the-above and none-of-the-above', async () => {
  for (const banned of ['All of the above', 'none of the above', 'None of these']) {
    const ctx = await mutated((bank) => { bank[0].items[0].options[3].text = banned; });
    assert.ok(checkOptionContract(ctx, {}).some((f) => f.message.toLowerCase().includes('above')
      || f.message.toLowerCase().includes('these')), banned);
  }
});

test('q-distractor-provenance rejects a second misconception in one item', async () => {
  const ctx = await mutated((bank) => {
    bank[0].items[0].options[2].provenance =
      { kind: 'misconception', documented_at: 'data:notes:alpha.things.widget' };
  });
  const out = checkDistractorProvenance(ctx, {});
  assert.ok(out.some((f) => /at most one/.test(f.message)));
});

test('q-distractor-provenance rejects a concept id that is not in data/', async () => {
  const ctx = await mutated((bank) => {
    bank[0].items[0].options[1].provenance.concept_id = 'alpha.things.imaginary';
  });
  assert.ok(checkDistractorProvenance(ctx, {}).some((f) => f.message.includes('imaginary')));
});

test('q-distractor-provenance rejects a variant naming a command the concept does not have', async () => {
  const ctx = await mutated((bank) => {
    bank[0].items[0].options[2].provenance = { kind: 'variant', command: 'nosuchctl frobnicate' };
  });
  assert.ok(checkDistractorProvenance(ctx, {}).some((f) => f.message.includes('nosuchctl')));
});

test('q-distractor-provenance rejects an unresolvable documented_at', async () => {
  const missingConcept = await mutated((bank) => {
    bank[0].items[0].options[3].provenance.documented_at = 'data:notes:alpha.things.imaginary';
  });
  assert.ok(checkDistractorProvenance(missingConcept, {}).some((f) => f.message.includes('imaginary')));

  const missingAnchor = await mutated((bank) => {
    bank[0].items[0].options[3].provenance.documented_at = 'guide:01-alpha/things.md#c-alpha.things.imaginary';
  });
  assert.ok(checkDistractorProvenance(missingAnchor, {}).some((f) => f.message.includes('imaginary')));

  const badForm = await mutated((bank) => {
    bank[0].items[0].options[3].provenance.documented_at = 'everyone knows this';
  });
  assert.ok(checkDistractorProvenance(badForm, {}).some((f) => /documented_at/.test(f.message)));
});

test('q-distractor-distinct fires when two options normalize to the same thing', async () => {
  const ctx = await mutated((bank) => {
    bank[0].items[0].options[2].text = bank[0].items[0].options[1].text.toUpperCase() + '.';
  });
  const out = checkDistractorDistinct(ctx, {});
  assert.equal(out.length, 1);
  assert.match(out[0].message, /o2 and o3/);
});

test('q-distractor-distinct says what it does not prove', async () => {
  const ctx = await mutated((bank) => {
    bank[0].items[0].options[2].text = bank[0].items[0].options[1].text;
  });
  assert.match(checkDistractorDistinct(ctx, {})[0].message, /does not check/i);
});

test('q-rationale-complete fires on a stub rationale or a why that restates the option', async () => {
  const stub = await mutated((bank) => { bank[0].items[0].rationale = 'Yes.'; });
  assert.ok(checkRationaleComplete(stub, {}).some((f) => /rationale/.test(f.message)));

  const echo = await mutated((bank) => {
    bank[0].items[0].options[1].why = bank[0].items[0].options[1].text;
  });
  assert.ok(checkRationaleComplete(echo, {}).some((f) => /restates/.test(f.message)));

  const terse = await mutated((bank) => { bank[0].items[0].options[1].why = 'No.'; });
  assert.ok(checkRationaleComplete(terse, {}).some((f) => /why/.test(f.message)));
});

test('q-source-ids fires on an unregistered source id', async () => {
  const ctx = await mutated((bank) => { bank[0].items[0].source_ids = ['not-a-source']; });
  const out = checkSourceIds(ctx, {});
  assert.equal(out.length, 1);
  assert.match(out[0].message, /not-a-source/);
});

test('q-source-ids fires on an empty source_ids array', async () => {
  const ctx = await mutated((bank) => { bank[0].items[0].source_ids = []; });
  assert.ok(checkSourceIds(ctx, {}).some((f) => /at least one/.test(f.message)));
});

test('q-guide-anchor fires on a missing file and on a missing anchor', async () => {
  const badFile = await mutated((bank) => {
    bank[0].items[0].guide_anchor = '01-alpha/nope.md#c-alpha.things.widget';
  });
  assert.ok(checkGuideAnchor(badFile, {}).some((f) => f.message.includes('nope.md')));

  const badAnchor = await mutated((bank) => {
    bank[0].items[0].guide_anchor = '01-alpha/things.md#c-alpha.things.imaginary';
  });
  assert.ok(checkGuideAnchor(badAnchor, {}).some((f) => f.message.includes('imaginary')));

  const noHash = await mutated((bank) => { bank[0].items[0].guide_anchor = '01-alpha/things.md'; });
  assert.ok(checkGuideAnchor(noHash, {}).some((f) => /#/.test(f.message)));
});

test('q-length-cue warns when the key dwarfs the distractors in one item', async () => {
  const ctx = await mutated((bank) => {
    const item = bank[0].items[0];
    const key = item.options.find((o) => o.correct);
    key.text = 'It is a widget, which is to say the component described in the specification '
      + 'as a widget, distinct in every material respect from the neighbouring components.';
  });
  const out = checkLengthCue(ctx, {});
  assert.ok(out.length >= 1);
  assert.equal(out[0].severity, 'warn');
});

test('q-length-cue warns when the key is longest far more often than chance', async () => {
  const ctx = await mutated((bank) => {
    for (const f of bank) {
      for (const i of f.items) {
        const key = i.options.find((o) => o.correct);
        key.text = `${key.text} and this clause makes it the longest option every time.`;
      }
    }
  });
  const out = checkLengthCue(ctx, {});
  assert.ok(out.some((f) => /longest/.test(f.message)));
});
