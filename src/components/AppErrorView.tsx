import { startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { normalizeError } from '@/utils/normalizeError'
import { BackButton } from '@/components/BackButton'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export function AppErrorView({ error, reset }: Props) {
  const router = useRouter()
  const appError = normalizeError(error)

  const title =
    appError.status === 503
      ? '通信エラーが発生しました'
      : appError.status === 404
        ? 'データがありません'
        : '想定外のエラーが発生しました'

  const message =
    appError.status === 503
      ? '通信状況が不安定です。'
      : appError.status === 404
        ? 'データが削除されたか、存在しません。'
        : 'もう一度お試しください。'

  const handleRetry = () => {
    startTransition(() => {
      reset()
      router.refresh()
    })
  }

  return (
    <main>
      <h1>{title}</h1>
      <p>{message}</p>
      <BackButton label="前の画面に戻る" />
      <button type="button" onClick={handleRetry}>再試行</button>
    </main>
  )
}
