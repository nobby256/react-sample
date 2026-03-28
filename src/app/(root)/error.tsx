'use client'

import { FatalErrorView } from '@/components/FatalErrorView'
import { normalizeError } from '@/utils/normalizeError'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
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
