'use client'

import { useRedirectToErrorPage } from '@/shared/error'

export default function RootErrorPage({ error }: {
  error: Error & { digest?: string },
  reset: () => void
}) {
  useRedirectToErrorPage(error)
  return null
}
