import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PermissionGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const {status} = usePermission()

  useEffect(() => {
    if (status === 'denied') {
      router.replace('/global-error?status=403')
    }
  }, [status, router])

  if (status !== 'allowed') {
    return (
      <main>
        <p>表示権限を確認中です...</p>
      </main>
    )
  }

  return <>{children}</>
}


function usePermission(): { status: 'checking' | 'allowed' | 'denied' } {
    return {
        status: 'allowed'
    }
}
