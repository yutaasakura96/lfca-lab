// Sending one write, and saying why it did not land.
//
// Extracted from the sitting so the whole paper can share one of these rather
// than one per question. It is the client half of doc 07 §1's error shape: the
// server always answers a failure with `{ error: { code } }`, and this is where
// that code is read.

/**
 * Why a write did not land, and whether sending it again could ever help.
 *
 * `retryable` is the distinction the outbox (#23) will be built on, which is
 * why the error `code` is kept rather than collapsed into a boolean. A
 * transport failure or a 5xx is worth repeating; a sitting whose clock has run
 * out will refuse this request forever, and a queue that could not tell the
 * difference would retry it until the tab closed.
 */
export interface WriteFailure {
  code: string;
  retryable: boolean;
}

export async function put(url: string, body: unknown): Promise<WriteFailure | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { code: 'network', retryable: true };
  }

  if (response.ok) return null;
  if (response.status >= 500) return { code: 'internal_error', retryable: true };

  // Every non-2xx from this app carries `{ error: { code } }`. A body that does
  // not is a proxy or a framework page, not this app answering.
  const payload = (await response.json().catch(() => null)) as
    | { error?: { code?: string } }
    | null;
  return { code: payload?.error?.code ?? 'internal_error', retryable: false };
}

/**
 * A request whose answer is the point, rather than only whether it landed.
 *
 * Submitting is the one write in the app that is not fire-and-forget: it comes
 * back with the score, and the screen has nothing else to show it from. So this
 * returns the body on success and the same {@link WriteFailure} on failure,
 * read the same way — one error shape, one place that reads it.
 *
 * It is deliberately **not** put through the outbox. The outbox exists to keep
 * retrying without being asked, and a submit that retried itself would go on
 * finalising a sitting the candidate had walked away from. A failed submit says
 * so and offers the button again (doc 10 §5), which puts the decision back with
 * the person whose sitting it is.
 */
export type PostResult<T> = { ok: true; data: T } | { ok: false; failure: WriteFailure };

export async function post<T>(url: string): Promise<PostResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, { method: 'POST' });
  } catch {
    return { ok: false, failure: { code: 'network', retryable: true } };
  }

  if (response.ok) {
    const data = (await response.json().catch(() => null)) as T | null;
    if (data === null) return { ok: false, failure: { code: 'internal_error', retryable: true } };
    return { ok: true, data };
  }

  if (response.status >= 500) {
    return { ok: false, failure: { code: 'internal_error', retryable: true } };
  }

  const payload = (await response.json().catch(() => null)) as
    | { error?: { code?: string } }
    | null;
  return { ok: false, failure: { code: payload?.error?.code ?? 'internal_error', retryable: false } };
}
