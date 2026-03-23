import { AppError } from '@/utils/AppError'

export type ResultItem = { id: string; name: string }

export async function getResults(keyword: string, category: string): Promise<ResultItem[]> {
  const params = new URLSearchParams()
  if (keyword) params.set('keyword', keyword)
  if (category) params.set('category', category)

  const res = await fetch(`/api/results?${params.toString()}`)
  if (!res.ok) throw new AppError(res.status, '検索結果の取得に失敗しました')
  return res.json()
}
