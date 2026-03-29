'use client'

import { AppBootstrapper } from '@/filters/AppBootstrapper'
import { PermissionGate } from '@/filters/PermissionGate'
import type { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <AppBootstrapper>
      <PermissionGate>
        {children}
      </PermissionGate>
    </AppBootstrapper>
  )
}
