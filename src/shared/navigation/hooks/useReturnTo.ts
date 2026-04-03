'use client'

import { useSearchParams } from 'next/navigation'
import { RETURN_TO_PARAM } from './useNavigationHref'

/**
 * 現在の URL に含まれる returnTo を安全に取得する Hook。
 *
 * 用途:
 * - 戻るボタンの活性 / 非活性を制御する
 * - 戻り先 URL を取得して router.push() に渡す
 *
 * 返り値:
 * - returnTo: 安全な内部パスならその文字列。無ければ undefined
 *
 * @example
 * const { returnTo } = useReturnTo()
 * if (!returnTo) {
 *   // 戻る先が無い
 * }
 */
export function useReturnTo() {
  const searchParams = useSearchParams()

  const value = searchParams.get(RETURN_TO_PARAM)
  const returnTo = isSafeInternalReturnTo(value) ? value : undefined

  return { returnTo }
}

/**
 * returnTo が安全な内部パスかを判定する。
 *
 * 用途:
 * - query 文字列から取得した returnTo をそのまま使ってよいか確認する
 * - 外部 URL や `//example.com` のような危険な値を弾く
 *
 * @param value query パラメータから取得した returnTo
 * @returns 安全な内部パスなら true
 */
function isSafeInternalReturnTo(value: string | null): boolean {
  return !!value && value.startsWith('/') && !value.startsWith('//')
}