'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { normalizeError } from '@/utils/normalizeError'
import { AppError } from '@/utils/AppError'
import { BackButton } from '@/components/BackButton'

/**
 * 第3層: 継続可能エラー用 error.tsx
 * - 401 / 403 は「継続不能」として第2層にバブルアップ
 * - それ以外はここで全画面エラー＋リトライ／戻る
 * - 完全CSR前提なので router.refresh() は使わない
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary()

  const appError: AppError = normalizeError(error)

  // 401 / 403 は第2層の error.tsx に任せたいので再スローしてバブルアップ
  if (appError.status === 401 || appError.status === 403) {
    throw error
  }

  const title =
    appError.status === 503
      ? '通信エラーが発生しました'
      : appError.status === 404
        ? 'データがありません'
        : '想定外のエラーが発生しました'


  // ログ出しなどはここで
  useEffect(() => {
    console.error('AppError:', appError)
  }, [appError])

  // 同じ画面でのリトライ
  const handleRetry = () => {
    // TanStack Query のエラー状態をクリア
    resetQueryErrors()
    // このセグメントの Error Boundary 状態をリセットして子ツリーを再レンダリング
    reset()
  }

  // 前の画面に戻る
  const handleBack = () => {
    // 前の画面と QueryKey が共有されている場合に備えて、エラー状態だけ掃除
    resetQueryErrors()
    // このセグメント自体から離脱するので、reset() は必須ではない
    router.back()
  }

  return (
    <>
      <h1>{title}</h1>
      <p>ステータス: {appError.status}</p>
      <p>{appError.message}</p>
      <button type="button" onClick={handleRetry}>リトライ</button>
      <BackButton label="前の画面に戻る" />
    </>
  )
}