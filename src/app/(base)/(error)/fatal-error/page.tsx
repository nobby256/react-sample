'use client'

import { useSearchParams } from 'next/navigation'
import { FatalErrorView } from '@/components/FatalErrorView'

export default function FatalErrorPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const message = status === '403' ? '権限がありません' : '再ログインが必要です'

  return (
    <FatalErrorView
      message={message}
    />
  )
}
