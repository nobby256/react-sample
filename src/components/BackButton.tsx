'use client'

import { memo, type ButtonHTMLAttributes } from 'react'
import { useAppRouter } from '@/shared/navigation'

export type BackButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick'
> & {
  children?: React.ReactNode
}

export const BackButton = memo(function BackButton({
  children = '戻る',
  disabled,
  ...props
}: BackButtonProps) {
  const { canGoBack, back } = useAppRouter()

  return (
    <button
      type="button"
      disabled={disabled ?? !canGoBack}
      onClick={back}
      {...props}
    >
      {children}
    </button>
  )
})