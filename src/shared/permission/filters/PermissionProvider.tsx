'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UiPermissions } from '../model/UiPermissions'
import { fetchUiPermissions } from '../services/fetchUiPermissions'

type PermissionContextValue = {
  isLoading: boolean
  screens: string[]
  actions: string[]
  hasScreen: (screen: string) => boolean
  hasAction: (action: string) => boolean
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

type PermissionProviderProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionProvider({
  children,
  fallback,
}: PermissionProviderProps) {
  const { data, isLoading } = useQuery<UiPermissions>({
    queryKey: ['ui-permissions'],
    queryFn: fetchUiPermissions,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  })

  const value = useMemo<PermissionContextValue>(() => {
    const screens = data?.screens ?? []
    const actions = data?.actions ?? []

    return {
      isLoading,
      screens,
      actions,
      hasScreen: (screen: string) => screens.includes(screen),
      hasAction: (action: string) => actions.includes(action),
    }
  }, [data, isLoading])

  if (isLoading) {
    return <>{fallback ?? <p>権限を読み込んでいます...</p>}</>
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }

  return context
}