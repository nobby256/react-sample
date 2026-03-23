'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { getReturnTo } from '@/utils/returnTo'

type Props = {
  className?: string
  label?: string
}

export function BackButton({ className, label = '戻る' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = getReturnTo(searchParams)

  if (!returnTo) return null

  return (
    <button
      type="button"
      className={className}
      onClick={() => router.push(returnTo)}
    >
      {label}
    </button>
  )
}
