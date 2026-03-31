'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { logout } from '@/api/logout'

/**
 * /fatal-error: 継続不能エラー専用ページ
 * - マウント時に一度だけ:
 *   - sessionStorage に「セッション死亡」フラグを立てる
 *   - TanStack Query の mutation で ログアウトを呼び出す
 */
export default function FatalErrorPage() {
  const searchParams = useSearchParams()

  const statusParam = searchParams.get('status')
  const from = searchParams.get('from') ?? undefined
  const status = statusParam ? Number(statusParam) : undefined

  const hasRunLogout = useRef(false)

  const logoutMutation = useMutation({
    mutationFn: logout,
    retry: false,
    throwOnError: false, // ここでは ErrorBoundary に飛ばさない
    onError: (error) => {
      console.error('Logout request error:', error)
      // ここで終わり。画面上の挙動は変えない
    },
  })

  useEffect(() => {
    if (hasRunLogout.current) {
      return
    }
    hasRunLogout.current = true

    // マウント時に一度だけ fire-and-forget で実行
    logoutMutation.mutate()

    // この SPA セッションは死亡したと明示
    // SessinonDeadGuard でこのフラグを使用する
    sessionStorage.setItem('sessionDead', '1')
  }, [logoutMutation])

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
      <p>ステータス: {status ?? '不明'}</p>
      <p>{message}</p>

      {from && (
        <p style={{ marginTop: 8 }}>
          エラー発生画面: <code>{from}</code>
        </p>
      )}
    </main>
  )
}
