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
