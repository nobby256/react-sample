'use client'

import { useRedirectToErrorPage } from '@/hooks/useRedirectToErrorPage'

export default function RootErrorPage({ error }: {
  error: Error & { digest?: string },
  reset: () => void
}) {
  useRedirectToErrorPage(error)
  return null
}
