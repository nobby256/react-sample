export type AppInitialData = {
  userName: string
  authorities: string[]
}

export async function fetchAppInitialData(): Promise<AppInitialData> {
  const res = await fetch('/api/app-initial-data', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch app initial data: ${res.status}`)
  }

  return (await res.json()) as AppInitialData
}
