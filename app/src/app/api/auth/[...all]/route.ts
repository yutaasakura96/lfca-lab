// Better Auth's own routes: the Google redirect, its callback, session reads
// and sign-out. Mounted wholesale rather than hand-written — these are the
// library's, and the only thing this project adds to them is the allowlist
// hook in the auth config.
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '../../../../auth.ts';

export const { GET, POST } = toNextJsHandler(auth);
