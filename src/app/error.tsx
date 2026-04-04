'use client'

import { memo } from 'react'
import { useRedirectToErrorPage } from '@/shared/error'

export default memo(function RootErrorPage({ error }: {
  error: Error & { digest?: string },
  reset: () => void
}) {
  useRedirectToErrorPage(error)
  return null
})
