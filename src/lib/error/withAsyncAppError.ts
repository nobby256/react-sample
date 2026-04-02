import { normalizeError } from './normalizeError'
import type { AppError } from './AppError'
import { redirectToErrorPage } from './redirectToErrorPage'

export function withAsyncAppError<TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<void>,
) {
  return async (...args: TArgs) => {
    try {
      await fn(...args)
    } catch (error) {
      const appError = normalizeError(error)
      if (appError.fatal) {
        redirectToErrorPage(error)
        return
      }

      nofity(appError)
    }
  }
}

function nofity(appError: AppError) {
  alert('更新に失敗しました')
}