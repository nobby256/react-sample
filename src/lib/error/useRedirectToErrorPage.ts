import { useEffect } from 'react'
import { redirectToErrorPage } from './redirectToErrorPage'

export function useRedirectToErrorPage(error: Error): void {
  useEffect(() => {
    redirectToErrorPage(error)
  }, [error])
}
