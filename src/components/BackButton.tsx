'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationHref } from '@/shared/navigation/useNavigationHref'

type BackButtonProps = {
  children?: ReactNode
  fallbackHref?: string
  className?: string
}

/**
 * 共通戻るボタン。
 *
 * 優先順位:
 * 1. returnTo
 * 2. browser history
 * 3. fallbackHref
 * 4. '/'
 *
 * @param children ボタン内に表示する内容。省略時は「戻る」
 * @param fallbackHref returnTo も browser history も使えないときの代替遷移先
 * @param className button 要素に付与する追加クラス名
 *
 * @example
 * <BackButton />
 *
 * @example
 * <BackButton className="btn-back" />
 *
 * @example
 * <BackButton fallbackHref="/results">戻る</BackButton>
 */
export function BackButton({
  children,
  fallbackHref,
  className,
}: BackButtonProps) {
  const router = useRouter()
  const { returnTo } = useNavigationHref()

  const handleClick = () => {
    if (returnTo) {
      router.push(returnTo)
      return
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref ?? '/')
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
    >
      {children ?? '戻る'}
    </button>
  )
}