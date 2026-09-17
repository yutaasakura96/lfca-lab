// Sentry in the browser.
//
// Next loads this file itself, by name, before any client code runs. Its one
// job is to hand the SDK the shared options; everything worth deciding is in
// `lib/sentry-options.ts`, and everything worth testing is in
// `domain/scrub.ts`.

import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentry-options.ts';

Sentry.init(sentryOptions);

// Router transitions are navigation, not tracing: this is what lets an error
// thrown after a client-side navigation name the route it happened on.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
