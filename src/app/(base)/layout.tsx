'use client'

import { AppBootstrapper } from '@/features/app-bootstrap'
import { PermissionProvider } from '@/shared/permission'
import type { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider fallback={<p>権限を読み込んでいます...</p>}>
      <AppBootstrapper>
        {children}
      </AppBootstrapper>
    </PermissionProvider>
  )
}
