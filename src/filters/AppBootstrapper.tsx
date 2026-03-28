import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAppInitialData } from '@/api/fetchAppInitialData'
import { useAppStore } from '@/stores/useAppStore'

export function AppBootstrapper({ children }: { children: ReactNode }) {
  const initialized = useAppStore((s) => s.initialized)
  const setAppInitialData = useAppStore((s) => s.setAppInitialData)

  const { data, isSuccess } = useQuery({
    queryKey: ['app-initial-data'],
    queryFn: fetchAppInitialData,
    staleTime: Infinity, // 起動時に取得した基礎情報は、画面遷移や再レンダリングで再取得したくないため。
    retry: false, // 起動時の基礎情報取得は、自動再試行せず失敗を明示したいので。
    refetchOnWindowFocus: false, // タブ復帰で勝手に再取得して store が変わるのを避けるため。
    throwOnError: true,
  })

  useEffect(() => {
    if (!isSuccess || !data || initialized) return
    setAppInitialData({
      userName: data.userName,
      authorities: data.authorities,
    })
  }, [isSuccess, data, initialized, setAppInitialData])

  if (!initialized) {
    return (
      <main>
        <p>初期化中です...</p>
      </main>
    )
  }

  return <>{children}</>
}
