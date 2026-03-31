'use client'

import { AppBootstrapper } from '@/filters/AppBootstrapper'
import { PermissionGate } from '@/filters/PermissionGate'
import { SessionDeadGuard } from '@/filters/SessionDeadGuard'
import type { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <SessionDeadGuard>
      <PermissionGate>
        <AppBootstrapper>
          {children}
        </AppBootstrapper>
      </PermissionGate>
    </SessionDeadGuard>
  )
}
