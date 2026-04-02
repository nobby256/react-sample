'use client'

import type { ReactNode } from 'react'
import { AppBootstrapper } from '@/shared/app-bootstrap'
import { PermissionProvider } from '@/shared/permission'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider fallback={<p>権限を読み込んでいます...</p>}>
      <AppBootstrapper fallback={<p>アプリデータを読み込んでいます...</p>}>
        {children}
      </AppBootstrapper>
    </PermissionProvider>
  )
}
