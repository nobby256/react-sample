'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { AppRouteTo, AppNavigationOptions, AppRouter } from './types'

export const NavigationContext = createContext<AppRouter | undefined>(undefined)

type NavigationProviderProps = {
  children: ReactNode
}

const NAVIGATION_STACK_STORAGE_KEY = 'navigationStack'
const NAVIGATION_ACTION_STORAGE_KEY = 'navigationAction'

type NavigationAction = 'push' | 'replace' | 'unknown'

function buildRouteKey(
  pathname: string | null,
  searchParamsString: string
): string | undefined {
  if (!pathname) return undefined
  return searchParamsString ? `${pathname}?${searchParamsString}` : pathname
}

function readNavigationStack(): string[] {
  if (typeof window === 'undefined') return []

  const raw = window.sessionStorage.getItem(NAVIGATION_STACK_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value): value is string => typeof value === 'string')
  } catch {
    return []
  }
}

function writeNavigationStack(stack: string[]) {
  window.sessionStorage.setItem(
    NAVIGATION_STACK_STORAGE_KEY,
    JSON.stringify(stack)
  )
}

function readPendingNavigationAction(): NavigationAction {
  if (typeof window === 'undefined') return 'unknown'

  const raw = window.sessionStorage.getItem(NAVIGATION_ACTION_STORAGE_KEY)
  if (raw === 'push' || raw === 'replace') return raw
  return 'unknown'
}

function writePendingNavigationAction(action: NavigationAction) {
  window.sessionStorage.setItem(NAVIGATION_ACTION_STORAGE_KEY, action)
}

function clearPendingNavigationAction() {
  window.sessionStorage.removeItem(NAVIGATION_ACTION_STORAGE_KEY)
}

function appendRoute(stack: string[], route: string): string[] {
  if (stack.length === 0) return [route]
  if (stack[stack.length - 1] === route) return stack
  return [...stack, route]
}

function replaceCurrentRoute(stack: string[], route: string): string[] {
  if (stack.length === 0) return [route]
  if (stack[stack.length - 1] === route) return stack
  return [...stack.slice(0, -1), route]
}

function alignStackWithCurrentRoute(
  stack: string[],
  currentRoute: string
): string[] {
  if (stack.length === 0) return [currentRoute]

  const index = stack.lastIndexOf(currentRoute)
  if (index >= 0) {
    return stack.slice(0, index + 1)
  }

  return [...stack, currentRoute]
}

function computeNavigationStack(
  stack: string[],
  currentRoute: string,
  action: NavigationAction
): string[] {
  if (action === 'push') {
    return appendRoute(stack, currentRoute)
  }

  if (action === 'replace') {
    return replaceCurrentRoute(stack, currentRoute)
  }

  return alignStackWithCurrentRoute(stack, currentRoute)
}

/**
 * アプリ内の戻る可否を管理しつつ、push / replace / back を提供する Provider です。
 *
 * ブラウザ全体の history 件数ではなく、このタブ内でのアプリ遷移履歴を
 * sessionStorage に保持して `canGoBack` を判定します。
 *
 * そのため、直アクセス・新規タブ・ブックマーク起動では戻るボタンを無効化しやすくなります。
 */
export function NavigationProvider({
  children,
}: NavigationProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParamsString = searchParams?.toString() ?? ''

  const currentRoute = useMemo(
    () => buildRouteKey(pathname, searchParamsString),
    [pathname, searchParamsString]
  )

  const [historyStack, setHistoryStack] = useState<string[]>([])
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!currentRoute) return

    const currentStack = readNavigationStack()
    const action = isInitializedRef.current
      ? readPendingNavigationAction()
      : 'unknown'

    const nextStack = computeNavigationStack(
      currentStack,
      currentRoute,
      action
    )

    writeNavigationStack(nextStack)
    clearPendingNavigationAction()

    // URL / sessionStorage と同期した結果を UI に反映する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistoryStack(nextStack)

    isInitializedRef.current = true
  }, [currentRoute])

  useEffect(() => {
    const handlePopState = () => {
      const stack = readNavigationStack()
      setHistoryStack(stack)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const canGoBack = historyStack.length >= 2

  const push = useCallback(
    (to: AppRouteTo, options?: AppNavigationOptions) => {
      writePendingNavigationAction('push')
      router.push(to, options)
    },
    [router]
  )

  const replace = useCallback(
    (to: AppRouteTo, options?: AppNavigationOptions) => {
      writePendingNavigationAction('replace')
      router.replace(to, options)
    },
    [router]
  )

  const back = useCallback(() => {
    if (!canGoBack) return
    router.back()
  }, [canGoBack, router])

  const value = useMemo<AppRouter>(
    () => ({
      canGoBack,
      push,
      replace,
      back,
    }),
    [canGoBack, push, replace, back]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}