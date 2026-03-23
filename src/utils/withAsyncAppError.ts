import { normalizeError } from './normalizeError'

export function withAsyncAppError<TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<void>,
) {
  return async (...args: TArgs) => {
    try {
      await fn(...args)
    } catch (err) {
      handleAppError(err)
    }
  }
}

function handleAppError(err: unknown) {
  const appError = normalizeError(err)

  if (appError.status === 401 || appError.status === 403) {
    window.location.replace(`/fatal-error?status=${appError.status}`)
    return
  }

  alert('更新に失敗しました')
}
