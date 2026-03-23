'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

type FormValues = {
  keyword: string
  category: string
}

export default function SearchPage() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { keyword: '', category: '' },
  })

  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams()
    if (data.keyword) params.set('keyword', data.keyword)
    if (data.category) params.set('category', data.category)
    router.push(`/results?${params.toString()}`)
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
