'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Tells the browser's Sentry client who is sitting there — by database id, and
 * by nothing else.
 *
 * Doc 03 §9 identifies users by id rather than email, which is why the id is
 * the only thing this takes: a component that received the whole user could
 * one day send the whole user. The server sets the same id from the session
 * helper, so an error thrown in a route handler and one thrown in the browser
 * name the same person without either of them naming an address.
 *
 * In an app with one account this is nearly redundant, and it is here for the
 * day it is not.
 */
export function SentryUser({ id }: { id: string }) {
  useEffect(() => {
    Sentry.setUser({ id });
    return () => Sentry.setUser(null);
  }, [id]);

  return null;
}
