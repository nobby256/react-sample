'use client'

import { useContext } from 'react'
import { BackNavigationContext } from './BackNavigationProvider'

export function useBackNavigation() {
  const context = useContext(BackNavigationContext)

  if (context === undefined) {
    throw new Error(
      'useBackNavigation must be used within BackNavigationProvider'
    )
  }

  return context
}