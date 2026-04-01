'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { normalizeError } from '@/utils/normalizeError'

export default function RootErrorPage({ error }: NextErrorPageProps) {

  useRedirectToFatalError(error)

  return null
}

function useRedirectToFatalError(error: Error): void {
  const router = useRouter()

  useEffect(() => {
    const appError = normalizeError(error)

    console.error('Fatal App Error:', appError)

    const params = new URLSearchParams()
    params.set('status', String(appError.status))
    params.set('from', window.location.pathname + window.location.search)

    router.replace(`/fatal-error?${params.toString()}`)
  }, [error, router])
}