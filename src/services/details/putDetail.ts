import { $api } from '@/lib/http/apiClient'

export type UpdateDetailInput = {
  id: string
  name: string
}

export type Detail = {
  id: string
  name: string
}

export async function putDetail(input: UpdateDetailInput): Promise<Detail> {
  const { id, ...body } = input

  return $api<Detail>(`/api/detail/${id}`, {
    method: 'PUT',
    body,
  })
}