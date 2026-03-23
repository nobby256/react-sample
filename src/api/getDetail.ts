// src/lib/api/getDetail.ts
import { AppError } from '@/utils/AppError'

export async function getDetail(id: string) {
  const res = await fetch(`/api/detail/${id}`)
  if (!res.ok) throw new AppError(res.status, '詳細の取得に失敗しました')
  return res.json() as Promise<{ id: string; name: string }>
}
