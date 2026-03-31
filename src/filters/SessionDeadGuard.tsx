'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function SessionDeadGuard({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isDead = sessionStorage.getItem('sessionDead') === '1'
    if (isDead) {
      // このSPAセッションでは何もさせず、BFFのログイン入口へ
      // 例: BFF側の /auth/login に飛ばす
      window.location.href = '/auth/login'
    }
  }, [])
  return <>{children}</>
}
