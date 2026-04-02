'use client'

import { useRedirectToErrorPage } from '@/shared/error'

export default function GlobalError({ error }: { error: Error }) {
  useRedirectToErrorPage(error)
  return (
    <html lang="ja">
      <body />
    </html>
  )
}
