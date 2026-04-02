'use client'

import type { ReactNode } from 'react'
import { AppError } from '@/utils/AppError'
import { usePermissions } from './PermissionProvider'

type PermissionGateProps = {
  screen: string
  children: ReactNode
}

export function PermissionGate({
  screen,
  children,
}: PermissionGateProps) {
  const { isLoading, hasScreen } = usePermissions()

  if (isLoading) {
    return null
  }

  if (!hasScreen(screen)) {
    throw new AppError(403, 'Forbidden')
  }

  return <>{children}</>
}