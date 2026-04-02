export function getReturnTo(searchParams: URLSearchParams | string | null | undefined) {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams)
      : searchParams instanceof URLSearchParams
        ? searchParams
        : new URLSearchParams()

  const returnTo = params.get('returnTo')
  return returnTo ? decodeURIComponent(returnTo) : null
}

export function buildReturnTo(pathname: string, search: string) {
  const url = `${pathname}${search}`
  return encodeURIComponent(url)
}
