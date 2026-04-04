'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type BackNavigationContextValue = {
  canGoBack: boolean
  goBack: () => void
  startIndex: number | undefined
  currentIndex: number | undefined
}

export const APP_HISTORY_START_KEY = 'appHistoryStartIdx'

export const BackNavigationContext =
  createContext<BackNavigationContextValue | undefined>(undefined)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getHistoryIndex(): number {
  const state = window.history.state

  if (!isRecord(state)) return 0

  const idx = state.idx
  return typeof idx === 'number' ? idx : 0
}

function readStoredStartIndex(): number | undefined {
  const raw = window.sessionStorage.getItem(APP_HISTORY_START_KEY)
  if (raw === null) return undefined

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

function getOrCreateStartIndex(): number {
  const saved = readStoredStartIndex()
  if (saved !== undefined) return saved

  const current = getHistoryIndex()
  window.sessionStorage.setItem(APP_HISTORY_START_KEY, String(current))
  return current
}

type BackNavigationProviderProps = {
  children: ReactNode
}

export function BackNavigationProvider({
  children,
}: BackNavigationProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [startIndex, setStartIndex] = useState<number | undefined>(undefined)
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined)

  const updateState = useCallback(() => {
    const start = getOrCreateStartIndex()
    const current = getHistoryIndex()

    setStartIndex(start)
    setCurrentIndex(current)
  }, [])

  // 初回マウント時にだけ同期で現在状態を反映
  useLayoutEffect(() => {
    updateState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // popstate / hashchange の購読だけを担当
  useEffect(() => {
    const handlePopState = () => {
      updateState()
    }

    const handleHashChange = () => {
      updateState()
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [updateState])

  const pathnameKey = pathname ?? undefined
  const searchParamsKey = searchParams?.toString() ?? undefined

  // ルート / クエリが変わったタイミングでも state を同期
  useEffect(() => {
    updateState()
  }, [pathnameKey, searchParamsKey, updateState])

  const canGoBack =
    startIndex !== undefined &&
    currentIndex !== undefined &&
    currentIndex > startIndex

  const goBack = useCallback(() => {
    if (!canGoBack) return
    router.back()
  }, [canGoBack, router])

  const value = useMemo<BackNavigationContextValue>(
    () => ({
      canGoBack,
      goBack,
      startIndex,
      currentIndex,
    }),
    [canGoBack, goBack, startIndex, currentIndex]
  )

  return (
    <BackNavigationContext.Provider value={value}>
      {children}
    </BackNavigationContext.Provider>
  )
}