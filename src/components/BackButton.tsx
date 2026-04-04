'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useBackNavigation } from '@/shared/navigation'

export type BackButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick'
> & {
  children?: React.ReactNode
}

export function BackButton({
  children = '戻る',
  disabled,
  ...props
}: BackButtonProps) {
  const { canGoBack, goBack } = useBackNavigation()

  return (
    <button
      type="button"
      disabled={disabled ?? !canGoBack}
      onClick={goBack}
      {...props}
    >
      {children}
    </button>
  )
}