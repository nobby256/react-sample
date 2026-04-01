'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function SessionDeadGuard({ children }: { children: ReactNode }) {
  const { isDead } = useSessionStatus()
  if (isDead) {
    return null
  }
  return <>{children}</>
}

export function forceSessionDead() {
  sessionStorage.setItem('sessionDead', '1')
}

function useSessionStatus(): { isDead: boolean } {
  const isDead = sessionStorage.getItem('sessionDead') === '1'

  useEffect(() => {
    if (isDead) {
      // このSPAセッションでは何もさせず、BFFのログイン入口へ
      // 例: BFF側の /auth/login に飛ばす
      window.location.href = '/auth/login'
    }
  }, [isDead])

  return { isDead }
}
