// Who may sign in.
//
// Google sign-in is open to every Google account on earth unless something
// closes it. This is that something, and it is the only thing standing between
// a deployed app and a published one.
//
// Pure, and separate from the hook that calls it, so every way of getting this
// wrong can be tested by calling a function — including the ways that involve
// no user at all. It reads no environment variable itself: the caller supplies
// the raw list, which is what lets an empty one, an absent one and a
// whitespace-only one each be tested for the behaviour they must have.

/**
 * Parse the raw allowlist into addresses.
 *
 * Comma-separated, trimmed, lowercased, blanks dropped. Case folding happens
 * here because email local-parts are case-sensitive in the RFC and case-
 * insensitive in every mail system anyone actually uses — treating
 * `Yuta@example.com` and `yuta@example.com` as different people would lock the
 * owner out of their own app for a reason nobody would guess.
 */
export function parseAllowlist(raw: string | undefined | null): string[] {
  if (raw == null) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

/**
 * Whether this Google identity may sign in.
 *
 * Three conditions, and each one is a decision rather than a detail:
 *
 * 1. **The allowlist is non-empty.** An empty or unset list rejects *everyone*,
 *    including the owner. A blank variable that meant "allow everyone" would
 *    publish the app the first time someone fat-fingered a deploy config, and
 *    the failure would be invisible — the app would simply start working for
 *    strangers.
 * 2. **The address is on the list**, compared case-insensitively after trimming.
 * 3. **Google says the address is verified.** Without this, anyone who can
 *    create an account claiming an allowlisted address could sign in as the
 *    owner. Google's own verification is what makes the address mean anything.
 */
export function isAllowed(
  email: string | undefined | null,
  emailVerified: boolean,
  rawAllowlist: string | undefined | null,
): boolean {
  const allowed = parseAllowlist(rawAllowlist);
  if (allowed.length === 0) return false;
  if (!emailVerified) return false;
  if (email == null) return false;

  const candidate = email.trim().toLowerCase();
  if (candidate.length === 0) return false;

  return allowed.includes(candidate);
}
