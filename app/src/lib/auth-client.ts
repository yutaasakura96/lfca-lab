// The browser half of Better Auth. Only what the UI actually calls.
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();
export const { signIn, signOut, useSession } = authClient;
