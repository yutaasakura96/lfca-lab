// One error shape, for every non-2xx response from every endpoint.
//
// `code` is a stable string the client branches on; `message` is English and
// may change freely. There is no field-level detail and no `details` array: the
// input surface is a handful of enums and two ids, so a failure is a bug or an
// attack rather than a typo worth explaining.

export type ErrorCode =
  | 'invalid_request'
  | 'unauthenticated'
  | 'not_allowlisted'
  | 'not_found'
  | 'attempt_already_submitted'
  | 'attempt_expired'
  | 'question_not_in_attempt'
  | 'flagging_not_available'
  | 'internal_error';

export function apiError(status: number, code: ErrorCode, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}
