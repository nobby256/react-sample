import { $api } from '@/shared/http/apiClient'

export type ResultItem = {
  id: string
  name: string
}

export async function fetchResults(
  keyword: string,
  category: string,
): Promise<ResultItem[]> {
  return $api<ResultItem[]>('/api/results', {
    query: {
      ...(keyword ? { keyword } : {}),
      ...(category ? { category } : {}),
    },
  })
}