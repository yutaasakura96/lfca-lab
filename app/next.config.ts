import type { NextConfig } from 'next';
// From `/config`, not from the package root: the root re-export is deprecated
// and stops working in v11, and it says so on every build. Documentation still
// shows the root import.
import { withSentryConfig } from '@sentry/nextjs/config';

const config: NextConfig = {
  typedRoutes: true,
};

// The Sentry build plugin: it uploads source maps, so a stack trace from the
// production bundle names a line of TypeScript rather than a column of minified
// output.
//
// Every value it needs comes from the environment rather than from this file.
// The slugs are not secrets, but committing them would put a second copy of
// what Vercel already holds somewhere it can drift; the auth token is a secret
// and could never be committed. All three exist only in Vercel production, so
// a local `next build` — which the browser suite runs — simply uploads nothing.
// The three are spread in only when set, rather than passed as `undefined`:
// `exactOptionalPropertyTypes` draws that distinction, and so does the plugin —
// an absent option falls back to its own environment variable, where an
// explicit `undefined` is a value.
const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env;

export default withSentryConfig(config, {
  ...(SENTRY_ORG ? { org: SENTRY_ORG } : {}),
  ...(SENTRY_PROJECT ? { project: SENTRY_PROJECT } : {}),
  ...(SENTRY_AUTH_TOKEN ? { authToken: SENTRY_AUTH_TOKEN } : {}),

  // A fixed path, and the reason is doc 12 §6's one client-side report: an ad
  // or content blocker that drops requests to sentry.io would silently drop
  // the outbox's five-failure event, which is the one failure the candidate
  // cannot see. Tunnelling sends it to this app's own origin instead.
  //
  // Fixed rather than auto-generated because the proxy has to exclude it by
  // name, and a route whose name changes per build cannot be excluded.
  tunnelRoute: '/monitoring',

  // Quiet on a laptop, loud in CI.
  silent: !process.env.CI,
});
