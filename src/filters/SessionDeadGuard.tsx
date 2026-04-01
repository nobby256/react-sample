'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function SessionDeadGuard({ children }: { children: ReactNode }) {
  useSessionStatus()
  return <>{children}</>
}

export function forceSessionDead() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('sessionDead', '1')
}

function useSessionStatus(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const dead = sessionStorage.getItem('sessionDead') === '1'
    if (!dead) return

    // クライアントルーターではなく「サーバーに再リクエスト」したいので、
    // 今の URL をフルリロードする
    window.location.reload()
  }, [])
}