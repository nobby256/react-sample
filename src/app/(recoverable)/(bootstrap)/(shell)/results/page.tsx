'use client'

import { memo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useAppRouter } from '@/shared/navigation'
import { fetchResults } from '@/services/search/fetchResults'

export default memo(function ResultsPage() {
  const router = useAppRouter()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const category = searchParams.get('category') ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['results', keyword, category],
    queryFn: () => fetchResults(keyword, category),
    throwOnError: true,
  })

  if (isLoading) return <main>読み込み中...</main>

  const onClick = (id: string) => {
    router.push(`/detail?id=${id}`)
  }

  return (
    <main>
      <h1>検索結果画面</h1>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onClick(item.id)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
})