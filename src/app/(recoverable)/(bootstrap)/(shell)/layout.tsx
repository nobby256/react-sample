'use client'

import type { ReactNode } from 'react'
import { BackButton } from '@/shared/navigation'

export default function PagesLayout({ children }: { children: ReactNode }) {
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
