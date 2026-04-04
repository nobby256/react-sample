'use client'

import { memo, type ReactNode } from 'react'
import { BackButton } from '@/components/BackButton'

export default memo(function PagesLayout({ children }: { children: ReactNode }) {
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
})
