'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { normalizeError } from '@/utils/normalizeError'
import type { AppError } from '@/utils/AppError'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  const appError: AppError = normalizeError(error)
  const status = appError.status ?? 500

  useEffect(() => {
    console.error('Fatal App Error:', appError)

    const params = new URLSearchParams()

    // 必須: ステータスコード
    params.set('status', String(status))

    // 任意: どのURLでエラーになったか（ログ用・UI用）
    if (pathname) {
      params.set('from', pathname)
    }

    router.replace(`/fatal-error?${params.toString()}`)
  }, [appError, pathname, router, status])

  // replace が走るまでに一瞬だけ描画される可能性があるので簡易メッセージを出しておく
  return (
    <p>致命的なエラーが発生しました。エラー画面に遷移しています...</p>
  )
}
