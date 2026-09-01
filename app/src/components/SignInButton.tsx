'use client';

import { useState } from 'react';
import { signIn } from '../lib/auth-client.ts';

/**
 * The one control on the sign-in screen.
 *
 * Busy state is the existing disabled tokens plus a changed label — no spinner.
 * The design system has no animated primitive, and this is not the place to
 * introduce its first one.
 */
export function SignInButton({ next }: { next?: string | undefined }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn btn--primary btn--lg"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signIn.social({ provider: 'google', callbackURL: next ?? '/' });
      }}
    >
      {busy ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
}
