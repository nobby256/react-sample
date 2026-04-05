'use client'

import { memo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { fetchResults } from '@/services/search/fetchResults'
import { PageFrame } from '@/components/PageFrame'
import { useRouter } from 'next/navigation'

export default memo(function ResultsPage() {
  const router = useRouter()
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
    <PageFrame title="検索結果画面">
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onClick(item.id)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </PageFrame>
  )
})