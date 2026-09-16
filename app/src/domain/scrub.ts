// What an error report is allowed to carry off to a third party.
//
// Sentry holds whatever this function lets through, on infrastructure this
// project does not control. The app holds three things worth keeping from it:
// the owner's email address, the Google OAuth tokens on `account`, and the
// session cookie that *is* a signed-in browser (doc 08 §2). Doc 03 §9 requires
// all three excluded.
//
// Pure, and not written inline in `Sentry.init`, because a scrubber written in
// provider configuration is a scrubber nothing can test (#52). It knows nothing
// about the SDK: an event is walked as plain data, so the same function serves
// `beforeSend` and `beforeBreadcrumb`, on the client and the server.
//
// Two rules, and both apply everywhere rather than at named paths, because an
// email or a token turns up wherever someone happened to interpolate it — a
// thrown message, a fetch breadcrumb's URL, a header nobody expected:
//
// 1. **A field named for a secret loses its value**, whatever the value is.
//    `cookies`, `Cookie`, `Set-Cookie`, `Authorization`, `accessToken` — the
//    name is the evidence, so the value is not inspected.
// 2. **Every string is searched for the shapes of a secret**: an email
//    address, a Google access or refresh token, a `name=value` pair whose name
//    says token, secret, password or session, and the password half of a
//    connection string.
//
// Sentry's own server-side data scrubbing stays on behind this. It is a second
// layer, not the first: by the time it runs, the event has already left.

export const FILTERED = '[Filtered]';

// `email` is deliberately not here: an address is caught by its shape wherever
// it sits, `user.email` included, and a key rule that no event could tell apart
// from the text rule is one the mutation check could not hold in place.
const SENSITIVE_KEY = /token|secret|passw|cookie|authorization|api[-_]?key|dsn/i;

/**
 * Order matters. The connection-string rule runs before the email rule, or
 * `owner:p4ssw0rd@ep-x.neon.tech` reads as an address and takes the host with
 * it — and the host is exactly what a connection error needs to be diagnosed.
 */
const SENSITIVE_TEXT: ReadonlyArray<readonly [RegExp, string]> = [
  [/(\/\/[^:/\s@]+:)[^@\s/]+@/g, `$1${FILTERED}@`],
  [/([\w.-]*(?:token|secret|passw|session)[\w.-]*=)[^&;\s]+/gi, `$1${FILTERED}`],
  [/ya29\.[\w.-]+/g, FILTERED],
  [/1\/\/[\w-]+/g, FILTERED],
  [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, FILTERED],
];

function scrubText(text: string): string {
  return SENSITIVE_TEXT.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}

function scrubValue(value: unknown): unknown {
  if (typeof value === 'string') return scrubText(value);
  if (Array.isArray(value)) return value.map(scrubValue);
  if (value === null || typeof value !== 'object') return value;

  const out: Record<string, unknown> = {};
  for (const [key, inner] of Object.entries(value)) {
    out[key] = SENSITIVE_KEY.test(key) ? FILTERED : scrubValue(inner);
  }
  return out;
}

/**
 * A copy of `event` with every secret this app holds removed. An event that
 * carries none comes back deep-equal; the input is never mutated.
 *
 * Typed as returning its input's type because the shape is preserved: a
 * filtered field keeps its key and holds a string, which the SDK serialises
 * like any other value.
 */
export function scrubEvent<T>(event: T): T {
  return scrubValue(event) as T;
}
