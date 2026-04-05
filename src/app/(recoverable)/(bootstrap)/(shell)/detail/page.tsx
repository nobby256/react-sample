'use client'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { memo, useState } from 'react'
import { withAsyncAppError } from '@/shared/error'
import { fetchDetail } from '@/services/details/fetchDetail'
import { putDetail } from '@/services/details/putDetail'
import { PageFrame } from '@/components/PageFrame'

export default memo(function DetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [name, setName] = useState('sample')

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['detail', id],
    queryFn: () => fetchDetail(id!),
  })

  const mutation = useMutation({
    mutationFn: putDetail,
  })

  const handleUpdate = withAsyncAppError(async () => {
    if (!id) return
    await mutation.mutateAsync({ id, name })
  })

  if (!id) {
    return <main>IDが指定されていません。</main>
  }

  if (isLoading) {
    return <main>読み込み中...</main>
  }

  return (
    <PageFrame title="詳細画面">
      <p>現在の値: {data?.name}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={handleUpdate} disabled={mutation.isPending}>
        {mutation.isPending ? '更新中...' : '更新'}
      </button>
    </PageFrame>
  )
})