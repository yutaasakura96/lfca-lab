// Sentry on the Node runtime — route handlers, server components, the seed's
// world. Loaded by `instrumentation.ts`.

import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentry-options.ts';

Sentry.init(sentryOptions);
