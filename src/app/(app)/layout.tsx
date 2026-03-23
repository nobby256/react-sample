'use client'

import type { ReactNode } from 'react'
import { CompositeFilter } from '@/filters/CompositeFilter'
import { BackButton } from '@/components/BackButton'

export default function GroupLayout({ children }: { children: ReactNode }) {
  return (
    <CompositeFilter>
      <header>
        <BackButton />
      </header>
      <main>{children}</main>
      <footer>
      </footer>
    </CompositeFilter>
  )
}
