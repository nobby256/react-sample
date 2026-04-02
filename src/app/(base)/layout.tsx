'use client'

import { AppBootstrapper } from '@/filters/AppBootstrapper'
import { PermissionProvider } from '@/features/permission'
import type { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider>
      <AppBootstrapper>
        {children}
      </AppBootstrapper>
    </PermissionProvider>
  )
}
