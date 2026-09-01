import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Middleware is a convenience, not a security boundary.
//
// It checks only for the *presence* of a session cookie — it does not validate
// it, and it cannot, without a database round trip on every request. The real
// checks are the session gate in the app layout and the ownership filter on
// every attempt-scoped query. What this buys is not rendering a page and then
// throwing it away, and landing a bookmarked link somewhere sensible.
//
// The one thing it must get right is the difference between a page and an API
// route. A page gets a redirect; an API route gets JSON. Redirecting an API
// call would hand the client an HTML login page to parse as an answer
// response — which is how a save failure turns into a confusing parse error
// instead of an honest 401.

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = getSessionCookie(request) !== null;

  if (pathname.startsWith('/api/')) {
    // Better Auth's own routes are how you get a session; they cannot require one.
    if (pathname.startsWith('/api/auth/')) return NextResponse.next();
    if (hasSessionCookie) return NextResponse.next();

    return NextResponse.json(
      { error: { code: 'unauthenticated', message: 'Sign in to continue.' } },
      { status: 401 },
    );
  }

  // Sign-in is always reachable, cookie or not.
  //
  // Bouncing a cookie-holder away from here looks harmless and is not: a cookie
  // can outlive its session row — after signing out, after an expiry, or after
  // the `DELETE FROM session` that doc 08 §2 names as the recovery move. In
  // every one of those cases the cookie is present and the session is gone, so
  // the server sends you to sign-in, and a bounce here would send you straight
  // back, forever. Presence-based middleware may guard a route; it must never
  // redirect away from the one page that fixes a bad session.
  //
  // Sending an already-signed-in visitor to the home screen still happens — on
  // the sign-in page itself, which asks the database rather than the cookie jar
  // and so cannot be wrong about it.
  if (pathname === '/sign-in') return NextResponse.next();

  if (!hasSessionCookie) {
    const signIn = new URL('/sign-in', request.url);
    // Carried so a bookmarked in-progress attempt survives the round trip.
    signIn.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the favicon. Listing what to skip
  // rather than what to guard means a new route is protected by default.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
