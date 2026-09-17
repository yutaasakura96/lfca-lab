// Sentry on the edge runtime, which here is the proxy in `src/proxy.ts` and
// nothing else. Loaded by `instrumentation.ts`.
//
// The same options as the Node runtime: the proxy sees a session cookie on
// every request, so the runtime with the least code has the most reason to be
// scrubbed.

import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentry-options.ts';

Sentry.init(sentryOptions);
