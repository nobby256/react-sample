'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useReturnTo } from '@/shared/navigation'

type BackButtonProps = {
  children?: ReactNode
  className?: string
}

/**
 * アプリ共通の「戻る」ボタン。
 *
 * 基本方針:
 * - ブラウザの戻るボタンと近い挙動を目指しつつ、
 *   アプリ内で明示された戻り先 `returnTo` がある場合のみ有効化する。
 * - これにより、一覧→詳細のような導線ではアプリ仕様として期待通りの戻り先を保証できる。
 *
 * disable 条件:
 * - `returnTo` が存在しない場合は disabled
 * - `window.history.length <= 1` の場合も disabled
 *
 * `history.length` を確認する意図:
 * - 別タブで詳細画面を開いた場合など、ブラウザの戻るボタンで戻れない状況では
 *   アプリ内の戻るボタンも disabled にし、違和感を減らすため。
 * - これにより、アプリ内の戻るボタンをブラウザ戻るとできるだけ同じ世界観に寄せる。
 *
 * ただし完全に同じ挙動ではない:
 * - ブラウザの戻るは別ドメインにも戻れるが、
 *   このボタンは `returnTo` によるアプリ内遷移だけを対象にする。
 * - そのため、ブラウザ戻るよりも「アプリの文脈に限定された戻る」として動作する。
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

  const hasHistory =
    typeof window !== 'undefined' && window.history.length > 1

  const disabled = !returnTo || !hasHistory

  const handleClick = () => {
    if (disabled) return
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