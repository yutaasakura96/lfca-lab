import { describe, expect, it } from 'vitest';
import { FILTERED, scrubEvent } from '../../src/domain/scrub.ts';

// The scrubber is the one logic-bearing piece of the Sentry wiring (#52), and
// the thing standing between an error report and a third party holding the
// owner's email address or a live session. It is tested here as data in, data
// out — the SDK never appears in this file, which is the whole reason the
// scrubber lives in the pure layer rather than inline in `Sentry.init`.

const EMAIL = 'candidate@example.com';
const SESSION = 'Xk3pQ9vT2mB7wLr0.aZ4yN8cD1eF6gH5jK2lM9nP3qR7sT0uV4wX8yZ1a%3D';
const GOOGLE_ACCESS = 'ya29.a0AfB_byC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4z';

/** Every string anywhere in a value, for asserting absence without naming paths. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, inner]) => [key, ...strings(inner)]);
  }
  return [];
}

function leaks(value: unknown, secret: string): boolean {
  return strings(value).some((s) => s.includes(secret));
}

describe('an event carrying nothing sensitive', () => {
  const clean = {
    event_id: 'c0ffee',
    level: 'error',
    environment: 'production',
    user: { id: 'u_01936f2a' },
    tags: { mode: 'exam', failures: 5 },
    exception: {
      values: [
        {
          type: 'Error',
          value: 'answer write failed five times in a row',
          stacktrace: { frames: [{ filename: 'app:///outbox.ts', lineno: 42, in_app: true }] },
        },
      ],
    },
    request: { url: 'https://lfca-lab-six.vercel.app/attempt/01936f2a', method: 'PUT' },
    breadcrumbs: [{ category: 'fetch', data: { url: '/api/attempt/01936f2a/answer', status_code: 503 } }],
    extra: { retried: true, nothing: null, count: 0 },
  };

  it('comes out unchanged', () => {
    expect(scrubEvent(clean)).toEqual(clean);
  });

  it('is not mutated in place', () => {
    const before = structuredClone(clean);
    scrubEvent(clean);
    expect(clean).toEqual(before);
  });
});

describe('an event the scrubber changes', () => {
  // A clean event cannot catch an in-place scrubber — writing the same values
  // back is invisible. The SDK still holds the original, so it must survive.
  it('leaves the original untouched', () => {
    const dirty = { user: { id: 'u_1' }, request: { headers: { Cookie: `s=${SESSION}` } }, message: EMAIL };
    const before = structuredClone(dirty);
    scrubEvent(dirty);
    expect(dirty).toEqual(before);
  });
});

describe('an email address', () => {
  it('is removed from an exception message', () => {
    const out = scrubEvent({ exception: { values: [{ type: 'Error', value: `no user row for ${EMAIL}` }] } });
    expect(leaks(out, EMAIL)).toBe(false);
    expect(out.exception.values[0]?.value).toBe(`no user row for ${FILTERED}`);
  });

  it('is removed from user.email, and the database id is kept', () => {
    const out = scrubEvent({ user: { id: 'u_1', email: EMAIL } });
    expect(leaks(out, EMAIL)).toBe(false);
    expect(out.user.id).toBe('u_1');
  });

  it('is removed from a breadcrumb deep in an array', () => {
    const out = scrubEvent({ breadcrumbs: [{ message: 'x' }, { data: { to: [`Owner <${EMAIL}>`] } }] });
    expect(leaks(out, EMAIL)).toBe(false);
  });

  it('is removed however it is cased', () => {
    const out = scrubEvent({ message: 'Candidate@Example.COM' });
    expect(out.message).toBe(FILTERED);
  });
});

describe('an OAuth token', () => {
  it('is removed from a field named for it', () => {
    const out = scrubEvent({ extra: { account: { accessToken: GOOGLE_ACCESS, refresh_token: '1//0gAbCdEf' } } });
    expect(leaks(out, GOOGLE_ACCESS)).toBe(false);
    expect(leaks(out, '1//0gAbCdEf')).toBe(false);
  });

  it('is removed from free text', () => {
    const out = scrubEvent({ message: `google said no to ${GOOGLE_ACCESS} today` });
    expect(leaks(out, GOOGLE_ACCESS)).toBe(false);
    expect(out.message).toBe(`google said no to ${FILTERED} today`);
  });

  it('is removed from a query string', () => {
    const out = scrubEvent({ request: { url: `https://x.test/cb?code=abc&id_token=eyJhbGci.eyJzdWIi.sig&state=s` } });
    expect(leaks(out, 'eyJhbGci.eyJzdWIi.sig')).toBe(false);
    expect(out.request.url).toContain('state=s');
  });
});

describe('a session cookie', () => {
  it('is removed from request.cookies', () => {
    const out = scrubEvent({ request: { cookies: { 'better-auth.session_token': SESSION } } });
    expect(leaks(out, SESSION)).toBe(false);
  });

  it('is removed from the Cookie header, whatever its case', () => {
    const out = scrubEvent({
      request: { headers: { cookie: `__Secure-better-auth.session_token=${SESSION}`, 'User-Agent': 'phone' } },
    });
    expect(leaks(out, SESSION)).toBe(false);
    expect(out.request.headers['User-Agent']).toBe('phone');
  });

  it('is removed from Set-Cookie and Authorization', () => {
    const out = scrubEvent({ request: { headers: { 'Set-Cookie': [`a=${SESSION}`], Authorization: `Bearer ${SESSION}` } } });
    expect(leaks(out, SESSION)).toBe(false);
  });

  it('is removed from free text that quotes the cookie', () => {
    const out = scrubEvent({ message: `rejected better-auth.session_token=${SESSION}; Path=/` });
    expect(leaks(out, SESSION)).toBe(false);
    expect(out.message).toContain('Path=/');
  });
});

describe('the other secrets this app holds', () => {
  it.each(['password', 'BETTER_AUTH_SECRET', 'GOOGLE_CLIENT_SECRET', 'api_key', 'sentryDsn'])(
    'a field named %s is filtered',
    (key) => {
      const out = scrubEvent({ extra: { [key]: 'hunter2-the-value' } });
      expect(leaks(out, 'hunter2-the-value')).toBe(false);
    },
  );

  it('a connection string in free text loses its password', () => {
    const out = scrubEvent({ message: 'connect failed postgresql://neondb_owner:p4ssw0rd@ep-x.neon.tech/neondb' });
    expect(leaks(out, 'p4ssw0rd')).toBe(false);
    expect(out.message).toContain('ep-x.neon.tech');
  });
});

describe('where the candidate is', () => {
  // Found in production, not predicted (#52): the server event carried Vercel's
  // IP-geolocation headers — city, latitude, longitude, postcode — unscrubbed.
  // `sendDefaultPii: false` does not strip request headers on the server path,
  // and Sentry's "Prevent Storing of IP Addresses" covers the address, not
  // what was derived from it. Location is personal data the app has no use for.
  const LOCATED = {
    request: {
      headers: {
        'X-Vercel-Ip-City': 'Shibuya',
        'X-Vercel-Ip-Latitude': '35.6620',
        'X-Vercel-Ip-Longitude': '139.7038',
        'X-Vercel-Ip-Postal-Code': '150-0002',
        'X-Vercel-Ip-Country-Region': '13',
        'X-Vercel-Ip-Timezone': 'Asia/Tokyo',
        'X-Vercel-Proxied-For': '203.0.113.7',
        'X-Forwarded-For': '203.0.113.7',
        'X-Real-Ip': '203.0.113.7',
        'X-Vercel-Id': 'hnd1::iad1::abc-123',
        'User-Agent': 'phone',
      },
    },
  };

  it.each(['Shibuya', '35.6620', '139.7038', '150-0002', 'Asia/Tokyo'])(
    'loses %s from the geolocation headers',
    (value) => {
      expect(leaks(scrubEvent(LOCATED), value)).toBe(false);
    },
  );

  it('loses the client address from every header that forwards it', () => {
    expect(leaks(scrubEvent(LOCATED), '203.0.113.7')).toBe(false);
  });

  it('is matched by header name whatever its case', () => {
    const out = scrubEvent({ request: { headers: { 'x-vercel-ip-city': 'Shibuya', 'x-forwarded-for': '203.0.113.7' } } });
    expect(leaks(out, 'Shibuya')).toBe(false);
    expect(leaks(out, '203.0.113.7')).toBe(false);
  });

  it('keeps the headers that say nothing about the person', () => {
    // The request id is what ties a Sentry event to Vercel's own log line —
    // filtering it would cost the one cross-reference a failed write needs.
    const out = scrubEvent(LOCATED);
    expect(out.request.headers['X-Vercel-Id']).toBe('hnd1::iad1::abc-123');
    expect(out.request.headers['User-Agent']).toBe('phone');
  });
});
