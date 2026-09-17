// Next's own entry point for server-side instrumentation.
//
// `register` runs once per runtime, before anything it serves; the branch is
// what stops the Node SDK being loaded into the edge bundle and the other way
// round.

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config.ts');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config.ts');
  }
}

// Errors thrown by server components, route handlers and the proxy reach
// Sentry through this hook rather than through a try/catch in each of them.
export const onRequestError = Sentry.captureRequestError;
