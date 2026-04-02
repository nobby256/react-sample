import { $api } from '@/shared/http/apiClient'

export type Detail = {
  id: string
  name: string
}

export async function fetchDetail(id: string): Promise<Detail> {
  return $api<Detail>(`/api/detail/${id}`)
}