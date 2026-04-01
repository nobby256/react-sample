'use client'

import { useRedirectToErrorPage } from '@/hooks/useRedirectToErrorPage'

export default function GlobalError({ error }: { error: Error }) {
  useRedirectToErrorPage(error)
  return (
    <html lang="ja">
      <body />
    </html>
  )
}
