import { normalizeError } from './normalizeError'

export function handleAppError(err: unknown) {
  const appError = normalizeError(err)

  if (appError.status === 401 || appError.status === 403) {
    window.location.replace(`/fatal-error?status=${appError.status}`)
    return
  }

  alert('更新に失敗しました')
}
