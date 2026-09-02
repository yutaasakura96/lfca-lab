import { describe, expect, it, vi } from 'vitest';
import { RETRY_CAP_MS, SUSTAINED_AFTER, createOutbox, retryDelay } from '../../src/lib/outbox.ts';
import type { WriteFailure } from '../../src/lib/writes.ts';

// The outbox, tested without a network and without a clock.
//
// It is the one piece of this slice that decides something — how long to wait,
// which write is still owed, when the screen may stop saying "not saved" — and
// the whole point of the ticket is that it behaves correctly precisely when
// nothing else does. So the scheduler is injected: a test that had to wait
// thirty real seconds to check the cap would be a test nobody runs.

const NETWORK: WriteFailure = { code: 'network', retryable: true };
const EXPIRED: WriteFailure = { code: 'attempt_expired', retryable: false };

/** Lets a whole drain — every microtask an `await` chain leaves behind — run out. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * A scheduler that never actually waits.
 *
 * Holds the retries the outbox asks for so a test can read the delay it chose
 * and fire it when it likes.
 */
function fakeScheduler() {
  const timers: { run: () => void; ms: number }[] = [];
  return {
    schedule(run: () => void, ms: number) {
      const timer = { run, ms };
      timers.push(timer);
      return () => {
        const at = timers.indexOf(timer);
        if (at !== -1) timers.splice(at, 1);
      };
    },
    /** Every delay currently waiting, in the order it was asked for. */
    delays: () => timers.map((timer) => timer.ms),
    /** Run the next retry and let the drain it starts finish. */
    async fire() {
      const timer = timers.shift();
      if (timer === undefined) throw new Error('nothing was scheduled');
      timer.run();
      await settle();
    },
  };
}

describe('the backoff', () => {
  it('doubles from one second and then holds at thirty', () => {
    // Doc 03 §7 writes it as "1s, 2s, 4s, 8s, capped 30s". Doubling reaches the
    // cap at the sixth attempt, and every attempt after that waits the same.
    expect([1, 2, 3, 4, 5, 6, 7, 20].map(retryDelay)).toEqual([
      1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000, 30_000,
    ]);
  });

  it('never waits longer than the cap', () => {
    for (let n = 1; n < 100; n += 1) expect(retryDelay(n)).toBeLessThanOrEqual(RETRY_CAP_MS);
  });
});

describe('a write that lands', () => {
  it('is sent once, settles, and leaves nothing queued', async () => {
    const send = vi.fn(async () => null);
    const settled = vi.fn();
    const scheduler = fakeScheduler();
    const changes: { pending: number; retrying: boolean }[] = [];

    const outbox = createOutbox({ schedule: scheduler.schedule, onChange: (s) => changes.push(s) });
    outbox.send({ key: 'q1:answer', send, settled });
    await settle();

    expect(send).toHaveBeenCalledTimes(1);
    expect(settled).toHaveBeenCalledWith(null);
    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
    expect(scheduler.delays()).toEqual([]);
    // The chip must not flash on a write that worked: `retrying` is never true
    // at any point in a clean round trip.
    expect(changes.some((state) => state.retrying)).toBe(false);
  });
});

describe('a write that fails for a reason repeating could fix', () => {
  it('stays queued, says so, and is retried after the first delay', async () => {
    const send = vi.fn(async () => NETWORK);
    const scheduler = fakeScheduler();

    const outbox = createOutbox({ schedule: scheduler.schedule });
    outbox.send({ key: 'q1:answer', send });
    await settle();

    expect(send).toHaveBeenCalledTimes(1);
    expect(outbox.state()).toEqual({ pending: 1, retrying: true });
    expect(scheduler.delays()).toEqual([1_000]);
  });

  it('backs off further on each consecutive failure', async () => {
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();
    const chosen: number[] = [];
    for (let n = 0; n < 6; n += 1) {
      chosen.push(scheduler.delays()[0] as number);
      await scheduler.fire();
    }

    expect(chosen).toEqual([1_000, 2_000, 4_000, 8_000, 16_000, 30_000]);
  });

  it('drains and goes quiet the moment the network comes back', async () => {
    const scheduler = fakeScheduler();
    const settled = vi.fn();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => (failing ? NETWORK : null), settled });
    await settle();
    expect(outbox.state().retrying).toBe(true);

    failing = false;
    await scheduler.fire();

    expect(settled).toHaveBeenCalledWith(null);
    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
    expect(scheduler.delays()).toEqual([]);
  });

  it('starts the backoff over once a write has landed', async () => {
    // Consecutive, not cumulative: a connection that drops for a second in the
    // middle of a sitting must not leave the next failure waiting thirty.
    const scheduler = fakeScheduler();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => (failing ? NETWORK : null) });
    await settle();
    await scheduler.fire();
    expect(scheduler.delays()).toEqual([2_000]);

    failing = false;
    await scheduler.fire();
    failing = true;
    outbox.send({ key: 'q2:answer', send: async () => NETWORK });
    await settle();

    expect(scheduler.delays()).toEqual([1_000]);
  });
});

describe('a write the server will refuse forever', () => {
  it('is dropped rather than retried, and hands the reason back', async () => {
    // `attempt_expired` is the case this exists for. A queue that could not
    // tell it from a dropped connection would retry it until the tab closed.
    const send = vi.fn(async () => EXPIRED);
    const settled = vi.fn();
    const scheduler = fakeScheduler();

    const outbox = createOutbox({ schedule: scheduler.schedule });
    outbox.send({ key: 'q1:answer', send, settled });
    await settle();

    expect(send).toHaveBeenCalledTimes(1);
    expect(settled).toHaveBeenCalledWith(EXPIRED);
    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
    expect(scheduler.delays()).toEqual([]);
  });

  it('does not stop the writes queued behind it', async () => {
    const scheduler = fakeScheduler();
    const second = vi.fn(async () => null);
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => EXPIRED });
    outbox.send({ key: 'q2:answer', send: second });
    await settle();

    expect(second).toHaveBeenCalledTimes(1);
    expect(outbox.state().pending).toBe(0);
  });
});

describe('two clicks on the same thing', () => {
  it('keeps only the newer one, so a stale value is never written last', async () => {
    // The reason the queue is keyed rather than a list. Answer A fails and is
    // owed; the candidate then chooses B. Replaying A afterwards would put the
    // database back to an answer they had already changed their mind about.
    const sent: string[] = [];
    const scheduler = fakeScheduler();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule });

    const write = (ref: string) => async () => {
      sent.push(ref);
      return failing ? NETWORK : null;
    };

    outbox.send({ key: 'q1:answer', send: write('o1') });
    await settle();
    outbox.send({ key: 'q1:answer', send: write('o2') });
    await settle();
    expect(outbox.state().pending).toBe(1);

    failing = false;
    await scheduler.fire();

    expect(sent.at(-1)).toBe('o2');
    expect(sent.filter((ref) => ref === 'o1')).toHaveLength(1);
    expect(outbox.state().pending).toBe(0);
  });

  it('sends the newer one even when the older is still in the air', async () => {
    // Changing an answer during an ordinary round trip, with nothing wrong with
    // the network. The first write lands, but it no longer speaks for the
    // question — and the one that does must not be left owed and unsent, which
    // is a durable answer the database never receives and a queue that never
    // empties.
    const sent: string[] = [];
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });

    let landFirst: (failure: null) => void = () => {};
    outbox.send({
      key: 'q1:answer',
      send: () => {
        sent.push('o1');
        return new Promise<null>((resolve) => (landFirst = resolve));
      },
    });
    await settle();

    outbox.send({
      key: 'q1:answer',
      send: async () => {
        sent.push('o2');
        return null;
      },
    });
    await settle();

    landFirst(null);
    await settle();

    expect(sent).toEqual(['o1', 'o2']);
    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
  });

  it('keeps the answer and the flag apart', async () => {
    // The two lanes are separate keys for the same reason they are separate
    // endpoints: a flag that will not save must not take an answer with it.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });
    const answered = vi.fn(async () => null);

    outbox.send({ key: 'q1:flag', send: async () => NETWORK });
    outbox.send({ key: 'q1:answer', send: answered });
    await settle();
    await scheduler.fire();

    expect(answered).toHaveBeenCalledTimes(1);
    // The flag is still owed; the answer is not.
    expect(outbox.state().pending).toBe(1);
  });
});

describe('answering while the network is down', () => {
  it('posts each new click immediately rather than waiting out the backoff', async () => {
    // Doc 03 §7's flow is click → post → queue on failure. A click that sat in
    // a queue for thirty seconds would make a recovering network look like a
    // lost answer.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });
    const second = vi.fn(async () => NETWORK);

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();
    outbox.send({ key: 'q2:answer', send: second });
    await settle();

    expect(second).toHaveBeenCalledTimes(1);
    expect(outbox.state().pending).toBe(2);
    // One retry pending, not two — a click must not leave a second timer
    // behind, or the retries would double with every failing answer.
    expect(scheduler.delays()).toHaveLength(1);
  });

  it('posts only the new click, leaving what is already owed on its wait', async () => {
    // Otherwise the outage costs the square of the number of clicks: the tenth
    // answer given while the network is away would fire eleven requests.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });
    const first = vi.fn(async () => NETWORK);

    outbox.send({ key: 'q1:answer', send: first });
    await settle();
    expect(first).toHaveBeenCalledTimes(1);

    outbox.send({ key: 'q2:answer', send: async () => NETWORK });
    await settle();
    outbox.send({ key: 'q3:answer', send: async () => NETWORK });
    await settle();

    expect(first).toHaveBeenCalledTimes(1);
    expect(outbox.state().pending).toBe(3);
  });

  it('sends the rest at once as soon as one click gets through', async () => {
    // A write that lands is proof the connection is back, and better proof
    // than the backoff's guess. Nothing is gained by making the answers
    // already owed wait out a timer the evidence has overtaken.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });
    const owed = vi.fn(async () => null);

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();
    // The queued write is replaced by one that works, standing in for a
    // connection that came back between the two clicks.
    outbox.send({ key: 'q1:answer', send: owed });
    outbox.send({ key: 'q2:answer', send: async () => null });
    await settle();

    expect(owed).toHaveBeenCalled();
    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
    expect(scheduler.delays()).toEqual([]);
  });

  it('sends what is owed in the order it was owed', async () => {
    const sent: string[] = [];
    const scheduler = fakeScheduler();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule });
    const write = (key: string) => async () => {
      sent.push(key);
      return failing ? NETWORK : null;
    };

    for (const key of ['q1:answer', 'q2:answer', 'q3:answer']) {
      outbox.send({ key, send: write(key) });
      await settle();
    }

    sent.length = 0;
    failing = false;
    await scheduler.fire();

    expect(sent).toEqual(['q1:answer', 'q2:answer', 'q3:answer']);
  });
});

describe('a request that outlives its own backoff', () => {
  it('still has a retry waiting for it afterwards', async () => {
    // The stall this guards: a click during an outage sends on its own, the
    // scheduled retry fires while that request is still in the air, the pass it
    // starts does nothing because a send is already running — and the timer is
    // spent. Without this, the queue would sit there owing writes, chip up, and
    // nothing would ever wake it again.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();
    expect(scheduler.delays()).toHaveLength(1);

    let finish: (failure: WriteFailure) => void = () => {};
    outbox.send({
      key: 'q2:answer',
      send: () => new Promise<WriteFailure>((resolve) => (finish = resolve)),
    });
    await settle();

    // The backoff comes due while that second request is still unanswered.
    await scheduler.fire();
    expect(scheduler.delays()).toEqual([]);

    finish(NETWORK);
    await settle();

    expect(outbox.state()).toEqual({ pending: 2, retrying: true });
    expect(scheduler.delays()).toHaveLength(1);
  });
});

describe('flush', () => {
  it('leaves a wait behind when it lands on a request already in the air', async () => {
    // `online` fires while a click is mid-flight. Flush cancels the backoff and
    // starts a pass, which does nothing because that send is still running — so
    // the timer it cancelled has to be replaced, or the queue is left owed with
    // the chip up and no retry coming.
    const scheduler = fakeScheduler();
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();

    let finish: (failure: WriteFailure) => void = () => {};
    outbox.send({
      key: 'q2:answer',
      send: () => new Promise<WriteFailure>((resolve) => (finish = resolve)),
    });
    await settle();

    outbox.flush();
    await settle();
    expect(scheduler.delays()).toEqual([]);

    finish(NETWORK);
    await settle();

    expect(outbox.state()).toEqual({ pending: 2, retrying: true });
    expect(scheduler.delays()).toHaveLength(1);
  });

  it('retries at once and cancels the wait it replaces', async () => {
    // What the `online` event calls. Waiting out thirty seconds of backoff
    // after the connection is demonstrably back is the one case where the
    // delay is pure cost.
    const scheduler = fakeScheduler();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule });

    outbox.send({ key: 'q1:answer', send: async () => (failing ? NETWORK : null) });
    await settle();
    expect(scheduler.delays()).toEqual([1_000]);

    failing = false;
    outbox.flush();
    await settle();

    expect(outbox.state()).toEqual({ pending: 0, retrying: false });
    expect(scheduler.delays()).toEqual([]);
  });
});

describe('a sustained failure', () => {
  it('is reported once, not on every retry', async () => {
    const scheduler = fakeScheduler();
    const onSustained = vi.fn();
    const outbox = createOutbox({ schedule: scheduler.schedule, onSustained });

    outbox.send({ key: 'q1:answer', send: async () => NETWORK });
    await settle();
    for (let n = 1; n < SUSTAINED_AFTER + 4; n += 1) await scheduler.fire();

    expect(onSustained).toHaveBeenCalledTimes(1);
    expect(onSustained).toHaveBeenCalledWith(NETWORK, SUSTAINED_AFTER);
  });

  it('is not reported for a flap that fixes itself', async () => {
    const scheduler = fakeScheduler();
    const onSustained = vi.fn();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule, onSustained });

    outbox.send({ key: 'q1:answer', send: async () => (failing ? NETWORK : null) });
    await settle();
    failing = false;
    await scheduler.fire();

    expect(onSustained).not.toHaveBeenCalled();
  });

  it('can be reported again after the queue has recovered and failed afresh', async () => {
    const scheduler = fakeScheduler();
    const onSustained = vi.fn();
    let failing = true;
    const outbox = createOutbox({ schedule: scheduler.schedule, onSustained });

    outbox.send({ key: 'q1:answer', send: async () => (failing ? NETWORK : null) });
    await settle();
    for (let n = 1; n < SUSTAINED_AFTER; n += 1) await scheduler.fire();
    expect(onSustained).toHaveBeenCalledTimes(1);

    failing = false;
    await scheduler.fire();
    failing = true;
    outbox.send({ key: 'q2:answer', send: async () => NETWORK });
    await settle();
    for (let n = 1; n < SUSTAINED_AFTER; n += 1) await scheduler.fire();

    expect(onSustained).toHaveBeenCalledTimes(2);
  });
});
