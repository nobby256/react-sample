'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { postLogout } from '@/services/auth/postLogout'
import { forceSessionDead } from '@/filters/SessionDeadGuard'

/**
 * 継続不能エラー専用ページ
 */
export default function FatalErrorPage() {
  // ログアウト呼び出し（副作用のみ）
  useLogout()

  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status')
  const from = searchParams.get('from') ?? undefined
  const status = statusParam ? Number(statusParam) || 500 : 500

  let title = '致命的なエラーが発生しました'
  let message =
    'お手数ですが、ウィンドウを閉じて、再度ログインし直してください。'

  if (status === 401) {
    title = 'セッションの有効期限が切れました'
    message = 'お手数ですが、再度ログインを行ってください。'
  } else if (status === 403) {
    title = 'この操作を行う権限がありません'
    message = '必要な権限をお持ちでないため、処理を続行できません。'
  }

  return (
    <main>
      <h1>{title}</h1>
      <p>ステータス: {status}</p>
      <p>{message}</p>

      {from && (
        <p style={{ marginTop: 8 }}>
          エラー発生画面: <code>{from}</code>
        </p>
      )}
    </main>
  )
}

function useLogout(): void {
  const hasRunLogout = useRef(false)

  const { mutate } = useMutation({
    mutationFn: postLogout,
    retry: false,
    throwOnError: false, // ここでは ErrorBoundary に飛ばさない
    onError: (error) => {
      console.error('Logout request error:', error)
    },
  })

  useEffect(() => {
    if (hasRunLogout.current) {
      return
    }
    hasRunLogout.current = true

    // マウント時に一度だけ fire-and-forget で実行
    mutate()

    // この SPA セッションは死亡したと明示
    forceSessionDead()

  }, [mutate])
}