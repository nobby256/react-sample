import type { ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { PermissionGate } from './PermissionGate'
import { AppBootstrapper } from './AppBootstrapper'

export function CompositeFilter({ children }: { children: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={() => null}>
          <AppBootstrapper>
            <PermissionGate>
              {children}
            </PermissionGate>
          </AppBootstrapper>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
