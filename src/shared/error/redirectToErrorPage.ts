import { normalizeError } from './normalizeError'

type RedirectToErrorPageOptions = {
  includeFrom?: boolean
}

export function redirectToErrorPage(
  err: unknown,
  options: RedirectToErrorPageOptions = {},
): never {
  const { includeFrom = true } = options
  const appError = normalizeError(err)

  const params = new URLSearchParams()
  params.set('status', String(appError.status))

  if (includeFrom && typeof window !== 'undefined') {
    params.set('from', window.location.pathname + window.location.search)
  }

  window.location.replace(`/error?${params.toString()}`)

  throw new Error('UNREACHABLE_AFTER_REDIRECT')
}