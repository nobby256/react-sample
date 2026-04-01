'use client'

import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/services/auth/fetchMe'
import { AppError } from '@/utils/AppError'

export function PermissionGate({ children }: { children: ReactNode }) {
  const { isLoading, isAllowed } = usePermission()

  if (isLoading) {
    return (
      <main>
        <p>表示権限を確認中です...</p>
      </main>
    )
  }

  if (!isAllowed) {
    // 403はAppErrorのstatusコードとして定義されているため、これをスローして第2層の error.tsx にバブルアップさせる
    throw new AppError(403, 'Forbidden') 
  }

  return <>{children}</>
}

function usePermission() {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    throwOnError: true,
  })

  return {
    isLoading,
    isAllowed: true
  }
}
