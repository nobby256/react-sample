import { AppError } from '@/utils/AppError'

export async function updateDetail(input: { id: string; name: string }) {
  const res = await fetch(`/api/detail/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: input.name }),
  })
  if (!res.ok) throw new AppError(res.status, '更新に失敗しました')
}
