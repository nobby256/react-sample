'use client'

import type { ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { PermissionGate } from '@/filters/PermissionGate'
import { AppBootstrapper } from '@/filters/AppBootstrapper'
import { BackButton } from '@/components/BackButton'

export default function GroupLayout({ children }: { children: ReactNode }) {
  return (
    <AppBootstrapper>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} fallbackRender={() => null}>
            <PermissionGate>
              <header>
                <BackButton />
              </header>
              <main>{children}</main>
              <footer>
              </footer>
            </PermissionGate>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

    </AppBootstrapper>
  )
}
