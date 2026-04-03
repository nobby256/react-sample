export const RETURN_TO_PARAM = 'returnTo'

/**
 * 現在画面の URL を「戻り先」として保存するための文字列へ変換する。
 *
 * 用途:
 * - 詳細画面へ遷移するときに、一覧画面の URL を returnTo として持たせたい場合に使う
 * - 既存の returnTo は除去して、多重ネストを防ぐ
 *
 * 返り値の例:
 * - pathname='/results', searchParams='keyword=abc&page=2'
 *   → '/results?keyword=abc&page=2'
 * - pathname='/results', searchParams='keyword=abc&returnTo=/search'
 *   → '/results?keyword=abc'
 *
 * @param pathname 現在の pathname。例: '/results'
 * @param searchParams 現在の search params。useSearchParams() の返り値など
 * @returns returnTo に格納するための内部パス文字列
 *
 * @example
 * const value = buildCurrentReturnTo(
 *   '/results',
 *   new URLSearchParams('keyword=apple&page=2'),
 * )
 * // value === '/results?keyword=apple&page=2'
 */
export function buildCurrentReturnTo(
  pathname: string,
  searchParams?: { toString(): string },
): string {
  const params = new URLSearchParams(searchParams?.toString() ?? '')
  // returnTo の多重ネストを防ぐため、既存の returnTo は削除しておく
  params.delete(RETURN_TO_PARAM)

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/**
 * 遷移先 URL に returnTo を付与した href を作る。
 *
 * 用途:
 * - 画面遷移するときに使う
 * - 遷移先固有の query と、現在画面を表す returnTo の両方をまとめて組み立てる
 *
 * 返り値の例:
 * - 現在: '/results?keyword=apple&page=2'
 * - 遷移先: '/detail?id=A'
 *   → '/detail?id=A&returnTo=%2Fresults%3Fkeyword%3Dapple%26page%3D2'
 *
 * @param nextPathname 遷移先の pathname。例: '/detail'
 * @param nextSearchParams 遷移先に付けたい query params
 * @param currentPathname 現在画面の pathname。例: '/results'
 * @param currentSearchParams 現在画面の search params
 * @returns returnTo 付きの遷移先 href
 *
 * @example
 * const href = createHrefWithReturnTo({
 *   nextPathname: '/detail',
 *   nextSearchParams: { id: 'A' },
 *   currentPathname: '/results',
 *   currentSearchParams: new URLSearchParams('keyword=apple&page=2'),
 * })
 * // href === '/detail?id=A&returnTo=%2Fresults%3Fkeyword%3Dapple%26page%3D2'
 */
export function createHrefWithReturnTo({
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

/**
 * returnTo が安全な内部パスかを判定する。
 *
 * 用途:
 * - query 文字列から受け取った returnTo をそのまま遷移先に使ってよいか確認する
 * - 外部 URL や `//example.com` のような危険な値を弾く
 *
 * 許可する例:
 * - '/results?keyword=apple'
 * - '/detail?id=A'
 *
 * 拒否する例:
 * - 'https://example.com'
 * - '//evil.example.com'
 * - 'javascript:alert(1)'
 *
 * @param value query パラメータから取得した returnTo の値
 * @returns 安全な内部パスなら true
 *
 * @example
 * isSafeInternalReturnTo('/results?keyword=apple') // true
 * isSafeInternalReturnTo('https://example.com') // false
 * isSafeInternalReturnTo('//evil.example.com') // false
 */
export function isSafeInternalReturnTo(value: string | null): boolean {
  return !!value && value.startsWith('/') && !value.startsWith('//')
}