'use client'

import { useEffect } from 'react'
import { redirectToErrorPage } from '@/utils/redirectToErrorPage'

export default function RootErrorPage({ error }: {
    error: Error & { digest?: string },
    reset: () => void
  }) {
  useRedirectToErrorPage(error)
  return null
}

function useRedirectToErrorPage(error: Error): void {
  useEffect(() => {
    redirectToErrorPage(error)
  }, [error])
}