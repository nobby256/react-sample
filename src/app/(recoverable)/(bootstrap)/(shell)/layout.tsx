'use client'

import { memo, type ReactNode } from 'react'
import { BackButton } from '@/shared/navigation'

export default memo(function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <BackButton mode="back" />
      </header>
      <main>{children}</main>
      <footer>
      </footer>
    </>
  )
})
