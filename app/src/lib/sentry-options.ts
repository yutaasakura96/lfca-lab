// The options every Sentry runtime shares.
//
// One object rather than three copies, because the settings that matter here
// are the ones that must never differ between the browser and the server: what
// is scrubbed, whether personally-identifying data travels, and whether the SDK
// is on at all. Three copies of those would be three chances for one of them to
// quietly stop matching.
//
// Deliberately absent, per doc 12 §6: no tracing, no Session Replay, no Logs.
// Replay is not a default — it arrives only by adding `replayIntegration()`, so
// what keeps it off is that nothing here adds it.

import { scrubEvent } from '../domain/scrub.ts';

/**
 * The DSN, and the switch.
 *
 * `NEXT_PUBLIC_` because the browser needs it at build time, and because a DSN
 * is public by design (doc 12 §2) — it identifies a project to write to, and
 * carries no authority to read anything back. The server reads the same
 * variable rather than a second one, so the two runtimes cannot end up pointed
 * at different projects.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryOptions = {
  dsn,

  // No DSN, no SDK. This is what keeps Sentry off on a laptop (doc 12 §1) —
  // the variable is set in Vercel production and nowhere else, so local work
  // and both test suites report nothing, without a flag to remember.
  enabled: Boolean(dsn),

  // Production is the only environment that holds a DSN, so it is the only one
  // that can reach this line. If a second environment ever reports, this is
  // what has to change.
  environment: 'production',

  // Doc 03 §9: identify by database id, never by email. `sendDefaultPii` is
  // what would otherwise attach the IP address and request headers.
  sendDefaultPii: false,

  // Errors only.
  tracesSampleRate: 0,

  // Both hooks take the scrubber, because a breadcrumb is as capable of
  // carrying a token as an event is — a fetch breadcrumb records the URL it
  // was given. `scrubEvent` returns a clean event unchanged, so this costs
  // nothing on the ordinary path.
  beforeSend: scrubEvent,
  beforeBreadcrumb: scrubEvent,
};
