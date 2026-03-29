'use client'

import { BackButton } from '@/components/BackButton'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <BackButton />
      </header>
      <main>{children}</main>
      <footer>
      </footer>
    </>
  )
}
