'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { getResults } from '@/api/getResults'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const category = searchParams.get('category') ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['results', keyword, category],
    queryFn: () => getResults(keyword, category),
    throwOnError: true,
  })

  if (isLoading) return <main>読み込み中...</main>

  return (
    <main>
      <h1>検索結果画面</h1>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => router.push(`/detail/${item.id}`)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
