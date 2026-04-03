'use client'

import { usePathname, useSearchParams } from 'next/navigation'

export const RETURN_TO_PARAM = 'returnTo'

/**
 * returnTo 付きの遷移先 href を作るための Hook。
 *
 * 用途:
 * - 一覧 → 詳細などのリンク生成
 * - 現在の URL を returnTo として次画面へ引き継ぐ
 *
 * @example
 * const { createHref } = useNavigationHref()
 * const href = createHref('/detail', { id: 'A' })
 */
export function useNavigationHref() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /**
   * 現在画面を returnTo として付与した遷移先 href を作る。
   *
   * @param nextPathname 遷移先の pathname
   * @param nextSearchParams 遷移先に付与する query params
   * @returns returnTo 付き href
   */
  const createHref = (
    nextPathname: string,
    nextSearchParams?: Record<string, string | number | boolean | undefined>,
  ) =>
    createHrefWithReturnTo({
      nextPathname,
      nextSearchParams,
      currentPathname: pathname,
      currentSearchParams: searchParams,
    })

  return {
    createHref,
  }
}

/**
 * 現在画面の URL を returnTo 用文字列へ変換する。
 *
 * 用途:
 * - 現在の pathname と search params から returnTo 文字列を作る
 * - 既存の returnTo は削除して多重ネストを防ぐ
 */
function buildCurrentReturnTo(
  pathname: string,
  searchParams?: { toString(): string },
): string {
  const params = new URLSearchParams(searchParams?.toString() ?? '')
  params.delete(RETURN_TO_PARAM)

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/**
 * 遷移先 URL に returnTo を付与した href を作る。
 *
 * 用途:
 * - 遷移先固有の query と、現在画面を表す returnTo をまとめて組み立てる
 */
function createHrefWithReturnTo({
  nextPathname,
  nextSearchParams,
  currentPathname,
  currentSearchParams,
}: {
  nextPathname: string
  nextSearchParams?: Record<string, string | number | boolean | undefined>
  currentPathname: string
  currentSearchParams?: { toString(): string }
}): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(nextSearchParams ?? {})) {
    if (value !== undefined) {
      params.set(key, String(value))
    }
  }

  params.set(
    RETURN_TO_PARAM,
    buildCurrentReturnTo(currentPathname, currentSearchParams),
  )

  const query = params.toString()
  return `${nextPathname}?${query}`
}