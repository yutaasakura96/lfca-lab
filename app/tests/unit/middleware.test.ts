import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { middleware } from '../../src/middleware.ts';

// Middleware is not a security boundary — the session gate and the ownership
// filter are. What it must get right is narrower and easier to get wrong: where
// an unauthenticated visitor is sent, what an unauthenticated API call gets
// back, and — the one that bit — never redirecting away from the page that
// fixes a broken session.
//
// Testable without a browser or a database, because it is a function from a
// request to a response.

/**
 * A request carrying a session cookie.
 *
 * The value is deliberately arbitrary. Middleware only looks for presence, and
 * that limitation is the subject of half these tests.
 */
function request(path: string, { cookie = false } = {}): NextRequest {
  const headers = new Headers();
  if (cookie) headers.set('cookie', 'better-auth.session_token=whatever');
  return new NextRequest(new URL(`http://localhost:3000${path}`), { headers });
}

function locationOf(response: Response): string | null {
  const location = response.headers.get('location');
  return location === null ? null : new URL(location).pathname + new URL(location).search;
}

describe('an unauthenticated visitor asking for a page', () => {
  it('is sent to sign-in', () => {
    expect(locationOf(middleware(request('/')))).toBe('/sign-in?next=%2F');
  });

  it('keeps where they were going, query string included', () => {
    // The point of this: a bookmarked in-progress attempt should survive the
    // round trip through Google rather than dumping you on the home screen.
    expect(locationOf(middleware(request('/attempt/abc?q=1'))))
      .toBe('/sign-in?next=%2Fattempt%2Fabc%3Fq%3D1');
  });
});

describe('an unauthenticated API call', () => {
  it('gets JSON, not a redirect', async () => {
    const response = middleware(request('/api/attempt/abc'));

    expect(response.status).toBe(401);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('content-type')).toContain('application/json');
    // A redirect here would hand the outbox an HTML login page to parse as an
    // answer response — a save failure disguised as a parse error.
    await expect(response.json()).resolves.toEqual({
      error: { code: 'unauthenticated', message: 'Sign in to continue.' },
    });
  });

  it('never blocks the auth routes, which are how you get a session', () => {
    for (const path of ['/api/auth/callback/google', '/api/auth/sign-out', '/api/auth/session']) {
      expect(middleware(request(path)).status, path).toBe(200);
    }
  });

  it('allows an API call once a session cookie is present', () => {
    expect(middleware(request('/api/attempt/abc', { cookie: true })).status).toBe(200);
  });
});

describe('the sign-in page is always reachable', () => {
  // The regression. A cookie can outlive its session row — after signing out,
  // after an expiry, or after the `DELETE FROM session` that doc 08 names as
  // the recovery move. Middleware sees the cookie; the server sees no session
  // and sends the visitor to sign-in. If middleware bounced them back, the two
  // would chase each other until the browser gave up with
  // ERR_TOO_MANY_REDIRECTS — which is exactly what happened.
  it('does not redirect away from sign-in when a stale cookie is present', () => {
    const response = middleware(request('/sign-in', { cookie: true }));

    expect(response.headers.get('location')).toBeNull();
    expect(response.status).toBe(200);
  });

  it('does not redirect away from sign-in without a cookie either', () => {
    expect(middleware(request('/sign-in')).headers.get('location')).toBeNull();
  });

  it('leaves the denied state reachable', () => {
    expect(middleware(request('/sign-in?denied=1', { cookie: true })).headers.get('location'))
      .toBeNull();
  });

  // The property, stated directly: no page request may be redirected to a page
  // that would itself be redirected. One hop, always terminating.
  it('never sends a visitor somewhere that would send them onwards', () => {
    for (const path of ['/', '/exams', '/attempt/abc', '/sign-in']) {
      for (const cookie of [true, false]) {
        const first = middleware(request(path, { cookie }));
        const target = locationOf(first);
        if (target === null) continue;

        const second = middleware(request(target, { cookie }));
        expect(locationOf(second), `${path} (cookie=${cookie}) → ${target} → onwards`).toBeNull();
      }
    }
  });
});

describe('a visitor with a session cookie', () => {
  it('is allowed through to a page', () => {
    expect(middleware(request('/', { cookie: true })).headers.get('location')).toBeNull();
  });
});
