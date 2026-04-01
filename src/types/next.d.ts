export {}

declare global {
  type ErrorWithDigest = Error & {
    digest?: string
  }

  type NextErrorPageProps = {
    error: ErrorWithDigest
    reset: () => void
  }
}