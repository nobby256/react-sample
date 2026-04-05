'use client'

import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useAppRouter } from '@/shared/navigation'

type FormValues = {
  keyword: string
  category: string
}

export default memo(function SearchPage() {
  const router = useAppRouter()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { keyword: '', category: '' },
  })

  const onSubmit = (data: FormValues) => {
    router.push(`/results?keyword=${data.keyword}&category=${data.category}`, {appBack: true})
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
})
