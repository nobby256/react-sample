import { AppError } from './AppError'

export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err
  if (err instanceof Error && err.message === 'AUTH_ERROR') return new AppError(401, 'セッションの有効期限が切れました')
  if (err instanceof Error && err.message === 'FORBIDDEN') return new AppError(403, '権限がありません')
  if (err instanceof Error) return new AppError(500, err.message)
  return new AppError(500, 'Unknown error')
}
