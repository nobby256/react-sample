'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useReturnTo } from '@/shared/navigation'

type BackButtonProps = {
  children?: ReactNode
  className?: string
}

/**
 * returnTo がある場合だけ有効な共通戻るボタン。
 *
 * 用途:
 * - 詳細画面などで、明示的な戻り先がある時だけ戻る
 * - returnTo が無い時は disabled にする
 *
 * @param children ボタン内に表示する内容。省略時は「戻る」
 * @param className button 要素に付与する追加クラス名
 *
 * @example
 * <BackButton />
 *
 * @example
 * <BackButton className="btn-back">検索結果へ戻る</BackButton>
 */
export function BackButton({
  children,
  className,
}: BackButtonProps) {
  const router = useRouter()
  const { returnTo } = useReturnTo()

  const disabled = !returnTo

  const handleClick = () => {
    if (!returnTo) {
      return
    }

    router.push(returnTo)
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {children ?? '戻る'}
    </button>
  )
}