import { describe, expect, it } from 'vitest';
import { isAllowed, parseAllowlist } from '../../src/domain/allowlist.ts';

// The control that keeps this app private, tested at every edge that could
// quietly open it.
//
// The dangerous failures here are all in one direction — returning true when it
// should return false — so most of these assert a refusal. A test suite that
// only proved the owner can sign in would pass just as happily on a function
// that returned `true` unconditionally.

const LIST = 'owner@example.com';

describe('parsing the raw list', () => {
  it('reads a single address', () => {
    expect(parseAllowlist('owner@example.com')).toEqual(['owner@example.com']);
  });

  it('reads several, trimming whitespace', () => {
    expect(parseAllowlist(' a@example.com ,b@example.com , c@example.com'))
      .toEqual(['a@example.com', 'b@example.com', 'c@example.com']);
  });

  it('lowercases, because no mail system treats case as identity', () => {
    expect(parseAllowlist('Owner@Example.COM')).toEqual(['owner@example.com']);
  });

  it('drops empty entries rather than admitting a blank address', () => {
    expect(parseAllowlist('a@example.com,,  ,b@example.com'))
      .toEqual(['a@example.com', 'b@example.com']);
  });

  it('reads an absent or blank list as no one', () => {
    expect(parseAllowlist(undefined)).toEqual([]);
    expect(parseAllowlist(null)).toEqual([]);
    expect(parseAllowlist('')).toEqual([]);
    expect(parseAllowlist('   ')).toEqual([]);
    expect(parseAllowlist(',,,')).toEqual([]);
  });
});

describe('who is allowed in', () => {
  it('admits a verified address on the list', () => {
    expect(isAllowed('owner@example.com', true, LIST)).toBe(true);
  });

  it('admits regardless of the case Google reports', () => {
    expect(isAllowed('Owner@Example.com', true, LIST)).toBe(true);
    expect(isAllowed('owner@example.com', true, 'OWNER@EXAMPLE.COM')).toBe(true);
  });

  it('admits an address surrounded by whitespace', () => {
    expect(isAllowed('  owner@example.com  ', true, LIST)).toBe(true);
  });

  it('admits one of several listed addresses', () => {
    expect(isAllowed('b@example.com', true, 'a@example.com,b@example.com')).toBe(true);
  });
});

describe('who is refused — the direction that matters', () => {
  it('refuses an address not on the list', () => {
    expect(isAllowed('stranger@example.com', true, LIST)).toBe(false);
  });

  // The failure mode this default exists for: a variable that is accidentally
  // blank must lock everyone out, not let everyone in. An app that silently
  // starts working for strangers is the worst possible way to find out.
  it('refuses everyone when the list is empty, absent, or whitespace', () => {
    for (const list of ['', '   ', ',,,', undefined, null]) {
      expect(isAllowed('owner@example.com', true, list), String(list)).toBe(false);
    }
  });

  it('refuses an unverified address even when it is on the list', () => {
    // Otherwise anyone who can claim the owner's address at an unverified
    // provider could sign in as the owner.
    expect(isAllowed('owner@example.com', false, LIST)).toBe(false);
  });

  it('refuses a missing or empty address', () => {
    expect(isAllowed(undefined, true, LIST)).toBe(false);
    expect(isAllowed(null, true, LIST)).toBe(false);
    expect(isAllowed('', true, LIST)).toBe(false);
    expect(isAllowed('   ', true, LIST)).toBe(false);
  });

  it('refuses a near-match rather than being generous', () => {
    for (const near of [
      'owner@example.co',
      'owner@example.com.evil.test',
      'notowner@example.com',
      'owner+tag@example.com',
      'owner@sub.example.com',
      'owner@example.com ext',
    ]) {
      expect(isAllowed(near, true, LIST), near).toBe(false);
    }
  });

  it('refuses a substring of a listed address', () => {
    // Guards against ever reaching for `includes` on the raw string instead of
    // an exact match against parsed entries.
    expect(isAllowed('wner@example.co', true, LIST)).toBe(false);
    expect(isAllowed('o', true, LIST)).toBe(false);
  });
});
