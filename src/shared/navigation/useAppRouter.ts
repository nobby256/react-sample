'use client'

import { useContext } from 'react'
import { NavigationContext } from './NavigationProvider'
import type { AppRouter } from './types'

/**
 * アプリ共通の router API を返すカスタムフックです。
 *
 * 画面側は Next.js の `useRouter()` を直接使わず、
 * この hook 経由で `push` / `replace` / `back` / `canGoBack` を利用します。
 *
 * これにより、戻る可否の判定ロジックを一箇所に集約でき、
 * 将来ほかの router 実装へ移行する場合も影響範囲を抑えられます。
 */
export function useAppRouter(): AppRouter {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error('useAppRouter must be used within NavigationProvider')
  }

  return context
}