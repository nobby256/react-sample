'use client'

import { useRedirectToErrorPage } from '@/lib/error'

export default function RootErrorPage({ error }: {
  error: Error & { digest?: string },
  reset: () => void
}) {
  useRedirectToErrorPage(error)
  return null
}
