'use client'

import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { PageFrame } from '@/components/PageFrame'
import { useRouter } from 'next/navigation'

type FormValues = {
  keyword: string
  category: string
}

export default memo(function SearchPage() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { keyword: '', category: '' },
  })

  const onSubmit = (data: FormValues) => {
    router.push(`/results?keyword=${data.keyword}&category=${data.category}`)
  }

  return (
    <PageFrame title="検索条件画面" backButton={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="keyword" {...register('keyword')} />
        <input placeholder="category" {...register('category')} />
        <button type="submit">検索</button>
      </form>
    </PageFrame>
  )
})
