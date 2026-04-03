'use client'

import { normalizeError } from '@/shared/error'
import { BackButton } from '@/components/BackButton'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

/**
 * 第3層: 継続可能エラー用 error.tsx
 * - 致命的エラーは「継続不能」として第2層にバブルアップ
 * - それ以外はここで全画面エラー＋リトライ／戻る
 * - 完全CSR前提なので router.refresh() ではなく、reset()を使用する
 * - refetchOnMount: 'always' により必ず再フェッチされるため、resetQueryErrors()は不要
 */
export default function RootErrorPage({ error, reset }: {
  error: Error & { digest?: string },
  reset: () => void
}) {
  const { reset: resetQueryErrorBoundary } = useQueryErrorResetBoundary()

  const appError = normalizeError(error)
  if (appError.fatal) {
    throw error // 致命的エラーは再スロー
  }

  const title =
    appError.status === 503
      ? '通信エラーが発生しました'
      : appError.status === 404
        ? 'データがありません'
        : '想定外のエラーが発生しました'

  // 同じ画面でのリトライ
  const handleRetry = () => {
    // QueryErrorResetBoundary のエラー状態をリセット
    resetQueryErrorBoundary()
    // このセグメントの Error Boundary 状態をリセットして子ツリーを再レンダリング
    reset()
  }

  return (
    <>
      <h1>{title}</h1>
      <p>ステータス: {appError.status}</p>
      <p>{appError.message}</p>
      <button type="button" onClick={handleRetry}>リトライ</button>
      <BackButton>前の画面に戻る</BackButton>
    </>
  )
}