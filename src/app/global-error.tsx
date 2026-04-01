'use client'

import { useEffect } from 'react'
import { redirectToErrorPage } from '@/utils/redirectToErrorPage'

export default function GlobalError({
  error,
}: {
  error: Error
}) {
  useRedirectToErrorPage(error)
  return (
    <html lang="ja">
      <body>
        <p>エラーページへ移動しています...</p>
      </body>
    </html>
  )
}

function useRedirectToErrorPage(error: Error): void {
  useEffect(() => {
    redirectToErrorPage(error)
  }, [error])
}
