'use client'

import { memo } from 'react'
import { useRedirectToErrorPage } from '@/shared/error'

export default memo(function GlobalError({ error }: { error: Error }) {
  useRedirectToErrorPage(error)
  return (
    <html lang="ja">
      <body />
    </html>
  )
})
