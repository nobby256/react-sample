'use client'

import { FatalErrorView } from '@/components/FatalErrorView'
import { normalizeError } from '@/utils/normalizeError'

export default function GlobalError({
  error,
}: {
  error: Error
}) {
  const appError = normalizeError(error)
  
  return (
    <html lang="ja">
      <body>
        <FatalErrorView message={appError.message} />
      </body>
    </html>
  )
}
