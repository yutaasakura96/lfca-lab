'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '../lib/auth-client.ts';

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn btn--quiet"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOut().then(() => {
          // Deleting the session row is what actually signs you out; this just
          // makes the browser stop showing a page it no longer has a right to.
          router.replace('/sign-in');
          router.refresh();
        });
      }}
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
