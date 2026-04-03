'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchResults } from '@/services/search/fetchResults'
import { useNavigationHref } from '@/shared/navigation'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const category = searchParams.get('category') ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['results', keyword, category],
    queryFn: () => fetchResults(keyword, category),
    throwOnError: true,
  })

  const { createHref } = useNavigationHref()

  if (isLoading) return <main>読み込み中...</main>

  const onClick = (id: string) => {
    const href = createHref(`/detail`, { id })
    router.push(href)
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
}
