'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { fetchDetail } from '@/services/details/fetchDetail'
import { putDetail } from '@/services/details/putDetail'
import { withAsyncAppError } from '@/utils/withAsyncAppError'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState('sample')

  const { data, isLoading } = useQuery({
    queryKey: ['detail', id],
    queryFn: () => fetchDetail(id),
    throwOnError: true,
  })

  const mutation = useMutation({
    mutationFn: putDetail,
  })

  const handleUpdate = withAsyncAppError(async () => {
    await mutation.mutateAsync({ id, name })
  })

  if (isLoading) return <main>読み込み中...</main>

  return (
    <main>
      <h1>詳細画面</h1>
      <p>現在の値: {data?.name}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={handleUpdate} disabled={mutation.isPending}>
        {mutation.isPending ? '更新中...' : '更新'}
      </button>
    </main>
  )
}
