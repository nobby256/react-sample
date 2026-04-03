'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useNavigationHref } from '@/shared/navigation'

type FormValues = {
  keyword: string
  category: string
}

export default function SearchPage() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { keyword: '', category: '' },
  })
  const { createHref } = useNavigationHref()

  const onSubmit = (data: FormValues) => {
    const href = createHref(`/results`, {
      keyword: data.keyword,
      category: data.category,
    })
    router.push(href)
  }

  return (
    <main>
      <h1>検索条件画面</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="keyword" {...register('keyword')} />
        <input placeholder="category" {...register('category')} />
        <button type="submit">検索</button>
      </form>
    </main>
  )
}
